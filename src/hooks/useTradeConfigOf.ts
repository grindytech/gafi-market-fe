import { useQuery } from '@tanstack/react-query';
import { useAppSelector } from './useRedux';
import { Option, StorageKey, u32 } from '@polkadot/types';
import {
  GafiSupportGameTypesTradeType,
  PalletGameTradeConfig,
} from '@polkadot/types/lookup';

export interface useTradeConfigOfProps {
  filter: 'entries' | number[];
  key: string | string[] | number | number[];
  type?: keyof GafiSupportGameTypesTradeType;
}

interface tradeConfigProps extends Partial<PalletGameTradeConfig> {
  trade_id: number;
}

export default function useTradeConfigOf({
  filter,
  key,
  type,
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
              if (meta.isEmpty) return; // not found

              const common: tradeConfigProps = {
                trade: meta.value.trade,
                owner: meta.value.owner,
                maybePrice: meta.value.maybePrice,
                endBlock: meta.value.endBlock,
                trade_id: trade_id.args[0].toNumber(),
              };

              if (type && meta.value.trade[type]) return common;

              if (!type) return common;
            }
          ) as tradeConfigProps[];
        }

        if (filter) {
          return Promise.all(
            filter.map(async trade_id => {
              const service = (await api.query.game.tradeConfigOf(
                trade_id
              )) as Option<PalletGameTradeConfig>;

              if (service.isEmpty) return; // not found

              const common: tradeConfigProps = {
                trade: service.value.trade,
                owner: service.value.owner,
                maybePrice: service.value.maybePrice,
                endBlock: service.value.endBlock,
                trade_id,
              };

              if (type && service.value.trade[type]) return common;

              if (!type) return common;
            })
          ).then(data =>
            data.filter((meta): meta is tradeConfigProps => !!meta)
          );
        }
      }

      // not found group
      return [];
    },
    enabled: !!filter,
  });

  return {
    tradeConfigOf: data,
    isLoading,
    isError,
    refetch,
  };
}
