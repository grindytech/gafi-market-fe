import { useQuery } from '@tanstack/react-query';
import { useAppSelector } from './useRedux';
import { StorageKey, Vec, u32 } from '@polkadot/types';
import { GafiSupportGameTypesPackage } from '@polkadot/types/lookup';

export interface useBundleOfProps {
  filter: 'entries' | 'trade_id';
  arg?: number[];
  key: string | string[] | number | number[];
}

export default function useBundleOf({ filter, arg, key }: useBundleOfProps) {
  const { api } = useAppSelector(state => state.substrate);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['bundleOf', key],
    queryFn: async () => {
      if (api) {
        if (filter === 'entries') {
          const service = await api.query.game.bundleOf.entries();

          return service.map(
            ([trade_id, meta]: [
              StorageKey<[u32]>,
              Vec<GafiSupportGameTypesPackage>
            ]) => ({
              trade_id: trade_id.args[0].toNumber(),
              collection_id: meta[0].collection.toNumber(),
              nft_id: meta[0].item.toNumber(),
              amount: meta[0].amount.toNumber(),
            })
          );
        }

        if (filter === 'trade_id' && arg) {
          return Promise.all(
            arg.map(async trade_id => {
              const service: Vec<GafiSupportGameTypesPackage> =
                await api.query.game.bundleOf(trade_id);

              if (service.isEmpty) return;

              return service.map(meta => ({
                trade_id,
                collection_id: meta.collection.toNumber(),
                nft_id: meta.item.toNumber(),
                amount: meta.amount.toNumber(),
              }));
            })
          ).then(data =>
            data
              .filter((meta): meta is NonNullable<typeof meta> => !!meta)
              .flat()
          );
          // not found and fill all array [Array(3)] = [1, 2, X]
        }
      }

      // not found group
      return [];
    },
    enabled: !!filter || !!arg,
  });

  return {
    bundleOf: data,
    isLoading,
    isError,
    refetch,
  };
}
