import { PrismaClient } from '@prisma/client';
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
const LEADERSHIP_TEAM_UUID = '3f08fe46-a243-4b33-84fa-6702a74f3a5d';
const CHIEF_OF_STAFF_UUID = '5a5b1c25-8bfe-4418-9ba6-b1420d1fedff';
const CHIEF_FIN_OFFICER_UUID = 'f7c20346-2158-404c-a753-061ba7049f3d';
const AGG_DIR_UUID = '81983f2c-c2ae-4010-b578-17cd141afbef';
const CHIEF_LEARNING_ENGAGEMENT_UUID = '693e8455-50e8-49bc-9d06-755eb24a5bcc';

const ANSHUL_SHIRUDE_UUID = 'b386ef53-d2d1-4bfd-a44c-55b1750a874e';
const HELEN_MIAO_UUID = 'c6de4017-cb1f-44f1-a707-0f38239e0bca';
const KAI_ZHENG_UUID = '339cf78e-d13f-4069-b1f7-dee0c64afb31';
const IRIS_ZHANG_UUID = '777c1974-3104-4744-ae31-7a9296e7784a';

const IT_EXIT_FORM_UUID = '584bf9fd-ea8b-4978-b7de-daa96cb35a03';
const STAFFING_REQUISITION_UUID = 'd0477fb8-bdd1-4811-8e11-203d8e33feba';
const NETWORK_ADD_CHANGE_UUID = 'e908c556-bc1f-4b02-8dea-372c56e24d5e';
const MFA_ORACLE_LOGON_REQUEST_UUID = '5231fd06-690e-4fd8-b309-0db21b8cd202';
const HYBRID_AND_REMOTE_WORK_AGREEMENT_UUID =
  '5ed47339-3af2-4b31-9a30-c0a06095f680';
const VPN_REQUEST_UUID = 'dca7eb51-16b0-4e3d-a3b2-64a57ce60ba0';
const DIGITAL_MFA_ID_BADGE_REQUEST_UUID =
  'cab76e75-5bc0-468c-a2c4-df8f21f87e25';
const TRAVEL_AUTHORIZATION_UUID = 'd5fcfa91-2e05-428d-a2ed-314089955555';

const IT_EXIT_FORM_LINK = 'IT_Exit_Form_584bf9fd-ea8b-4978-b7de-daa96cb35a03';
const STAFFING_REQUISITION_FORM_LINK =
  'Staffing_Requisition_d0477fb8-bdd1-4811-8e11-203d8e33feba';
const NETWORK_ADD_CHANGE_FORM_LINK =
  'Network_Add_Change_Form_e908c556-bc1f-4b02-8dea-372c56e24d5e';
const MFA_ORACLE_LOGON_REQUEST_FORM_LINK =
  'MFA_Oracle_Logon_Request_Form_5231fd06-690e-4fd8-b309-0db21b8cd202';
const HYBRID_AND_REMOTE_WORK_AGREEMENT_FORM_LINK =
  'Hybrid_and_Remote_Work_Agreement_Form_5ed47339-3af2-4b31-9a30-c0a06095f680';
const VPN_REQUEST_FORM_LINK =
  'VPN_Request_Form_dca7eb51-16b0-4e3d-a3b2-64a57ce60ba0';
const DIGITAL_MFA_ID_BADGE_REQUEST_FORM_LINK =
  'Digital_MFA_ID_Badge_Request_Form_cab76e75-5bc0-468c-a2c4-df8f21f87e25';
const TRAVEL_AUTHORIZATION_FORM_LINK =
  'Travel_Authorization_Form_Excample_d5fcfa91-2e05-428d-a2ed-314089955555';

const IT_EXIT_FORM_LINK_INSTANCE_UUID =
  'IT_Exit_Form_instance_5f349017-94c8-4943-8383-fb610c5aa762';
const STAFFING_REQUISITION_FORM_LINK_INSTANCE_UUID =
  'Staffing_Requisition_instance_fd7e21c5-1edb-4566-8484-c49e9c116f0c';
const NETWORK_ADD_CHANGE_FORM_LINK_INSTANCE_UUID =
  'Network_Add_Change_instance_6965a025-8229-4d76-9635-e3d87487ef85';
const MFA_ORACLE_LOGON_REQUEST_FORM_LINK_INSTANCE_UUID =
  'MFA_Oracle_Logon_Request_instance_effdf802-a915-4561-92fb-20611f14fc13';
const HYBRID_AND_REMOTE_WORK_AGREEMENT_FORM_LINK_INSTANCE_UUID =
  'Hybrid_and_Remote_Work_Agreement_instance_32ae0a2c-77c3-4b8c-af6a-4505a3360e1e';
const VPN_REQUEST_FORM_LINK_INSTANCE_UUID =
  'VPN_Request_instance_0f53bc91-789a-4b5a-80f5-db40b86b1420';
