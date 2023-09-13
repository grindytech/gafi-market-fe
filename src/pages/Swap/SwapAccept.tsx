import { Box, Button } from '@chakra-ui/react';
import { useAppSelector } from 'hooks/useRedux';
import useSignAndSend from 'hooks/useSignAndSend';
import { useParams } from 'react-router-dom';

interface SwapAcceptProps {
  maybePrice: number;
}

export default ({ maybePrice }: SwapAcceptProps) => {
  const { id } = useParams();
  const { account } = useAppSelector(state => state.injected.polkadot);
  const { api } = useAppSelector(state => state.substrate);

  const { mutation, isLoading } = useSignAndSend({
    key: [`swap_detail_claim/${id}`],
    address: account?.address as string,
  });

  return (
    <Box padding={6} paddingTop={0}>
      <Button
        variant="primary"
        width="fit-content"
        fontSize="sm"
        px={12}
        borderRadius="3xl"
        isLoading={isLoading}
        onClick={() => {
          if (api) {
            mutation(api.tx.game.makeSwap(Number(id), maybePrice));
          }
        }}
      >
        Accept
      </Button>
    </Box>
  );
};
