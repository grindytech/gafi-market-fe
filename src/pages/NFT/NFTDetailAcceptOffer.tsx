import { Button, ButtonProps } from '@chakra-ui/react';
import { useAppSelector } from 'hooks/useRedux';
import useSignAndSend from 'hooks/useSignAndSend';

interface NFTDetailAcceptOfferProps {
  trade_id: number;
  amount: number;
  price: number;
  sx?: ButtonProps;
  refetch: () => void;
}

export default function NFTDetailAcceptOffer({
  trade_id,
  amount,
  price,
  sx,
  refetch,
}: NFTDetailAcceptOfferProps) {
  const { account } = useAppSelector(state => state.injected.polkadot);
  const { api } = useAppSelector(state => state.substrate);

  const { mutation, isLoading } = useSignAndSend({
    key: [`nft_detail_accept_offer`, account?.address as string],
    address: account?.address as string,
    onSuccess() {
      refetch();
    },
  });

  return (
    <Button
      variant="primary"
      isLoading={isLoading}
      onClick={() => {
        if (api) {
          mutation(api.tx.game.sellItem(trade_id, amount, price));
        }
      }}
      {...sx}
    >
      Accept
    </Button>
  );
}
