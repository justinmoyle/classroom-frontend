import { createDataProvider, CreateDataProviderOptions } from '@refinedev/rest';
import { BACKEND_BASE_URL } from '@/constants';
import { CreateResponse, GetOneResponse, ListResponse } from '@/types';
import { HttpError } from '@refinedev/core';

if (!BACKEND_BASE_URL) {
  throw new Error('VITE_BACKEND_BASE_URL environment variable is not set');
}

const buildHttpError = async (response: Response): Promise<HttpError> => {
  let message = 'Request failed.';

  try {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const payload = (await response.json()) as { message?: string; error?: string };
      message = payload.message || payload.error || message;
    } else {
      const text = await response.text();
      message = `Server returned non-JSON response: ${text.substring(0, 100)}...`;
    }
  } catch {
    //Ignore error
  }
  return {
    message,
    statusCode: response.status,
  };
};

const options: CreateDataProviderOptions = {
  getList: {
    getEndpoint: ({ resource }) => resource,

    buildQueryParams: async ({ resource, pagination, filters }) => {
      const page = pagination?.currentPage ?? 1;
      const pageSize = pagination?.pageSize ?? 10;
      const params: Record<string, string | number> = { page, limit: pageSize };

      filters?.forEach((filter) => {
        const field = 'field' in filter ? filter.field : '';
        const value = String(filter.value);

        if (field === 'role') {
          params.role = value;
        }

        if (resource === 'departments') {
          if (field === 'name' || field === 'code') params.search = value;
        }

        if (resource === 'users') {
          if (field === 'search' || field === 'name' || field === 'email') {
            params.search = value;
          }
        }

        if (resource === 'subjects') {
          if (field === 'department') params.department = value;
          if (field === 'name' || field === 'code') params.search = value;
        }

        if (resource === 'classes') {
          if(field === 'name') params.search = value;
          if (field === 'subject') params.subject = value;
          if (field === 'teacher') params.teacher = value;
        }

      });
      return params;
    },

    mapResponse: async (response) => {
      if (!response.ok) throw await buildHttpError(response);

      const payload: ListResponse = await response.clone().json();

      return payload.data ?? [];
    },

    getTotalCount: async (response) => {
      if (!response.ok) throw await buildHttpError(response);

      const payload: ListResponse = await response.clone().json();

      if (payload.pagination) {
        return payload.pagination.total;
      }
      if (Array.isArray(payload.data)) {
        return payload.data.length;
      }
      return 0;
    },
  },

  create: {
    getEndpoint: ({ resource }) => resource,

    buildBodyParams: async ({ variables }) => variables,

    mapResponse: async (response) => {
      const json: CreateResponse = await response.json();

      return json.data ?? [];
    },
  },

  getOne: {
    getEndpoint: ({ resource, id }) => `${resource}/${id}`,

    mapResponse: async (response) => {
      if (!response.ok) throw await buildHttpError(response);
      const json: GetOneResponse = await response.json();

      return json.data ?? null;
    },
  },

  getCustom: {
    getEndpoint: ({ url }) => url,
    mapResponse: async (response) => {
      if (!response.ok) throw await buildHttpError(response);
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
         throw await buildHttpError(response);
      }

      const json = await response.json();
      return json.data;
    },
  }
};

const { dataProvider } = createDataProvider(BACKEND_BASE_URL, options);

export { dataProvider };
