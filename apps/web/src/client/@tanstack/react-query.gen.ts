// This file is auto-generated by @hey-api/openapi-ts

import {
  type Options,
  appControllerGetHello,
  appControllerLogin,
  appControllerRefresh,
  appControllerRegister,
  appControllerLogout,
  employeesControllerFindAll,
  employeesControllerCreate,
  employeesControllerOnboardEmployee,
  employeesControllerFindAllDisabled,
  employeesControllerFindMe,
  employeesControllerRemove,
  employeesControllerFindOne,
  employeesControllerUpdate,
  employeesControllerUpdateSignature,
  positionsControllerFindAll,
  positionsControllerCreate,
  positionsControllerFindAllInDepartment,
  positionsControllerFindAllInDepartmentName,
  positionsControllerRemove,
  positionsControllerFindOne,
  positionsControllerUpdate,
  positionsControllerFindOneByNameInDepartment,
  assignedGroupControllerUpdateAssignedGroupSigner,
  formTemplatesControllerFindAll,
  formTemplatesControllerCreate,
  formTemplatesControllerRemove,
  formTemplatesControllerFindOne,
  formTemplatesControllerUpdate,
  departmentsControllerFindAll,
  departmentsControllerCreate,
  departmentsControllerRemove,
  departmentsControllerFindOne,
  departmentsControllerUpdate,
  departmentsControllerFindOneByName,
  formInstancesControllerFindAll,
  formInstancesControllerCreate,
  formInstancesControllerFindAllAssignedToCurrentEmployee,
  formInstancesControllerFindAllCreatedByCurrentEmployee,
  formInstancesControllerRemove,
  formInstancesControllerFindOne,
  formInstancesControllerUpdate,
  formInstancesControllerSignFormInstance,
  formInstancesControllerCompleteFormInstance,
} from '../sdk.gen';
import {
  queryOptions,
  type UseMutationOptions,
  type DefaultError,
  infiniteQueryOptions,
  type InfiniteData,
} from '@tanstack/react-query';
import type {
  AppControllerGetHelloData,
  AppControllerLoginData,
  AppControllerLoginResponse,
  AppControllerRefreshData,
  AppControllerRegisterData,
  AppControllerRegisterResponse,
  AppControllerLogoutData,
  EmployeesControllerFindAllData,
  EmployeesControllerCreateData,
  EmployeesControllerCreateResponse,
  EmployeesControllerOnboardEmployeeData,
  EmployeesControllerOnboardEmployeeResponse,
  EmployeesControllerFindAllDisabledData,
  EmployeesControllerFindMeData,
  EmployeesControllerRemoveData,
  EmployeesControllerFindOneData,
  EmployeesControllerUpdateData,
  EmployeesControllerUpdateResponse,
  EmployeesControllerUpdateSignatureData,
  EmployeesControllerUpdateSignatureResponse,
  PositionsControllerFindAllData,
  PositionsControllerCreateData,
  PositionsControllerCreateResponse,
  PositionsControllerFindAllInDepartmentData,
  PositionsControllerFindAllInDepartmentNameData,
  PositionsControllerRemoveData,
  PositionsControllerFindOneData,
  PositionsControllerUpdateData,
  PositionsControllerUpdateResponse,
  PositionsControllerFindOneByNameInDepartmentData,
  AssignedGroupControllerUpdateAssignedGroupSignerData,
  AssignedGroupControllerUpdateAssignedGroupSignerResponse,
  FormTemplatesControllerFindAllData,
  FormTemplatesControllerFindAllResponse,
  FormTemplatesControllerCreateData,
  FormTemplatesControllerCreateResponse,
  FormTemplatesControllerRemoveData,
  FormTemplatesControllerFindOneData,
  FormTemplatesControllerUpdateData,
  FormTemplatesControllerUpdateResponse,
  DepartmentsControllerFindAllData,
  DepartmentsControllerCreateData,
  DepartmentsControllerCreateResponse,
  DepartmentsControllerRemoveData,
  DepartmentsControllerFindOneData,
  DepartmentsControllerUpdateData,
  DepartmentsControllerUpdateResponse,
  DepartmentsControllerFindOneByNameData,
  FormInstancesControllerFindAllData,
  FormInstancesControllerFindAllResponse,
  FormInstancesControllerCreateData,
  FormInstancesControllerCreateResponse,
  FormInstancesControllerFindAllAssignedToCurrentEmployeeData,
  FormInstancesControllerFindAllCreatedByCurrentEmployeeData,
  FormInstancesControllerRemoveData,
  FormInstancesControllerFindOneData,
  FormInstancesControllerUpdateData,
  FormInstancesControllerUpdateResponse,
  FormInstancesControllerSignFormInstanceData,
  FormInstancesControllerSignFormInstanceResponse,
  FormInstancesControllerCompleteFormInstanceData,
  FormInstancesControllerCompleteFormInstanceResponse,
} from '../types.gen';
import type { AxiosError } from 'axios';
import { client as _heyApiClient } from '../client.gen';

