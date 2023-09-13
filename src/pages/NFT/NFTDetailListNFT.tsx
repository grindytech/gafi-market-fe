import { Box, Center, Grid, Text } from '@chakra-ui/react';

import RatioPicture from 'components/RatioPicture';

import useMetaCollection from 'hooks/useMetaCollection';
import useMetaNFT from 'hooks/useMetaNFT';
import useNFTsItem from 'hooks/useNFTsItem';

import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

export default function NFTDetailListNFT() {
  const { nft_id, collection_id } = useParams();

  const { NFTsItem, isLoading } = useNFTsItem({
    key: `nft_detail_more/${nft_id}/${collection_id}`,
    filter: 'collection_id',
    arg: [Number(collection_id)],
  });

  const { metaNFT } = useMetaNFT({
    key: `nft_detail_more/${nft_id}/${collection_id}/isLoading=${isLoading}`,
    filter: 'collection_id',
    arg: NFTsItem?.map(({ collection_id, nft_id }) => ({
      collection_id,
      nft_id,
    })),
  });

  const { MetaCollection } = useMetaCollection({
    key: `nft_detail_more/${nft_id}/${collection_id}`,
    filter: 'collection_id',
    arg: [Number(collection_id)],
  });

  return (
    <>
      <Text fontSize="xl" fontWeight="semibold" color="shader.a.900" mt={10}>
        More from&nbsp;
        <Text as="span" color="primary.a.500">
          {MetaCollection?.[0]?.name}
        </Text>
      </Text>

      {NFTsItem?.length ? (
        <Grid
          gridTemplateColumns={{
            '2sm': 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
            xl: 'repeat(5, 1fr)',
          }}
          mt={5}
          gap={5}
        >
          {NFTsItem.filter(meta => meta.nft_id !== Number(nft_id)).map(
            ({ collection_id, nft_id }) => {
              const currentMetaNFT = metaNFT?.find(
                data =>
                  data?.collection_id === collection_id &&
                  data.nft_id === nft_id
              );

              return (
                <Box
                  key={`nft-detail-${nft_id}/${collection_id}`}
                  to={`/nft/${nft_id}/${collection_id}`}
                  as={Link}
                  borderRadius="lg"
                  border="0.0625rem solid"
                  borderColor="shader.a.300"
                  boxShadow="0px 3px 14px 0px rgba(0, 0, 0, 0.05)"
                  fontSize="sm"
                  fontWeight="medium"
                >
                  <RatioPicture
                    src={currentMetaNFT?.image || null}
                    alt={nft_id}
                  />

                  <Box
                    padding={4}
                    borderTop="0.0625rem solid"
                    borderColor="shader.a.200"
                  >
                    <Text
                      as="strong"
                      color="primary.a.500"
                      fontSize="inherit"
                      fontWeight="inherit"
                    >
                      {MetaCollection?.[0]?.name}
                    </Text>

                    <Center justifyContent="space-between">
                      <Text color="shader.a.900">{currentMetaNFT?.name}</Text>

                      <Text as="span">{nft_id}</Text>
                    </Center>
                  </Box>
                </Box>
              );
            }
          )}
        </Grid>
      ) : null}
    </>
  );
}
