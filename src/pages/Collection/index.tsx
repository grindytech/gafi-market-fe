import {
  Box,
  Center,
  Heading,
  List,
  ListItem,
  Spinner,
  Text,
} from '@chakra-ui/react';

import { useAppSelector } from 'hooks/useRedux';
import { useParams } from 'react-router-dom';
import { shorten } from 'utils/utils';

import RatioPicture from 'components/RatioPicture';

import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axiosSwagger from 'axios/axios.swagger';
import CollectionNFT from './CollectionNFT';

export default function Collection() {
  const { collection_id } = useParams();

  const { account } = useAppSelector(state => state.injected.polkadot);

  const { data, isLoading, isError } = useQuery({
    queryKey: [`collection_detail/${collection_id}`],
    queryFn: async () => {
      return axiosSwagger.collectionSearch({
        body: {
          query: {
            collection_id: collection_id,
          },
        },
      });
    },
  });

  const { data: DataNFT, isLoading: isLoadingNFT } = useQuery({
    queryKey: [`nft_collection_detail/${collection_id}`],
    queryFn: async () => {
      return axiosSwagger.nftSearch({
        body: {
          query: {
            collection_id: collection_id,
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
      {data?.data.length ? (
        <Box
          borderRadius="xl"
          boxShadow="0px 0.1875rem 0.875rem 0px rgba(0, 0, 0, 0.05)"
          bg="white"
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

          <Center pt={20} pb={6} flexDirection="column" textAlign="center">
            <Heading fontSize="2xl" color="shader.a.900">
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

            <List
              mt={5}
              display="flex"
              gap={16}
              px={6}
              py={4}
              borderRadius="xl"
              border="0.0625rem solid"
              borderColor="shader.a.300"
              sx={{
                p: { color: 'shader.a.500', pb: 0.5 },
                span: { color: 'shader.a.900', fontWeight: 'medium' },
              }}
            >
              <ListItem>
                <Text>Items</Text>

                <Text as="span">{DataNFT?.data.length || 0}</Text>
              </ListItem>
            </List>
          </Center>

          <CollectionNFT data={DataNFT} isLoading={isLoadingNFT} />
        </Box>
      ) : null}
    </>
  );
}