type QueryKey<TOptions extends Options> = [
  Pick<TOptions, 'baseURL' | 'body' | 'headers' | 'path' | 'query'> & {
    _id: string;
    _infinite?: boolean;
  },
];

const createQueryKey = <TOptions extends Options>(
  id: string,
  options?: TOptions,
  infinite?: boolean,
): QueryKey<TOptions>[0] => {
  const params: QueryKey<TOptions>[0] = {
    _id: id,
    baseURL: (options?.client ?? _heyApiClient).getConfig().baseURL,
  } as QueryKey<TOptions>[0];
  if (infinite) {
    params._infinite = infinite;
  }
  if (options?.body) {
    params.body = options.body;
  }
  if (options?.headers) {
    params.headers = options.headers;
  }
  if (options?.path) {
    params.path = options.path;
  }
  if (options?.query) {
    params.query = options.query;
  }
  return params;
};

export const appControllerGetHelloQueryKey = (
  options?: Options<AppControllerGetHelloData>,
) => [createQueryKey('appControllerGetHello', options)];

export const appControllerGetHelloOptions = (
  options?: Options<AppControllerGetHelloData>,
) => {
  return queryOptions({
    queryFn: async ({ queryKey, signal }) => {
      const { data } = await appControllerGetHello({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true,
      });
      return data;
    },
    queryKey: appControllerGetHelloQueryKey(options),
  });
};

export const appControllerLoginQueryKey = (
  options: Options<AppControllerLoginData>,
) => [createQueryKey('appControllerLogin', options)];

export const appControllerLoginOptions = (
  options: Options<AppControllerLoginData>,
) => {
  return queryOptions({
    queryFn: async ({ queryKey, signal }) => {
      const { data } = await appControllerLogin({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true,
      });
      return data;
    },
    queryKey: appControllerLoginQueryKey(options),
  });
};

export const appControllerLoginMutation = (
  options?: Partial<Options<AppControllerLoginData>>,
) => {
  const mutationOptions: UseMutationOptions<
    AppControllerLoginResponse,
    AxiosError<DefaultError>,
    Options<AppControllerLoginData>
  > = {
    mutationFn: async (localOptions) => {
      const { data } = await appControllerLogin({
        ...options,
        ...localOptions,
        throwOnError: true,
      });
      return data;
    },
  };
  return mutationOptions;
};

export const appControllerRefreshQueryKey = (
  options?: Options<AppControllerRefreshData>,
) => [createQueryKey('appControllerRefresh', options)];

export const appControllerRefreshOptions = (
  options?: Options<AppControllerRefreshData>,
) => {
  return queryOptions({
    queryFn: async ({ queryKey, signal }) => {
      const { data } = await appControllerRefresh({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true,
      });
      return data;
    },
    queryKey: appControllerRefreshQueryKey(options),
  });
};

export const appControllerRegisterQueryKey = (
  options: Options<AppControllerRegisterData>,
) => [createQueryKey('appControllerRegister', options)];

export const appControllerRegisterOptions = (
  options: Options<AppControllerRegisterData>,
) => {
  return queryOptions({
    queryFn: async ({ queryKey, signal }) => {
      const { data } = await appControllerRegister({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true,
      });
      return data;
    },
    queryKey: appControllerRegisterQueryKey(options),
  });
};

export const appControllerRegisterMutation = (
  options?: Partial<Options<AppControllerRegisterData>>,
) => {
  const mutationOptions: UseMutationOptions<
    AppControllerRegisterResponse,
    AxiosError<DefaultError>,
    Options<AppControllerRegisterData>
  > = {
    mutationFn: async (localOptions) => {
      const { data } = await appControllerRegister({
        ...options,
        ...localOptions,
        throwOnError: true,
      });
      return data;
    },
  };
  return mutationOptions;
};

export const appControllerLogoutQueryKey = (
  options?: Options<AppControllerLogoutData>,
) => [createQueryKey('appControllerLogout', options)];

export const appControllerLogoutOptions = (
  options?: Options<AppControllerLogoutData>,
) => {
  return queryOptions({
    queryFn: async ({ queryKey, signal }) => {
      const { data } = await appControllerLogout({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true,
      });
      return data;
    },
    queryKey: appControllerLogoutQueryKey(options),
  });
};

export const employeesControllerFindAllQueryKey = (
  options?: Options<EmployeesControllerFindAllData>,
) => [createQueryKey('employeesControllerFindAll', options)];

