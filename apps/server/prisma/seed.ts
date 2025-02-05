import { SignatureBoxFieldType, SignerType } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import {
  DepartmentData,
  EmployeeData,
  FormInstanceData,
  FormTemplateData,
  PositionData,
} from './seed.types';
import { Seeder } from './seeder';

// department ids
const LEADERSHIP_TEAM_UUID = uuidv4();
const TEST_TEAM_UUID = uuidv4();

// position ids
const CHIEF_OF_STAFF_UUID = uuidv4();
const CHIEF_FIN_OFFICER_UUID = uuidv4();
const AGG_DIR_UUID = uuidv4();
const CHIEF_LEARNING_ENGAGEMENT_UUID = uuidv4();

// employee ids
const ANSHUL_SHIRUDE_UUID = uuidv4();
const ANGELA_WEIGL_UUID = uuidv4();
const KAI_ZHENG_UUID = uuidv4();
const IRIS_ZHANG_UUID = uuidv4();

// form template ids
const IT_EXIT_FORM_UUID = uuidv4();
const STAFFING_REQUISITION_UUID = uuidv4();
const NETWORK_ADD_CHANGE_UUID = uuidv4();
const MFA_ORACLE_LOGON_REQUEST_UUID = uuidv4();
const HYBRID_AND_REMOTE_WORK_AGREEMENT_UUID = uuidv4();
const VPN_REQUEST_UUID = uuidv4();
const DIGITAL_MFA_ID_BADGE_REQUEST_UUID = uuidv4();
const TRAVEL_AUTHORIZATION_UUID = uuidv4();

// field group ids
const IT_EXIT_FORM_FIELD_GROUP_0_UUID = uuidv4();
const IT_EXIT_FORM_FIELD_GROUP_1_UUID = uuidv4();
const STAFFING_REQUISITION_FIELD_GROUP_0_UUID = uuidv4();
const STAFFING_REQUISITION_FIELD_GROUP_1_UUID = uuidv4();
const NETWORK_ADD_CHANGE_FIELD_GROUP_0_UUID = uuidv4();
const MFA_ORACLE_LOGON_REQUEST_FIELD_GROUP_0_UUID = uuidv4();
const MFA_ORACLE_LOGON_REQUEST_FIELD_GROUP_1_UUID = uuidv4();
const HYBRID_AND_REMOTE_WORK_AGREEMENT_FIELD_GROUP_0_UUID = uuidv4();
const VPN_REQUEST_FIELD_GROUP_0_UUID = uuidv4();
const DIGITAL_MFA_ID_BADGE_REQUEST_FIELD_GROUP_0_UUID = uuidv4();
const TRAVEL_AUTHORIZATION_FIELD_GROUP_0_UUID = uuidv4();

// links
const DEV_FORM_DOC_LINK = 'http://localhost:3002/test.pdf';
const DEV_SIGNATURE_LINK = 'http://localhost:3002/signature.png';

const departments: DepartmentData[] = [
  {
    id: LEADERSHIP_TEAM_UUID,
    name: 'Leadership Team',
  },
  {
    id: TEST_TEAM_UUID,
    name: 'Test Team',
  },
];

const positions: PositionData[] = [
  {
    id: CHIEF_OF_STAFF_UUID,
    name: 'Chief of Staff',
    departmentId: LEADERSHIP_TEAM_UUID,
  },
  {
    id: CHIEF_FIN_OFFICER_UUID,
    name: 'Chief Financial Officer',
    departmentId: LEADERSHIP_TEAM_UUID,
  },
  {
    id: AGG_DIR_UUID,
    name: 'AGG Director',
    departmentId: LEADERSHIP_TEAM_UUID,
  },
  {
    id: CHIEF_LEARNING_ENGAGEMENT_UUID,
    name: 'Chief of Learning & Community Engagement',
    departmentId: LEADERSHIP_TEAM_UUID,
  },
];

const employees: EmployeeData[] = [
  {
    id: IRIS_ZHANG_UUID,
    firstName: 'Iris',
    lastName: 'Zhang',
    email: 'zhang.iri@northeastern.edu',
    positionId: CHIEF_OF_STAFF_UUID,
    signatureLink: DEV_SIGNATURE_LINK,
  },
  {
    id: KAI_ZHENG_UUID,
    firstName: 'Kai',
    lastName: 'Zheng',
    email: 'zheng.kaiy@northeastern.edu',
    positionId: CHIEF_FIN_OFFICER_UUID,
    signatureLink: DEV_SIGNATURE_LINK,
  },
  {
    id: ANGELA_WEIGL_UUID,
    firstName: 'Angela',
    lastName: 'Weigl',
    email: 'weigl.a@northeastern.edu',
    positionId: AGG_DIR_UUID,
    signatureLink: DEV_SIGNATURE_LINK,
  },
  {
    id: ANSHUL_SHIRUDE_UUID,
    firstName: 'Anshul',
    lastName: 'Shirude',
    email: 'shirude.a@northeastern.edu',
    positionId: CHIEF_LEARNING_ENGAGEMENT_UUID,
    signatureLink: DEV_SIGNATURE_LINK,
  },
];

