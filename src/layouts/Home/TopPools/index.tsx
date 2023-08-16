import { Box, Center, Flex, Icon, Stack, Text } from '@chakra-ui/react';

import { Mousewheel } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import CollectionIcon from 'public/assets/line/collection-02.svg';

import { Link } from 'react-router-dom';

import RatioPicture from 'components/RatioPicture';
import CardBox from 'components/CardBox';

import { formatGAFI } from 'utils/utils';
import DateBlock from 'components/DateBlock';
import SwiperThumbsButton from 'layouts/SwiperThumbs/SwiperThumbsButton';
import { Swiper as SwiperType } from 'swiper/types';
import { useRef } from 'react';
import usePoolOf from 'hooks/usePoolOf';

export default function TopPools() {
  const { poolOf } = usePoolOf({
    key: 'topPools',
    filter: 'entries',
  });

  const swiperRef = useRef<SwiperType>();

  return (
    <Stack spacing={6}>
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
          Top Pools
        </Text>
      </Flex>

      {poolOf?.length ? (
        <Box role="group" position="relative">
          {poolOf.length >= 5 && (
            <SwiperThumbsButton
              swiperRef={swiperRef}
              sx={{
                _first: { left: '-2.5%' },
                _last: { right: '-2.5%' },
              }}
            />
          )}

          <Swiper
            loop={true}
            modules={[Mousewheel]}
            spaceBetween={32}
            slidesPerView={4}
            mousewheel={{ forceToAxis: true }}
            onSwiper={swiper => (swiperRef.current = swiper)}
            breakpoints={{
              0: { slidesPerView: 1 },
              480: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
          >
            {poolOf.map(meta => (
              <SwiperSlide key={`${meta?.pool_id}`}>
                <CardBox variant="baseStyle" padding={0}>
                  <Link to={`/pool/${meta?.pool_id}`}>
                    <Box
                      padding={2}
                      borderBottom="0.0625rem solid"
                      borderColor="shader.a.200"
                    >
                      <RatioPicture src={null} />
                    </Box>

                    <Box padding={4}>
                      <Center justifyContent="space-between">
                        <Text color="shader.a.900" fontWeight="medium">
                          {meta?.poolType}
                        </Text>

                        <Text
                          fontSize="sm"
                          color="shader.a.600"
                          fontWeight="medium"
                        >
                          ID:&nbsp;
                          <Text as="span" color="shader.a.900">
                            {meta?.pool_id}
                          </Text>
                        </Text>
                      </Center>

                      <Center
                        justifyContent="space-between"
                        fontSize="sm"
                        fontWeight="medium"
                        color="shader.a.900"
                      >
                        <Text display="flex" flexDirection="column">
                          Price:
                          <Text as="span" color="shader.a.900">
                            {formatGAFI(meta?.price)} GAFI
                          </Text>
                        </Text>

                        <Text
                          display="flex"
                          flexDirection="column"
                          textAlign="right"
                        >
                          End at:
                          <DateBlock
                            end={meta?.endBlock.isSome ? 'Expired' : 'Infinity'}
                            endBlock={
                              meta?.endBlock.isSome
                                ? meta.endBlock.value.toNumber()
                                : -1
                            }
                            sx={{ as: 'span', color: 'shader.a.900' }}
                          />
                        </Text>
                      </Center>
                    </Box>
                  </Link>
                </CardBox>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      ) : (
        <Center>Empty</Center>
      )}
    </Stack>
  );
}
