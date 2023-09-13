import { useQuery } from '@tanstack/react-query';
import { useAppSelector } from './useRedux';

import { GafiSupportGameTypesLoot } from '@polkadot/types/lookup';
import { Vec } from '@polkadot/types';

export interface lootTableOfProps {
  weight: number;
  maybeNfT: { collection_id: number; nft_id: number } | null;
  pool_id: number;
}

interface useLootTableOfProps {
  filter?: 'entries' | 'pool_id';
  arg?: number[];
  key: string | string[] | number | number[];
}

export default function useLootTableOf({
  filter,
  key,
  arg,
}: useLootTableOfProps) {
  const { api } = useAppSelector(state => state.substrate);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['lootTableOf', key],
    queryFn: async () => {
      if (api) {
        if (filter === 'entries') {
          const service = await api.query.game.lootTableOf.entries();

          return service
            .map(([key, meta]) => {
              return meta.map(option => ({
                pool_id: key.args[0].toNumber(),
                weight: option.weight.toNumber(),
                maybeNfT: option.maybeNft.isSome
                  ? {
                      collection_id:
                        option.maybeNft.value.collection.toNumber(),
                      nft_id: option.maybeNft.value.item.toNumber(),
                    }
                  : null,
              })) as lootTableOfProps[];
            })
            .flat();
        }

        if (filter === 'pool_id' && arg) {
          return Promise.all(
            arg.map(async pool_id => {
              const service = (await api.query.game.lootTableOf(
                pool_id
              )) as Vec<GafiSupportGameTypesLoot>;

              return service.map(meta => ({
                pool_id,
                weight: meta.weight.toNumber(),
                maybeNfT: meta.maybeNft.isSome
                  ? {
                      collection_id: meta.maybeNft.value.collection.toNumber(),
                      nft_id: meta.maybeNft.value.item.toNumber(),
                    }
                  : null,
              }));
            })
          ).then(data =>
            data.filter((meta): meta is lootTableOfProps[] => !!meta).flat()
          );
        }
      }

      return []; // not found
    },
    enabled: !!filter || !!arg,
  });

  return {
    lootTableOf: data,
    isError,
    isLoading,
  };
}
