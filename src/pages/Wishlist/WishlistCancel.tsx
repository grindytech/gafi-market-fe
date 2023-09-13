import { Button } from '@chakra-ui/react';
import { useAppSelector } from 'hooks/useRedux';
import useSignAndSend from 'hooks/useSignAndSend';

interface WishlistCancelProps {
  trade_id: number;
}

export default ({ trade_id }: WishlistCancelProps) => {
  const { account } = useAppSelector(state => state.injected.polkadot);
  const { api } = useAppSelector(state => state.substrate);

  const { mutation, isLoading } = useSignAndSend({
    key: [`cancel_wishlist_detail/${trade_id}`],
    address: account?.address as string,
    onSuccess() {},
  });

  return (
    <Button
      variant="cancel"
      px={6}
      borderRadius="3xl"
      isLoading={isLoading}
      onClick={() => {
        if (api) {
          mutation(api.tx.game.cancelTrade(trade_id, 'Wishlist'));
        }
      }}
    >
      Cancel wishlist
    </Button>
  );
};