const formTemplates: FormTemplateData[] = [
  {
    id: IT_EXIT_FORM_UUID,
    name: 'IT Exit Form',
    formDocLink: DEV_FORM_DOC_LINK,
    fieldGroups: [
      {
        id: IT_EXIT_FORM_FIELD_GROUP_0_UUID,
        name: 'Chief',
        order: 0,
        templateBoxes: [
          {
            id: uuidv4(),
            type: SignatureBoxFieldType.SIGNATURE,
            x_coordinate: 0,
            y_coordinate: 0,
          },
        ],
      },
      {
        id: IT_EXIT_FORM_FIELD_GROUP_1_UUID,
        name: 'Chief Fin Officer',
        order: 1,
        templateBoxes: [
          {
            id: uuidv4(),
            type: SignatureBoxFieldType.SIGNATURE,
            x_coordinate: 0,
            y_coordinate: 0,
          },
        ],
      },
    ],
  },
  {
    id: STAFFING_REQUISITION_UUID,
    name: 'Staffing Requisition',
    formDocLink: DEV_FORM_DOC_LINK,
    fieldGroups: [
      {
        id: STAFFING_REQUISITION_FIELD_GROUP_0_UUID,
        name: 'Person 1',
        order: 0,
        templateBoxes: [
          {
            id: uuidv4(),
            type: SignatureBoxFieldType.SIGNATURE,
            x_coordinate: 0,
            y_coordinate: 0,
          },
        ],
      },
      {
        id: STAFFING_REQUISITION_FIELD_GROUP_1_UUID,
        name: 'Person 2',
        order: 1,
        templateBoxes: [
          {
            id: uuidv4(),
            type: SignatureBoxFieldType.SIGNATURE,
            x_coordinate: 0,
            y_coordinate: 0,
          },
        ],
      },
    ],
  },
  {
    id: NETWORK_ADD_CHANGE_UUID,
    name: 'Network Add Change',
    formDocLink: DEV_FORM_DOC_LINK,
    fieldGroups: [
      {
        id: NETWORK_ADD_CHANGE_FIELD_GROUP_0_UUID,
        name: 'Chief',
        order: 0,
        templateBoxes: [
          {
            id: uuidv4(),
            type: 'SIGNATURE',
            x_coordinate: 0,
            y_coordinate: 0,
          },
        ],
      },
    ],
  },
  {
    id: MFA_ORACLE_LOGON_REQUEST_UUID,
    name: 'MFA Oracle Logon Request',
    formDocLink: DEV_FORM_DOC_LINK,
    fieldGroups: [
      {
        id: MFA_ORACLE_LOGON_REQUEST_FIELD_GROUP_0_UUID,
        name: 'Chief',
        order: 0,
        templateBoxes: [
          {
            id: uuidv4(),
            type: SignatureBoxFieldType.SIGNATURE,
            x_coordinate: 0,
            y_coordinate: 0,
          },
        ],
      },
      {
        id: MFA_ORACLE_LOGON_REQUEST_FIELD_GROUP_1_UUID,
        name: 'Chief',
        order: 1,
        templateBoxes: [
          {
            id: uuidv4(),
            type: SignatureBoxFieldType.SIGNATURE,
            x_coordinate: 0,
            y_coordinate: 0,
          },
        ],
      },
    ],
  },
  {
    id: HYBRID_AND_REMOTE_WORK_AGREEMENT_UUID,
    name: 'Hybrid and Remote Work Agreement',
    formDocLink: DEV_FORM_DOC_LINK,
    fieldGroups: [
      {
        id: HYBRID_AND_REMOTE_WORK_AGREEMENT_FIELD_GROUP_0_UUID,
        name: 'Chief',
        order: 0,
        templateBoxes: [
          {
            id: uuidv4(),
            type: SignatureBoxFieldType.SIGNATURE,
            x_coordinate: 0,
            y_coordinate: 0,
          },
        ],
      },
    ],
  },
  {
    id: VPN_REQUEST_UUID,
    name: 'VPN Request',
    formDocLink: DEV_FORM_DOC_LINK,
    fieldGroups: [
      {
        id: VPN_REQUEST_FIELD_GROUP_0_UUID,
        name: 'Chief',
        order: 0,
        templateBoxes: [
          {
            id: uuidv4(),
            type: SignatureBoxFieldType.SIGNATURE,
            x_coordinate: 0,
            y_coordinate: 0,
          },
        ],
      },
    ],
  },
  {
    id: DIGITAL_MFA_ID_BADGE_REQUEST_UUID,
    name: 'Digital MFA ID Badge Request',
    formDocLink: DEV_FORM_DOC_LINK,
    fieldGroups: [
      {
        id: DIGITAL_MFA_ID_BADGE_REQUEST_FIELD_GROUP_0_UUID,
        name: 'Chief',
        order: 0,
        templateBoxes: [
          {
            id: uuidv4(),
            type: SignatureBoxFieldType.SIGNATURE,
            x_coordinate: 0,
            y_coordinate: 0,
          },
        ],
      },
    ],
  },
  {
    id: TRAVEL_AUTHORIZATION_UUID,
    name: 'Travel Authorization',
    formDocLink: DEV_FORM_DOC_LINK,
    fieldGroups: [
      {
        id: TRAVEL_AUTHORIZATION_FIELD_GROUP_0_UUID,
        name: 'Chief',
        order: 0,
        templateBoxes: [
          {
            id: uuidv4(),
            type: SignatureBoxFieldType.SIGNATURE,
            x_coordinate: 0,
            y_coordinate: 0,
          },
        ],
      },
    ],
  },
];