export const employeesControllerFindAllOptions = (
  options?: Options<EmployeesControllerFindAllData>,
) => {
  return queryOptions({
    queryFn: async ({ queryKey, signal }) => {
      const { data } = await employeesControllerFindAll({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true,
      });
      return data;
    },
    queryKey: employeesControllerFindAllQueryKey(options),
  });
};

export const employeesControllerCreateQueryKey = (
  options: Options<EmployeesControllerCreateData>,
) => [createQueryKey('employeesControllerCreate', options)];

export const employeesControllerCreateOptions = (
  options: Options<EmployeesControllerCreateData>,
) => {
  return queryOptions({
    queryFn: async ({ queryKey, signal }) => {
      const { data } = await employeesControllerCreate({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true,
      });
      return data;
    },
    queryKey: employeesControllerCreateQueryKey(options),
  });
};

export const employeesControllerCreateMutation = (
  options?: Partial<Options<EmployeesControllerCreateData>>,
) => {
  const mutationOptions: UseMutationOptions<
    EmployeesControllerCreateResponse,
    AxiosError<DefaultError>,
    Options<EmployeesControllerCreateData>
  > = {
    mutationFn: async (localOptions) => {
      const { data } = await employeesControllerCreate({
        ...options,
        ...localOptions,
        throwOnError: true,
      });
      return data;
    },
  };
  return mutationOptions;
};

export const employeesControllerOnboardEmployeeMutation = (
  options?: Partial<Options<EmployeesControllerOnboardEmployeeData>>,
) => {
  const mutationOptions: UseMutationOptions<
    EmployeesControllerOnboardEmployeeResponse,
    AxiosError<DefaultError>,
    Options<EmployeesControllerOnboardEmployeeData>
  > = {
    mutationFn: async (localOptions) => {
      const { data } = await employeesControllerOnboardEmployee({
        ...options,
        ...localOptions,
        throwOnError: true,
      });
      return data;
    },
  };
  return mutationOptions;
};

export const employeesControllerFindAllDisabledQueryKey = (
  options?: Options<EmployeesControllerFindAllDisabledData>,
) => [createQueryKey('employeesControllerFindAllDisabled', options)];

export const employeesControllerFindAllDisabledOptions = (
  options?: Options<EmployeesControllerFindAllDisabledData>,
) => {
  return queryOptions({
    queryFn: async ({ queryKey, signal }) => {
      const { data } = await employeesControllerFindAllDisabled({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true,
      });
      return data;
    },
    queryKey: employeesControllerFindAllDisabledQueryKey(options),
  });
};

export const employeesControllerFindMeQueryKey = (
  options?: Options<EmployeesControllerFindMeData>,
) => [createQueryKey('employeesControllerFindMe', options)];

export const employeesControllerFindMeOptions = (
  options?: Options<EmployeesControllerFindMeData>,
) => {
  return queryOptions({
    queryFn: async ({ queryKey, signal }) => {
      const { data } = await employeesControllerFindMe({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true,
      });
      return data;
    },
    queryKey: employeesControllerFindMeQueryKey(options),
  });
};

export const employeesControllerRemoveMutation = (
  options?: Partial<Options<EmployeesControllerRemoveData>>,
) => {
  const mutationOptions: UseMutationOptions<
    unknown,
    AxiosError<DefaultError>,
    Options<EmployeesControllerRemoveData>
  > = {
    mutationFn: async (localOptions) => {
      const { data } = await employeesControllerRemove({
        ...options,
        ...localOptions,
        throwOnError: true,
      });
      return data;
    },
  };
  return mutationOptions;
};

export const employeesControllerFindOneQueryKey = (
  options: Options<EmployeesControllerFindOneData>,
) => [createQueryKey('employeesControllerFindOne', options)];

export const employeesControllerFindOneOptions = (
  options: Options<EmployeesControllerFindOneData>,
) => {
  return queryOptions({
    queryFn: async ({ queryKey, signal }) => {
      const { data } = await employeesControllerFindOne({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true,
      });
      return data;
    },
    queryKey: employeesControllerFindOneQueryKey(options),
  });
};

export const employeesControllerUpdateMutation = (
  options?: Partial<Options<EmployeesControllerUpdateData>>,
) => {
  const mutationOptions: UseMutationOptions<
    EmployeesControllerUpdateResponse,
    AxiosError<DefaultError>,
    Options<EmployeesControllerUpdateData>
  > = {
    mutationFn: async (localOptions) => {
      const { data } = await employeesControllerUpdate({
        ...options,
        ...localOptions,
        throwOnError: true,
      });
      return data;
    },
  };
  return mutationOptions;
};

