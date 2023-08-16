import { useQuery } from '@tanstack/react-query';
import { useAppSelector } from './useRedux';

import { Option, StorageKey, u32 } from '@polkadot/types';
import { PalletGamePoolDetails } from '@polkadot/types/lookup';

export interface usePoolOfProps {
  filter: 'entries' | number[];
  key: string | string[] | number | number[];
}

export default function usePoolOf({ filter, key }: usePoolOfProps) {
  const { api } = useAppSelector(state => state.substrate);

  const { data, isLoading } = useQuery({
    queryKey: ['poolOf', key],
    queryFn: async () => {
      if (api) {
        if (filter === 'entries') {
          const service = await api.query.game.poolOf.entries();

          return service.map(
            ([pool_id, meta]: [
              StorageKey<[u32]>,
              Option<PalletGamePoolDetails>
            ]) => {
              return {
                pool_id: pool_id.args[0].toNumber(),
                poolType: meta.value.poolType.toString(),
                owner: meta.value.owner.toString(),
                price: meta.value.mintSettings.price.toString(),
                endBlock: meta.value.mintSettings.endBlock,
              };
            }
          );
        }

        if (filter) {
          return Promise.all(
            filter.map(async pool_id => {
              const service = (await api.query.game.poolOf(
                pool_id
              )) as Option<PalletGamePoolDetails>;

              if (service.isEmpty) return;

              return {
                pool_id,
                poolType: service.value.poolType.toString(),
                owner: service.value.owner.toString(),
                price: service.value.mintSettings.price.toString(),
                endBlock: service.value.mintSettings.endBlock,
              };
            })
          );
        }
      }

      // not found group
      return [];
    },
    enabled: !!filter,
  });

  return {
    poolOf: data,
    isLoading,
  };
}
