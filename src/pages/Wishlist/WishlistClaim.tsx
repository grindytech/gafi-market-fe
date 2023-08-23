import { Button } from '@chakra-ui/react';
import { useAppSelector } from 'hooks/useRedux';
import useSignAndSend from 'hooks/useSignAndSend';

interface WishlistClaimProps {
  trade_id: number;
  maybePrice: number;
}

export default ({ trade_id, maybePrice }: WishlistClaimProps) => {
  const { account } = useAppSelector(state => state.injected.polkadot);
  const { api } = useAppSelector(state => state.substrate);

  const { mutation, isLoading } = useSignAndSend({
    key: [''],
    address: account?.address as string,
    onSuccess: () => {},
  });

  return (
    <Button
      variant="primary"
      px={6}
      borderRadius="3xl"
      isLoading={isLoading}
      onClick={() => {
        if (api) {
          mutation(api.tx.game.claimWishlist(trade_id, maybePrice));
        }
      }}
    >
      Claim Wishlist
    </Button>
  );
};