const DIGITAL_MFA_ID_BADGE_REQUEST_FORM_LINK_INSTANCE_UUID =
  'Digital_MFA_ID_Badge_Request_instance_a388e3e4-35bd-4fc7-bd85-d08f4afeb8e1';
const TRAVEL_AUTHORIZATION_FORM_LINK_INSTANCE_UUID =
  'Travel_Authorization_instance_2acd0e6b-871f-4993-aa9d-c36a20f4864c';

// type definition for employee data used in upsertEmployee
type EmployeeData = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  positionId: string;
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
      formDocLink: IT_EXIT_FORM_LINK,
    },
  });

  await prisma.formTemplate.upsert({
    where: { id: STAFFING_REQUISITION_UUID },
    update: {},
    create: {
      id: STAFFING_REQUISITION_UUID,
      name: 'Staffing Requisition',
      formDocLink: STAFFING_REQUISITION_FORM_LINK,
    },
  });

  await prisma.formTemplate.upsert({
    where: { id: NETWORK_ADD_CHANGE_UUID },
    update: {},
    create: {
      id: NETWORK_ADD_CHANGE_UUID,
      name: 'Network Add Change',
      formDocLink: NETWORK_ADD_CHANGE_FORM_LINK,
    },
  });

  await prisma.formTemplate.upsert({
    where: { id: MFA_ORACLE_LOGON_REQUEST_UUID },
    update: {},
    create: {
      id: MFA_ORACLE_LOGON_REQUEST_UUID,
      name: 'MFA Oracle Logon Request',
      formDocLink: MFA_ORACLE_LOGON_REQUEST_FORM_LINK,
    },
  });

  await prisma.formTemplate.upsert({
    where: { id: HYBRID_AND_REMOTE_WORK_AGREEMENT_UUID },
    update: {},
    create: {
      id: HYBRID_AND_REMOTE_WORK_AGREEMENT_UUID,
      name: 'Hybrid and Remote Work Agreement',
      formDocLink: HYBRID_AND_REMOTE_WORK_AGREEMENT_FORM_LINK,
    },
  });

  await prisma.formTemplate.upsert({
    where: { id: VPN_REQUEST_UUID },
    update: {},
    create: {
      id: VPN_REQUEST_UUID,
      name: 'VPN Request',
      formDocLink: VPN_REQUEST_FORM_LINK,
    },
  });

  await prisma.formTemplate.upsert({
    where: { id: DIGITAL_MFA_ID_BADGE_REQUEST_UUID },
    update: {},
    create: {
      id: DIGITAL_MFA_ID_BADGE_REQUEST_UUID,
      name: 'Digital MFA ID Badge Request',
      formDocLink: DIGITAL_MFA_ID_BADGE_REQUEST_FORM_LINK,
    },
  });

  await prisma.formTemplate.upsert({
    where: { id: TRAVEL_AUTHORIZATION_UUID },
    update: {},
    create: {
      id: TRAVEL_AUTHORIZATION_UUID,
      name: 'Travel Authorization',
      formDocLink: TRAVEL_AUTHORIZATION_FORM_LINK,
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

  // positions
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

  // employees
  const employees = [
    {
      id: IRIS_ZHANG_UUID,
      firstName: 'Iris',
      lastName: 'Zhang',
      email: 'zhang.iri@northeastern.edu',
      positionId: CHIEF_OF_STAFF_UUID,
    },
    {
      id: KAI_ZHENG_UUID,
      firstName: 'Kai',
      lastName: 'Zheng',
      email: 'zheng.kaiy@northeastern.edu',
      positionId: CHIEF_FIN_OFFICER_UUID,
    },
    {
      id: HELEN_MIAO_UUID,
      firstName: 'Helen',
      lastName: 'Miao',
      email: 'weigl.a@northeastern.edu',
      positionId: AGG_DIR_UUID,
    },
    {
      id: ANSHUL_SHIRUDE_UUID,
      firstName: 'Anshul',
      lastName: 'Shirude',
      email: 'email1@kaiyangzhenggmail.onmicrosoft.com',
      positionId: CHIEF_LEARNING_ENGAGEMENT_UUID,
    },
  ];

  for (const empData of employees) {
    await upsertEmployee(empData);
  }

  // form instances
  const formInstances = [
    {
      id: '855498f1-0a8c-44a8-8159-26e28ab8eca0',
      name: 'IT Exit Form Instance',
      formDocLink: IT_EXIT_FORM_LINK_INSTANCE_UUID,
      originatorId: KAI_ZHENG_UUID,
      formTemplateId: IT_EXIT_FORM_UUID,
      signatures: [
        {
          id: '087229bf-ce86-449b-aa0b-56c83744acf3',
          order: 0,
          signerPositionId: CHIEF_LEARNING_ENGAGEMENT_UUID,
          assignedUserId: ANSHUL_SHIRUDE_UUID,
        },
        {
          id: '760b9266-f165-4551-bf8e-53cfae73b67d',
          order: 1,
          signerPositionId: AGG_DIR_UUID,
          assignedUserId: HELEN_MIAO_UUID,
        },
      ],
    },
    {
      id: '1c50e8ed-b6d7-4205-bfd7-dce825c63040',
      name: 'Staffing Requisition Form Instance',
      formDocLink: STAFFING_REQUISITION_FORM_LINK_INSTANCE_UUID,
      originatorId: IRIS_ZHANG_UUID,
      formTemplateId: STAFFING_REQUISITION_UUID,
      signatures: [
        {
          id: 'b3c7c3ce-9d87-4369-b6b5-6c85e151e7fa',
          order: 0,
          signerPositionId: CHIEF_LEARNING_ENGAGEMENT_UUID,
          assignedUserId: ANSHUL_SHIRUDE_UUID,
        },
      ],
    },
    {
      id: '0affdf33-3c4b-42bf-99af-8ef47d231f41',
      name: 'Network Add Change Form Instance',
      formDocLink: NETWORK_ADD_CHANGE_FORM_LINK_INSTANCE_UUID,
      originatorId: ANSHUL_SHIRUDE_UUID,
      formTemplateId: NETWORK_ADD_CHANGE_UUID,
      signatures: [
        {
          id: '2c6db7e8-8418-4e84-9621-07805850fb46',
          order: 0,
          signerPositionId: AGG_DIR_UUID,
          assignedUserId: HELEN_MIAO_UUID,
        },
      ],
    },
    {
      id: '0ff583fd-8e8c-41c5-9207-51affdf1f677',
      name: 'MFA Oracle Logon Request Form Instance',
      formDocLink: MFA_ORACLE_LOGON_REQUEST_FORM_LINK_INSTANCE_UUID,
      originatorId: HELEN_MIAO_UUID,
      formTemplateId: MFA_ORACLE_LOGON_REQUEST_UUID,
      signatures: [
        {
          id: '67a66ebc-4ce8-4e9e-872a-beb81fc7fde4',
          order: 0,
          signerPositionId: CHIEF_FIN_OFFICER_UUID,
          assignedUserId: KAI_ZHENG_UUID,
        },
      ],
    },
    {
      id: '0daf753e-25e4-4eea-834b-dccda5bba71c',
      name: 'Hybrid and Remote Work Agreement Form Instance',
      formDocLink: HYBRID_AND_REMOTE_WORK_AGREEMENT_FORM_LINK_INSTANCE_UUID,
      originatorId: ANSHUL_SHIRUDE_UUID,
      formTemplateId: HYBRID_AND_REMOTE_WORK_AGREEMENT_UUID,
      signatures: [
        {
          id: '6518fb90-ca64-4b5c-8bec-cf813649cf27',
          order: 0,
          signerPositionId: CHIEF_OF_STAFF_UUID,
          assignedUserId: IRIS_ZHANG_UUID,
        },
      ],
    },
    {
      id: 'b91f0c84-f1c0-440a-8a54-8ebc40dd3e9a',
      name: 'VPN Request Form Instance',
      formDocLink: VPN_REQUEST_FORM_LINK_INSTANCE_UUID,
      originatorId: IRIS_ZHANG_UUID,
      formTemplateId: VPN_REQUEST_UUID,
      signatures: [
        {
          id: '8a39729d-c41e-4b62-a66f-8eac9e29316b',
          order: 0,
          signerPositionId: CHIEF_OF_STAFF_UUID,
          assignedUserId: IRIS_ZHANG_UUID,
        },
      ],
    },
    {
      id: 'c1d27580-77fa-40f6-8ae8-4134b8eb49aa',
      name: 'Digital MFA ID Badge Request Form Instance',
      formDocLink: DIGITAL_MFA_ID_BADGE_REQUEST_FORM_LINK_INSTANCE_UUID,
      originatorId: KAI_ZHENG_UUID,
      formTemplateId: DIGITAL_MFA_ID_BADGE_REQUEST_UUID,
      signatures: [
        {
          id: '6e3b78b7-78dc-4b77-872b-708392038940',
          order: 0,
          signerPositionId: CHIEF_OF_STAFF_UUID,
          assignedUserId: IRIS_ZHANG_UUID,
        },
      ],
    },
    {
      id: 'fa0a3093-acc0-4e93-a96c-adefbd94fcda',
      name: 'Travel Authorization Form Instance',
      formDocLink: TRAVEL_AUTHORIZATION_FORM_LINK_INSTANCE_UUID,
      originatorId: HELEN_MIAO_UUID,
      formTemplateId: TRAVEL_AUTHORIZATION_UUID,
      signatures: [
        {
          id: 'dd179a4a-e153-4e8c-93bf-3e3cc975f7d5',
          order: 0,
          signerPositionId: CHIEF_OF_STAFF_UUID,
          assignedUserId: IRIS_ZHANG_UUID,
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

    const allFormInstances = await prisma.formInstance.findMany();
    console.log('Form Instances:', allFormInstances);

    await prisma.$disconnect();
  });
