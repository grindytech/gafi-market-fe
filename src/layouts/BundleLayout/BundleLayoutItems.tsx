import { Box, Center, Flex, Text } from '@chakra-ui/react';
import { cloundinary_link } from 'axios/cloudinary_axios';
import RatioPicture from 'components/RatioPicture';
import useMetaCollection from 'hooks/useMetaCollection';
import useMetaNFT from 'hooks/useMetaNFT';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper/types';

import { Thumbs } from 'swiper';
import CardBox from 'components/CardBox';

interface BundleLayoutItemsProps {
  queryKey: string;
  bundleOf: {
    trade_id: number;
    collection_id: number;
    nft_id: number;
    amount: number;
  }[];
  setThumbsSwiper: React.Dispatch<SwiperType>;
  heading: string;
}

export default function BundleLayoutItems({
  queryKey,
  bundleOf,
  setThumbsSwiper,
  heading,
}: BundleLayoutItemsProps) {
  const { MetaCollection } = useMetaCollection({
    key: queryKey,
    filter: bundleOf.map(({ collection_id }) => collection_id),
  });

  const { metaNFT } = useMetaNFT({
    key: queryKey,
    filter: bundleOf.map(({ collection_id, nft_id }) => ({
      collection_id,
      nft_id,
    })),
  });

  return (
    <CardBox variant="baseStyle" padding={0} color="shader.a.900">
      <Text
        py={5}
        px={6}
        fontWeight="medium"
        borderBottom="0.0625rem solid"
        borderColor="shader.a.200"
      >
        {heading}&nbsp;
        <Text as="span" color="shader.a.500" fontSize="sm">
          {bundleOf.length} Items
        </Text>
      </Text>

      <Box
        padding={6}
        pt={4}
        sx={{
          '.swiper-slide-thumb-active': {
            '> div': { borderColor: 'primary.a.500' },
          },
        }}
      >
        <Swiper
          modules={[Thumbs]}
          slidesPerView={bundleOf.length}
          mousewheel={{ forceToAxis: true }}
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
                    mt={2}
                    justifyContent="space-between"
                    wordBreak="break-word"
                    borderRadius="xl"
                    gap={4}
                    padding={4}
                    border="0.0625rem solid"
                    borderColor="shader.a.300"
                  >
                    <Flex gap={4}>
                      <RatioPicture
                        src={
                          currentMetaNFT?.image
                            ? cloundinary_link(currentMetaNFT.image)
                            : null
                        }
                        sx={{ width: 12 }}
                      />

                      <Box>
                        <Text
                          as="strong"
                          fontWeight="medium"
                          color="shader.a.500"
                          fontSize="sm"
                        >
                          {currentMetaCollection?.title || '-'}
                        </Text>

                        <Text fontWeight="medium">
                          {currentMetaNFT?.title || '-'}&nbsp;
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
    </CardBox>
  );
}
