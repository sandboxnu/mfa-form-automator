import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

const LEADERSHIP_TEAM_UUID = uuidv4();
const CHIEF_OF_STAFF_UUID = uuidv4();
const CHIEF_FIN_OFFICER_UUID = uuidv4();
const AGG_DIR_UUID = uuidv4();
const CHIEF_LEARNING_ENGAGEMENT_UUID = uuidv4();

async function main() {

  const formTemplate1Id = uuidv4();
  const formTemplate1 = await prisma.formTemplate.upsert({
    where: { id: formTemplate1Id },
    update: {},
    create: {
      id: formTemplate1Id,
      name: 'Form Template 1',
      formDocLink: 'https://www.mfa.org/'
    },
  });

  const signatureFields = await fetchSignatureFields(formTemplate1Id);

  const departmentLeadershipTeam = await prisma.department.upsert({
    where: { id: LEADERSHIP_TEAM_UUID },
    update: {},
    create: {
      id: LEADERSHIP_TEAM_UUID,
      name: 'Leadership Team',
    },
  });
  const positions = [
    {
      id: CHIEF_OF_STAFF_UUID,
      name: 'Chief of Staff',
      departmentId: departmentLeadershipTeam.id,
      signatureFields: signatureFields,
    },
    {
      id: CHIEF_FIN_OFFICER_UUID,
      name: 'Chief Financial Officer',
      departmentId: departmentLeadershipTeam.id,
      signatureFields: [],  // assuming no signature fields for this position
    },
    {
      id: AGG_DIR_UUID,
      name: 'AGG Director',
      departmentId: departmentLeadershipTeam.id,
      signatureFields: [],  // assuming no signature fields for this position
    },
    {
      id: CHIEF_LEARNING_ENGAGEMENT_UUID,
      name: 'Chief of Learning & Community Engagement',
      departmentId: departmentLeadershipTeam.id,
      signatureFields: [],  // assuming no signature fields for this position
    },
  ];
  for (const position of positions) {
    await prisma.position.upsert({
      where: { id: position.id },
      update: {},
      create: {
        id: position.id,
        name: position.name,
        departmentId: position.departmentId,
        signatureFields: {
          connect: position.signatureFields.map(sigField => ({ id: sigField.id }))
        }
      }
    });
  }

  const employees = [
    {
      id: uuidv4(),
      firstName: 'Helen',
      lastName: 'Miao',
      email: 'email@gmail.com',
      positionId: CHIEF_OF_STAFF_UUID,
    },
    {
      id: uuidv4(),
      firstName: 'Kai',
      lastName: 'Zheng',
      email: 'email@gmail.com',
      positionId: CHIEF_FIN_OFFICER_UUID,
    },
    {
      id: uuidv4(),
      firstName: 'Iris',
      lastName: 'Zhang',
      email: 'email@gmail.com',
      positionId: AGG_DIR_UUID,
    },
    {
      id: uuidv4(),
      firstName: 'Anshul',
      lastName: 'Shirude',
      email: 'email@gmail.com',
      positionId: CHIEF_LEARNING_ENGAGEMENT_UUID
      ,
    },
  ];

  for (const empData of employees) {
    await prisma.employee.upsert({
      where: { id: empData.id },
      update: {},
      create: {
        id: empData.id,
        firstName: empData.firstName,
        lastName: empData.lastName,
        email: empData.email,
        position: {
          connect: { id: empData.positionId }
        }
      },
    });
  }
}

async function fetchSignatureFields(formTemplateId: string) {
  const signatureFieldNames = ['Elvin Cheng', 'Isabelle Papa', 'Angela Weigl'];

  const signatureFields = await Promise.all(
    signatureFieldNames.map(async (name, index) => {
      const existingField = await prisma.signatureField.findFirst({
        where: {
          name: name,
          formTemplateId: formTemplateId,
        },
      });

      if (existingField) {
        return existingField;
      }

      return prisma.signatureField.create({
        data: {
          id: uuidv4(),
          name: name,
          order: index + 1,
          formTemplateId: formTemplateId,
        },
      });
    })
  );

  return signatureFields;
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })

  .finally(async () => {

    const formTemplates = await prisma.formTemplate.findMany();
    console.log('Form Templates:', formTemplates);

    const departments = await prisma.department.findMany();
    console.log('Departments:', departments);

    const allPositions = await prisma.position.findMany({
      include: {
        signatureFields: true
      }
    });
    console.log('Positions:', allPositions);


    const allEmployees = await prisma.employee.findMany({
      include: {
        position: true
      }
    });
    console.log('Employees:', allEmployees);

    const allSignatureFields = await prisma.signatureField.findMany();
    console.log('Signature Fields:', allSignatureFields);

    await prisma.$disconnect();
  });
