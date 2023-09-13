import {
  Box,
  Center,
  Heading,
  Icon,
  Spinner,
  Text,
  Link as LinkChakra,
} from '@chakra-ui/react';

import { useAppSelector } from 'hooks/useRedux';
import { useParams } from 'react-router-dom';
import { shorten } from 'utils/utils';

import RatioPicture from 'components/RatioPicture';

import { useQuery } from '@tanstack/react-query';
import axiosSwagger from 'axios/axios.swagger';
import InternetIcon from 'public/assets/line/internet.svg';
import TwitterIcon from 'public/assets/fill/twitter-fill.svg';
import DiscordIcon from 'public/assets/fill/discord.svg';
import React from 'react';
import { Link } from 'react-router-dom';
import GameCollection from './GameCollection';

export default function Collection() {
  const { game_id } = useParams();
  const { account } = useAppSelector(state => state.injected.polkadot);

  const { data, isError, isLoading } = useQuery({
    queryKey: [`game_detail/${game_id}`],
    queryFn: async () => {
      return axiosSwagger.gameSearch({
        body: {
          query: {
            game_id: game_id,
          },
        },
      });
    },
  });

  if (isLoading) {
    return (
      <Center height="100vh">
        <Spinner color="primary.a.500" size="lg" />
      </Center>
    );
  }

  if (isError) return <Center>not found</Center>;

  return (
    <>
      {data.data.length ? (
        <>
          <Box
            borderRadius="xl"
            boxShadow="0px 0.1875rem 0.875rem 0px rgba(0, 0, 0, 0.05)"
            bg="white"
            pb={9}
          >
            <Center height={80} position="relative">
              <RatioPicture
                src={data.data[0].logo || null}
                sx={{ height: 'full', width: 'full', pointerEvents: 'none' }}
              />

              <Box
                bg="linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, #FFF 100%)"
                position="absolute"
                height={24}
                inset="auto 0 0 0"
              />

              <RatioPicture
                src={data.data[0].logo || null}
                sx={{
                  height: 32,
                  width: 32,
                  border: '0.625rem solid white',
                  position: 'absolute',
                  inset: 'auto auto 0 50%',
                  transform: 'translate(-50%, 50%)',
                }}
              />
            </Center>

            <Center pt={16} pb={5} flexDirection="column" textAlign="center">
              <Heading fontSize="2xl" color="shader.a.900" pb={1}>
                {data.data[0].name}
              </Heading>

              <Text
                as={Link}
                to={`/account/${data.data[0].owner}`}
                fontWeight="normal"
                color="shader.a.500"
              >
                Owner by&nbsp;
                <Text as="span" color="primary.a.500" fontWeight="medium">
                  {data.data[0].owner === account?.address
                    ? 'You'
                    : shorten(data.data[0].owner)}
                </Text>
              </Text>
            </Center>

            <Center gap={4} pb={5}>
              {React.Children.toArray(
                [
                  { link: data.data[0].website, icon: InternetIcon },
                  { link: data.data[0].twitter, icon: TwitterIcon },
                  { link: data.data[0].discord, icon: DiscordIcon },
                ].map(meta => (
                  <LinkChakra
                    href={meta.link}
                    target="_blank"
                    color="shader..ă00"
                    transitionDuration="ultra-slow"
                    opacity={meta.link ? undefined : 0.4}
                    pointerEvents={meta.link ? undefined : 'none'}
                    onClick={() => {}}
                    _hover={{
                      color: 'primary.a.500',
                    }}
                  >
                    <Icon as={meta.icon} width={6} height={6} />
                  </LinkChakra>
                ))
              )}
            </Center>

            <Center px={96}>
              <Text fontWeight="medium" textAlign="center" noOfLines={3}>
                {data.data[0].description}
              </Text>
            </Center>
          </Box>

          <GameCollection />
        </>
      ) : null}
    </>
  );
}