export const employeesControllerUpdateSignatureMutation = (
  options?: Partial<Options<EmployeesControllerUpdateSignatureData>>,
) => {
  const mutationOptions: UseMutationOptions<
    EmployeesControllerUpdateSignatureResponse,
    AxiosError<DefaultError>,
    Options<EmployeesControllerUpdateSignatureData>
  > = {
    mutationFn: async (localOptions) => {
      const { data } = await employeesControllerUpdateSignature({
        ...options,
        ...localOptions,
        throwOnError: true,
      });
      return data;
    },
  };
  return mutationOptions;
};

export const positionsControllerFindAllQueryKey = (
  options?: Options<PositionsControllerFindAllData>,
) => [createQueryKey('positionsControllerFindAll', options)];

export const positionsControllerFindAllOptions = (
  options?: Options<PositionsControllerFindAllData>,
) => {
  return queryOptions({
    queryFn: async ({ queryKey, signal }) => {
      const { data } = await positionsControllerFindAll({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true,
      });
      return data;
    },
    queryKey: positionsControllerFindAllQueryKey(options),
  });
};

export const positionsControllerCreateQueryKey = (
  options: Options<PositionsControllerCreateData>,
) => [createQueryKey('positionsControllerCreate', options)];

export const positionsControllerCreateOptions = (
  options: Options<PositionsControllerCreateData>,
) => {
  return queryOptions({
    queryFn: async ({ queryKey, signal }) => {
      const { data } = await positionsControllerCreate({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true,
      });
      return data;
    },
    queryKey: positionsControllerCreateQueryKey(options),
  });
};

export const positionsControllerCreateMutation = (
  options?: Partial<Options<PositionsControllerCreateData>>,
) => {
  const mutationOptions: UseMutationOptions<
    PositionsControllerCreateResponse,
    AxiosError<DefaultError>,
    Options<PositionsControllerCreateData>
  > = {
    mutationFn: async (localOptions) => {
      const { data } = await positionsControllerCreate({
        ...options,
        ...localOptions,
        throwOnError: true,
      });
      return data;
    },
  };
  return mutationOptions;
};

export const positionsControllerFindAllInDepartmentQueryKey = (
  options: Options<PositionsControllerFindAllInDepartmentData>,
) => [createQueryKey('positionsControllerFindAllInDepartment', options)];

export const positionsControllerFindAllInDepartmentOptions = (
  options: Options<PositionsControllerFindAllInDepartmentData>,
) => {
  return queryOptions({
    queryFn: async ({ queryKey, signal }) => {
      const { data } = await positionsControllerFindAllInDepartment({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true,
      });
      return data;
    },
    queryKey: positionsControllerFindAllInDepartmentQueryKey(options),
  });
};

export const positionsControllerFindAllInDepartmentNameQueryKey = (
  options: Options<PositionsControllerFindAllInDepartmentNameData>,
) => [createQueryKey('positionsControllerFindAllInDepartmentName', options)];

export const positionsControllerFindAllInDepartmentNameOptions = (
  options: Options<PositionsControllerFindAllInDepartmentNameData>,
) => {
  return queryOptions({
    queryFn: async ({ queryKey, signal }) => {
      const { data } = await positionsControllerFindAllInDepartmentName({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true,
      });
      return data;
    },
    queryKey: positionsControllerFindAllInDepartmentNameQueryKey(options),
  });
};

export const positionsControllerRemoveMutation = (
  options?: Partial<Options<PositionsControllerRemoveData>>,
) => {
  const mutationOptions: UseMutationOptions<
    unknown,
    AxiosError<DefaultError>,
    Options<PositionsControllerRemoveData>
  > = {
    mutationFn: async (localOptions) => {
      const { data } = await positionsControllerRemove({
        ...options,
        ...localOptions,
        throwOnError: true,
      });
      return data;
    },
  };
  return mutationOptions;
};

export const positionsControllerFindOneQueryKey = (
  options: Options<PositionsControllerFindOneData>,
) => [createQueryKey('positionsControllerFindOne', options)];

export const positionsControllerFindOneOptions = (
  options: Options<PositionsControllerFindOneData>,
) => {
  return queryOptions({
    queryFn: async ({ queryKey, signal }) => {
      const { data } = await positionsControllerFindOne({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true,
      });
      return data;
    },
    queryKey: positionsControllerFindOneQueryKey(options),
  });
};

export const positionsControllerUpdateMutation = (
  options?: Partial<Options<PositionsControllerUpdateData>>,
) => {
  const mutationOptions: UseMutationOptions<
    PositionsControllerUpdateResponse,
    AxiosError<DefaultError>,
    Options<PositionsControllerUpdateData>
  > = {
    mutationFn: async (localOptions) => {
      const { data } = await positionsControllerUpdate({
        ...options,
        ...localOptions,
        throwOnError: true,
      });
      return data;
    },
  };
  return mutationOptions;
};

