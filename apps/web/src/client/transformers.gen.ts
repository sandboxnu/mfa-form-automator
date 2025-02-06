// This file is auto-generated by @hey-api/openapi-ts

import type { AppControllerRegisterResponse, EmployeesControllerFindAllResponse, EmployeesControllerCreateResponse, EmployeesControllerFindMeResponse, EmployeesControllerFindOneResponse, EmployeesControllerUpdateResponse, PositionsControllerFindAllResponse, PositionsControllerCreateResponse, PositionsControllerFindAllInDepartmentResponse, PositionsControllerFindAllInDepartmentNameResponse, PositionsControllerFindOneResponse, PositionsControllerUpdateResponse, PositionsControllerFindOneByNameInDepartmentResponse, SignatureFieldsControllerFindAllResponse, SignatureFieldsControllerCreateResponse, SignatureFieldsControllerFindOneResponse, SignatureFieldsControllerUpdateResponse, DepartmentsControllerFindAllResponse, DepartmentsControllerCreateResponse, DepartmentsControllerFindOneResponse, DepartmentsControllerUpdateResponse, DepartmentsControllerFindOneByNameResponse, FormInstancesControllerFindAllResponse, FormInstancesControllerCreateResponse, FormInstancesControllerFindAllAssignedToCurrentEmployeeResponse, FormInstancesControllerFindAllCreatedByCurrentEmployeeResponse, FormInstancesControllerFindOneResponse, FormInstancesControllerUpdateResponse, FormInstancesControllerSignFormInstanceResponse, FormInstancesControllerCompleteFormInstanceResponse, FormTemplatesControllerFindAllResponse, FormTemplatesControllerCreateResponse, FormTemplatesControllerFindOneResponse, FormTemplatesControllerUpdateResponse } from './types.gen';

const departmentEntitySchemaResponseTransformer = (data: any) => {
    data.createdAt = new Date(data.createdAt);
    data.updatedAt = new Date(data.updatedAt);
    return data;
};

const positionBaseEntitySchemaResponseTransformer = (data: any) => {
    data.department = departmentEntitySchemaResponseTransformer(data.department);
    data.createdAt = new Date(data.createdAt);
    data.updatedAt = new Date(data.updatedAt);
    return data;
};

const employeeEntitySchemaResponseTransformer = (data: any) => {
    data.position = positionBaseEntitySchemaResponseTransformer(data.position);
    data.createdAt = new Date(data.createdAt);
    data.updatedAt = new Date(data.updatedAt);
    return data;
};

export const appControllerRegisterResponseTransformer = async (data: any): Promise<AppControllerRegisterResponse> => {
    data = employeeEntitySchemaResponseTransformer(data);
    return data;
};

export const employeesControllerFindAllResponseTransformer = async (data: any): Promise<EmployeesControllerFindAllResponse> => {
    data = data.map((item: any) => {
        return employeeEntitySchemaResponseTransformer(item);
    });
    return data;
};

export const employeesControllerCreateResponseTransformer = async (data: any): Promise<EmployeesControllerCreateResponse> => {
    data = employeeEntitySchemaResponseTransformer(data);
    return data;
};

export const employeesControllerFindMeResponseTransformer = async (data: any): Promise<EmployeesControllerFindMeResponse> => {
    data = employeeEntitySchemaResponseTransformer(data);
    return data;
};

export const employeesControllerFindOneResponseTransformer = async (data: any): Promise<EmployeesControllerFindOneResponse> => {
    data = employeeEntitySchemaResponseTransformer(data);
    return data;
};

export const employeesControllerUpdateResponseTransformer = async (data: any): Promise<EmployeesControllerUpdateResponse> => {
    data = employeeEntitySchemaResponseTransformer(data);
    return data;
};

const employeeBaseEntitySchemaResponseTransformer = (data: any) => {
    data.createdAt = new Date(data.createdAt);
    data.updatedAt = new Date(data.updatedAt);
    return data;
};

const positionEntitySchemaResponseTransformer = (data: any) => {
    data.department = departmentEntitySchemaResponseTransformer(data.department);
    data.createdAt = new Date(data.createdAt);
    data.updatedAt = new Date(data.updatedAt);
    if (data.employees) {
        data.employees = data.employees.map((item: any) => {
            return employeeBaseEntitySchemaResponseTransformer(item);
        });
    }
    return data;
};

