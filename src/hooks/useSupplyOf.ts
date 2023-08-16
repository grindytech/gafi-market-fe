import { useQuery } from '@tanstack/react-query';
import { useAppSelector } from './useRedux';

interface useSupplyOfProps {
  filter?: 'entries' | 'collection_id';
  arg?: number[] | { collection_id?: number; nft_id?: number }[];
  key: string | string[] | number | number[];
}

export default function useSupplyOf({ filter, key, arg }: useSupplyOfProps) {
  const { api } = useAppSelector(state => state.substrate);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['supplyOf', key],
    queryFn: async () => {
      if (api) {
        if (filter === 'entries') {
          const service = await api.query.game.supplyOf.entries();

          return service.map(([meta, supply]) => {
            return {
              collection_id: meta.args[0].toNumber(),
              nft_id: meta.args[1].toNumber(),
              supply: supply.toHuman() as string | null,
            };
          });
        }

        if (filter === 'collection_id' && arg) {
          for (let i = 0; i < arg.length; i++) {
            const service = await api.query.game.supplyOf.entries(arg[i]);

            return service.map(([meta, supply]) => ({
              collection_id: meta.args[0].toNumber(),
              nft_id: meta.args[1].toNumber(),
              supply: supply.toHuman() as string | null,
            }));
          }
        }
      }

      return []; // not found
    },
    // enabled: !!filter || !!arg,
    enabled: !!api?.query.game.supplyOf || !!arg,
  });

  return {
    supplyOf: data,
    isError,
    isLoading,
  };
}
