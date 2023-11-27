import { Box, Center, Flex, HStack, Spinner, Text } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import axiosSwagger from 'axios/axios.swagger';
import RatioPicture from 'components/RatioPicture';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Grid, Mousewheel } from 'swiper';

import { convertHex, shorten } from 'utils/utils';
import { Link } from 'react-router-dom';
import { colors } from 'theme/theme';
import useNFTsCollection from 'hooks/useNFTsCollection';

export default () => {
  const { game_id } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: [`game_detail_collection/${game_id}`],
    queryFn: async () => {
      return await axiosSwagger.collectionSearch({
        body: {
          query: {
            game_id: [game_id as string],
          },
        },
      });
    },
  });

  const { NFTsCollection } = useNFTsCollection({
    key: `game_detail_collection/${game_id}`,
    filter: 'collection_id',
    arg: data?.data.map(({ collection_id }) => collection_id),
    async: isLoading,
  });

  if (isLoading) {
    return (
      <Center height="100vh">
        <Spinner color="primary.a.500" size="lg" />
      </Center>
    );
  }

  return (
    <>
      {data?.data.length && NFTsCollection?.length ? (
        <>
          <Text
            fontSize="lg"
            fontWeight="medium"
            color="shader.a.1000"
            mb={6}
            mt={8}
          >
            Game collections
          </Text>

          <Swiper
            spaceBetween={20}
            modules={[Grid, Mousewheel]}
            slidesPerView={3.5}
            loop={true}
            mousewheel={{
              forceToAxis: true,
            }}
          >
            {data.data.map((meta, index) => (
              <SwiperSlide key={meta.id}>
                <Box
                  as={Link}
                  display="block"
                  to={`/collection/${meta.collection_id}`}
                  borderRadius="lg"
                  overflow="hidden"
                  bg={convertHex(colors.shader.a[500], 0.8)}
                >
                  <RatioPicture
                    src={meta.logo || null}
                    sx={{
                      borderBottomRadius: 'unset',
                    }}
                  />

                  <Box padding={4}>
                    <Flex alignItems="center" gap={2}>
                      <Text fontSize="xl" fontWeight="bold" color="white">
                        {meta.name}
                      </Text>

                      <Text
                        as="span"
                        color={convertHex('#ffffff', 0.8)}
                        fontWeight="medium"
                      >
                        ID: {meta.collection_id}
                      </Text>
                    </Flex>

                    <Text
                      fontSize="sm"
                      color={convertHex('#ffffff', 0.8)}
                      mt={0.5}
                    >
                      By {shorten(meta.owner)}
                    </Text>

                    <HStack
                      color="white"
                      fontSize="sm"
                      fontWeight="medium"
                      alignItems="center"
                      mt={6}
                    >
                      <Text>Items: {NFTsCollection[index].items}</Text>

                      <Box
                        borderRadius="full"
                        width={1}
                        height={1}
                        bg={convertHex('#ffffff', 0.8)}
                      />

                      <Text>Floor: 0.045 GAFI</Text>
                    </HStack>
                  </Box>
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      ) : null}
    </>
  );
};
