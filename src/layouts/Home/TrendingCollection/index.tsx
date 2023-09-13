import { Box, Center, Flex, HStack, Icon, Text } from '@chakra-ui/react';

import CollectionIcon from 'public/assets/line/collection-02.svg';

import { cloundinary_link } from 'axios/cloudinary_axios';
import { Link } from 'react-router-dom';
import useMetaCollection from 'hooks/useMetaCollection';
import RatioPicture from 'components/RatioPicture';
import TrendingCollectionLoading from './TrendingCollectionLoading';

import useNFTsCollection from 'hooks/useNFTsCollection';

import { Swiper, SwiperSlide } from 'swiper/react';

import { Grid } from 'swiper';

export default function TrendingCollection() {
  const { NFTsCollection, isLoading } = useNFTsCollection({
    key: 'trendingCollection',
    filter: 'entries',
  });

  const { MetaCollection } = useMetaCollection({
    key: 'trendingCollection',
    filter: 'entries',
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

        {NFTsCollection?.length ? (
          <Box
            sx={{
              '.swiper-wrapper': { rowGap: 2 },
              '.swiper-slide': { mt: '0!' },
            }}
          >
            <Swiper
              spaceBetween={24}
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
              {NFTsCollection.map(({ collection_id }, index) => {
                const currentMetaCollection = MetaCollection?.find(
                  meta => meta?.collection_id === collection_id
                );

                if (index <= 11) {
                  return (
                    <SwiperSlide key={collection_id}>
                      <HStack
                        as={Link}
                        spacing={4}
                        to={`/collection/${collection_id}`}
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
                            alt={`trendingCollection-${collection_id}`}
                            src={
                              currentMetaCollection?.avatar
                                ? cloundinary_link(currentMetaCollection.avatar)
                                : null
                            }
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
                            {currentMetaCollection?.title || 'unknown'}
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
                  );
                }
              })}
            </Swiper>
          </Box>
        ) : isLoading ? null : (
          <Center>Empty</Center>
        )}
      </Box>
    </Box>
  );
}
