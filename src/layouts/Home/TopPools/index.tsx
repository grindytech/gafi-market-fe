import { Box, Center, Flex, Icon, Stack, Text } from '@chakra-ui/react';

import { Grid } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import CollectionIcon from 'public/assets/line/collection-02.svg';

import { Link } from 'react-router-dom';

import RatioPicture from 'components/RatioPicture';

import { convertHex, formatGAFI } from 'utils/utils';
import DateBlock from 'components/DateBlock';

import TopPoolsSkeleton from './TopPoolsSkeleton';

import { useQuery } from '@tanstack/react-query';
import axiosSwagger from 'axios/axios.swagger';
import useMetaNFT from 'hooks/useMetaNFT';

export default function TopPools() {
  const { data, isLoading } = useQuery({
    queryKey: ['home_topPool'],
    queryFn: async () => {
      return await axiosSwagger.poolSearch({
        body: { size: 5 },
      });
    },
  });

  const { metaNFT } = useMetaNFT({
    key: 'home_topPool',
    filter: 'collection_id',
    arg: data?.data
      .map(({ loot_table }) => loot_table[0].nft)
      .filter(meta => meta?.collection && meta?.item)
      .map(({ collection, item }) => ({
        collection_id: Number(collection),
        nft_id: Number(item),
      })),
    async: isLoading,
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

        {data?.data?.length ? (
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
            {data.data.map((meta, index) => (
              <SwiperSlide key={meta.pool_id}>
                <Box
                  borderRadius="xl"
                  border="0.0625rem solid"
                  borderColor="#52525B"
                  bg="#3F3F46"
                >
                  <Link to={`/pool/${meta.pool_id}`}>
                    <RatioPicture src={metaNFT?.[index]?.image || null} />

                    <Stack spacing={3} padding={4} pt={6}>
                      <Center
                        justifyContent="space-between"
                        fontWeight="medium"
                        color="white"
                      >
                        <Text>{metaNFT?.[index]?.name}</Text>

                        <Text fontSize="sm">ID: {meta.pool_id}</Text>
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
                          <Text as="span">
                            {formatGAFI(meta.minting_fee)}&nbsp; GAFI
                          </Text>
                        </Box>

                        <Box textAlign="right">
                          <Text fontWeight="normal" color="shader.a.500">
                            Type:
                          </Text>
                          <Text as="span">{meta.type_pool}</Text>
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
                          end={meta.end_at ? 'Expired' : 'Infinity'}
                          endBlock={meta.end_at}
                        />
                      </Box>
                    </Stack>
                  </Link>
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : isLoading ? null : (
          <Center color="white">Empty</Center>
        )}
      </Box>
    </Box>
  );
}
