import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/*
Hard coded UUIDs for: 
- leadership team department
- chief of staff position
- chief financial officer position 
- agg director position 
- chief learning engagement position
- chief signature field 
- manager signature field 
- director signature field 
*/
const LEADERSHIP_TEAM_UUID = '3f08fe46-a243-4b33-84fa-6702a74f3a5d';
const CHIEF_OF_STAFF_UUID = '5a5b1c25-8bfe-4418-9ba6-b1420d1fedff';
const CHIEF_FIN_OFFICER_UUID = 'f7c20346-2158-404c-a753-061ba7049f3d';
const AGG_DIR_UUID = '81983f2c-c2ae-4010-b578-17cd141afbef';
const CHIEF_LEARNING_ENGAGEMENT_UUID = '693e8455-50e8-49bc-9d06-755eb24a5bcc';
const CHIEF_SIG_FIELD_UUID = '33b169ed-e98f-4f72-807d-c31c7cb4230d';
const MANAGER_SIG_FIELD_UUID = '1727a4d2-b22c-42de-b63d-5f553e964d75';
const DIR_SIG_FIELD_UUID = '6bd5c08b-f309-4226-8914-7fef4ba631c2';

// type definition for employee data used in upsertEmployee
type EmployeeData = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  positionId: string;
};

// update or insert employee to database based on the employee id
async function upsertEmployee(empData: any) {
  await prisma.employee.upsert({
    where: { id: empData.id },
    update: {},
    create: {
      id: empData.id,
      firstName: empData.firstName,
      lastName: empData.lastName,
      email: empData.email,
      position: {
        connect: { id: empData.positionId },
      },
    },
  });
}

// type definition for position data used in upsertPosition
type PositionData = {
  id: string;
  name: string;
  departmentId: string;
  signatureFields: { id: string }[];
};

// update or insert position into database based on position id
async function upsertPosition(data: PositionData) {
  const { id, name, departmentId, signatureFields } = data;
  const connections = signatureFields.map((sigField) => ({ id: sigField.id }));

  return prisma.position.upsert({
    where: { id },
    update: {},
    create: {
      id,
      name,
      departmentId,
      signatureFields: {
        connect: connections,
      },
    },
  });
}

// type definition for mapping signature field names (ex: 'Director', 'Manager') to their data
type SignatureFieldMap = {
  [key: string]: {
    id: string;
    name: string;
    order: number;
    formTemplateId: string;
  };
};

//  fetch or create signature field for the given form template based on form template id
async function fetchSignatureFields(
  formTemplateId: string,
): Promise<SignatureFieldMap> {
  // hard coded signature fields
  const signatureFieldNames = ['Chief', 'Manager', 'Director'];
  const signatureFieldIds: { [key: string]: string } = {
    Chief: CHIEF_SIG_FIELD_UUID,
    Manager: MANAGER_SIG_FIELD_UUID,
    Director: DIR_SIG_FIELD_UUID,
  };

  let signatureFieldsMap: SignatureFieldMap = {};

  // fetch signaturefield, or create one if it doesn't already exist
  for (const name of signatureFieldNames) {
    const existingField = await prisma.signatureField.findFirst({
      where: {
        name: name,
        formTemplateId: formTemplateId,
      },
    });

    if (existingField) {
      signatureFieldsMap[name] = existingField;
    } else {
      const createdField = await prisma.signatureField.create({
        data: {
          id: signatureFieldIds[name],
          name: name,
          order: signatureFieldNames.indexOf(name) + 1,
          formTemplateId: formTemplateId,
        },
      });
      signatureFieldsMap[name] = createdField;
    }
  }

  return signatureFieldsMap;
}

/* main seeding function to upsert the following data: 
- 1 form template 
- 1 department (leadership team) 
- 3 signature fields ('chief', 'director', 'manager')
- 4 positions (chief of staff, cheif financial officer, agg director, chief of learning)
- 4 employees, one for each of the above positions
*/

async function main() {
  // form template
  const formTemplate1Id = '1fbccd8a-b00c-472f-a94f-defa8e86e0cf';
  const formTemplate1 = await prisma.formTemplate.upsert({
    where: { id: formTemplate1Id },
    update: {},
    create: {
      id: formTemplate1Id,
      name: 'Form Template 1',
      formDocLink: 'https://www.mfa.org/',
    },
  });

  // leadership team department
  const departmentLeadershipTeam = await prisma.department.upsert({
    where: { id: LEADERSHIP_TEAM_UUID },
    update: {},
    create: {
      id: LEADERSHIP_TEAM_UUID,
      name: 'Leadership Team',
    },
  });

  // signature fields
  const signatureFieldsMap: SignatureFieldMap =
    await fetchSignatureFields(formTemplate1Id);

  // positions
  const positions = [
    {
      id: CHIEF_OF_STAFF_UUID,
      name: 'Chief of Staff',
      departmentId: departmentLeadershipTeam.id,
      signatureFields: [signatureFieldsMap['Chief']],
    },
    {
      id: CHIEF_FIN_OFFICER_UUID,
      name: 'Chief Financial Officer',
      departmentId: departmentLeadershipTeam.id,
      signatureFields: [signatureFieldsMap['Chief']],
    },
    {
      id: AGG_DIR_UUID,
      name: 'AGG Director',
      departmentId: departmentLeadershipTeam.id,
      signatureFields: [signatureFieldsMap['Director']],
    },
    {
      id: CHIEF_LEARNING_ENGAGEMENT_UUID,
      name: 'Chief of Learning & Community Engagement',
      departmentId: departmentLeadershipTeam.id,
      signatureFields: [signatureFieldsMap['Manager']],
    },
  ];

  for (const positionData of positions) {
    await upsertPosition(positionData);
  }

  // employees
  const employees = [
    {
      id: '777c1974-3104-4744-ae31-7a9296e7784a',
      firstName: 'Helen',
      lastName: 'Miao',
      email: 'email@gmail.com',
      positionId: CHIEF_OF_STAFF_UUID,
    },
    {
      id: '339cf78e-d13f-4069-b1f7-dee0c64afb31',
      firstName: 'Kai',
      lastName: 'Zheng',
      email: 'email@gmail.com',
      positionId: CHIEF_FIN_OFFICER_UUID,
    },
    {
      id: 'c6de4017-cb1f-44f1-a707-0f38239e0bca',
      firstName: 'Iris',
      lastName: 'Zhang',
      email: 'email@gmail.com',
      positionId: AGG_DIR_UUID,
    },
    {
      id: 'b386ef53-d2d1-4bfd-a44c-55b1750a874e',
      firstName: 'Anshul',
      lastName: 'Shirude',
      email: 'email@gmail.com',
      positionId: CHIEF_LEARNING_ENGAGEMENT_UUID,
    },
  ];

  for (const empData of employees) {
    await upsertEmployee(empData);
  }
}

// runs main seeding function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  // fetch and log data to verify seeding
  .finally(async () => {
    const formTemplates = await prisma.formTemplate.findMany();
    console.log('Form Templates:', formTemplates);

    const departments = await prisma.department.findMany();
    console.log('Departments:', departments);

    const allPositions = await prisma.position.findMany({
      include: {
        signatureFields: true,
      },
    });
    console.log('Positions:', JSON.stringify(allPositions, null, 2));

    const allEmployees = await prisma.employee.findMany({
      include: {
        position: true,
      },
    });
    console.log('Employees:', allEmployees);

    const allSignatureFields = await prisma.signatureField.findMany();
    console.log('Signature Fields:', allSignatureFields);

    await prisma.$disconnect();
  });
