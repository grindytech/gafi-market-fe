import { Box, Center, Flex, Text } from '@chakra-ui/react';
import useMetaCollection from 'hooks/useMetaCollection';
import useMetaNFT from 'hooks/useMetaNFT';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper/types';
import { Thumbs } from 'swiper';
import RatioPicture from 'components/RatioPicture';

interface SwiperLayoutItems {
  queryKey: string;
  setThumbsSwiper: React.Dispatch<SwiperType>;
  bundleOf: {
    collection_id: number;
    nft_id: number;
    amount: number;
  }[];
}

export default ({ queryKey, setThumbsSwiper, bundleOf }: SwiperLayoutItems) => {
  const { MetaCollection } = useMetaCollection({
    key: queryKey,
    filter: 'collection_id',
    arg: bundleOf.map(({ collection_id }) => collection_id),
  });

  const { metaNFT } = useMetaNFT({
    key: queryKey,
    filter: 'collection_id',
    arg: bundleOf.map(({ collection_id, nft_id }) => ({
      collection_id,
      nft_id,
    })),
  });

  return (
    <Box>
      <Text as="span" fontSize="sm" color="shader.a.600" mb={4}>
        {bundleOf.length} Items
      </Text>

      <Box
        sx={{
          '.swiper-slide-thumb-active': {
            '> div': { borderColor: 'primary.a.500' },
          },
        }}
      >
        <Swiper
          modules={[Thumbs]}
          slidesPerView={bundleOf.length}
          onSwiper={setThumbsSwiper}
          direction="vertical"
        >
          {React.Children.toArray(
            bundleOf.map(({ amount, collection_id, nft_id }) => {
              const currentMetaCollection = MetaCollection?.find(
                meta => meta?.collection_id === collection_id
              );

              const currentMetaNFT = metaNFT?.find(
                meta =>
                  meta?.collection_id === collection_id &&
                  meta.nft_id === nft_id
              );

              return (
                <SwiperSlide>
                  <Center
                    justifyContent="space-between"
                    wordBreak="break-word"
                    borderRadius="xl"
                    gap={4}
                    padding={4}
                    mt={2}
                    border="0.0625rem solid"
                    borderColor="shader.a.300"
                    cursor="pointer"
                  >
                    <Flex gap={4}>
                      <RatioPicture
                        src={currentMetaNFT?.image || null}
                        sx={{ width: 12 }}
                      />

                      <Box>
                        <Text
                          as="strong"
                          fontWeight="medium"
                          color="shader.a.500"
                          fontSize="sm"
                        >
                          {currentMetaCollection?.name}
                        </Text>

                        <Text fontWeight="medium" mt={1.5}>
                          {currentMetaNFT?.name}&nbsp;
                          <Text
                            as="span"
                            fontSize="sm"
                            color="shader.a.700"
                            fontWeight="normal"
                          >
                            ID: {nft_id}
                          </Text>
                        </Text>
                      </Box>
                    </Flex>

                    <Text as="span" fontWeight="medium">
                      x{amount}
                    </Text>
                  </Center>
                </SwiperSlide>
              );
            })
          )}
        </Swiper>
      </Box>
    </Box>
  );
};
