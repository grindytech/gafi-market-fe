import { Box, Center, Text } from '@chakra-ui/react';

import { Grid, Mousewheel } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import { useRef } from 'react';

import { Link } from 'react-router-dom';

import RatioPicture from 'components/RatioPicture';

import CardBox from 'components/CardBox';
import DateBlock from 'components/DateBlock';
import GafiAmount from 'components/GafiAmount';
import SwiperThumbsButton from 'layouts/SwiperThumbs/SwiperThumbsButton';
import { Swiper as SwiperType } from 'swiper/types';
import TopBundlesSkeleton from './TopBundlesSkeleton';
import useBundleOf from 'hooks/useBundleOf';
import useTradeConfigOf from 'hooks/useTradeConfigOf';

interface TopBundlesServiceProps {
  bundleOf: {
    trade_id: number;
    collection_id: number;
    nft_id: number;
    amount: number;
  }[];
}

export default function TopBundles() {
  const { bundleOf, isLoading } = useBundleOf({
    key: 'topBundle',
    filter: 'entries',
  });

  if (isLoading) return <TopBundlesSkeleton />;

  return (
    <>
      {bundleOf?.length ? (
        <TopBundlesService bundleOf={bundleOf} />
      ) : (
        <Center>Empty</Center>
      )}
    </>
  );
}

function TopBundlesService({ bundleOf }: TopBundlesServiceProps) {
  const { tradeConfigOf } = useTradeConfigOf({
    key: 'topBundle',
    filter: 'trade_id',
    arg: bundleOf.map(meta => meta.trade_id),
  });

  const getOnlyBundle = tradeConfigOf
    ?.map(meta => {
      if (meta?.trade.isBundle) {
        return {
          trade_id: meta.trade_id,
          maybePrice: meta.maybePrice,
          owner: meta.owner,
          endBlock: meta.endBlock,
        };
      }
    })
    .filter((meta): meta is NonNullable<typeof meta> => !!meta);

  const swiperRef = useRef<SwiperType>();

  return (
    <>
      {getOnlyBundle?.length ? (
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
            {getOnlyBundle.map(meta => {
              return (
                <SwiperSlide key={meta.trade_id}>
                  <Link to={`/bundle/${meta.trade_id}`}>
                    <CardBox variant="baseStyle" padding={0}>
                      <Box
                        padding={2}
                        borderBottom="0.0625rem solid"
                        borderColor="shader.a.200"
                      >
                        <RatioPicture
                          alt={`topBundle/${meta.trade_id}`}
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
                                meta.endBlock.isSome
                                  ? meta.endBlock.value.toNumber()
                                  : -1
                              }
                              sx={{ as: 'span' }}
                            />
                          </Box>

                          <Box textAlign="right">
                            <Text color="shader.a.600">Price:</Text>

                            <GafiAmount
                              amount={
                                meta.maybePrice.isSome
                                  ? meta.maybePrice.value.toHuman()
                                  : 0
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
            })}
          </Swiper>
        </Box>
      ) : null}
    </>
  );
}