const formInstances: FormInstanceData[] = [
  {
    id: uuidv4(),
    name: 'IT Exit Form Instance',
    formDocLink: DEV_FORM_DOC_LINK,
    originatorId: KAI_ZHENG_UUID,
    formTemplateId: IT_EXIT_FORM_UUID,
    assignedGroups: [
      {
        id: uuidv4(),
        fieldGroupId: IT_EXIT_FORM_FIELD_GROUP_0_UUID,
        order: 0,
        signerType: SignerType.USER_LIST,
        signerEmployeeList: [
          { id: IRIS_ZHANG_UUID },
          { id: KAI_ZHENG_UUID },
          { id: ANGELA_WEIGL_UUID },
          { id: ANSHUL_SHIRUDE_UUID },
        ],
      },
      {
        id: uuidv4(),
        fieldGroupId: IT_EXIT_FORM_FIELD_GROUP_1_UUID,
        order: 1,
        signerType: SignerType.POSITION,
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
    assignedGroups: [
      {
        id: uuidv4(),
        fieldGroupId: STAFFING_REQUISITION_FIELD_GROUP_0_UUID,
        order: 0,
        signerType: SignerType.USER,
        signerEmployeeId: KAI_ZHENG_UUID,
      },
      {
        id: uuidv4(),
        fieldGroupId: STAFFING_REQUISITION_FIELD_GROUP_1_UUID,
        order: 1,
        signerType: SignerType.USER_LIST,
        signerEmployeeList: [
          { id: IRIS_ZHANG_UUID },
          { id: KAI_ZHENG_UUID },
          { id: ANGELA_WEIGL_UUID },
          { id: ANSHUL_SHIRUDE_UUID },
        ],
      },
    ],
  },
  {
    id: uuidv4(),
    name: 'Network Add Change Form Instance',
    formDocLink: DEV_FORM_DOC_LINK,
    originatorId: ANSHUL_SHIRUDE_UUID,
    formTemplateId: NETWORK_ADD_CHANGE_UUID,
    assignedGroups: [
      {
        id: uuidv4(),
        fieldGroupId: NETWORK_ADD_CHANGE_FIELD_GROUP_0_UUID,
        order: 0,
        signerType: SignerType.DEPARTMENT,
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
    assignedGroups: [
      {
        id: uuidv4(),
        fieldGroupId: MFA_ORACLE_LOGON_REQUEST_FIELD_GROUP_0_UUID,
        order: 0,
        signerType: SignerType.DEPARTMENT,
        signerDepartmentId: LEADERSHIP_TEAM_UUID,
      },
      {
        id: uuidv4(),
        fieldGroupId: MFA_ORACLE_LOGON_REQUEST_FIELD_GROUP_1_UUID,
        order: 1,
        signerType: SignerType.DEPARTMENT,
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
    assignedGroups: [
      {
        id: uuidv4(),
        fieldGroupId: HYBRID_AND_REMOTE_WORK_AGREEMENT_FIELD_GROUP_0_UUID,
        order: 0,
        signerType: SignerType.USER,
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
    assignedGroups: [
      {
        id: uuidv4(),
        fieldGroupId: VPN_REQUEST_FIELD_GROUP_0_UUID,
        order: 0,
        signerType: SignerType.USER,
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
    assignedGroups: [
      {
        id: uuidv4(),
        fieldGroupId: DIGITAL_MFA_ID_BADGE_REQUEST_FIELD_GROUP_0_UUID,
        order: 0,
        signerType: SignerType.DEPARTMENT,
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
    assignedGroups: [
      {
        id: uuidv4(),
        fieldGroupId: TRAVEL_AUTHORIZATION_FIELD_GROUP_0_UUID,
        order: 0,
        signerType: SignerType.POSITION,
        signerPositionId: AGG_DIR_UUID,
      },
    ],
  },
];

const seeder = new Seeder(
  departments,
  positions,
  employees,
  formTemplates,
  formInstances,
);

seeder.seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
