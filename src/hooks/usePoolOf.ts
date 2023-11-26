import { useQuery } from '@tanstack/react-query';
import { useAppSelector } from './useRedux';
import { Option, u32 } from '@polkadot/types';

export interface poolOfProps {
  pool_id: number;
  poolType: string;
  owner: string;
  price: string;
  endBlock: Option<u32>;
}

export interface usePoolOfProps {
  filter: 'entries' | 'pool_id';
  arg?: number[];
  key: string | string[] | number | number[];
}

export default function usePoolOf({ filter, arg, key }: usePoolOfProps) {
  const { api } = useAppSelector(state => state.substrate);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['poolOf', key],
    queryFn: async () => {
      if (api) {
        if (filter === 'entries') {
          const service = await api.query.game.poolOf.entries();

          return service.map(([pool_id, meta]) => {
            return {
              pool_id: pool_id.args[0].toNumber(),
              poolType: meta.value.poolType.toString(),
              owner: meta.value.owner.toString(),
              price: meta.value.mintSettings.price.toString(),
              endBlock: meta.value.mintSettings.endBlock,
            };
          }) as poolOfProps[];
        }

        if (filter === 'pool_id' && arg) {
          return Promise.all(
            arg.map(async pool_id => {
              const service = await api.query.game.poolOf(pool_id);

              if (service.isEmpty) return;

              return {
                pool_id,
                poolType: service.value.poolType.toString(),
                owner: service.value.owner.toString(),
                price: service.value.mintSettings.price.toString(),
                endBlock: service.value.mintSettings.endBlock,
              };
            })
          ).then(data => data.filter((meta): meta is poolOfProps => !!meta));
        }
      }

      // not found group
      return [];
    },
    enabled: !!api?.query.game.poolOf || !!arg,
  });

  return {
    poolOf: data,
    isLoading,
    isError,
  };
}
