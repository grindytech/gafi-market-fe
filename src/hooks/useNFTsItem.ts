import { useQuery } from '@tanstack/react-query';
import { useAppSelector } from './useRedux';
import { Option, StorageKey, u32 } from '@polkadot/types';
import { PalletNftsItemDetails } from '@polkadot/types/lookup';

interface useNFTsItemProps {
  filter?: 'entries' | 'collection_id';
  arg?: number[];
  key: string | string[] | number | number[];
}

export default function useNFTsItem({ filter, key, arg }: useNFTsItemProps) {
  const { api } = useAppSelector(state => state.substrate);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['nfts_item', key],
    queryFn: async () => {
      if (api) {
        if (filter === 'entries') {
          const service = await api.query.nfts.item.entries();

          return service.map(([key, option]) => {
            const meta = option as Option<PalletNftsItemDetails>;

            return {
              collection_id: key.args[0].toNumber(),
              nft_id: key.args[1].toNumber(),
              owner: meta.value.owner.toString(),
            };
          });
        }

        if (filter === 'collection_id' && arg) {
          return Promise.all(
            arg.map(async collection_id => {
              const service = await api.query.nfts.item.entries(collection_id);

              return service.map(
                ([option, meta]: [
                  StorageKey<[u32, u32]>,
                  Option<PalletNftsItemDetails>
                ]) => {
                  return {
                    collection_id: option.args[0].toNumber(),
                    nft_id: option.args[1].toNumber(),
                    owner: meta.value.owner.toString(),
                  };
                }
              );
            })
          ).then(data => data.flat());
        }
      }

      // return []; // not found
    },
    enabled: !!filter || !!arg,
  });

  return {
    NFTsItem: data,
    isError,
    isLoading,
  };
}
