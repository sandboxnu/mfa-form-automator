import { EmployeeScope, PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

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

const LEADERSHIP_TEAM_UUID = uuidv4();
const CHIEF_OF_STAFF_UUID = uuidv4();
const CHIEF_FIN_OFFICER_UUID = uuidv4();
const AGG_DIR_UUID = uuidv4();
const CHIEF_LEARNING_ENGAGEMENT_UUID = uuidv4();

const TEST_TEAM_UUID = uuidv4();
const TEST_TEAM_POSITION_UUID = uuidv4();

const ANSHUL_SHIRUDE_UUID = uuidv4();
const ANGELA_WEIGL_UUID = uuidv4();
const KAI_ZHENG_UUID = uuidv4();
const IRIS_ZHANG_UUID = uuidv4();

const IT_EXIT_FORM_UUID = uuidv4();
const STAFFING_REQUISITION_UUID = uuidv4();
const NETWORK_ADD_CHANGE_UUID = uuidv4();
const MFA_ORACLE_LOGON_REQUEST_UUID = uuidv4();
const HYBRID_AND_REMOTE_WORK_AGREEMENT_UUID = uuidv4();
const VPN_REQUEST_UUID = uuidv4();
const DIGITAL_MFA_ID_BADGE_REQUEST_UUID = uuidv4();
const TRAVEL_AUTHORIZATION_UUID = uuidv4();

const DEV_FORM_DOC_LINK = 'http://localhost:3002/test.pdf';
const DEV_SIGNATURE_LINK = 'http://localhost:3002/signature.png';

// type definition for employee data used in upsertEmployee
type EmployeeData = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  positionId: string;
  signatureLink: string;
  scope: EmployeeScope;
};

// update or insert employee to database based on the employee id
async function upsertEmployee(empData: EmployeeData) {
  await prisma.employee.upsert({
    where: { id: empData.id },
    update: {},
    create: {
      id: empData.id,
      firstName: empData.firstName,
      lastName: empData.lastName,
      email: empData.email,
      signatureLink: empData.signatureLink,
      position: {
        connect: { id: empData.positionId },
      },
      scope: empData.scope,
    },
  });
}

// type definition for position data used in upsertPosition
type PositionData = {
  id: string;
  name: string;
  departmentId: string;
};