export const positionsControllerFindOneByNameInDepartmentQueryKey = (
  options: Options<PositionsControllerFindOneByNameInDepartmentData>,
) => [createQueryKey('positionsControllerFindOneByNameInDepartment', options)];

export const positionsControllerFindOneByNameInDepartmentOptions = (
  options: Options<PositionsControllerFindOneByNameInDepartmentData>,
) => {
  return queryOptions({
    queryFn: async ({ queryKey, signal }) => {
      const { data } = await positionsControllerFindOneByNameInDepartment({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true,
      });
      return data;
    },
    queryKey: positionsControllerFindOneByNameInDepartmentQueryKey(options),
  });
};

export const assignedGroupControllerUpdateAssignedGroupSignerMutation = (
  options?: Partial<
    Options<AssignedGroupControllerUpdateAssignedGroupSignerData>
  >,
) => {
  const mutationOptions: UseMutationOptions<
    AssignedGroupControllerUpdateAssignedGroupSignerResponse,
    AxiosError<DefaultError>,
    Options<AssignedGroupControllerUpdateAssignedGroupSignerData>
  > = {
    mutationFn: async (localOptions) => {
      const { data } = await assignedGroupControllerUpdateAssignedGroupSigner({
        ...options,
        ...localOptions,
        throwOnError: true,
      });
      return data;
    },
  };
  return mutationOptions;
};

export const formTemplatesControllerFindAllQueryKey = (
  options?: Options<FormTemplatesControllerFindAllData>,
) => [createQueryKey('formTemplatesControllerFindAll', options)];

export const formTemplatesControllerFindAllOptions = (
  options?: Options<FormTemplatesControllerFindAllData>,
) => {
  return queryOptions({
    queryFn: async ({ queryKey, signal }) => {
      const { data } = await formTemplatesControllerFindAll({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true,
      });
      return data;
    },
    queryKey: formTemplatesControllerFindAllQueryKey(options),
  });
};

const createInfiniteParams = <
  K extends Pick<QueryKey<Options>[0], 'body' | 'headers' | 'path' | 'query'>,
>(
  queryKey: QueryKey<Options>,
  page: K,
) => {
  const params = queryKey[0];
  if (page.body) {
    params.body = {
      ...(queryKey[0].body as any),
      ...(page.body as any),
    };
  }
  if (page.headers) {
    params.headers = {
      ...queryKey[0].headers,
      ...page.headers,
    };
  }
  if (page.path) {
    params.path = {
      ...(queryKey[0].path as any),
      ...(page.path as any),
    };
  }
  if (page.query) {
    params.query = {
      ...(queryKey[0].query as any),
      ...(page.query as any),
    };
  }
  return params as unknown as typeof page;
};

export const formTemplatesControllerFindAllInfiniteQueryKey = (
  options?: Options<FormTemplatesControllerFindAllData>,
): QueryKey<Options<FormTemplatesControllerFindAllData>> => [
  createQueryKey('formTemplatesControllerFindAll', options, true),
];

export const formTemplatesControllerFindAllInfiniteOptions = (
  options?: Options<FormTemplatesControllerFindAllData>,
) => {
  return infiniteQueryOptions<
    FormTemplatesControllerFindAllResponse,
    AxiosError<DefaultError>,
    InfiniteData<FormTemplatesControllerFindAllResponse>,
    QueryKey<Options<FormTemplatesControllerFindAllData>>,
    | number
    | Pick<
        QueryKey<Options<FormTemplatesControllerFindAllData>>[0],
        'body' | 'headers' | 'path' | 'query'
      >
  >(
    // @ts-ignore
    {
      queryFn: async ({ pageParam, queryKey, signal }) => {
        // @ts-ignore
        const page: Pick<
          QueryKey<Options<FormTemplatesControllerFindAllData>>[0],
          'body' | 'headers' | 'path' | 'query'
        > =
          typeof pageParam === 'object'
            ? pageParam
            : {
                query: {
                  cursor: pageParam,
                },
              };
        const params = createInfiniteParams(queryKey, page);
        const { data } = await formTemplatesControllerFindAll({
          ...options,
          ...params,
          signal,
          throwOnError: true,
        });
        return data;
      },
      queryKey: formTemplatesControllerFindAllInfiniteQueryKey(options),
    },
  );
};

export const formTemplatesControllerCreateQueryKey = (
  options: Options<FormTemplatesControllerCreateData>,
) => [createQueryKey('formTemplatesControllerCreate', options)];

