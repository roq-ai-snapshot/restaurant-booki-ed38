import { UserInterface, UserGetQueryInterface } from 'interfaces/user';
import { PaginatedInterface } from 'interfaces';
import { getOrderByOptions } from 'lib/utils';
import { ApiFetcher } from 'lib/hooks/use-authorized-fetcher';

export const getUsers = async (
  fetcher: ApiFetcher,
  query: UserGetQueryInterface = {},
): Promise<PaginatedInterface<UserInterface>> => {
  const { offset: skip, limit: take, relations = [], searchTerm, order, searchTermKeys, ...where } = query;
  const pagination = {
    skip,
    take,
  };
  const [response, count] = await Promise.all([
    fetcher(
      '/api/model/user/findMany',
      {},
      {
        ...pagination,
        where,
        include: relations.reduce((acc, el) => ({ ...acc, [el.split('.')[0]]: true }), {}),
        ...(order && {
          orderBy: getOrderByOptions(order),
        }),
      },
    ),
    fetcher('/api/model/user/count', {}, { where }),
  ]);
  return {
    ...response,
    totalCount: count.data,
  };
};

export const getUserById = async (fetcher: ApiFetcher, id: string, query: UserGetQueryInterface = {}) => {
  const { relations = [] } = query;
  const response = await fetcher(
    '/api/model/user/findUnique',
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
