import { createDataProvider, CreateDataProviderOptions } from '@refinedev/rest';
import { BACKEND_BASE_URL } from '@/components/constants';
import { ListResponse } from '@/types';

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

        if (resource === 'subjects') {
          if (field === 'department') params.department = value;
          if (field === 'name' || field === 'code') params.search = value;
        }
      });
      return params;
    },

    mapResponse: async (response) => {
      const payload: ListResponse = await response.json();

      return payload.data ?? [];
    },

    getTotalCount: async (response) => {
      if ('pagination' in response && response.pagination) {
        return (response.pagination as { total: number }).total;
      }
      if ('data' in response && Array.isArray(response.data)) {
        return response.data.length;
      }
      return 0;
    },
  },
};

const { dataProvider } = createDataProvider(BACKEND_BASE_URL, options);

export { dataProvider };
