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
import { cloundinary_link } from 'axios/cloudinary_axios';

import useMetaCollection from 'hooks/useMetaCollection';

import RatioPicture from 'components/RatioPicture';
import CollectionNFTOf from './CollectionNFTOf';
import useNFTsCollection from 'hooks/useNFTsCollection';
import { Link } from 'react-router-dom';

export default function Collection() {
  const { collection_id } = useParams();

  const { account } = useAppSelector(state => state.injected.polkadot);

  const { NFTsCollection, isLoading, isError } = useNFTsCollection({
    key: `collection_detail/${collection_id}`,
    filter: 'collection_id',
    arg: [Number(collection_id)],
  });

  const { MetaCollection } = useMetaCollection({
    key: `collection_detail/${collection_id}`,
    filter: 'collection_id',
    arg: [Number(collection_id)],
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
      {NFTsCollection?.length ? (
        <Box
          borderRadius="xl"
          boxShadow="0px 0.1875rem 0.875rem 0px rgba(0, 0, 0, 0.05)"
          bg="white"
        >
          <Center height={80} position="relative">
            <RatioPicture
              src={
                MetaCollection?.[0]?.image
                  ? cloundinary_link(MetaCollection[0].image)
                  : null
              }
              sx={{ height: 'full', width: 'full', pointerEvents: 'none' }}
            />

            <Box
              bg="linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, #FFF 100%)"
              position="absolute"
              height={24}
              inset="auto 0 0 0"
            />

            <RatioPicture
              src={
                MetaCollection?.[0]?.image
                  ? cloundinary_link(MetaCollection[0].image)
                  : null
              }
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
              {MetaCollection?.[0]?.title || '-'}
            </Heading>

            <Text
              as={Link}
              to={`/account/${NFTsCollection[0].owner}`}
              fontWeight="normal"
              color="shader.a.500"
            >
              Owner by&nbsp;
              <Text as="span" color="primary.a.500" fontWeight="medium">
                {NFTsCollection[0].owner === account?.address
                  ? 'You'
                  : shorten(NFTsCollection[0].owner)}
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

                <Text as="span">{NFTsCollection[0].items}</Text>
              </ListItem>
            </List>
          </Center>

          <CollectionNFTOf />
        </Box>
      ) : null}
    </>
  );
}
