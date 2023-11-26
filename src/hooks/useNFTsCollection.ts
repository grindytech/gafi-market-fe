import { useQuery } from '@tanstack/react-query';
import { useAppSelector } from './useRedux';
import { Option, StorageKey, u32 } from '@polkadot/types';
import { PalletNftsCollectionDetails } from '@polkadot/types/lookup';
import { useEffect } from 'react';

interface useNFTsCollectionProps {
  filter?: 'entries' | 'collection_id';
  arg?: number[];
  key: string | string[] | number | number[];
  async?: boolean;
}

export default function useNFTsCollection({
  filter,
  arg,
  key,
  async,
}: useNFTsCollectionProps) {
  const { api } = useAppSelector(state => state.substrate);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['nfts_collection', key],
    queryFn: async () => {
      if (api) {
        if (filter === 'entries') {
          const service = await api.query.nfts.collection.entries();

          return service.map(
            ([collection_id, meta]: [
              StorageKey<[u32]>,
              Option<PalletNftsCollectionDetails>
            ]) => ({
              collection_id: collection_id.args[0].toNumber(),
              items: meta.value.items.toNumber(),
              owner: meta.value.owner.toString(),
              itemMetadatas: meta.value.itemMetadatas.toNumber(),
              itemConfigs: meta.value.itemConfigs.toNumber(),
              attributes: meta.value.attributes.toNumber(),
            })
          );
        }

        if (filter === 'collection_id' && arg) {
          return Promise.all(
            arg.map(async collection_id => {
              const service = (await api.query.nfts.collection(
                collection_id
              )) as Option<PalletNftsCollectionDetails>;

              if (service.isEmpty) return;

              return {
                collection_id,
                items: service.value.items.toNumber(),
                owner: service.value.owner.toString(),
                itemMetadatas: service.value.itemMetadatas.toNumber(),
                itemConfigs: service.value.itemConfigs.toNumber(),
                attributes: service.value.attributes.toNumber(),
              };
            })
          ).then(data =>
            data.filter((meta): meta is NonNullable<typeof meta> => !!meta)
          );
        }
      }

      return []; // not found
    },
    enabled: !!api?.query.nfts.collection || !!arg,
  });

  useEffect(() => {
    if (!async && !isLoading) {
      refetch();
    }
  }, [async, isLoading]);
  return {
    NFTsCollection: data,
    isError,
    isLoading,
  };
}
