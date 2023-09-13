import {
  Box,
  Button,
  Flex,
  FormControl,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';

import { useAppSelector } from 'hooks/useRedux';
import useSignAndSend from 'hooks/useSignAndSend';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { formatCurrency } from 'utils/utils';

import DurationBlock, { ListDurationProps } from 'components/DurationBlock';
import useBlockTime from 'hooks/useBlockTime';
import { BLOCK_TIME, unitGAFI } from 'utils/contants.utils';

interface NFTDetailSellProps {
  refetch: () => void;
}

export default function NFTDetailSell({ refetch }: NFTDetailSellProps) {
  const { nft_id, collection_id } = useParams();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { api } = useAppSelector(state => state.substrate);
  const { account } = useAppSelector(state => state.injected.polkadot);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<{ price: string; amount: number }>();

  const { amount, price } = watch();

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

  const [duration, setDuration] = React.useState(ListDuration[0]);

  const { blockNumber } = useBlockTime('bestNumber');

  const { isLoading, mutation } = useSignAndSend({
    key: ['sell_nft', String(nft_id)],
    address: account?.address as string,
    onSuccess() {
      refetch();
      onClose();
      reset();
    },
  });

  return (
    <Button
      variant="primary"
      borderRadius="3xl"
      isLoading={isLoading}
      onClick={onOpen}
    >
      Sell Now
      <Modal
        isOpen={isOpen}
        onClose={() => {
          reset();
          onClose();
        }}
        closeOnOverlayClick={!isLoading}
      >
        <ModalOverlay />

        <ModalContent
          as="form"
          sx={{
            input: {
              padding: 4,
              height: 'auto',
              fontSize: 'sm',
              color: 'shader.a.900',
              borderRadius: 'xl',
              borderColor: 'shader.a.300',
            },
            span: {
              color: 'shader.a.500',
              fontWeight: 'normal',
              fontSize: 'sm',
            },
          }}
          onSubmit={handleSubmit(({ price, amount }) => {
            if (api) {
              mutation(
                api.tx.game.setPrice(
                  {
                    collection: Number(collection_id),
                    item: Number(nft_id),
                    amount,
                  },
                  BigInt(unitGAFI(price)),
                  blockNumber, // start_block
                  blockNumber + duration.time // end_block
                )
              );
            }
          })}
        >
          <ModalHeader
            display="flex"
            justifyContent="space-between"
            padding={4}
            borderBottom="0.0625rem solid"
            borderColor="shader.a.300"
          >
            <Heading fontSize="xl" color="shader.a.900" fontWeight="semibold">
              Sell
            </Heading>

            <ModalCloseButton position="unset" width={6} height={6} />
          </ModalHeader>

          <ModalBody display="flex" flexDirection="column" gap={5} padding={4}>
            <FormControl isRequired={true} isInvalid={!!errors.amount}>
              <Input
                placeholder="Enter Amount"
                isRequired={false}
                {...register('amount', {
                  required: true,
                  valueAsNumber: true,
                })}
              />
            </FormControl>

            <FormControl isRequired={true} isInvalid={!!errors.price}>
              <Input
                placeholder="Enter Price"
                isRequired={false}
                {...register('price', { required: true })}
              />
            </FormControl>

            <DurationBlock
              listDuration={ListDuration}
              duration={duration}
              setCurrentDuration={setDuration}
            />
          </ModalBody>

          <ModalFooter
            gap={2}
            borderTop="0.0625rem solid"
            borderColor="shader.a.300"
            padding={4}
            justifyContent="space-between"
            display="block"
          >
            {price && amount ? (
              <Flex justifyContent="space-between" mb={4}>
                <Text as="span">Total value</Text>

                <Box textAlign="right">
                  <Text fontWeight="medium" fontSize="sm">
                    {price}&nbsp;
                    <Text as="span">GAFI</Text>
                  </Text>

                  <Text as="span">{formatCurrency(price)}</Text>
                </Box>
              </Flex>
            ) : null}

            <Button
              isLoading={isLoading}
              variant="primary"
              width="full"
              type="submit"
            >
              Sell
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Button>
  );
}
