import queryString from 'query-string';
import { TableInterface, TableGetQueryInterface } from 'interfaces/table';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';
import { convertQueryToPrismaUtil, getOrderByOptions } from 'lib/utils';
import { ApiFetcher } from 'lib/hooks/use-authorized-fetcher';

export const getTables = async (
  fetcher: ApiFetcher,
  query: TableGetQueryInterface = {},
): Promise<PaginatedInterface<TableInterface>> => {
  const { offset: skip, limit: take, order, ...restQuery } = query;
  const pagination = {
    skip,
    take,
  };
  const params = convertQueryToPrismaUtil(restQuery, 'table');
  const [response, count] = await Promise.all([
    fetcher(
      '/api/model/table/findMany',
      {},
      {
        ...params,
        ...pagination,
        ...(order && {
          orderBy: getOrderByOptions(order),
        }),
      },
    ),
    fetcher('/api/model/table/count', {}, { where: params.where }),
  ]);
  return {
    ...response,
    totalCount: count.data,
  };
};

export const createTable = async (fetcher: ApiFetcher, table: TableInterface) => {
  return fetcher('/api/model/table', { method: 'POST', body: JSON.stringify({ data: table }) });
};

export const updateTableById = async (fetcher: ApiFetcher, id: string, table: TableInterface) => {
  return fetcher('/api/model/table/update', {
    method: 'PUT',
    body: JSON.stringify({
      where: {
        id,
      },
      data: table,
    }),
  });
};

export const getTableById = async (fetcher: ApiFetcher, id: string, query: GetQueryInterface = {}) => {
  const { relations = [] } = query;
  const response = await fetcher(
    '/api/model/table/findUnique',
    {},
    {
      where: {
        id,
      },
      include: relations.reduce((acc, el) => ({ ...acc, [el.split('.')[0]]: true }), {}),
    },
  );
  return response.data;
};

export const deleteTableById = async (fetcher: ApiFetcher, id: string) => {
  return fetcher(
    '/api/model/table/delete',
    { method: 'DELETE' },
    {
      where: {
        id,
      },
    },
  );
};
