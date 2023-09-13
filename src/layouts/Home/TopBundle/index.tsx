import {
  Box,
  Center,
  Grid as GridChakra,
  Flex,
  Icon,
  Text,
} from '@chakra-ui/react';

import { Swiper, SwiperSlide } from 'swiper/react';

import useBundleOf from 'hooks/useBundleOf';
import RatioPicture from 'components/RatioPicture';
import useMetaNFT from 'hooks/useMetaNFT';
import { cloundinary_link } from 'axios/cloudinary_axios';
import React from 'react';
import useTradeConfigOf from 'hooks/useTradeConfigOf';
import { Link } from 'react-router-dom';
import TopBundleSkeleton from './TopBundleSkeleton';
import NFTsIcon from 'public/assets/line/nfts.svg';

export default () => {
  const { tradeConfigOf, isLoading } = useTradeConfigOf({
    key: `home_TopBundle`,
    filter: 'entries',
  });

  const { bundleOf, isLoading: bundleLoading } = useBundleOf({
    key: `home_TopBundle/isLoading=${isLoading}`,
    filter: 'trade_id',
    arg: tradeConfigOf?.map(({ trade_id }) => trade_id),
  });

  const { metaNFT } = useMetaNFT({
    key: `home_TopBundle/isLoading=[${bundleLoading}, ${isLoading}]`,
    filter: 'collection_id',
    arg: bundleOf?.map(({ collection_id, nft_id }) => ({
      collection_id,
      nft_id,
    })),
  });

  return (
    <Box mt={6}>
      <Flex gap={3} alignItems="center">
        <Icon as={NFTsIcon} width={6} height={6} color="primary.a.400" />

        <Text color="shader.a.900" fontWeight="semibold" fontSize="xl">
          Top Bundle
        </Text>
      </Flex>

      <Box mt={4}>
        {isLoading && <TopBundleSkeleton />}

        {bundleOf?.length && tradeConfigOf?.length ? (
          <GridChakra
            gridTemplateColumns={{
              sm: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
              xl: 'repeat(5, 1fr)',
            }}
            overflowX="auto"
            gap={5}
            sx={{
              '.swiper-initialized': {
                display: 'inline-flex',
                mx: '0!',
                overflow: 'hidden',
                borderRadius: 'xl',
                border: '0.0625rem solid',
                borderColor: 'shader.a.400',
              },
            }}
          >
            {tradeConfigOf.map(({ maybePrice, trade_id }) => {
              return (
                <Swiper loop={true} spaceBetween={32} key={trade_id}>
                  {React.Children.toArray(
                    bundleOf.map(
                      ({ collection_id, nft_id, trade_id: tradeBundle }) => {
                        const currentMetaNFT = metaNFT?.find(
                          meta =>
                            meta.collection_id === collection_id &&
                            meta.nft_id === nft_id
                        );

                        if (tradeBundle === trade_id) {
                          return (
                            <SwiperSlide>
                              <Link to={`/bundle/${trade_id}`}>
                                <RatioPicture
                                  src={
                                    currentMetaNFT?.avatar
                                      ? cloundinary_link(currentMetaNFT.avatar)
                                      : null
                                  }
                                />

                                <Box bg="shader.a.100" padding={4} pt={6}>
                                  <Center
                                    justifyContent="space-between"
                                    fontWeight="medium"
                                    color="shader.a.900"
                                  >
                                    <Text>
                                      {currentMetaNFT?.title || 'unknown'}
                                    </Text>

                                    <Text fontSize="sm">ID: {nft_id}</Text>
                                  </Center>

                                  <Center
                                    mt={1}
                                    justifyContent="space-between"
                                    fontSize="sm"
                                  >
                                    <Text color="shader.a.900">Price:</Text>

                                    <Text
                                      color="shader.a.500"
                                      fontWeight="medium"
                                    >
                                      {maybePrice.value.toHuman() || 0}
                                      &nbsp; GAFI
                                    </Text>
                                  </Center>
                                </Box>
                              </Link>
                            </SwiperSlide>
                          );
                        }
                      }
                    )
                  )}
                </Swiper>
              );
            })}
          </GridChakra>
        ) : isLoading ? null : (
          <Center>Empty</Center>
        )}
      </Box>
    </Box>
  );
};
