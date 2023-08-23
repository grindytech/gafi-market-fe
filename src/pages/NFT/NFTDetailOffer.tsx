import {
  Box,
  Button,
  Flex,
  FormControl,
  HStack,
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
import { cloundinary_link } from 'axios/cloudinary_axios';
import GafiAmount from 'components/GafiAmount';

import { useAppSelector } from 'hooks/useRedux';
import useSignAndSend from 'hooks/useSignAndSend';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { formatCurrency } from 'utils/utils';

import useBlockTime from 'hooks/useBlockTime';
import DurationBlock, { ListDurationProps } from 'components/DurationBlock';
import RatioPicture from 'components/RatioPicture';
import { BLOCK_TIME } from 'utils/constants';
import { TypeMetadataOfCollection, TypeMetadataOfItem } from 'types';

interface NFTDetailOfferProps {
  fee: number | undefined;
  amount: number | undefined;
  metaNFT: TypeMetadataOfItem;
  metaCollection: TypeMetadataOfCollection[] | undefined;
  refetch: () => void;
}

export default function NFTDetailOffer({
  fee,
  amount,
  metaNFT,
  metaCollection,
  refetch,
}: NFTDetailOfferProps) {
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
  } = useForm();

  const { blockNumber } = useBlockTime('bestNumber');

  const { isLoading, mutation } = useSignAndSend({
    key: ['make_offer', String(nft_id)],
    address: account?.address as string,
    onSuccess() {
      onClose();
      reset();
      refetch();
    },
  });

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

  return (
    <Button
      variant="cancel"
      borderRadius="3xl"
      isLoading={isLoading}
      onClick={onOpen}
      _hover={{}}
    >
      Make offer
      {isOpen && (
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
              '.amount-gafi': {
                color: 'shader.a.900',
                fontSize: 'sm',
                fontWeight: 'medium',
              },
            }}
            onSubmit={handleSubmit(({ price, amount }) => {
              if (api) {
                mutation(
                  api.tx.game.setBuy(
                    { collection: collection_id, item: nft_id, amount },
                    price,
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
                Make offer
              </Heading>

              <ModalCloseButton position="unset" width={6} height={6} />
            </ModalHeader>

            <ModalBody
              display="flex"
              flexDirection="column"
              gap={5}
              padding={4}
            >
              <HStack alignItems="flex-start" spacing={4}>
                <Flex gap={4}>
                  <RatioPicture
                    alt={nft_id}
                    src={
                      metaNFT?.image ? cloundinary_link(metaNFT?.image) : null
                    }
                    sx={{ width: 32 }}
                  />

                  <Box>
                    <Text color="primary.a.500" fontWeight="medium">
                      {metaCollection?.[0]?.title || '-'}
                    </Text>

                    <Text
                      as="span"
                      color="shader.a.900"
                      fontWeight="semibold"
                      fontSize="xl"
                    >
                      {metaNFT?.title || '-'}

                      {amount ? (
                        <Text
                          as="strong"
                          fontWeight="medium"
                          fontSize="md"
                          color="primary.a.500"
                        >
                          &nbsp;x{amount}
                        </Text>
                      ) : null}
                    </Text>
                  </Box>
                </Flex>
              </HStack>

              <Flex
                borderRadius="xl"
                bg="shader.a.200"
                border="0.0625rem solid"
                borderColor="shader.a.300"
                justifyContent="space-between"
                padding={2}
              >
                <Text as="span">Best offer</Text>

                <Box textAlign="right">
                  <GafiAmount
                    amount={fee || 0}
                    sx={{
                      className: 'amount-gafi',
                      sx: {
                        span: {
                          color: 'inherit!',
                          fontSize: 'inherit',
                          fontWeight: 'inherit',
                        },
                      },
                    }}
                  />

                  <Text as="span">{formatCurrency(fee || 0, 'usd')}</Text>
                </Box>
              </Flex>

              <FormControl isRequired={true} isInvalid={!!errors.price}>
                <Input
                  placeholder="Enter offer"
                  isRequired={false}
                  {...register('price', { required: true })}
                />
              </FormControl>

              <FormControl isRequired={true} isInvalid={!!errors.amount}>
                <Input
                  placeholder="Enter Amount"
                  isRequired={false}
                  {...register('amount', { required: true })}
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
              <Flex justifyContent="space-between">
                <Text as="span">Total value</Text>

                <Box textAlign="right">
                  <GafiAmount
                    amount={watch().price || 0}
                    sx={{
                      className: 'amount-gafi',
                      sx: {
                        span: {
                          color: 'inherit!',
                          fontSize: 'inherit',
                          fontWeight: 'inherit',
                        },
                      },
                    }}
                  />

                  <Text as="span">
                    {formatCurrency(Number(watch().price || 0), 'usd')}
                  </Text>
                </Box>
              </Flex>

              <Button
                isLoading={isLoading}
                variant="primary"
                width="full"
                type="submit"
                mt={4}
                _hover={{}}
              >
                Make offer
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Button>
  );
}
