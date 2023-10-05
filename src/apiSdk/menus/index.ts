import queryString from 'query-string';
import { MenuInterface, MenuGetQueryInterface } from 'interfaces/menu';
import { GetQueryInterface, PaginatedInterface } from '../../interfaces';
import { convertQueryToPrismaUtil, getOrderByOptions } from 'lib/utils';
import { ApiFetcher } from 'lib/hooks/use-authorized-fetcher';

export const getMenus = async (
  fetcher: ApiFetcher,
  query: MenuGetQueryInterface = {},
): Promise<PaginatedInterface<MenuInterface>> => {
  const { offset: skip, limit: take, order, ...restQuery } = query;
  const pagination = {
    skip,
    take,
  };
  const params = convertQueryToPrismaUtil(restQuery, 'menu');
  const [response, count] = await Promise.all([
    fetcher(
      '/api/model/menu/findMany',
      {},
      {
        ...params,
        ...pagination,
        ...(order && {
          orderBy: getOrderByOptions(order),
        }),
      },
    ),
    fetcher('/api/model/menu/count', {}, { where: params.where }),
  ]);
  return {
    ...response,
    totalCount: count.data,
  };
};

export const createMenu = async (fetcher: ApiFetcher, menu: MenuInterface) => {
  return fetcher('/api/model/menu', { method: 'POST', body: JSON.stringify({ data: menu }) });
};

export const updateMenuById = async (fetcher: ApiFetcher, id: string, menu: MenuInterface) => {
  return fetcher('/api/model/menu/update', {
    method: 'PUT',
    body: JSON.stringify({
      where: {
        id,
      },
      data: menu,
    }),
  });
};

export const getMenuById = async (fetcher: ApiFetcher, id: string, query: GetQueryInterface = {}) => {
  const { relations = [] } = query;
  const response = await fetcher(
    '/api/model/menu/findUnique',
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

export const deleteMenuById = async (fetcher: ApiFetcher, id: string) => {
  return fetcher(
    '/api/model/menu/delete',
    { method: 'DELETE' },
    {
      where: {
        id,
      },
    },
  );
};