export const positionsControllerFindAllResponseTransformer = async (data: any): Promise<PositionsControllerFindAllResponse> => {
    data = data.map((item: any) => {
        return positionEntitySchemaResponseTransformer(item);
    });
    return data;
};

export const positionsControllerCreateResponseTransformer = async (data: any): Promise<PositionsControllerCreateResponse> => {
    data = positionEntitySchemaResponseTransformer(data);
    return data;
};

export const positionsControllerFindAllInDepartmentResponseTransformer = async (data: any): Promise<PositionsControllerFindAllInDepartmentResponse> => {
    data = data.map((item: any) => {
        return positionEntitySchemaResponseTransformer(item);
    });
    return data;
};

export const positionsControllerFindAllInDepartmentNameResponseTransformer = async (data: any): Promise<PositionsControllerFindAllInDepartmentNameResponse> => {
    data = data.map((item: any) => {
        return positionEntitySchemaResponseTransformer(item);
    });
    return data;
};

export const positionsControllerFindOneResponseTransformer = async (data: any): Promise<PositionsControllerFindOneResponse> => {
    data = positionEntitySchemaResponseTransformer(data);
    return data;
};

export const positionsControllerUpdateResponseTransformer = async (data: any): Promise<PositionsControllerUpdateResponse> => {
    data = positionEntitySchemaResponseTransformer(data);
    return data;
};

export const positionsControllerFindOneByNameInDepartmentResponseTransformer = async (data: any): Promise<PositionsControllerFindOneByNameInDepartmentResponse> => {
    data = positionEntitySchemaResponseTransformer(data);
    return data;
};

const signatureFieldEntitySchemaResponseTransformer = (data: any) => {
    data.createdAt = new Date(data.createdAt);
    data.updatedAt = new Date(data.updatedAt);
    return data;
};

export const signatureFieldsControllerFindAllResponseTransformer = async (data: any): Promise<SignatureFieldsControllerFindAllResponse> => {
    data = data.map((item: any) => {
        return signatureFieldEntitySchemaResponseTransformer(item);
    });
    return data;
};

export const signatureFieldsControllerCreateResponseTransformer = async (data: any): Promise<SignatureFieldsControllerCreateResponse> => {
    data = signatureFieldEntitySchemaResponseTransformer(data);
    return data;
};

export const signatureFieldsControllerFindOneResponseTransformer = async (data: any): Promise<SignatureFieldsControllerFindOneResponse> => {
    data = signatureFieldEntitySchemaResponseTransformer(data);
    return data;
};

export const signatureFieldsControllerUpdateResponseTransformer = async (data: any): Promise<SignatureFieldsControllerUpdateResponse> => {
    data = signatureFieldEntitySchemaResponseTransformer(data);
    return data;
};

export const departmentsControllerFindAllResponseTransformer = async (data: any): Promise<DepartmentsControllerFindAllResponse> => {
    data = data.map((item: any) => {
        return departmentEntitySchemaResponseTransformer(item);
    });
    return data;
};

export const departmentsControllerCreateResponseTransformer = async (data: any): Promise<DepartmentsControllerCreateResponse> => {
    data = departmentEntitySchemaResponseTransformer(data);
    return data;
};

export const departmentsControllerFindOneResponseTransformer = async (data: any): Promise<DepartmentsControllerFindOneResponse> => {
    data = departmentEntitySchemaResponseTransformer(data);
    return data;
};

export const departmentsControllerUpdateResponseTransformer = async (data: any): Promise<DepartmentsControllerUpdateResponse> => {
    data = departmentEntitySchemaResponseTransformer(data);
    return data;
};

export const departmentsControllerFindOneByNameResponseTransformer = async (data: any): Promise<DepartmentsControllerFindOneByNameResponse> => {
    data = departmentEntitySchemaResponseTransformer(data);
    return data;
};

const formTemplateBaseEntitySchemaResponseTransformer = (data: any) => {
    data.createdAt = new Date(data.createdAt);
    data.updatedAt = new Date(data.updatedAt);
    return data;
};

const signatureEntitySchemaResponseTransformer = (data: any) => {
    data.createdAt = new Date(data.createdAt);
    data.updatedAt = new Date(data.updatedAt);
    data.signerPosition = positionBaseEntitySchemaResponseTransformer(data.signerPosition);
    data.signerDepartment = departmentEntitySchemaResponseTransformer(data.signerDepartment);
    data.signerEmployee = employeeBaseEntitySchemaResponseTransformer(data.signerEmployee);
    data.signerEmployeeList = data.signerEmployeeList.map((item: any) => {
        return employeeBaseEntitySchemaResponseTransformer(item);
    });
    data.signingEmployee = employeeBaseEntitySchemaResponseTransformer(data.signingEmployee);
    return data;
};

