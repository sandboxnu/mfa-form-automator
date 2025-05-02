import { v4 as uuidv4 } from 'uuid';
import {
  SignatureBoxFieldType,
  SignerType,
  EmployeeScope,
} from '@prisma/client';
import {
  DepartmentData,
  EmployeeData,
  FormInstanceData,
  FormTemplateData,
  PositionData,
} from './seed.types';

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
const DEV_SIGNATURE_LINK =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAB4CAYAAAAE0wCdAAAAAXNSR0IArs4c6QAADQ5JREFUeF7t3cG15TYBBmBlx5ISJh0MFQzs2FECQwUMFQQqSDqAlMCSFUwFGSogVECW7ODp5Al0PPa9lm3Jsvzdc3JmMs+WpU9697+WZd8vghcBAgQIECBweYEvLt8CDSBAgAABAgSCQDcICBAgQIDAAAICfYBO1AQCBAgQICDQjQECBAgQIDCAgEAfoBM1gQABAgQICHRjgAABAgQIDCAg0AfoRE0gQIAAAQIC3RggQIAAAQIDCAj0ATpREwgQIECAgEA3BggQIECAwAACAn2ATtQEAgQIECAg0I0BAgQIECAwgIBAH6ATNYEAAQIECAh0Y4AAAQIECAwgINAH6ERNIECAAAECAt0YIECAAAECAwgI9AE6URMIECBAgIBANwYIECBAgMAAAgJ9gE7UBAIECBAgINCNAQIECBAgMICAQB+gEzWBAAECBAgIdGOAAAECBAgMICDQB+hETSBAgAABAgLdGCBAgAABAgMICPQBOlETLivw8xDCX0MIfwsh/OH1z8s2RsUJEDhXQKCf6+/o9xb4fQjhq4xAsN97PGg9gV0CAn0Xn50J7BaIZ+jxTH3ulc7aY9B7ESBA4KGAQDdACJwvkKbel2rizP38PlIDAt0LCPTuu0gFOxDIz6Dj39+91in+/RcHXft+FurxkIK9g8GgCgR6FRDovfbMuPXKF4LFMDz7FeszDemSOsVp8Xgt/IjXmlCPx/kUQvjzgcc9ou7KIEDgZAGBfnIH3PDw+UKwo85uSxljcMbFaEvXrteUl65rH/2hpLRu8QNFfB31oWJN221DgECHAgK9w04ZvEr5WeiRZ7fP2EqDMi8vhffH12nvFovUttY31q1lPZ+5+zkBAo0EBHojaIf5n0DLQE+hGA9eejaeQvvs+8NTvdPtbaXtiG1PZ/Hx76ld0w8l03Ljz+cuR3wbQnhvPBMg0J+AQO+vT0avUT7lXuMMfeuZbR528fr0N513RJpiz+9jb1XlGv3Wqu6OQ2BYAYE+bNd227AagR5D/I8hhDcrWv39yxlm/C++0tR0HuYriuhyk/wa+q9CCG8r19J7R2VgxRMoFfBLWSpm+70CRwX62jPxXqbO97pt3T+fNi+Zrk9T7skvfljKPzCdtaBxq4P9CAwvINCH7+LuGpg/GS2GRekq8ZIgP/v6d3f4kwrlAf9ood/c7XTeO3rvXfW7nYBfytt1+ekN3hLoa0M8TqX/5qAHvZwO1UkF5i5nbPkg1klzVIPAuAICfdy+7bVl/5lU7NEYXBPk6elpsdgWt5P16lqjXksPujHdXkNbmQR2Cgj0nYB2LxJYM3W7NsTjgU2pF/EXbbwU5m5bK2K0MYF2AgK9nbUj/Xhfc5xyz1/pGvqaVepxVXpcVOdMvO5omn6tazqaqfa67konsEtAoO/is3OhwNpnlefF+kKSQuSdmwvznYB2J3CWgEA/S/6ex/0QQvh6RdPT40s9n3wF1kGbPLvU4b3iIGjFEKgl4Je0lqxyc4Gls76pklXq54ybRzMnngp3Tp84KoFiAYFeTGaHAoE1QR6/CvR3r2W6Nl6Ae9Cmj/pImB+ErBgCLQQEegvlex7jTyGEX69oulugViBV2iR/JkA6hMsdlbAVS6C2gECvLXzf8qf3m0eJ9DjRXEWgtx8jS2flbklr3xeOSOAwAYF+GKWCMoGla7JxCnf67WACve3QmQtzU+tt+8DRCFQREOhVWBX6EtxzZ+gR5t8hhJ+8Crmvud1QWTorF+bt+sCRCFQVEOhVeW9d+JoFcXFV+5e3ViprfPoylblLF3lJcbt3r//w09dvSYt/Lr3SdfP0c7cLlvWLrQl0ISDQu+iGYSvxLNT/EkL45bCt/7xh00Voz4K5FxqB30tPqAeBBwIC3fBoIRCD/bchhLmzxLtcQ9/ylLwWfbPnGHG6Pr6c0e9RtC+BgwQE+kGQilklMHebVNzxLqEegy9Nha8Ce7kzYO00+9ry1m5XMnvww+uHtRTwcV/PFFgrbTsCBwkI9IMgFbNa4F8LZ+rG4mrCzzZMoR9/8H7m/v+/v8yQRPf45Tb5axq60//Py01/jx9I8n9/VGv3tG/vU3sSKBbwJlpMZoedAktn6Va874R92X26ZiF9vWyNs+UU6vHPNyseIuS9Zn//KoHAQwG/ZAZIa4GlQI/1cAvV9t6Yup5hGcM9Bf30eQPea7b3rT0JrBLwS7aKyUYHCuT3p8cnk00fD3uX6+lHkc4ttjsjzOfakwLeNfWjels5BB4ICHTDo7VAHugxvNPXdub16CWQWtuUHm/utkAfiEoVbU9gEAGBPkhHXqgZeaCn8edxpOUdODWLZ8Hpmnl5afYgQODyAgL98l14qQbk08PTRXBL92nHr1b95lKtrF/ZuTCPZ+ZeBAjcWECg37jzT2j6o0CP1UnT79PbokzB/7+z5laye7DLCYPZIQn0JiDQe+uRsevzIYTw9WsTH92mNjcF77a2EKbfMe+Dzti/L1pHoEhAoBdx2XinQB7UzxZvzU3B3zXUpxafQgjxUkSN+8t3drHdCRA4S0CgnyV/z+Pm90o/C/Q0BR/3yV93W/xliv2evytaTaBYQKAXk9lhh0Ae6GvH3tJ19TUfCHZUtYtdhXkX3aASBK4hsPZN9RqtUcveBdIta1umzueeMDdqqLuNr/eRrH4EOhQQ6B12yqBVerbCfU2z7/AgFbekrRkJtiFA4DMBgW5QtBLIA33P6uyRQ90Ue6vR6DgEBhQQ6AN2aqdNKl0Q96gZo01Jj9aeToegahEYW0Cgj92/PbVuy4K4R/WfWyy358z/DKvYhnhf/tvs4FdrwxlujkmAwIyAQDcsWgnsWRBXcra+ZcFdK4N0HE/Eay3ueARuICDQb9DJHTTxiAVxj5oxtwK+x7G99F3wV/gQ0sEwUgUCBB4J9Pimp8fGEyh5QtzW1vd8HXqubrGdd3tIzta+tR8BAisEBPoKJJvsFjhyQVzJ9HsKzTO/iaznDxq7O1YBBAj0IyDQ++mLkWty9IK4Z1ZzU9tnLDZzT/mznvJzAgQOExDoh1Eq6IFAWhAXN2k15uZCveUU9/Sb0Vwn9ytCgEBVgVZvrlUbofDuBWqtcH/W8KVr1x9fv3v92f5bfz7yw2+2mtiPAIHKAgK9MrDiQ+0V7muIW03Bux1tTW/YhgCBKgICvQqrQjOBfOr5+xDClyfp1FycthTksalnXLs/idhhCRA4U0Cgn6l/j2PnQXp2uH14fTJbLr/3G9vyGYi8XNfM7zG+tZJANwICvZuuGLYi+XT32YEekY++vh2D+13Wey0X3g07aDSMAIFyAYFebmaPMoFW96CX1Gp6Tf1TCOFnJQVk2+Yr+OM/+53aCGk3AgT2CXjz2edn78cC0+noXsbb3NT71iny6YeDOAsRy4r/eREgQKCZQC9vsM0a7EBNBXpY4b7U4LmV71uupy9dQ48LAL99OXic4vciQIBAdQGBXp341gfIr1dvPQOuBbgUxDGE3xcedOlLV1Ixse3/fCk3hvzcK53Nxz9jveLLGX5hJ9icwN0FBPrdR0Dd9ve2IG7a2qUHz2xZvLdU1l7hGOzxQTh5yAv7var2JzCggEAfsFM7alKPC+KmPN+FEN7OmPUU6tPq9Tbb0dGQUxUC9xUQ6Pft+9otn05pb7k+XbuOqfx/hBDeLBxsy+9IrbP1vIpb6tXK03EIEDhBwJvCCeg3OWSvK9yX+Jeug+/5IJIviPshhBBvj5t75VPo6Rp63C7+Pd7jHqfc073u8d+2zB7cZNhpJoH7Cgj0+/Z97Zb38sjXknbOnVn7HSkRtC0BAqcJeLM6jX74A+dnvHse3NIaKp4BpzPjdE956zo4HgECBIoFBHoxmR1WCuRPUDNFvBLNZgQIENgqINC3ytnvkcCVFsTpSQIECAwhINCH6MbuGiHQu+sSFSJAYHQBgT56D5/Tvp6fEHeOiKMSIECgsoBArwx80+KvuML9pl2l2QQIjCIg0Efpyb7acdUV7n0pqg0BAgQKBAR6AZZNVwv0/gz31Q2xIQECBK4iINCv0lPXqqdAv1Z/qS0BAgMICPQBOrHDJgj0DjtFlQgQGFtAoI/dv2e1zkNlzpJ3XAIEbisg0G/b9VUbnge6r/qsSq1wAgQI/Cgg0I2EGgL5lLtAryGsTAIECEwEBLohUUNAoNdQVSYBAgQeCAh0w6OGgCfF1VBVJgECBAS6MdBYID7L/asQwseXryKNU+7xPy8CBAgQqCjgDL0irqIJECBAgEArAYHeStpxCBAgQIBARQGBXhFX0QQIECBAoJWAQG8l7TgECBAgQKCigECviKtoAgQIECDQSkCgt5J2HAIECBAgUFFAoFfEVTQBAgQIEGglINBbSTsOAQIECBCoKCDQK+IqmgABAgQItBIQ6K2kHYcAAQIECFQUEOgVcRVNgAABAgRaCQj0VtKOQ4AAAQIEKgoI9Iq4iiZAgAABAq0E/gtterGI0NQ81gAAAABJRU5ErkJggg==';

