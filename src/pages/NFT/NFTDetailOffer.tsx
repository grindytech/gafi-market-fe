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

import { useAppSelector } from 'hooks/useRedux';
import useSignAndSend from 'hooks/useSignAndSend';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { formatCurrency, formatGAFI } from 'utils/utils';

import useBlockTime from 'hooks/useBlockTime';
import DurationBlock, { ListDurationProps } from 'components/DurationBlock';
import RatioPicture from 'components/RatioPicture';

import { MetaNFTFieldProps } from 'hooks/useMetaNFT';
import { BLOCK_TIME, unitGAFI } from 'utils/contants.utils';
import BigNumber from 'bignumber.js';
import { MetaCollectionFieldProps } from 'hooks/useMetaCollection';

interface NFTDetailOfferProps {
  fee: number;
  amount: number | undefined;
  metaNFT: MetaNFTFieldProps | undefined;
  metaCollection: MetaCollectionFieldProps[] | undefined;
}

export default function NFTDetailOffer({
  fee,
  amount,
  metaNFT,
  metaCollection,
}: NFTDetailOfferProps) {
  const { nft_id, collection_id } = useParams();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { api } = useAppSelector(state => state.substrate);
  const { account } = useAppSelector(state => state.injected.polkadot);
  const { blockNumber } = useBlockTime('bestNumber');

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<{ priceOffer: number; amountOffer: number }>();

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

  const onReset = () => {
    reset();
    onClose();
    setDuration(ListDuration[0]);
  };

  const { amountOffer, priceOffer } = watch();

  const { isLoading, mutation } = useSignAndSend({
    key: ['make_offer', String(nft_id)],
    address: account?.address as string,
    onSuccess() {
      onReset();
    },
  });

  return (
    <Button
      variant="cancel"
      borderRadius="3xl"
      isLoading={isLoading}
      onClick={onOpen}
    >
      Make offer
      {isOpen && (
        <Modal
          isOpen={isOpen}
          onClose={onReset}
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
            onSubmit={handleSubmit(() => {
              if (api) {
                mutation(
                  api.tx.game.setOrder(
                    {
                      collection: Number(collection_id),
                      item: Number(nft_id),
                      amount,
                    },
                    BigInt(
                      unitGAFI(
                        BigNumber(priceOffer)
                          .multipliedBy(amountOffer)
                          .toFixed()
                      )
                    ),
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
                    src={metaNFT?.image || null}
                    sx={{ width: 32 }}
                  />

                  <Box>
                    <Text color="primary.a.500" fontWeight="medium">
                      {metaCollection?.[0]?.name}
                    </Text>

                    <Text
                      as="span"
                      color="shader.a.900"
                      fontWeight="semibold"
                      fontSize="xl"
                    >
                      {metaNFT?.name}

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
                  <Text fontWeight="medium" fontSize="sm">
                    {formatGAFI(fee)}&nbsp;
                    <Text as="span">GAFI</Text>
                  </Text>

                  <Text as="span">{formatCurrency(formatGAFI(fee))}</Text>
                </Box>
              </Flex>

              <FormControl isRequired={true} isInvalid={!!errors.priceOffer}>
                <Input
                  placeholder="Enter offer"
                  isRequired={false}
                  {...register('priceOffer', {
                    required: true,
                    valueAsNumber: true,
                  })}
                />
              </FormControl>

              <FormControl isRequired={true} isInvalid={!!errors.amountOffer}>
                <Input
                  placeholder="Enter Amount"
                  isRequired={false}
                  {...register('amountOffer', {
                    required: true,
                    valueAsNumber: true,
                  })}
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
              {priceOffer && amountOffer ? (
                <Flex justifyContent="space-between" mb={4}>
                  <Text as="span">Total value</Text>

                  <Box textAlign="right">
                    <Text fontWeight="medium" fontSize="sm">
                      {priceOffer * amountOffer}&nbsp;
                      <Text as="span">GAFI</Text>
                    </Text>

                    <Text as="span">
                      {formatCurrency(priceOffer * amountOffer)}
                    </Text>
                  </Box>
                </Flex>
              ) : null}

              <Button
                isLoading={isLoading}
                variant="primary"
                width="full"
                type="submit"
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