const formInstanceEntitySchemaResponseTransformer = (data: any) => {
    data.createdAt = new Date(data.createdAt);
    data.updatedAt = new Date(data.updatedAt);
    if (data.completedAt) {
        data.completedAt = new Date(data.completedAt);
    }
    if (data.markedCompletedAt) {
        data.markedCompletedAt = new Date(data.markedCompletedAt);
    }
    data.originator = employeeEntitySchemaResponseTransformer(data.originator);
    data.formTemplate = formTemplateBaseEntitySchemaResponseTransformer(data.formTemplate);
    data.signatures = data.signatures.map((item: any) => {
        return signatureEntitySchemaResponseTransformer(item);
    });
    return data;
};

export const formInstancesControllerFindAllResponseTransformer = async (data: any): Promise<FormInstancesControllerFindAllResponse> => {
    data = data.map((item: any) => {
        return formInstanceEntitySchemaResponseTransformer(item);
    });
    return data;
};

export const formInstancesControllerCreateResponseTransformer = async (data: any): Promise<FormInstancesControllerCreateResponse> => {
    data = formInstanceEntitySchemaResponseTransformer(data);
    return data;
};

export const formInstancesControllerFindAllAssignedToCurrentEmployeeResponseTransformer = async (data: any): Promise<FormInstancesControllerFindAllAssignedToCurrentEmployeeResponse> => {
    data = data.map((item: any) => {
        return formInstanceEntitySchemaResponseTransformer(item);
    });
    return data;
};

export const formInstancesControllerFindAllCreatedByCurrentEmployeeResponseTransformer = async (data: any): Promise<FormInstancesControllerFindAllCreatedByCurrentEmployeeResponse> => {
    data = data.map((item: any) => {
        return formInstanceEntitySchemaResponseTransformer(item);
    });
    return data;
};

export const formInstancesControllerFindOneResponseTransformer = async (data: any): Promise<FormInstancesControllerFindOneResponse> => {
    data = formInstanceEntitySchemaResponseTransformer(data);
    return data;
};

export const formInstancesControllerUpdateResponseTransformer = async (data: any): Promise<FormInstancesControllerUpdateResponse> => {
    data = formInstanceEntitySchemaResponseTransformer(data);
    return data;
};

export const formInstancesControllerSignFormInstanceResponseTransformer = async (data: any): Promise<FormInstancesControllerSignFormInstanceResponse> => {
    data = formInstanceEntitySchemaResponseTransformer(data);
    return data;
};

export const formInstancesControllerCompleteFormInstanceResponseTransformer = async (data: any): Promise<FormInstancesControllerCompleteFormInstanceResponse> => {
    data = formInstanceEntitySchemaResponseTransformer(data);
    return data;
};

const formTemplateEntitySchemaResponseTransformer = (data: any) => {
    data.signatureFields = data.signatureFields.map((item: any) => {
        return signatureFieldEntitySchemaResponseTransformer(item);
    });
    data.formInstances = data.formInstances.map((item: any) => {
        return formInstanceEntitySchemaResponseTransformer(item);
    });
    data.createdAt = new Date(data.createdAt);
    data.updatedAt = new Date(data.updatedAt);
    return data;
};

export const formTemplatesControllerFindAllResponseTransformer = async (data: any): Promise<FormTemplatesControllerFindAllResponse> => {
    data = data.map((item: any) => {
        return formTemplateEntitySchemaResponseTransformer(item);
    });
    return data;
};

export const formTemplatesControllerCreateResponseTransformer = async (data: any): Promise<FormTemplatesControllerCreateResponse> => {
    data = formTemplateEntitySchemaResponseTransformer(data);
    return data;
};

export const formTemplatesControllerFindOneResponseTransformer = async (data: any): Promise<FormTemplatesControllerFindOneResponse> => {
    data = formTemplateEntitySchemaResponseTransformer(data);
    return data;
};

export const formTemplatesControllerUpdateResponseTransformer = async (data: any): Promise<FormTemplatesControllerUpdateResponse> => {
    data = formTemplateEntitySchemaResponseTransformer(data);
    return data;
};