// update or insert position into database based on position id
async function upsertPosition(data: PositionData) {
  const { id, name, departmentId } = data;

  return prisma.position.upsert({
    where: { id },
    update: {},
    create: {
      id,
      name,
      departmentId,
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
    Chief: uuidv4(),
    Manager: uuidv4(),
    Director: uuidv4(),
  };

  const signatureFieldsMap: SignatureFieldMap = {};

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

// type definition for mapping signature field names (ex: 'Director', 'Manager') to their data
type FormInstanceData = {
  id: string;
  name: string;
  formDocLink: string;
  originatorId: string;
  formTemplateId: string;
  signatures: any[];
};

// upsert new form instances
async function upsertFormInstance(formInstanceData: FormInstanceData) {
  const { id, name, formDocLink, originatorId, formTemplateId, signatures } =
    formInstanceData;
  await prisma.formInstance.upsert({
    where: { id },
    update: {},
    create: {
      id,
      name,
      formDocLink,
      originatorId,
      formTemplateId,
      signatures: {
        create: signatures,
      },
    },
  });
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
  await prisma.formTemplate.upsert({
    where: { id: IT_EXIT_FORM_UUID },
    update: {},
    create: {
      id: IT_EXIT_FORM_UUID,
      name: 'IT Exit Form',
      formDocLink: DEV_FORM_DOC_LINK,
    },
  });

  await prisma.formTemplate.upsert({
    where: { id: STAFFING_REQUISITION_UUID },
    update: {},
    create: {
      id: STAFFING_REQUISITION_UUID,
      name: 'Staffing Requisition',
      formDocLink: DEV_FORM_DOC_LINK,
    },
  });

  await prisma.formTemplate.upsert({
    where: { id: NETWORK_ADD_CHANGE_UUID },
    update: {},
    create: {
      id: NETWORK_ADD_CHANGE_UUID,
      name: 'Network Add Change',
      formDocLink: DEV_FORM_DOC_LINK,
    },
  });

  await prisma.formTemplate.upsert({
    where: { id: MFA_ORACLE_LOGON_REQUEST_UUID },
    update: {},
    create: {
      id: MFA_ORACLE_LOGON_REQUEST_UUID,
      name: 'MFA Oracle Logon Request',
      formDocLink: DEV_FORM_DOC_LINK,
    },
  });

  await prisma.formTemplate.upsert({
    where: { id: HYBRID_AND_REMOTE_WORK_AGREEMENT_UUID },
    update: {},
    create: {
      id: HYBRID_AND_REMOTE_WORK_AGREEMENT_UUID,
      name: 'Hybrid and Remote Work Agreement',
      formDocLink: DEV_FORM_DOC_LINK,
    },
  });

  await prisma.formTemplate.upsert({
    where: { id: VPN_REQUEST_UUID },
    update: {},
    create: {
      id: VPN_REQUEST_UUID,
      name: 'VPN Request',
      formDocLink: DEV_FORM_DOC_LINK,
    },
  });

  await prisma.formTemplate.upsert({
    where: { id: DIGITAL_MFA_ID_BADGE_REQUEST_UUID },
    update: {},
    create: {
      id: DIGITAL_MFA_ID_BADGE_REQUEST_UUID,
      name: 'Digital MFA ID Badge Request',
      formDocLink: DEV_FORM_DOC_LINK,
    },
  });

  await prisma.formTemplate.upsert({
    where: { id: TRAVEL_AUTHORIZATION_UUID },
    update: {},
    create: {
      id: TRAVEL_AUTHORIZATION_UUID,
      name: 'Travel Authorization',
      formDocLink: DEV_FORM_DOC_LINK,
    },
  });

  const IT_EXIT_FORM_SIGNATURE_FIELDS =
    await fetchSignatureFields(IT_EXIT_FORM_UUID);
  const STAFFING_REQUISITION_SIGNATURE_FIELDS = await fetchSignatureFields(
    STAFFING_REQUISITION_UUID,
  );
  const NETWORK_ADD_CHANGE_SIGNATURE_FIELDS = await fetchSignatureFields(
    NETWORK_ADD_CHANGE_UUID,
  );
  const MFA_ORACLE_LOGON_REQUEST_SIGNATURE_FIELDS = await fetchSignatureFields(
    MFA_ORACLE_LOGON_REQUEST_UUID,
  );
  const HYBRID_AND_REMOTE_WORK_AGREEMENT_SIGNATURE_FIELDS =
    await fetchSignatureFields(HYBRID_AND_REMOTE_WORK_AGREEMENT_UUID);
  const VPN_REQUEST_SIGNATURE_FIELDS =
    await fetchSignatureFields(VPN_REQUEST_UUID);
  const DIGITAL_MFA_ID_BADGE_REQUEST_SIGNATURE_FIELDS =
    await fetchSignatureFields(DIGITAL_MFA_ID_BADGE_REQUEST_UUID);
  const TRAVEL_AUTHORIZATION_SIGNATURE_FIELDS = await fetchSignatureFields(
    TRAVEL_AUTHORIZATION_UUID,
  );

  // leadership team department
  const departmentLeadershipTeam = await prisma.department.upsert({
    where: { id: LEADERSHIP_TEAM_UUID },
    update: {},
    create: {
      id: LEADERSHIP_TEAM_UUID,
      name: 'Leadership Team',
    },
  });

  // leadership team positions
  const positions = [
    {
      id: CHIEF_OF_STAFF_UUID,
      name: 'Chief of Staff',
      departmentId: departmentLeadershipTeam.id,
      signatureFields: [
        IT_EXIT_FORM_SIGNATURE_FIELDS['Chief'],
        STAFFING_REQUISITION_SIGNATURE_FIELDS['Chief'],
        NETWORK_ADD_CHANGE_SIGNATURE_FIELDS['Chief'],
        MFA_ORACLE_LOGON_REQUEST_SIGNATURE_FIELDS['Chief'],
        HYBRID_AND_REMOTE_WORK_AGREEMENT_SIGNATURE_FIELDS['Chief'],
        VPN_REQUEST_SIGNATURE_FIELDS['Chief'],
        DIGITAL_MFA_ID_BADGE_REQUEST_SIGNATURE_FIELDS['Chief'],
        TRAVEL_AUTHORIZATION_SIGNATURE_FIELDS['Chief'],
      ],
    },
    {
      id: CHIEF_FIN_OFFICER_UUID,
      name: 'Chief Financial Officer',
      departmentId: departmentLeadershipTeam.id,
      signatureFields: [
        IT_EXIT_FORM_SIGNATURE_FIELDS['Chief'],
        STAFFING_REQUISITION_SIGNATURE_FIELDS['Chief'],
        NETWORK_ADD_CHANGE_SIGNATURE_FIELDS['Chief'],
        MFA_ORACLE_LOGON_REQUEST_SIGNATURE_FIELDS['Chief'],
        HYBRID_AND_REMOTE_WORK_AGREEMENT_SIGNATURE_FIELDS['Chief'],
        VPN_REQUEST_SIGNATURE_FIELDS['Chief'],
        DIGITAL_MFA_ID_BADGE_REQUEST_SIGNATURE_FIELDS['Chief'],
        TRAVEL_AUTHORIZATION_SIGNATURE_FIELDS['Chief'],
      ],
    },
    {
      id: AGG_DIR_UUID,
      name: 'AGG Director',
      departmentId: departmentLeadershipTeam.id,
      signatureFields: [
        IT_EXIT_FORM_SIGNATURE_FIELDS['Director'],
        STAFFING_REQUISITION_SIGNATURE_FIELDS['Director'],
        NETWORK_ADD_CHANGE_SIGNATURE_FIELDS['Director'],
        MFA_ORACLE_LOGON_REQUEST_SIGNATURE_FIELDS['Director'],
        HYBRID_AND_REMOTE_WORK_AGREEMENT_SIGNATURE_FIELDS['Director'],
        VPN_REQUEST_SIGNATURE_FIELDS['Director'],
        DIGITAL_MFA_ID_BADGE_REQUEST_SIGNATURE_FIELDS['Director'],
        TRAVEL_AUTHORIZATION_SIGNATURE_FIELDS['Director'],
      ],
    },
    {
      id: CHIEF_LEARNING_ENGAGEMENT_UUID,
      name: 'Chief of Learning & Community Engagement',
      departmentId: departmentLeadershipTeam.id,
      signatureFields: [
        IT_EXIT_FORM_SIGNATURE_FIELDS['Manager'],
        STAFFING_REQUISITION_SIGNATURE_FIELDS['Manager'],
        NETWORK_ADD_CHANGE_SIGNATURE_FIELDS['Manager'],
        MFA_ORACLE_LOGON_REQUEST_SIGNATURE_FIELDS['Manager'],
        HYBRID_AND_REMOTE_WORK_AGREEMENT_SIGNATURE_FIELDS['Manager'],
        VPN_REQUEST_SIGNATURE_FIELDS['Manager'],
        DIGITAL_MFA_ID_BADGE_REQUEST_SIGNATURE_FIELDS['Manager'],
        TRAVEL_AUTHORIZATION_SIGNATURE_FIELDS['Manager'],
      ],
    },
  ];

  for (const positionData of positions) {
    await upsertPosition(positionData);
  }

  // test team department
  await prisma.department.upsert({
    where: { id: TEST_TEAM_UUID },
    update: {},
    create: {
      id: TEST_TEAM_UUID,
      name: 'Test Team',
    },
  });

  // test team positions
  await upsertPosition({
    id: TEST_TEAM_POSITION_UUID,
    name: 'Test Position',
    departmentId: TEST_TEAM_UUID,
  });

  // employees
  const employees = [
    {
      id: IRIS_ZHANG_UUID,
      firstName: 'Iris',
      lastName: 'Zhang',
      email: 'zhang.iri@northeastern.edu',
      positionId: CHIEF_OF_STAFF_UUID,
      signatureLink: DEV_SIGNATURE_LINK,
      scope: EmployeeScope.BASE_USER,
    },
    {
      id: KAI_ZHENG_UUID,
      firstName: 'Kai',
      lastName: 'Zheng',
      email: 'zheng.kaiy@northeastern.edu',
      positionId: CHIEF_FIN_OFFICER_UUID,
      signatureLink: DEV_SIGNATURE_LINK,
      scope: EmployeeScope.BASE_USER,
    },
    {
      id: ANGELA_WEIGL_UUID,
      firstName: 'Angela',
      lastName: 'Weigl',
      email: 'weigl.a@northeastern.edu',
      positionId: AGG_DIR_UUID,
      signatureLink: DEV_SIGNATURE_LINK,
      scope: EmployeeScope.BASE_USER,
    },
    {
      id: ANSHUL_SHIRUDE_UUID,
      firstName: 'Anshul',
      lastName: 'Shirude',
      email: 'shirude.a@northeastern.edu',
      positionId: CHIEF_LEARNING_ENGAGEMENT_UUID,
      signatureLink: DEV_SIGNATURE_LINK,
      scope: EmployeeScope.BASE_USER,
    },
  ];

  for (const empData of employees) {
    await upsertEmployee(empData);
  }

  // form instances
  const formInstances = [
    {
      id: uuidv4(),
      name: 'IT Exit Form Instance',
      formDocLink: DEV_FORM_DOC_LINK,
      originatorId: KAI_ZHENG_UUID,
      formTemplateId: IT_EXIT_FORM_UUID,
      signatures: [
        {
          id: uuidv4(),
          order: 0,
          signerType: 'USER_LIST',
          signerEmployeeList: {
            connect: [
              { id: IRIS_ZHANG_UUID },
              { id: KAI_ZHENG_UUID },
              { id: ANGELA_WEIGL_UUID },
              { id: ANSHUL_SHIRUDE_UUID },
            ],
          },
        },
        {
          id: uuidv4(),
          order: 1,
          signerType: 'POSITION',
          signerPositionId: CHIEF_FIN_OFFICER_UUID,
        },
      ],
    },
    {
      id: uuidv4(),
      name: 'Staffing Requisition Form Instance',
      formDocLink: DEV_FORM_DOC_LINK,
      originatorId: IRIS_ZHANG_UUID,
      formTemplateId: STAFFING_REQUISITION_UUID,
      signatures: [
        {
          id: uuidv4(),
          order: 0,
          signerType: 'USER',
          signerEmployeeId: KAI_ZHENG_UUID,
        },
        {
          id: uuidv4(),
          order: 1,
          signerType: 'USER_LIST',
          signerEmployeeList: {
            connect: [
              { id: IRIS_ZHANG_UUID },
              { id: KAI_ZHENG_UUID },
              { id: ANGELA_WEIGL_UUID },
              { id: ANSHUL_SHIRUDE_UUID },
            ],
          },
        },
      ],
    },
    {
      id: uuidv4(),
      name: 'Network Add Change Form Instance',
      formDocLink: DEV_FORM_DOC_LINK,
      originatorId: ANSHUL_SHIRUDE_UUID,
      formTemplateId: NETWORK_ADD_CHANGE_UUID,
      signatures: [
        {
          id: uuidv4(),
          order: 0,
          signerType: 'DEPARTMENT',
          signerDepartmentId: LEADERSHIP_TEAM_UUID,
        },
      ],
    },
    {
      id: uuidv4(),
      name: 'MFA Oracle Logon Request Form Instance',
      formDocLink: DEV_FORM_DOC_LINK,
      originatorId: ANGELA_WEIGL_UUID,
      formTemplateId: MFA_ORACLE_LOGON_REQUEST_UUID,
      signatures: [
        {
          id: uuidv4(),
          order: 0,
          signerType: 'DEPARTMENT',
          signerDepartmentId: LEADERSHIP_TEAM_UUID,
        },
      ],
    },
    {
      id: uuidv4(),
      name: 'Hybrid and Remote Work Agreement Form Instance',
      formDocLink: DEV_FORM_DOC_LINK,
      originatorId: ANSHUL_SHIRUDE_UUID,
      formTemplateId: HYBRID_AND_REMOTE_WORK_AGREEMENT_UUID,
      signatures: [
        {
          id: uuidv4(),
          order: 0,
          signerType: 'USER',
          signerEmployeeId: KAI_ZHENG_UUID,
        },
      ],
    },
    {
      id: uuidv4(),
      name: 'VPN Request Form Instance',
      formDocLink: DEV_FORM_DOC_LINK,
      originatorId: IRIS_ZHANG_UUID,
      formTemplateId: VPN_REQUEST_UUID,
      signatures: [
        {
          id: uuidv4(),
          order: 0,
          signerType: 'USER',
          signerEmployeeId: KAI_ZHENG_UUID,
        },
      ],
    },
    {
      id: uuidv4(),
      name: 'Digital MFA ID Badge Request Form Instance',
      formDocLink: DEV_FORM_DOC_LINK,
      originatorId: KAI_ZHENG_UUID,
      formTemplateId: DIGITAL_MFA_ID_BADGE_REQUEST_UUID,
      signatures: [
        {
          id: uuidv4(),
          order: 0,
          signerType: 'DEPARTMENT',
          signerDepartmentId: LEADERSHIP_TEAM_UUID,
        },
      ],
    },
    {
      id: uuidv4(),
      name: 'Travel Authorization Form Instance',
      formDocLink: DEV_FORM_DOC_LINK,
      originatorId: ANGELA_WEIGL_UUID,
      formTemplateId: TRAVEL_AUTHORIZATION_UUID,
      signatures: [
        {
          id: uuidv4(),
          order: 0,
          signerType: 'POSITION',
          signerPositionId: AGG_DIR_UUID,
        },
      ],
    },
  ];

  for (const formInstance of formInstances) {
    await upsertFormInstance(formInstance);
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

    const allPositions = await prisma.position.findMany();
    console.log('Positions:', JSON.stringify(allPositions, null, 2));

    const allEmployees = await prisma.employee.findMany({
      include: {
        position: true,
      },
    });
    console.log('Employees:', allEmployees);

    const allSignatureFields = await prisma.signatureField.findMany();
    console.log('Signature Fields:', allSignatureFields);

    const allFormInstances = await prisma.formInstance.findMany();
    console.log('Form Instances:', allFormInstances);

    await prisma.$disconnect();
  });
