import { Box, Center, Flex, Icon, Text } from '@chakra-ui/react';
import RatioPicture from 'components/RatioPicture';
import { colors } from 'theme/theme';
import { convertHex } from 'utils/utils';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Grid } from 'swiper';
import useGame, { GamesFieldProps } from 'hooks/useGame';
// import { Link } from 'react-router-dom';
import useMetaGame from 'hooks/useMetaGame';
import { cloundinary_link } from 'axios/cloudinary_axios';
import TopGamesSkeleton from './TopGamesSkeleton';
import JoyStickIcon from 'public/assets/line/joystick.svg';

export default () => {
  const { Games, isLoading } = useGame({
    key: 'home_topGames',
    filter: 'entries',
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

        {Games?.length ? (
          <TopGamesService Games={Games} />
        ) : isLoading ? null : (
          <Center>Empty</Center>
        )}
      </Box>
    </Box>
  );
};

function TopGamesService({ Games }: { Games: GamesFieldProps[] }) {
  const { MetaGame } = useMetaGame({
    key: `home_topGames`,
    filter: `game_id`,
    arg: Games.map(({ game_id }) => game_id),
  });

  return (
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
        {Games.map(({ game_id }, index) => {
          const currentMetaGame = MetaGame?.find(
            meta => meta.game_id === game_id
          );

          if (index <= 11) {
            return (
              <SwiperSlide key={game_id}>
                <Box
                  // as={Link}
                  // to={`/game/${game_id}`}
                  cursor="pointer"
                >
                  <Box
                    bg="white"
                    borderRadius="xl"
                    border="0.0625rem solid"
                    borderColor="shader.a.400"
                    overflow="hidden"
                  >
                    <Box position="relative">
                      <RatioPicture
                        src={
                          currentMetaGame?.avatar
                            ? cloundinary_link(currentMetaGame.avatar)
                            : null
                        }
                      />

                      <Box
                        position="absolute"
                        inset="auto auto 0 0"
                        transform="translate(25%, 25%)"
                      >
                        <RatioPicture
                          src={
                            currentMetaGame?.avatar
                              ? cloundinary_link(currentMetaGame.avatar)
                              : null
                          }
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
                      <Flex justifyContent="space-between" fontWeight="medium">
                        <Text noOfLines={1} color="shader.a.900">
                          {currentMetaGame?.title || 'unknown'}
                        </Text>

                        <Text whiteSpace="pre" fontSize="sm">
                          ID: {game_id}
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
                        {currentMetaGame?.categories || 'unknown'}
                      </Text>
                    </Box>
                  </Box>
                </Box>
              </SwiperSlide>
            );
          }
        })}
      </Swiper>
    </Box>
  );
}
