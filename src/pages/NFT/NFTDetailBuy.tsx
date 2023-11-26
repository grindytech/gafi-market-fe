import {
  Box,
  Button,
  ButtonProps,
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

import { useParams } from 'react-router-dom';

import { useForm } from 'react-hook-form';

import { formatCurrency, formatGAFI } from 'utils/utils';

import useMetaCollection from 'hooks/useMetaCollection';
import useMetaNFT from 'hooks/useMetaNFT';
import useItemBought from 'hooks/useItemBought';
import RatioPicture from 'components/RatioPicture';

import { BigNumber } from 'bignumber.js';
import { unitGAFI } from 'utils/contants.utils';

interface NFTDetailBuyProps {
  trade_id: number;
  fee: string;
  amount: number;
  sx?: ButtonProps;
  refetch: () => void;
}

export default function NFTDetailBuy({
  trade_id,
  fee,
  amount,
  refetch,
  sx,
}: NFTDetailBuyProps) {
  const { nft_id, collection_id } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<{
    supply: number;
  }>();

  const { supply } = watch();

  const { metaNFT } = useMetaNFT({
    key: `nft_detail/${nft_id}/${collection_id}`,
    filter: 'collection_id',
    arg: [{ nft_id: Number(nft_id), collection_id: Number(collection_id) }],
  });

  const { MetaCollection } = useMetaCollection({
    key: `nft_detail/${nft_id}/${collection_id}`,
    filter: 'collection_id',
    arg: [Number(collection_id)],
  });

  const { isLoading, mutation, api } = useItemBought({
    trade_id,
    refetch() {
      refetch();
      onClose();
    },
  });

  return (
    <Button
      variant="primary"
      borderRadius="3xl"
      fontSize="sm"
      fontWeight="medium"
      isLoading={isLoading}
      onClick={onOpen}
      {...sx}
    >
      Buy now
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
            }}
            onSubmit={handleSubmit(() => {
              mutation(
                api?.tx.game.buyItem(
                  trade_id,
                  amount,
                  BigInt(
                    unitGAFI(BigNumber(fee).multipliedBy(supply).toFixed())
                  )
                )
              );
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
                Buy
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
                    src={metaNFT?.[0].image || null}
                    sx={{ width: 32 }}
                  />

                  <Box>
                    <Text color="primary.a.500" fontWeight="medium">
                      {MetaCollection?.[0]?.name}
                    </Text>

                    <Text
                      as="span"
                      color="shader.a.900"
                      fontWeight="semibold"
                      fontSize="xl"
                    >
                      {metaNFT?.[0]?.name}
                      <Text
                        as="strong"
                        fontWeight="medium"
                        fontSize="md"
                        color="primary.a.500"
                      >
                        &nbsp;x{amount}
                      </Text>
                    </Text>
                  </Box>
                </Flex>
              </HStack>

              <Flex
                borderRadius="xl"
                bg="shader.a.200"
                border="0.0625rem solid"
                borderColor="shader.a.300"
                padding={2}
                justifyContent="space-between"
              >
                <Text as="span">Current price</Text>

                <Box textAlign="right">
                  <Text fontWeight="medium" fontSize="sm">
                    {formatGAFI(fee)}&nbsp;
                    <Text as="span">GAFI</Text>
                  </Text>

                  <Text as="span">{formatCurrency(formatGAFI(fee))}</Text>
                </Box>
              </Flex>

              <FormControl isRequired={true} isInvalid={!!errors.supply}>
                <Input
                  placeholder="Enter supply"
                  isRequired={false}
                  {...register('supply', {
                    required: true,
                    valueAsNumber: true,
                  })}
                />
              </FormControl>
            </ModalBody>

            <ModalFooter
              gap={2}
              borderTop="0.0625rem solid"
              borderColor="shader.a.300"
              padding={4}
              justifyContent="space-between"
              display="block"
              opacity={supply ? undefined : 0.4}
              pointerEvents={supply ? undefined : 'none'}
            >
              {supply ? (
                <Flex justifyContent="space-between" mb={4}>
                  <Text as="span">Total value</Text>

                  <Box textAlign="right">
                    <Text fontWeight="medium" fontSize="sm">
                      {Number(formatGAFI(fee)) * supply}
                      &nbsp;
                      <Text as="span">GAFI</Text>
                    </Text>

                    <Text as="span">
                      {formatCurrency(Number(formatGAFI(fee)) * supply)}
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
                Purchase
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Button>
  );
}