export const formTemplatesControllerCreateOptions = (
  options: Options<FormTemplatesControllerCreateData>,
) => {
  return queryOptions({
    queryFn: async ({ queryKey, signal }) => {
      const { data } = await formTemplatesControllerCreate({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true,
      });
      return data;
    },
    queryKey: formTemplatesControllerCreateQueryKey(options),
  });
};

export const formTemplatesControllerCreateMutation = (
  options?: Partial<Options<FormTemplatesControllerCreateData>>,
) => {
  const mutationOptions: UseMutationOptions<
    FormTemplatesControllerCreateResponse,
    AxiosError<DefaultError>,
    Options<FormTemplatesControllerCreateData>
  > = {
    mutationFn: async (localOptions) => {
      const { data } = await formTemplatesControllerCreate({
        ...options,
        ...localOptions,
        throwOnError: true,
      });
      return data;
    },
  };
  return mutationOptions;
};

export const formTemplatesControllerRemoveMutation = (
  options?: Partial<Options<FormTemplatesControllerRemoveData>>,
) => {
  const mutationOptions: UseMutationOptions<
    unknown,
    AxiosError<DefaultError>,
    Options<FormTemplatesControllerRemoveData>
  > = {
    mutationFn: async (localOptions) => {
      const { data } = await formTemplatesControllerRemove({
        ...options,
        ...localOptions,
        throwOnError: true,
      });
      return data;
    },
  };
  return mutationOptions;
};

export const formTemplatesControllerFindOneQueryKey = (
  options: Options<FormTemplatesControllerFindOneData>,
) => [createQueryKey('formTemplatesControllerFindOne', options)];

export const formTemplatesControllerFindOneOptions = (
  options: Options<FormTemplatesControllerFindOneData>,
) => {
  return queryOptions({
    queryFn: async ({ queryKey, signal }) => {
      const { data } = await formTemplatesControllerFindOne({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true,
      });
      return data;
    },
    queryKey: formTemplatesControllerFindOneQueryKey(options),
  });
};

export const formTemplatesControllerUpdateMutation = (
  options?: Partial<Options<FormTemplatesControllerUpdateData>>,
) => {
  const mutationOptions: UseMutationOptions<
    FormTemplatesControllerUpdateResponse,
    AxiosError<DefaultError>,
    Options<FormTemplatesControllerUpdateData>
  > = {
    mutationFn: async (localOptions) => {
      const { data } = await formTemplatesControllerUpdate({
        ...options,
        ...localOptions,
        throwOnError: true,
      });
      return data;
    },
  };
  return mutationOptions;
};

export const departmentsControllerFindAllQueryKey = (
  options?: Options<DepartmentsControllerFindAllData>,
) => [createQueryKey('departmentsControllerFindAll', options)];

export const departmentsControllerFindAllOptions = (
  options?: Options<DepartmentsControllerFindAllData>,
) => {
  return queryOptions({
    queryFn: async ({ queryKey, signal }) => {
      const { data } = await departmentsControllerFindAll({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true,
      });
      return data;
    },
    queryKey: departmentsControllerFindAllQueryKey(options),
  });
};

export const departmentsControllerCreateQueryKey = (
  options: Options<DepartmentsControllerCreateData>,
) => [createQueryKey('departmentsControllerCreate', options)];

export const departmentsControllerCreateOptions = (
  options: Options<DepartmentsControllerCreateData>,
) => {
  return queryOptions({
    queryFn: async ({ queryKey, signal }) => {
      const { data } = await departmentsControllerCreate({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true,
      });
      return data;
    },
    queryKey: departmentsControllerCreateQueryKey(options),
  });
};

export const departmentsControllerCreateMutation = (
  options?: Partial<Options<DepartmentsControllerCreateData>>,
) => {
  const mutationOptions: UseMutationOptions<
    DepartmentsControllerCreateResponse,
    AxiosError<DefaultError>,
    Options<DepartmentsControllerCreateData>
  > = {
    mutationFn: async (localOptions) => {
      const { data } = await departmentsControllerCreate({
        ...options,
        ...localOptions,
        throwOnError: true,
      });
      return data;
    },
  };
  return mutationOptions;
};

export const departmentsControllerRemoveMutation = (
  options?: Partial<Options<DepartmentsControllerRemoveData>>,
) => {
  const mutationOptions: UseMutationOptions<
    unknown,
    AxiosError<DefaultError>,
    Options<DepartmentsControllerRemoveData>
  > = {
    mutationFn: async (localOptions) => {
      const { data } = await departmentsControllerRemove({
        ...options,
        ...localOptions,
        throwOnError: true,
      });
      return data;
    },
  };
  return mutationOptions;
};

export const departmentsControllerFindOneQueryKey = (
  options: Options<DepartmentsControllerFindOneData>,
) => [createQueryKey('departmentsControllerFindOne', options)];

