import {
  Box,
  Button,
  Center,
  Grid,
  GridItem,
  Heading,
  Text,
  useDisclosure,
} from '@chakra-ui/react';

import { isNull, isUndefined } from '@polkadot/util';
import { cloundinary_link } from 'axios/cloudinary_axios';
import CardBox from 'components/CardBox';
import DateBlock from 'components/DateBlock';
import NumberInputMaxLength from 'components/NumberInput/NumberInputMaxLength';
import RatioPicture from 'components/RatioPicture';
import useMetaCollection from 'hooks/useMetaCollection';
import useMetaNFT from 'hooks/useMetaNFT';
import { useAppSelector } from 'hooks/useRedux';
import useSignAndSend from 'hooks/useSignAndSend';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import {
  CalculatorOfRarity,
  ColorOfRarity,
  formatCurrency,
  formatGAFI,
  shorten,
  sumGAFI,
} from 'utils/utils';
import PoolSuccessfuly from './PoolSuccessfuly';
import usePoolOf from 'hooks/usePoolOf';
import useLootTableOf from 'hooks/useLootTableOf';
import useSupplyOf from 'hooks/useSupplyOf';

export default function Pool() {
  const { api } = useAppSelector(state => state.substrate);
  const { account } = useAppSelector(state => state.injected.polkadot);
  const { id } = useParams();

  const { poolOf } = usePoolOf({
    key: `pool_detail/${id}`,
    filter: [Number(id)],
  });

  const { lootTableOf } = useLootTableOf({
    key: `pool_detail/${id}`,
    filter: 'pool_id',
    arg: [Number(id)],
  });

  const shouldHaveTableOf = lootTableOf?.filter(meta => !!meta.maybeNfT);

  const { supplyOf } = useSupplyOf({
    key: `pool_detail/${id}/${JSON.stringify(shouldHaveTableOf)}`,
    filter: 'collection_id',
    arg: shouldHaveTableOf?.map(meta => meta.maybeNfT?.collection_id) as never,
  });

  const { metaNFT } = useMetaNFT({
    key: `pool_detail/${id}/${JSON.stringify(shouldHaveTableOf)}`,
    filter: shouldHaveTableOf?.map(meta => ({
      collection_id: meta.maybeNfT?.collection_id,
      nft_id: meta.maybeNfT?.nft_id,
    })) as never,
  });

  const { MetaCollection } = useMetaCollection({
    key: `pool_detail/${id}/${JSON.stringify(shouldHaveTableOf)}`,
    filter: shouldHaveTableOf?.map(
      meta => meta.maybeNfT?.collection_id
    ) as never,
  });

  const { isLoading, mutation } = useSignAndSend({
    key: [`mint_pool/${id}`],
    address: account?.address as string,
    onSuccess: () => {
      onOpen();
    },
  });

  const { isOpen, onClose, onOpen } = useDisclosure();
  const { control, watch, handleSubmit, reset } = useForm();
  const { amount } = watch();

  const price = poolOf?.find(meta => meta?.price)?.price || '0';

  return (
    <>
      {isOpen && (
        <PoolSuccessfuly
          onCloseSuccess={() => {
            reset();
            onClose();
          }}
        />
      )}

      {poolOf?.length && lootTableOf?.length ? (
        <Grid gridTemplateColumns="repeat(6, 1fr)" gap={5}>
          <GridItem colSpan={{ base: 6, lg: 4 }}>
            <Grid
              gridTemplateColumns={{
                lg: 'repeat(2, 1fr)',
                xl: 'repeat(3, 1fr)',
              }}
              gap={4}
            >
              {React.Children.toArray(
                lootTableOf.map(meta => {
                  const rarity = CalculatorOfRarity(
                    meta.weight,
                    lootTableOf.map(data => data.weight)
                  );

                  const currentMetaNFT = metaNFT?.find(
                    data =>
                      data?.collection_id === meta.maybeNfT?.collection_id &&
                      data?.nft_id === meta.maybeNfT?.nft_id
                  );

                  const currentMetaCollection = MetaCollection?.find(
                    data => data?.collection_id === meta.maybeNfT?.collection_id
                  );

                  const currentSupplyOf = supplyOf?.find(
                    data =>
                      data.collection_id === meta.maybeNfT?.collection_id &&
                      data.nft_id === meta.maybeNfT.nft_id
                  );

                  const isFailed = isUndefined(meta.maybeNfT?.collection_id);
                  const isInfinity = isUndefined(currentSupplyOf?.supply);

                  return (
                    <Box
                      border="0.0625rem solid"
                      borderColor="shader.a.200"
                      borderRadius="xl"
                      bg="white"
                      boxShadow="0px 0px 20px 0px rgba(0, 0, 0, 0.10)"
                    >
                      <Box position="relative">
                        <RatioPicture
                          src={
                            currentMetaNFT?.image
                              ? cloundinary_link(currentMetaNFT.image)
                              : null
                          }
                        />

                        <RatioPicture
                          src={
                            currentMetaCollection?.image
                              ? cloundinary_link(currentMetaCollection.image)
                              : null
                          }
                          sx={{
                            ml: 4,
                            mb: -4,
                            width: 14,
                            height: 14,
                            position: 'absolute',
                            inset: 'auto auto 0 0',
                            borderRadius: '0.625rem',
                            border: '0.25rem solid white',
                          }}
                        />
                      </Box>

                      <Box padding={4} pt={6} fontSize="sm">
                        <Text color={isFailed ? 'second.red' : 'shader.a.500'}>
                          {isFailed
                            ? 'Failed'
                            : currentMetaCollection?.title || '-'}
                        </Text>

                        <Center
                          gap={4}
                          justifyContent="space-between"
                          fontWeight="medium"
                        >
                          <Text
                            color={isFailed ? 'second.red' : 'shader.a.900'}
                            fontSize="md"
                          >
                            {isFailed
                              ? 'Good luck next time'
                              : currentMetaNFT?.title || '-'}
                          </Text>

                          {!isFailed && (
                            <Text as="span" color="shader.a.900">
                              ID: {meta.maybeNfT?.nft_id}
                            </Text>
                          )}
                        </Center>

                        <Center justifyContent="space-between" gap={4}>
                          {!isInfinity && (
                            <Text fontSize="sm" color="shader.a.900">
                              Amount:&nbsp;
                              <Text as="span" fontWeight="medium">
                                {currentSupplyOf?.supply || 'Infinity'}
                              </Text>
                            </Text>
                          )}

                          <Text fontSize="sm" color="shader.a.900">
                            Rarity:&nbsp;
                            <Text
                              as="span"
                              fontWeight="medium"
                              color={ColorOfRarity(rarity)}
                            >
                              {rarity}%
                            </Text>
                          </Text>
                        </Center>
                      </Box>
                    </Box>
                  );
                })
              )}
            </Grid>
          </GridItem>

          <GridItem
            colSpan={{ base: 6, lg: 2 }}
            gridRow={{ base: 1, lg: 'unset' }}
          >
            <CardBox
              as="form"
              onSubmit={handleSubmit(() => {
                if (api && account?.address) {
                  mutation(
                    api.tx.game.mint(
                      Number(id),
                      account.address,
                      sumGAFI(price, amount, true)
                    )
                  );
                }
              })}
              padding={0}
              variant="baseStyle"
              position="sticky"
              top={{
                base: '4.5rem',
                lg: 20,
              }}
            >
              <Box padding={6}>
                <Heading fontSize="lg" fontWeight="medium" color="shader.a.900">
                  Pool ID {id}
                </Heading>

                <Text color="shader.a.500" mt={1}>
                  Owned by&nbsp;
                  <Text as="span" color="primary.a.500" fontWeight="medium">
                    {shorten(String(poolOf[0]?.owner))}
                  </Text>
                </Text>

                <Box
                  mt={4}
                  borderRadius="xl"
                  border="0.0625rem solid"
                  borderColor="shader.a.300"
                >
                  <Text
                    color="shader.a.500"
                    padding={4}
                    borderBottom="0.0625rem solid"
                    borderColor="shader.a.200"
                  >
                    Finish in&nbsp;
                    {(function () {
                      const endBlock = poolOf[0]?.endBlock;

                      return (
                        <DateBlock
                          end={endBlock?.isSome ? 'Expired' : 'Infinity'}
                          endBlock={
                            endBlock?.isSome ? endBlock.value.toNumber() : -1
                          }
                          sx={{
                            as: 'span',
                            color: 'shader.a.900',
                            fontWeight: 'medium',
                          }}
                        />
                      );
                    })()}
                  </Text>

                  <Box padding={6}>
                    <NumberInputMaxLength
                      heading="Amount"
                      formState={{
                        control,
                        value: 'amount',
                        isInvalid: isNull(amount),
                        isRequired: true,
                        max: 10,
                        min: 1,
                      }}
                      sx={
                        {
                          flexDirection: 'column',
                          isDisabled: isLoading,
                        } as any
                      }
                    />

                    <Text mt={4} color="shader.a.500" fontSize="sm">
                      Mint fee&nbsp;
                      <Text as="span" fontWeight="medium" color="shader.a.900">
                        {formatGAFI(price)}
                        &nbsp; GAFI
                      </Text>
                    </Text>
                  </Box>
                </Box>
              </Box>

              <Box
                padding={6}
                borderTop="0.0625rem solid"
                borderColor="shader.a.200"
              >
                <Center justifyContent="space-between">
                  <Text color="shader.a.500" fontWeight="medium">
                    Total Purchase
                  </Text>

                  <Box textAlign="right">
                    <Text
                      as="strong"
                      fontSize="xl"
                      fontWeight="semibold"
                      color="primary.a.500"
                    >
                      {sumGAFI(price, amount || 0)}
                      &nbsp; GAFI
                    </Text>

                    <Text color="shader.a.500" fontSize="sm">
                      {formatCurrency(
                        Number(sumGAFI(price, amount || 0, true))
                      )}
                    </Text>
                  </Box>
                </Center>

                <Button
                  variant="primary"
                  borderRadius="3xl"
                  type="submit"
                  fontSize="sm"
                  mt={4}
                  isLoading={isLoading}
                  _hover={{}}
                  width="full"
                >
                  Sign & Submit
                </Button>
              </Box>
            </CardBox>
          </GridItem>
        </Grid>
      ) : null}
    </>
  );
}
