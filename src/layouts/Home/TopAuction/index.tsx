import {
  Box,
  Center,
  Grid as GridChakra,
  Flex,
  Icon,
  Text,
} from '@chakra-ui/react';
import useAuctionConfigOf from 'hooks/useAuctionConfigOf';
import useHighestBidOf from 'hooks/useHighestBidOf';
import { Swiper, SwiperSlide } from 'swiper/react';

import useBundleOf from 'hooks/useBundleOf';
import RatioPicture from 'components/RatioPicture';
import useMetaNFT from 'hooks/useMetaNFT';
import DateBlock from 'components/DateBlock';
import { cloundinary_link } from 'axios/cloudinary_axios';
import React from 'react';
import TopAuctionSkeleton from './TopAuctionSkeleton';
import { Link } from 'react-router-dom';
import HandIcon from 'public/assets/line/hand.svg';

export default () => {
  const { auctionConfigOf, isLoading } = useAuctionConfigOf({
    key: `home_TopAuction`,
    filter: 'entries',
  });

  const { bundleOf, isLoading: bundleLoading } = useBundleOf({
    key: `home_TopAuction/isLoading=${isLoading}`,
    filter: 'trade_id',
    arg: auctionConfigOf?.map(({ trade_id }) => trade_id),
  });

  const { highestBidOf } = useHighestBidOf({
    key: `home_TopAuction/isLoading=${isLoading}`,
    filter: 'trade_id',
    arg: auctionConfigOf?.map(meta => meta.trade_id),
  });

  const { metaNFT } = useMetaNFT({
    key: `home_TopAuction/isLoading=[${bundleLoading}, ${isLoading}]`,
    filter: 'collection_id',
    arg: bundleOf?.map(({ collection_id, nft_id }) => ({
      collection_id,
      nft_id,
    })),
  });

  return (
    <Box mt={6}>
      <Flex gap={3} alignItems="center">
        <Icon as={HandIcon} width={6} height={6} color="#B98DFE" />

        <Text color="shader.a.900" fontWeight="semibold" fontSize="xl">
          Top Auctions
        </Text>
      </Flex>

      <Box mt={4}>
        {isLoading && <TopAuctionSkeleton />}

        {bundleOf?.length && auctionConfigOf?.length ? (
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
                borderColor: '#3F3F46',
              },
            }}
          >
            {auctionConfigOf.map(({ duration, maybePrice, trade_id }) => {
              const HighestBid = highestBidOf?.find(
                meta => meta.trade_id === trade_id
              );

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
                              <Box
                                bg="#27272A"
                                borderRadius="xl"
                                border="0.0625rem solid #3F3F46"
                                boxShadow="0px 0px 20px 0px rgba(0, 0, 0, 0.10)"
                              >
                                <Link to={`/auction/${trade_id}`}>
                                  <RatioPicture
                                    src={
                                      currentMetaNFT?.avatar
                                        ? cloundinary_link(
                                            currentMetaNFT.avatar
                                          )
                                        : null
                                    }
                                  />

                                  <Box bg="#3F3F46" padding={4} pt={6}>
                                    <Center
                                      justifyContent="space-between"
                                      fontWeight="medium"
                                      color="white"
                                    >
                                      <Text>
                                        {currentMetaNFT?.title || 'unknown'}
                                      </Text>

                                      <Text fontSize="sm">ID: {nft_id}</Text>
                                    </Center>

                                    <Center
                                      justifyContent="space-between"
                                      fontSize="sm"
                                    >
                                      <Text color="#A1A1AA">Highest bid</Text>

                                      <Text color="white" fontWeight="medium">
                                        {HighestBid?.bidPrice.toHuman() ||
                                          maybePrice.value.toHuman() ||
                                          0}
                                        &nbsp; GAFI
                                      </Text>
                                    </Center>

                                    <Text
                                      color="#E4E4E7"
                                      fontSize="xs"
                                      mt={0.5}
                                    >
                                      Start in:&nbsp;
                                      <DateBlock
                                        endBlock={
                                          duration.isEmpty
                                            ? -1
                                            : duration.toNumber()
                                        }
                                        end={
                                          duration.isEmpty
                                            ? 'Infinity'
                                            : 'Expired'
                                        }
                                        sx={{
                                          as: 'span',
                                          fontWeight: 'medium',
                                          color: 'white',
                                        }}
                                      />
                                    </Text>
                                  </Box>
                                </Link>
                              </Box>
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
