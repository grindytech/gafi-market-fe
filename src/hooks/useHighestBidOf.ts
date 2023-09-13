import { useQuery } from '@tanstack/react-query';
import { useAppSelector } from './useRedux';
import { Option, StorageKey, u128, u32 } from '@polkadot/types';
import { ITuple } from '@polkadot/types/types';
import { AccountId32 } from '@polkadot/types/interfaces';

export interface useHighestBidOfProps {
  filter: 'entries' | 'trade_id';
  arg?: number[];
  key: string | string[] | number | number[];
}

export interface HighestBidOfFieldProps {
  trade_id: number;
  owner: string;
  bidPrice: u128;
}

export default function useHighestBidOf({
  filter,
  arg,
  key,
}: useHighestBidOfProps) {
  const { api } = useAppSelector(state => state.substrate);

  const { data, refetch } = useQuery({
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
                bidPrice: meta.value[1],
              };
            }
          ) as HighestBidOfFieldProps[];
        }

        if (filter === 'trade_id' && arg) {
          return Promise.all(
            arg.map(async trade_id => {
              const service = (await api.query.game.highestBidOf(
                trade_id
              )) as Option<ITuple<[AccountId32, u128]>>;

              if (service.isEmpty) return; // not found

              return {
                trade_id,
                owner: service.value[0].toString(),
                bidPrice: service.value[1],
              };
            })
          ).then(data =>
            data.filter((meta): meta is HighestBidOfFieldProps => !!meta)
          );
        }
      }

      // not found group
      return [];
    },
    enabled: !!api?.query.game.highestBidOf || !!arg,
  });

  return {
    highestBidOf: data,
    refetch,
  };
}
