import { Box, Center, Flex, HStack, Icon, Text } from '@chakra-ui/react';

import CollectionIcon from 'public/assets/line/collection-02.svg';

import { Link } from 'react-router-dom';

import RatioPicture from 'components/RatioPicture';
import TrendingCollectionLoading from './TrendingCollectionLoading';

import { Swiper, SwiperSlide } from 'swiper/react';

import { Grid } from 'swiper';
import { useQuery } from '@tanstack/react-query';
import axiosSwagger from 'axios/axios.swagger';

export default function TrendingCollection() {
  const { data, isLoading } = useQuery({
    queryKey: ['home_trendingCollection'],
    queryFn: async () => {
      return axiosSwagger.collectionSearch();
    },
  });

  return (
    <Box mt={6}>
      <Flex gap={3} alignItems="center">
        <Icon
          as={CollectionIcon}
          width={6}
          height={6}
          sx={{
            path: { stroke: 'url(#CollectionLinear06)' },
          }}
        />

        <Text color="shader.a.900" fontWeight="semibold" fontSize="xl">
          Trending collections
        </Text>
      </Flex>

      <Box mt={4}>
        {isLoading && <TrendingCollectionLoading />}

        {data?.data?.length ? (
          <Box
            sx={{
              '.swiper-slide': { mt: '0!' },
            }}
          >
            <Swiper
              spaceBetween={32}
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
                  slidesPerView: 4,
                  grid: { fill: 'row', rows: 3 },
                },
              }}
            >
              {data.data.map(meta => (
                <SwiperSlide key={meta.id}>
                  <HStack
                    as={Link}
                    spacing={4}
                    to={`/collection/${meta.collection_id}`}
                    border="0.0625rem solid transparent"
                    transitionDuration="ultra-slow"
                    borderRadius="xl"
                    padding={4}
                    _hover={{
                      borderColor: 'shader.a.400',
                      bg: 'shader.a.200',
                    }}
                  >
                    <Box>
                      <RatioPicture
                        alt={meta.collection_id}
                        src={meta.logo}
                        sx={{ width: 16, height: 16 }}
                      />
                    </Box>

                    <Box>
                      <Text
                        fontSize="lg"
                        fontWeight="medium"
                        color="shader.a.900"
                        noOfLines={1}
                      >
                        {meta.name}
                      </Text>

                      <Flex
                        mt={0.5}
                        gap={{ base: 2, md: 6 }}
                        fontSize="sm"
                        color="shader.a.600"
                      >
                        <Box>
                          <Text>Floor Price:&nbsp;</Text>

                          <Text color="shader.a.900" fontWeight="medium">
                            0.00 GAFI
                          </Text>
                        </Box>

                        <Box>
                          <Text>Vol:&nbsp;</Text>

                          <Text color="shader.a.900" fontWeight="medium">
                            0.00 GAFI
                          </Text>
                        </Box>
                      </Flex>
                    </Box>
                  </HStack>
                </SwiperSlide>
              ))}
            </Swiper>
          </Box>
        ) : isLoading ? null : (
          <Center>Empty</Center>
        )}
      </Box>
    </Box>
  );
}
