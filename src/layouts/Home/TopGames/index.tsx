import { Box, Center, Flex, Icon, Text } from '@chakra-ui/react';
import RatioPicture from 'components/RatioPicture';
import { colors } from 'theme/theme';
import { convertHex } from 'utils/utils';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Grid } from 'swiper';
import TopGamesSkeleton from './TopGamesSkeleton';
import JoyStickIcon from 'public/assets/line/joystick.svg';
import axiosSwagger from 'axios/axios.swagger';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

export default () => {
  const { data, isLoading } = useQuery({
    queryKey: ['home_topGames'],
    queryFn: async () => {
      return axiosSwagger.gameSearch();
    },
  });

  return (
    <Box mt={6}>
      <Flex gap={3} alignItems="center">
        <Icon as={JoyStickIcon} width={6} height={6} color="second.green" />

        <Text color="shader.a.900" fontWeight="semibold" fontSize="xl">
          Top Games
        </Text>
      </Flex>

      <Box mt={4}>
        {isLoading && <TopGamesSkeleton />}

        {data?.data.length ? (
          <Box
            sx={{
              '.swiper-wrapper': { rowGap: 4 },
              '.swiper-slide': { mt: '0!' },
            }}
          >
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
              {data.data.map(meta => (
                <SwiperSlide key={meta.id}>
                  <Box as={Link} to={`game/${meta.game_id}`}>
                    <Box
                      bg="white"
                      borderRadius="xl"
                      border="0.0625rem solid"
                      borderColor="shader.a.400"
                      overflow="hidden"
                    >
                      <Box position="relative">
                        <RatioPicture src={meta.logo || null} />

                        <Box
                          position="absolute"
                          inset="auto auto 0 0"
                          transform="translate(25%, 25%)"
                        >
                          <RatioPicture
                            src={meta.logo || null}
                            sx={{
                              width: 14,
                              height: 14,
                              borderRadius: '0.625rem',
                              border: '0.1875rem solid white',
                            }}
                          />
                        </Box>
                      </Box>

                      <Box px={4} py={6}>
                        <Flex
                          justifyContent="space-between"
                          fontWeight="medium"
                        >
                          <Text noOfLines={1} color="shader.a.900">
                            {meta.name}
                          </Text>

                          <Text whiteSpace="pre" fontSize="sm">
                            ID: {meta.game_id}
                          </Text>
                        </Flex>

                        <Text
                          display="inline-block"
                          py={1}
                          px={2}
                          borderRadius="lg"
                          bg={convertHex(colors.primary.a[400], 0.15)}
                          fontSize="xs"
                          color="primary.a.300"
                        >
                          {meta.category}
                        </Text>
                      </Box>
                    </Box>
                  </Box>
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
};
