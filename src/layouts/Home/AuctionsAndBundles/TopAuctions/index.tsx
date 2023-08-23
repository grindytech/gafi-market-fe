import { Box, Center, Text } from '@chakra-ui/react';

import { Grid, Mousewheel } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import React, { useRef } from 'react';

import { Link } from 'react-router-dom';

import RatioPicture from 'components/RatioPicture';

import CardBox from 'components/CardBox';
import DateBlock from 'components/DateBlock';
import GafiAmount from 'components/GafiAmount';
import useHighestBidOf from 'hooks/useHighestBidOf';
import SwiperThumbsButton from 'layouts/SwiperThumbs/SwiperThumbsButton';
import { Swiper as SwiperType } from 'swiper/types';

import useAuctionConfigOf from 'hooks/useAuctionConfigOf';

import TopAuctionsSkeleton from './TopAuctionsSkeleton';
import { Option, u128, u32 } from '@polkadot/types';

interface TopAuctionsServiceProps {
  auctionConfigOf: {
    trade_id: number;
    owner: string;
    maybePrice: Option<u128>;
    startBlock: u32;
    duration: u32;
  }[];
}

export default function TopAuctions() {
  const { auctionConfigOf, isLoading } = useAuctionConfigOf({
    key: 'topAuction',
    filter: 'entries',
  });

  if (isLoading) return <TopAuctionsSkeleton />;

  return (
    <>
      {auctionConfigOf?.length ? (
        <TopAuctionsService auctionConfigOf={auctionConfigOf} />
      ) : (
        <Center>Empty</Center>
      )}
    </>
  );
}

function TopAuctionsService({ auctionConfigOf }: TopAuctionsServiceProps) {
  const { highestBidOf } = useHighestBidOf({
    key: 'topAuction',
    filter: 'trade_id',
    arg: auctionConfigOf.map(meta => meta.trade_id),
  });

  const swiperRef = useRef<SwiperType>();

  return (
    <Box position="relative" role="group">
      <SwiperThumbsButton
        swiperRef={swiperRef}
        sx={{
          _first: { left: '-2%' },
          _last: { right: '-2%' },
        }}
      />

      <Swiper
        modules={[Mousewheel, Grid]}
        spaceBetween={32}
        slidesPerView={4}
        grid={{ rows: 2, fill: 'row' }}
        mousewheel={{ forceToAxis: true }}
        onSwiper={swiper => (swiperRef.current = swiper)}
        breakpoints={{
          0: { slidesPerView: 1, grid: { rows: 2 } },
          480: { slidesPerView: 2, grid: { rows: 2 } },
          768: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
      >
        {React.Children.toArray(
          auctionConfigOf.map(meta => {
            const currentHighestBid = highestBidOf?.find(
              data => data?.trade_id === meta?.trade_id
            );

            return (
              <SwiperSlide>
                <Link to={`/auction/${meta.trade_id}`}>
                  <CardBox variant="baseStyle" padding={0}>
                    <Box
                      padding={2}
                      borderBottom="0.0625rem solid"
                      borderColor="shader.a.200"
                    >
                      <RatioPicture
                        alt={`topAuction/${meta.trade_id}}`}
                        src={null}
                      />
                    </Box>

                    <Box
                      padding={4}
                      color="shader.a.900"
                      fontSize="sm"
                      fontWeight="medium"
                    >
                      <Center justifyContent="space-between">
                        <Text as="strong" fontWeight="inherit" fontSize="md">
                          -
                        </Text>

                        <Text color="shader.a.600">
                          ID:
                          <Text as="span" color="shader.a.900">
                            {meta.trade_id}
                          </Text>
                        </Text>
                      </Center>

                      <Center justifyContent="space-between">
                        <Box>
                          <Text color="shader.a.600">Finish:</Text>

                          <DateBlock
                            endBlock={
                              meta.duration.isEmpty
                                ? -1
                                : meta.duration.toNumber()
                            }
                            sx={{ as: 'span' }}
                          />
                        </Box>

                        <Box textAlign="right">
                          <Text color="shader.a.600">Price:</Text>

                          <GafiAmount
                            amount={
                              currentHighestBid?.bidPrice ||
                              meta.maybePrice.value.toHuman()
                            }
                            sx={{
                              sx: {
                                '&, span': {
                                  fontSize: 'inherit',
                                  fontWeight: 'inherit',
                                  color: 'inherit',
                                },
                              },
                            }}
                          />
                        </Box>
                      </Center>
                    </Box>
                  </CardBox>
                </Link>
              </SwiperSlide>
            );
          })
        )}
      </Swiper>
    </Box>
  );
}
