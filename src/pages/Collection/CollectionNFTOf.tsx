import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  HStack,
  Icon,
  Select,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { testOption1, testOption2, testOptionSort } from 'hooks/DataTest';
import FilterIcon from 'public/assets/line/filter.svg';

import MarketPlaceFilter from 'components/MarketPlaceFilter';
import { useParams } from 'react-router-dom';

import React from 'react';
import { cloundinary_link } from 'axios/cloudinary_axios';
import { Link } from 'react-router-dom';

import useMetaNFT from 'hooks/useMetaNFT';

import RatioPicture from 'components/RatioPicture';
import useNFTsItem from 'hooks/useNFTsItem';

export default function CollectionNFTOf() {
  const { collection_id } = useParams();

  const { isOpen, onToggle } = useDisclosure();

  const { NFTsItem } = useNFTsItem({
    key: `collection_detail_of/${collection_id}`,
    filter: 'collection_id',
    arg: [Number(collection_id)],
  });

  const { metaNFT } = useMetaNFT({
    key: `collection_detail_of/${collection_id}/${JSON.stringify(NFTsItem)}`,
    filter: 'collection_id',
    arg: NFTsItem?.map(({ collection_id, nft_id }) => ({
      collection_id,
      nft_id,
    })),
  });

  return (
    <>
      {NFTsItem?.length ? (
        <Box
          padding={6}
          borderTop="0.0625rem solid"
          borderTopColor="shader.a.200"
        >
          <HStack gap={4} mb={4} flexWrap="wrap">
            <Button
              variant={isOpen ? 'primary' : 'baseStyle'}
              leftIcon={<Icon as={FilterIcon} />}
              onClick={onToggle}
            >
              Filter
            </Button>

            <Select variant="formFilter" width="fit-content">
              {testOption1.map(item => (
                <option key={item.value} value={item.value}>
                  {item.title}
                </option>
              ))}
            </Select>

            <Select variant="formFilter" width="fit-content">
              {testOption2.map(item => (
                <option key={item.value} value={item.value}>
                  {item.title}
                </option>
              ))}
            </Select>

            <Select variant="formFilter" width="fit-content">
              {testOptionSort.map(item => (
                <option key={item.value} value={item.value}>
                  {item.title}
                </option>
              ))}
            </Select>
          </HStack>

          <Flex gap={5}>
            {isOpen ? (
              <Box flexBasis="25%">
                <Box position="sticky" top={85} flexBasis="25%">
                  <MarketPlaceFilter isOpen={isOpen} />
                </Box>
              </Box>
            ) : null}

            <Grid
              flex={1}
              gap={4}
              gridTemplateColumns={{
                sm: 'repeat(2, 1fr)',
                lg: 'repeat(4, 1fr)',
              }}
            >
              {React.Children.toArray(
                NFTsItem.map(meta => {
                  const currentMetaNFT = metaNFT?.find(
                    data =>
                      data?.collection_id === meta.collection_id &&
                      data.nft_id === meta.nft_id
                  );

                  return (
                    <Box
                      as={Link}
                      to={`/nft/${meta.nft_id}/${meta.collection_id}`}
                      border="0.0625rem solid"
                      borderColor="shader.a.300"
                      bg="white"
                      borderRadius="xl"
                    >
                      <RatioPicture
                        src={
                          currentMetaNFT?.image
                            ? cloundinary_link(currentMetaNFT.image)
                            : null
                        }
                        alt={meta.nft_id}
                      />

                      <Box padding={4}>
                        <Center justifyContent="space-between">
                          <Text
                            fontSize="sm"
                            fontWeight="medium"
                            color="shader.a.600"
                          >
                            Collection ID
                          </Text>

                          <Text>{meta.collection_id}</Text>
                        </Center>

                        <Center justifyContent="space-between">
                          <Text color="shader.a.900" fontWeight="medium">
                            {currentMetaNFT?.title || '-'}
                          </Text>

                          <Text color="shader.a.500">
                            ID:&nbsp;
                            <Text
                              as="span"
                              color="primary.a.500"
                              fontWeight="medium"
                            >
                              {meta.nft_id}
                            </Text>
                          </Text>
                        </Center>
                      </Box>
                    </Box>
                  );
                })
              )}
            </Grid>
          </Flex>
        </Box>
      ) : null}
    </>
  );
}
