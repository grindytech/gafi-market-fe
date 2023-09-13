import { Box, Center, Flex, Icon, Stack, Text } from '@chakra-ui/react';

import { Grid } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import CollectionIcon from 'public/assets/line/collection-02.svg';

import { Link } from 'react-router-dom';

import RatioPicture from 'components/RatioPicture';

import { convertHex, formatGAFI } from 'utils/utils';
import DateBlock from 'components/DateBlock';

import usePoolOf from 'hooks/usePoolOf';
import TopPoolsSkeleton from './TopPoolsSkeleton';

import useMetaPool from 'hooks/useMetaPool';

import useLootTableOf from 'hooks/useLootTableOf';
import useMetaNFT from 'hooks/useMetaNFT';
import { cloundinary_link } from 'axios/cloudinary_axios';

export default function TopPools() {
  const { poolOf, isLoading } = usePoolOf({
    key: 'home_TopPools',
    filter: 'entries',
  });

  const { lootTableOf, isLoading: lootLoading } = useLootTableOf({
    key: `home_TopPools/isLoading=${isLoading}`,
    filter: 'pool_id',
    arg: poolOf?.map(({ pool_id }) => pool_id),
  });

  const { metaNFT } = useMetaNFT({
    key: `home_TopPools/isLoading=[${isLoading}, ${lootLoading}]`,
    filter: 'collection_id',
    arg: lootTableOf
      ?.filter(meta => !!meta.maybeNfT)
      .map(({ maybeNfT }) => ({
        collection_id: maybeNfT?.collection_id as number,
        nft_id: maybeNfT?.nft_id as number,
      })),
  });

  const { MetaPool } = useMetaPool({
    key: 'home_TopPools',
    filter: 'entries',
  });

  return (
    <Box mt={6} bg="#27272A" padding={6} borderRadius="2xl">
      <Flex gap={2} alignItems="center">
        <Center
          bg={convertHex('#FFC966', 0.1)}
          borderRadius="3xl"
          padding={2}
          color="#FFC966"
        >
          <Icon as={CollectionIcon} width={4} height={4} />
        </Center>

        <Text color="white" fontWeight="semibold" fontSize="xl">
          Top Pools
        </Text>
      </Flex>

      <Box mt={6}>
        {isLoading && <TopPoolsSkeleton />}

        {poolOf?.length ? (
          <Swiper
            spaceBetween={20}
            modules={[Grid]}
            breakpoints={{
              0: {
                slidesPerView: 1,
                grid: { fill: 'row', rows: 2 },
              },
              768: {
                slidesPerView: 2,
                grid: { fill: 'row', rows: 2 },
              },
              992: {
                slidesPerView: 3,
                grid: { fill: 'row', rows: 3 },
              },
              1280: {
                slidesPerView: 5,
                grid: { fill: 'row', rows: 3 },
              },
            }}
          >
            {poolOf.map(({ endBlock, pool_id, price, poolType }, index) => {
              const currentMetaPool = MetaPool?.find(
                meta => meta.pool_id === pool_id
              );

              const currentMetaNFT = lootTableOf
                ?.map(meta => {
                  if (meta.maybeNfT) {
                    const find = metaNFT?.find(
                      ({ nft_id, collection_id }) =>
                        collection_id === meta.maybeNfT?.collection_id &&
                        nft_id === meta.maybeNfT.nft_id
                    );

                    if (find) {
                      return {
                        pool_id: meta.pool_id,
                        title: find?.title,
                        avatar: find?.avatar,
                      };
                    }
                  }
                })
                .find(meta => meta?.pool_id === pool_id);

              if (index < 5) {
                return (
                  <SwiperSlide key={pool_id}>
                    <Box
                      borderRadius="xl"
                      border="0.0625rem solid"
                      borderColor="#52525B"
                      bg="#3F3F46"
                    >
                      <Link to={`/pool/${pool_id}`}>
                        <RatioPicture
                          src={
                            currentMetaNFT?.avatar
                              ? cloundinary_link(currentMetaNFT.avatar)
                              : null
                          }
                        />

                        <Stack spacing={3} padding={4} pt={6}>
                          <Center
                            justifyContent="space-between"
                            fontWeight="medium"
                            color="white"
                          >
                            <Text>{currentMetaPool?.title || 'unknown'}</Text>

                            <Text fontSize="sm">ID: {pool_id}</Text>
                          </Center>

                          <Center
                            justifyContent="space-between"
                            fontWeight="medium"
                            color="white"
                            fontSize="sm"
                          >
                            <Box>
                              <Text fontWeight="normal" color="shader.a.500">
                                Mint fee:
                              </Text>
                              <Text as="span">{formatGAFI(price)} GAFI</Text>
                            </Box>

                            <Box textAlign="right">
                              <Text fontWeight="normal" color="shader.a.500">
                                Type:
                              </Text>
                              <Text as="span">{poolType}</Text>
                            </Box>
                          </Center>

                          <Box
                            width="fit-content"
                            fontSize="xs"
                            fontWeight="medium"
                            borderRadius="lg"
                            bg={convertHex('#ffffff', 0.1)}
                            color="#CED1D7"
                            px={2}
                          >
                            <DateBlock
                              endBlock={
                                endBlock.isSome ? endBlock.value.toNumber() : -1
                              }
                              end={endBlock.isSome ? 'Expired' : 'Infinity'}
                            />
                          </Box>
                        </Stack>
                      </Link>
                    </Box>
                  </SwiperSlide>
                );
              }
            })}
          </Swiper>
        ) : isLoading ? null : (
          <Center color="white">Empty</Center>
        )}
      </Box>
    </Box>
  );
}
