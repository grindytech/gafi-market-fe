import { useQuery } from '@tanstack/react-query';
import { useAppSelector } from './useRedux';

interface useNFTSCollectionOwnerProps {
  filter?: 'entries' | 'address';
  arg?: string[];
  key: string | string[] | number | number[];
}

export default function useNFTSCollectionOwner({
  filter,
  arg,
  key,
}: useNFTSCollectionOwnerProps) {
  const { api } = useAppSelector(state => state.substrate);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['nfts_collectionAccount', key],
    queryFn: async () => {
      if (api) {
        if (filter === 'entries') {
          const service = await api.query.nfts.collectionAccount.entries();

          return service.map(([key]) => {
            return {
              owner: key.args[0].toString(),
              collection_id: key.args[1].toNumber(),
            };
          });
        }

        if (filter === 'address' && arg) {
          return Promise.all(
            arg.map(async address => {
              const service = await api.query.nfts.collectionAccount.entries(
                address
              );

              return service.map(([key]) => {
                return {
                  owner: key.args[0].toString(),
                  collection_id: key.args[1].toNumber(),
                };
              });
            })
          ).then(meta => meta.flat());
        }
      }

      return []; // not found
    },
    enabled: !!api?.query.nfts.collectionAccount || !!arg,
  });

  return {
    NFTsCollectionAccount: data,
    isError,
    isLoading,
  };
}
