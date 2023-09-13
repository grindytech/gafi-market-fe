import { Button } from '@chakra-ui/react';
import { useAppSelector } from 'hooks/useRedux';
import useSignAndSend from 'hooks/useSignAndSend';
import { useParams } from 'react-router-dom';

interface AccountActivitysSwapClaimProps {
  trade_id: number;
  maybePrice: number;
  onSuccess: () => void;
}

export default function AccountActivitysSwapClaim({
  trade_id,
  maybePrice,
  onSuccess,
}: AccountActivitysSwapClaimProps) {
  const { address } = useParams();
  const { account } = useAppSelector(state => state.injected.polkadot);
  const { api } = useAppSelector(state => state.substrate);

  const { mutation, isLoading } = useSignAndSend({
    key: [`claimSwap/${address}/${trade_id}`],
    address: account?.address as string,
    onSuccess,
  });

  return (
    <Button
      variant="cancel"
      isLoading={isLoading}
      onClick={() => {
        if (api) {
          mutation(api.tx.game.claimSwap(trade_id, maybePrice));
        }
      }}
    >
      Accept
    </Button>
  );
}
