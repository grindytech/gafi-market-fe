import { useQuery } from '@tanstack/react-query';
import { useAppSelector } from './useRedux';
import { Option, StorageKey, u32 } from '@polkadot/types';
import { PalletGameTradeConfig } from '@polkadot/types/lookup';

export interface useTradeConfigOfProps {
  filter: 'entries' | 'trade_id';
  arg?: number[];
  key: string | string[] | number | number[];
}

export default function useTradeConfigOf({
  filter,
  arg,
  key,
}: useTradeConfigOfProps) {
  const { api } = useAppSelector(state => state.substrate);

  const { data, refetch, isLoading, isError } = useQuery({
    queryKey: ['tradeConfigOf', key],
    queryFn: async () => {
      if (api) {
        if (filter === 'entries') {
          const service = await api.query.game.tradeConfigOf.entries();

          return service.map(
            ([trade_id, meta]: [
              StorageKey<[u32]>,
              Option<PalletGameTradeConfig>
            ]) => {
              return {
                trade_id: trade_id.args[0].toNumber(),
                trade: meta.value.trade,
                owner: meta.value.owner.toString(),
                maybePrice: meta.value.maybePrice,
                maybeRequired: meta.value.maybeRequired,
                endBlock: meta.value.endBlock,
              };
            }
          );
        }

        if (filter === 'trade_id' && arg) {
          return Promise.all(
            arg.map(async trade_id => {
              const service = await api.query.game.tradeConfigOf(trade_id);

              // not found
              if (service.isEmpty) return;

              return {
                trade_id,
                trade: service.value.trade,
                owner: service.value.owner.toString(),
                maybePrice: service.value.maybePrice,
                maybeRequired: service.value.maybeRequired,
                endBlock: service.value.endBlock,
              };
            })
          ).then(data =>
            data.filter((meta): meta is NonNullable<typeof meta> => !!meta)
          );
        }
      }

      // not found group
      return [];
    },
    enabled: !!api?.query.game.tradeConfigOf || !!arg,
  });

  return {
    tradeConfigOf: data,
    isLoading,
    isError,
    refetch,
  };
}