export const departments: DepartmentData[] = [
  {
    id: LEADERSHIP_TEAM_UUID,
    name: 'Leadership Team',
  },
  {
    id: TEST_TEAM_UUID,
    name: 'Test Team',
  },
];

export const positions: PositionData[] = [
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

export const employees: EmployeeData[] = [
  {
    id: IRIS_ZHANG_UUID,
    firstName: 'Iris',
    lastName: 'Zhang',
    email: 'zhang.iri@northeastern.edu',
    positionId: CHIEF_OF_STAFF_UUID,
    signatureLink: DEV_SIGNATURE_LINK,
    scope: EmployeeScope.CONTRIBUTOR,
  },
  {
    id: KAI_ZHENG_UUID,
    firstName: 'Kai',
    lastName: 'Zheng',
    email: 'zheng.kaiy@test.edu',
    positionId: CHIEF_FIN_OFFICER_UUID,
    signatureLink: DEV_SIGNATURE_LINK,
    scope: EmployeeScope.ADMIN,
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

export const formTemplates: FormTemplateData[] = [
  {
    id: IT_EXIT_FORM_UUID,
    name: 'IT Exit Form',
    formDocLink: DEV_FORM_DOC_LINK,
    pageWidth: 800,
    pageHeight: 1035,
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
            width: 100,
            height: 100,
            page: 0,
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
            width: 100,
            height: 100,
            page: 0,
          },
        ],
      },
    ],
    description: 'IT exit form description',
    disabled: false,
  },
  {
    id: STAFFING_REQUISITION_UUID,
    name: 'Staffing Requisition',
    description: 'Staffing Requisition description',
    formDocLink: DEV_FORM_DOC_LINK,
    pageWidth: 800,
    pageHeight: 1035,
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
            width: 100,
            height: 100,
            page: 0,
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
            width: 100,
            height: 100,
            page: 0,
          },
        ],
      },
    ],
    disabled: false,
  },
  {
    id: NETWORK_ADD_CHANGE_UUID,
    name: 'Network Add Change',
    description: 'Network Add Change description',
    formDocLink: DEV_FORM_DOC_LINK,
    pageWidth: 800,
    pageHeight: 1035,
    fieldGroups: [
      {
        id: NETWORK_ADD_CHANGE_FIELD_GROUP_0_UUID,
        name: 'Chief',
        order: 0,
        templateBoxes: [
          {
            id: uuidv4(),
            type: 'SIGNATURE',
            x_coordinate: 50,
            y_coordinate: 40,
            width: 100,
            height: 100,
            page: 0,
          },
        ],
      },
    ],
    disabled: false,
  },
  {
    id: MFA_ORACLE_LOGON_REQUEST_UUID,
    name: 'MFA Oracle Logon Request',
    description: 'MFA Oracle Logon Request description',
    formDocLink: DEV_FORM_DOC_LINK,
    pageWidth: 800,
    pageHeight: 1035,
    fieldGroups: [
      {
        id: MFA_ORACLE_LOGON_REQUEST_FIELD_GROUP_0_UUID,
        name: 'Chief',
        order: 0,
        templateBoxes: [
          {
            id: uuidv4(),
            type: SignatureBoxFieldType.SIGNATURE,
            x_coordinate: 50,
            y_coordinate: 100,
            width: 100,
            height: 100,
            page: 0,
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
            x_coordinate: 400,
            y_coordinate: 400,
            width: 100,
            height: 100,
            page: 0,
          },
        ],
      },
    ],
    disabled: false,
  },
  {
    id: HYBRID_AND_REMOTE_WORK_AGREEMENT_UUID,
    name: 'Hybrid and Remote Work Agreement',
    description: 'Hybrid and Remote Work Agreement description',
    formDocLink: DEV_FORM_DOC_LINK,
    pageWidth: 800,
    pageHeight: 1035,
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
            width: 100,
            height: 100,
            page: 0,
          },
        ],
      },
    ],
    disabled: false,
  },
  {
    id: VPN_REQUEST_UUID,
    name: 'VPN Request',
    description: 'VPN Request description',
    formDocLink: DEV_FORM_DOC_LINK,
    pageWidth: 800,
    pageHeight: 1035,
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
            width: 100,
            height: 100,
            page: 0,
          },
        ],
      },
    ],
    disabled: false,
  },
  {
    id: DIGITAL_MFA_ID_BADGE_REQUEST_UUID,
    name: 'Digital MFA ID Badge Request',
    description: 'Digital MFA ID Badge Request description',
    formDocLink: DEV_FORM_DOC_LINK,
    pageWidth: 800,
    pageHeight: 1035,
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
            width: 100,
            height: 100,
            page: 0,
          },
        ],
      },
    ],
    disabled: false,
  },
  {
    id: TRAVEL_AUTHORIZATION_UUID,
    name: 'Travel Authorization',
    description: 'Travel Authorization description',
    formDocLink: DEV_FORM_DOC_LINK,
    pageWidth: 800,
    pageHeight: 1035,
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
            width: 100,
            height: 100,
            page: 0,
          },
        ],
      },
    ],
    disabled: false,
  },
];

export const formInstances: FormInstanceData[] = [
  {
    id: uuidv4(),
    name: 'IT Exit Form Instance',
    description: 'IT Exit Form Instance description',
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
    description: 'Staffing Requisition Form Instance description',
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
    description: 'Network Add Change Form Instance description',
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
    description: 'MFA Oracle Logon Request Form Instance description',
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
    description: 'Hybrid and Remote Work Agreement Form Instance description',
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
    description: 'VPN Request Form Instance description',
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
    description: 'Digital MFA ID Badge Request Form Instance description',
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
    description: 'Travel Authorization Form Instance description',
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
