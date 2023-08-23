import DurationBlock, { ListDurationProps } from 'components/DurationBlock';
import { useEffect, useState } from 'react';
import { Control, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { BLOCK_TIME } from 'utils/constants';
import { AccountWishlistFieldProps } from '.';
import { Button, Stack } from '@chakra-ui/react';
import NumberInput from 'components/NumberInput';
import { isNull } from '@polkadot/util';
import { useAppSelector } from 'hooks/useRedux';
import useSignAndSend from 'hooks/useSignAndSend';
import { useNavigate } from 'react-router-dom';
import useBlockTime from 'hooks/useBlockTime';
import useSubscribeSystem from 'hooks/useSubscribeSystem';

interface AccountWishlistControlProps {
  onSuccess: () => void;
  formState: {
    control: Control<AccountWishlistFieldProps, any>;
    setValue: UseFormSetValue<AccountWishlistFieldProps>;
    watch: UseFormWatch<AccountWishlistFieldProps>;
  };
}

export default ({ onSuccess, formState }: AccountWishlistControlProps) => {
  const { product: productForm, price, selected } = formState.watch();

  const product = Object.values(productForm || []).filter(meta => !!meta);

  const navigate = useNavigate();

  const { api } = useAppSelector(state => state.substrate);

  const { account } = useAppSelector(state => state.injected.polkadot);

  const { blockNumber } = useBlockTime('bestNumber');

  const ListDuration: ListDurationProps[] = [
    {
      text: '1 Minutes',
      time: 60 / BLOCK_TIME,
    },
    {
      text: '5 Minutes',
      time: 300 / BLOCK_TIME,
    },
    {
      text: '1 Hours',
      time: 3600 / BLOCK_TIME,
    },
    {
      text: '1 Day',
      time: (86400 * 1) / BLOCK_TIME,
    },
    {
      text: '1 Week',
      time: (86400 * 7) / BLOCK_TIME,
    },
    {
      text: '2 Weeks',
      time: (86400 * 14) / BLOCK_TIME,
    },
    {
      text: '1 Month',
      time: (86400 * 30) / BLOCK_TIME,
    },
  ];

  const [duration, setDuration] = useState(ListDuration[0]);

  const { event, setEvent } = useSubscribeSystem('game::WishlistSet');

  const { mutation, isLoading } = useSignAndSend({
    key: [`setWishlist/${account?.address}`],
    address: account?.address as string,
    onSuccess,
  });

  useEffect(() => {
    if (event && account?.address) {
      event.forEach(({ eventValue }) => {
        const [trade_id, who] = JSON.parse(eventValue);

        if (account.address === who) {
          return navigate(`/wishlist/${trade_id}`);
        }

        setEvent([]);
      });
    }
  }, [event]);

  return (
    <Stack spacing={4} px={6} py={4}>
      <NumberInput
        formState={{
          control: formState.control,
          value: 'price',
          isInvalid: isNull(price),
          isRequired: true,
        }}
        heading="Price"
        sx={{
          display: 'block',
          sx: { h2: { color: 'shader.a.600', mb: 2 } },
        }}
      />

      <DurationBlock
        listDuration={ListDuration}
        duration={duration}
        setCurrentDuration={setDuration}
        sx={{
          sx: { '> p': { fontSize: 'md', color: 'shader.a.600' } },
        }}
      />

      <Button
        variant="primary"
        mt={2}
        isLoading={isLoading}
        onClick={() => {
          if (!price) {
            formState.setValue(`price`, null as never);
          }

          if (api && price && selected) {
            mutation(
              api.tx.game.setWishlist(
                product.map(({ collection_id, nft_id }, index) => ({
                  collection: collection_id,
                  item: nft_id,
                  amount: selected[index],
                })),
                price,
                blockNumber,
                blockNumber + duration.time
              )
            );
          }
        }}
      >
        Sign & Submit
      </Button>
    </Stack>
  );
};
