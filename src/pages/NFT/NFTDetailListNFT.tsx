import { Box, Center, Grid, Heading, Text } from '@chakra-ui/react';

import { cloundinary_link } from 'axios/cloudinary_axios';

import RatioPicture from 'components/RatioPicture';

import useMetaCollection from 'hooks/useMetaCollection';
import useMetaNFT from 'hooks/useMetaNFT';
import useNFTsItem from 'hooks/useNFTsItem';

import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

export default function NFTDetailListNFT() {
  const { nft_id, collection_id } = useParams();

  const { NFTsItem } = useNFTsItem({
    key: `nft_detail/${nft_id}/${collection_id}`,
    filter: collection_id as never,
  });

  const { metaNFT } = useMetaNFT({
    key: `nft_detail/${nft_id}/${collection_id}`,
    filter: NFTsItem?.map(({ collection_id, nft_id }) => ({
      collection_id,
      nft_id,
    })) as keyof typeof NFTsItem,
  });

  const { MetaCollection } = useMetaCollection({
    key: `nft_detail/${nft_id}/${collection_id}`,
    filter: [Number(collection_id)],
  });

  return (
    <>
      <Heading fontSize="xl" fontWeight="semibold" color="shader.a.900" mt={10}>
        More from&nbsp;
        <Text as="span" color="primary.a.500">
          {MetaCollection?.[0]?.title || '-'}
        </Text>
      </Heading>

      {NFTsItem?.length ? (
        <>
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
            {NFTsItem.map(meta => {
              const currentMetaNFT = metaNFT?.find(
                data =>
                  data?.collection_id === meta.collection_id &&
                  data.nft_id === meta.nft_id
              );

              return (
                <Box
                  key={`nft-detail-${meta.nft_id}/${meta.collection_id}`}
                  as={Link}
                  to={`/nft/${meta.nft_id}/${meta.collection_id}`}
                  borderRadius="lg"
                  border="0.0625rem solid"
                  borderColor="shader.a.300"
                  boxShadow="0px 3px 14px 0px rgba(0, 0, 0, 0.05)"
                  fontSize="sm"
                  fontWeight="medium"
                >
                  <RatioPicture
                    src={
                      currentMetaNFT?.image
                        ? cloundinary_link(currentMetaNFT.image)
                        : null
                    }
                    alt={meta.nft_id}
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
                      {MetaCollection?.[0]?.title || '-'}
                    </Text>

                    <Center justifyContent="space-between">
                      <Text color="shader.a.900">
                        {currentMetaNFT?.title || '-'}
                      </Text>

                      <Text as="span">{meta.nft_id}</Text>
                    </Center>
                  </Box>
                </Box>
              );
            })}
          </Grid>
        </>
      ) : null}
    </>
  );
}
