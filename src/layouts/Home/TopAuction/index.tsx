import {
  Box,
  Center,
  Grid as GridChakra,
  Flex,
  Icon,
  Text,
} from '@chakra-ui/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import RatioPicture from 'components/RatioPicture';
import useMetaNFT from 'hooks/useMetaNFT';
import DateBlock from 'components/DateBlock';

import TopAuctionSkeleton from './TopAuctionSkeleton';
import { Link } from 'react-router-dom';
import HandIcon from 'public/assets/line/hand.svg';
import { useQuery } from '@tanstack/react-query';
import axiosSwagger from 'axios/axios.swagger';
import { formatGAFI } from 'utils/utils';

export default () => {
  const { data, isLoading } = useQuery({
    queryKey: ['home_TopAuction'],
    queryFn: async () => {
      return axiosSwagger.tradeSearch({
        body: {
          size: 5,
          query: {
            trade_type: 'SetAuction',
          },
        },
      });
    },
  });

  const { metaNFT } = useMetaNFT({
    key: `home_TopAuction`,
    filter: 'collection_id',
    arg: data?.data
      .map(meta => meta.source)
      .flat()
      .map(({ collection, item }) => ({
        collection_id: Number(collection),
        nft_id: Number(item),
      })),
    async: isLoading,
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

        {data?.data.length ? (
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
            {data.data.map(meta => (
              <Swiper loop={true} spaceBetween={32} key={meta.trade_id}>
                {meta.source.map(({ collection, item }) => {
                  const currentMetaNFT = metaNFT?.find(
                    meta =>
                      meta.collection_id === Number(collection) &&
                      meta.nft_id === Number(item)
                  );

                  return (
                    <SwiperSlide key={`${collection}/${item}`}>
                      <Box
                        bg="#27272A"
                        borderRadius="xl"
                        border="0.0625rem solid #3F3F46"
                        boxShadow="0px 0px 20px 0px rgba(0, 0, 0, 0.10)"
                      >
                        <Link to={`/auction/${meta.trade_id}`}>
                          <RatioPicture src={currentMetaNFT?.image || null} />

                          <Box bg="#3F3F46" padding={4} pt={6}>
                            <Center
                              justifyContent="space-between"
                              fontWeight="medium"
                              color="white"
                            >
                              <Text>{currentMetaNFT?.name}</Text>

                              <Text fontSize="sm">ID: {meta.trade_id}</Text>
                            </Center>

                            <Center
                              justifyContent="space-between"
                              fontSize="sm"
                            >
                              <Text color="#A1A1AA">Highest bid</Text>

                              <Text color="white" fontWeight="medium">
                                {formatGAFI(meta.highest_bid || meta.price)}
                                &nbsp; GAFI
                              </Text>
                            </Center>

                            <Text color="#E4E4E7" fontSize="xs" mt={0.5}>
                              Start in:&nbsp;
                              <DateBlock
                                endBlock={meta.duration || -1}
                                end={meta.duration ? 'Expired' : 'Infinity'}
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
                })}
              </Swiper>
            ))}
          </GridChakra>
        ) : (
          <Center>Empty</Center>
        )}
      </Box>
    </Box>
  );
};