export const departmentsControllerFindOneOptions = (
  options: Options<DepartmentsControllerFindOneData>,
) => {
  return queryOptions({
    queryFn: async ({ queryKey, signal }) => {
      const { data } = await departmentsControllerFindOne({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true,
      });
      return data;
    },
    queryKey: departmentsControllerFindOneQueryKey(options),
  });
};

export const departmentsControllerUpdateMutation = (
  options?: Partial<Options<DepartmentsControllerUpdateData>>,
) => {
  const mutationOptions: UseMutationOptions<
    DepartmentsControllerUpdateResponse,
    AxiosError<DefaultError>,
    Options<DepartmentsControllerUpdateData>
  > = {
    mutationFn: async (localOptions) => {
      const { data } = await departmentsControllerUpdate({
        ...options,
        ...localOptions,
        throwOnError: true,
      });
      return data;
    },
  };
  return mutationOptions;
};

export const departmentsControllerFindOneByNameQueryKey = (
  options: Options<DepartmentsControllerFindOneByNameData>,
) => [createQueryKey('departmentsControllerFindOneByName', options)];

export const departmentsControllerFindOneByNameOptions = (
  options: Options<DepartmentsControllerFindOneByNameData>,
) => {
  return queryOptions({
    queryFn: async ({ queryKey, signal }) => {
      const { data } = await departmentsControllerFindOneByName({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true,
      });
      return data;
    },
    queryKey: departmentsControllerFindOneByNameQueryKey(options),
  });
};

export const formInstancesControllerFindAllQueryKey = (
  options?: Options<FormInstancesControllerFindAllData>,
) => [createQueryKey('formInstancesControllerFindAll', options)];

export const formInstancesControllerFindAllOptions = (
  options?: Options<FormInstancesControllerFindAllData>,
) => {
  return queryOptions({
    queryFn: async ({ queryKey, signal }) => {
      const { data } = await formInstancesControllerFindAll({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true,
      });
      return data;
    },
    queryKey: formInstancesControllerFindAllQueryKey(options),
  });
};

export const formInstancesControllerFindAllInfiniteQueryKey = (
  options?: Options<FormInstancesControllerFindAllData>,
): QueryKey<Options<FormInstancesControllerFindAllData>> => [
  createQueryKey('formInstancesControllerFindAll', options, true),
];

export const formInstancesControllerFindAllInfiniteOptions = (
  options?: Options<FormInstancesControllerFindAllData>,
) => {
  return infiniteQueryOptions<
    FormInstancesControllerFindAllResponse,
    AxiosError<DefaultError>,
    InfiniteData<FormInstancesControllerFindAllResponse>,
    QueryKey<Options<FormInstancesControllerFindAllData>>,
    | number
    | Pick<
        QueryKey<Options<FormInstancesControllerFindAllData>>[0],
        'body' | 'headers' | 'path' | 'query'
      >
  >(
    // @ts-ignore
    {
      queryFn: async ({ pageParam, queryKey, signal }) => {
        // @ts-ignore
        const page: Pick<
          QueryKey<Options<FormInstancesControllerFindAllData>>[0],
          'body' | 'headers' | 'path' | 'query'
        > =
          typeof pageParam === 'object'
            ? pageParam
            : {
                query: {
                  cursor: pageParam,
                },
              };
        const params = createInfiniteParams(queryKey, page);
        const { data } = await formInstancesControllerFindAll({
          ...options,
          ...params,
          signal,
          throwOnError: true,
        });
        return data;
      },
      queryKey: formInstancesControllerFindAllInfiniteQueryKey(options),
    },
  );
};

export const formInstancesControllerCreateQueryKey = (
  options: Options<FormInstancesControllerCreateData>,
) => [createQueryKey('formInstancesControllerCreate', options)];

export const formInstancesControllerCreateOptions = (
  options: Options<FormInstancesControllerCreateData>,
) => {
  return queryOptions({
    queryFn: async ({ queryKey, signal }) => {
      const { data } = await formInstancesControllerCreate({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true,
      });
      return data;
    },
    queryKey: formInstancesControllerCreateQueryKey(options),
  });
};

export const formInstancesControllerCreateMutation = (
  options?: Partial<Options<FormInstancesControllerCreateData>>,
) => {
  const mutationOptions: UseMutationOptions<
    FormInstancesControllerCreateResponse,
    AxiosError<DefaultError>,
    Options<FormInstancesControllerCreateData>
  > = {
    mutationFn: async (localOptions) => {
      const { data } = await formInstancesControllerCreate({
        ...options,
        ...localOptions,
        throwOnError: true,
      });
      return data;
    },
  };
  return mutationOptions;
};

