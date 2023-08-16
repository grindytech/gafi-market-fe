import { useQuery } from '@tanstack/react-query';
import { useAppSelector } from './useRedux';
import { Option, StorageKey, u32 } from '@polkadot/types';
import { PalletGameAuctionConfig } from '@polkadot/types/lookup';

export interface useAuctionConfigOfProps {
  filter: 'entries' | number[];
  key: string | string[] | number | number[];
}

export default function useAuctionConfigOf({
  filter,
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
          );
        }

        if (filter) {
          return Promise.all(
            filter.map(async trade_id => {
              const service = (await api.query.game.auctionConfigOf(
                trade_id
              )) as Option<PalletGameAuctionConfig>;

              if (service.isEmpty) return; // not found

              return {
                trade_id,
                owner: service.value.owner.toString(),
                maybePrice: service.value.maybePrice,
                startBlock: service.value.startBlock,
                duration: service.value.duration,
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
    auctionConfigOf: data,
    isLoading,
  };
}
