import { CreateFileAssociationInterface, GetFilesQuery } from 'interfaces/files';
import { ApiFetcher } from 'lib/hooks/use-authorized-fetcher';

export const createFileAssociation = async (fetcher: ApiFetcher, fileAssociation: CreateFileAssociationInterface) => {
  return fetcher('/api/file-associations', { method: 'POST', body: JSON.stringify(fileAssociation) });
};

export const deleteFileAssociation = async (fetcher: ApiFetcher, fileId: string) => {
  return fetcher('/api/file-associations', { method: 'DELETE', body: JSON.stringify({ fileId }) });
};

export const getFiles = async (fetcher: ApiFetcher, query: GetFilesQuery) => {
  return fetcher(
    '/api/files',
    {
      headers: { 'Content-Type': 'application/json' },
    },
    query,
  );
};
