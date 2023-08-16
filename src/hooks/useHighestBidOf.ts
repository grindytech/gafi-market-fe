import { useQuery } from '@tanstack/react-query';
import { useAppSelector } from './useRedux';
import { Option, StorageKey, u128, u32 } from '@polkadot/types';
import { ITuple } from '@polkadot/types/types';
import { AccountId32 } from '@polkadot/types/interfaces';

export interface useHighestBidOfProps {
  filter: 'entries' | number[];
  key: string | string[] | number | number[];
}

export default function useHighestBidOf({ filter, key }: useHighestBidOfProps) {
  const { api } = useAppSelector(state => state.substrate);

  const { data } = useQuery({
    queryKey: ['highestBidOf', key],
    queryFn: async () => {
      if (api) {
        if (filter === 'entries') {
          const service = await api.query.game.highestBidOf.entries();

          return service.map(
            ([trade_id, meta]: [
              StorageKey<[u32]>,
              Option<ITuple<[AccountId32, u128]>>
            ]) => {
              if (meta.isEmpty) return; // not found

              return {
                trade_id: trade_id.args[0].toNumber(),
                owner: meta.value[0].toString(),
                bidPrice: meta.value[1].toNumber(),
              };
            }
          );
        }

        if (filter) {
          return Promise.all(
            filter.map(async trade_id => {
              const service = (await api.query.game.highestBidOf(
                trade_id
              )) as Option<ITuple<[AccountId32, u128]>>;

              if (service.isEmpty) return; // not found

              return {
                trade_id,
                owner: service.value[0].toString(),
                bidPrice: service.value[1].toNumber(),
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
    highestBidOf: data,
  };
}
