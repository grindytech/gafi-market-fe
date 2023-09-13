import { useQuery } from '@tanstack/react-query';
import { useAppSelector } from './useRedux';
import { Option, StorageKey, u128, u32 } from '@polkadot/types';
import { PalletGameAuctionConfig } from '@polkadot/types/lookup';

export interface useAuctionConfigOfProps {
  filter: 'entries' | 'trade_id';
  arg?: number[];
  key: string | string[] | number | number[];
}

export interface AuctionConfigOfProps {
  trade_id: number;
  owner: string;
  maybePrice: Option<u128>;
  startBlock: u32;
  duration: u32;
}

export default function useAuctionConfigOf({
  filter,
  arg,
  key,
}: useAuctionConfigOfProps) {
  const { api } = useAppSelector(state => state.substrate);

  const { data, isLoading } = useQuery({
    queryKey: ['auctionConfigOf', key],
    queryFn: async () => {
      if (api) {
        if (filter === 'entries') {
          const service = await api.query.game.auctionConfigOf.entries();

          return service.map(
            ([trade_id, meta]: [
              StorageKey<[u32]>,
              Option<PalletGameAuctionConfig>
            ]) => {
              return {
                trade_id: trade_id.args[0].toNumber(),
                owner: meta.value.owner.toString(),
                maybePrice: meta.value.maybePrice,
                startBlock: meta.value.startBlock,
                duration: meta.value.duration,
              };
            }
          ) as AuctionConfigOfProps[];
        }

        if (filter && arg) {
          return Promise.all(
            arg.map(async trade_id => {
              const service: Option<PalletGameAuctionConfig> =
                await api.query.game.auctionConfigOf(trade_id);

              // not found
              if (service.isEmpty) return;

              return {
                trade_id,
                owner: service.value.owner.toString(),
                maybePrice: service.value.maybePrice,
                startBlock: service.value.startBlock,
                duration: service.value.duration,
              };
            })
          ).then(data =>
            data.filter((meta): meta is AuctionConfigOfProps => !!meta)
          );
        }
      }

      // not found group
      return [];
    },
    enabled: !!api?.query.game.auctionConfigOf || !!arg,
  });

  return {
    auctionConfigOf: data,
    isLoading,
  };
}
