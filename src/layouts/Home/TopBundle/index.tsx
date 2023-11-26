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

import { Link } from 'react-router-dom';
import TopBundleSkeleton from './TopBundleSkeleton';
import NFTsIcon from 'public/assets/line/nfts.svg';
import { useQuery } from '@tanstack/react-query';
import axiosSwagger from 'axios/axios.swagger';
import useMetaNFT from 'hooks/useMetaNFT';

import { formatGAFI } from 'utils/utils';

export default () => {
  const { data, isLoading } = useQuery({
    queryKey: ['home_topBundle'],
    queryFn: async () => {
      return axiosSwagger.tradeSearch();
    },
  });

  const { metaNFT } = useMetaNFT({
    key: 'home_topBundle',
    filter: 'collection_id',
    arg: data?.data?.map(({ nft }) => ({
      collection_id: nft?.collection,
      nft_id: nft?.item,
    })),
    async: isLoading,
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

        {data?.data?.length ? (
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
            {data.data.map((meta, index) => {
              return (
                <Swiper loop={true} spaceBetween={32} key={meta.trade_id}>
                  <SwiperSlide>
                    <Link to={`/bundle/${meta.trade_id}`}>
                      <RatioPicture src={metaNFT?.[index]?.image || null} />

                      <Box bg="shader.a.100" padding={4} pt={6}>
                        <Center
                          justifyContent="space-between"
                          fontWeight="medium"
                          color="shader.a.900"
                        >
                          <Text>{metaNFT?.[index]?.name}</Text>

                          <Text fontSize="sm">ID: {meta.trade_id}</Text>
                        </Center>

                        <Center
                          mt={1}
                          justifyContent="space-between"
                          fontSize="sm"
                        >
                          <Text color="shader.a.900">Price:</Text>

                          <Text color="shader.a.500" fontWeight="medium">
                            {formatGAFI(meta.highest_bid || meta.price)}
                            &nbsp; GAFI
                          </Text>
                        </Center>
                      </Box>
                    </Link>
                  </SwiperSlide>
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