export const formInstancesControllerFindAllAssignedToCurrentEmployeeQueryKey = (
  options?: Options<FormInstancesControllerFindAllAssignedToCurrentEmployeeData>,
) => [
  createQueryKey(
    'formInstancesControllerFindAllAssignedToCurrentEmployee',
    options,
  ),
];

export const formInstancesControllerFindAllAssignedToCurrentEmployeeOptions = (
  options?: Options<FormInstancesControllerFindAllAssignedToCurrentEmployeeData>,
) => {
  return queryOptions({
    queryFn: async ({ queryKey, signal }) => {
      const { data } =
        await formInstancesControllerFindAllAssignedToCurrentEmployee({
          ...options,
          ...queryKey[0],
          signal,
          throwOnError: true,
        });
      return data;
    },
    queryKey:
      formInstancesControllerFindAllAssignedToCurrentEmployeeQueryKey(options),
  });
};

export const formInstancesControllerFindAllCreatedByCurrentEmployeeQueryKey = (
  options?: Options<FormInstancesControllerFindAllCreatedByCurrentEmployeeData>,
) => [
  createQueryKey(
    'formInstancesControllerFindAllCreatedByCurrentEmployee',
    options,
  ),
];

export const formInstancesControllerFindAllCreatedByCurrentEmployeeOptions = (
  options?: Options<FormInstancesControllerFindAllCreatedByCurrentEmployeeData>,
) => {
  return queryOptions({
    queryFn: async ({ queryKey, signal }) => {
      const { data } =
        await formInstancesControllerFindAllCreatedByCurrentEmployee({
          ...options,
          ...queryKey[0],
          signal,
          throwOnError: true,
        });
      return data;
    },
    queryKey:
      formInstancesControllerFindAllCreatedByCurrentEmployeeQueryKey(options),
  });
};

export const formInstancesControllerRemoveMutation = (
  options?: Partial<Options<FormInstancesControllerRemoveData>>,
) => {
  const mutationOptions: UseMutationOptions<
    unknown,
    AxiosError<DefaultError>,
    Options<FormInstancesControllerRemoveData>
  > = {
    mutationFn: async (localOptions) => {
      const { data } = await formInstancesControllerRemove({
        ...options,
        ...localOptions,
        throwOnError: true,
      });
      return data;
    },
  };
  return mutationOptions;
};

export const formInstancesControllerFindOneQueryKey = (
  options: Options<FormInstancesControllerFindOneData>,
) => [createQueryKey('formInstancesControllerFindOne', options)];

export const formInstancesControllerFindOneOptions = (
  options: Options<FormInstancesControllerFindOneData>,
) => {
  return queryOptions({
    queryFn: async ({ queryKey, signal }) => {
      const { data } = await formInstancesControllerFindOne({
        ...options,
        ...queryKey[0],
        signal,
        throwOnError: true,
      });
      return data;
    },
    queryKey: formInstancesControllerFindOneQueryKey(options),
  });
};

export const formInstancesControllerUpdateMutation = (
  options?: Partial<Options<FormInstancesControllerUpdateData>>,
) => {
  const mutationOptions: UseMutationOptions<
    FormInstancesControllerUpdateResponse,
    AxiosError<DefaultError>,
    Options<FormInstancesControllerUpdateData>
  > = {
    mutationFn: async (localOptions) => {
      const { data } = await formInstancesControllerUpdate({
        ...options,
        ...localOptions,
        throwOnError: true,
      });
      return data;
    },
  };
  return mutationOptions;
};

export const formInstancesControllerSignFormInstanceMutation = (
  options?: Partial<Options<FormInstancesControllerSignFormInstanceData>>,
) => {
  const mutationOptions: UseMutationOptions<
    FormInstancesControllerSignFormInstanceResponse,
    AxiosError<DefaultError>,
    Options<FormInstancesControllerSignFormInstanceData>
  > = {
    mutationFn: async (localOptions) => {
      const { data } = await formInstancesControllerSignFormInstance({
        ...options,
        ...localOptions,
        throwOnError: true,
      });
      return data;
    },
  };
  return mutationOptions;
};

export const formInstancesControllerCompleteFormInstanceMutation = (
  options?: Partial<Options<FormInstancesControllerCompleteFormInstanceData>>,
) => {
  const mutationOptions: UseMutationOptions<
    FormInstancesControllerCompleteFormInstanceResponse,
    AxiosError<DefaultError>,
    Options<FormInstancesControllerCompleteFormInstanceData>
  > = {
    mutationFn: async (localOptions) => {
      const { data } = await formInstancesControllerCompleteFormInstance({
        ...options,
        ...localOptions,
        throwOnError: true,
      });
      return data;
    },
  };
  return mutationOptions;
};
