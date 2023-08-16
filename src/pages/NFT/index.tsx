import {
  Box,
  Button,
  Center,
  CircularProgress,
  Flex,
  Grid,
  Heading,
  Icon,
  List,
  ListItem,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from '@chakra-ui/react';
import HeartIcon from 'public/assets/line/heart.svg';
import EyesIcon from 'public/assets/line/eye.svg';
import ShareIcon from 'public/assets/line/share.svg';

import CardBox from 'components/CardBox';

import { useParams } from 'react-router-dom';

import { useAppSelector } from 'hooks/useRedux';
import { cloundinary_link } from 'axios/cloudinary_axios';

import { GafiSupportGameTypesTradeType } from '@polkadot/types/lookup';

import { Option, u128, u32 } from '@polkadot/types';
import NFTDetailSell from './NFTDetailSell';
import NFTDetailBuy from './NFTDetailBuy';

import NFTDetailOffer from './NFTDetailOffer';
import NFTDetailListOffer from './NFTDetailListOffer';
import { AccountId32 } from '@polkadot/types/interfaces';
import NFTDetailListing from './NFTDetailListing';

import useMetaCollection from 'hooks/useMetaCollection';
import useMetaNFT from 'hooks/useMetaNFT';
import { formatCurrency } from 'utils/utils';
import NFTDetailListNFT from './NFTDetailListNFT';

import RatioPicture from 'components/RatioPicture';

import DateBlock from 'components/DateBlock';
import useNFTsItem from 'hooks/useNFTsItem';
import useTradeConfigOf from 'hooks/useTradeConfigOf';
import useBundleOf from 'hooks/useBundleOf';
import BundleLayoutOwner from 'layouts/BundleLayout/BundleLayoutOwner';
import { TypeMetadataOfItem } from 'types';

export interface NFTListingsProps {
  maybePrice: Option<u128> | undefined;
  endBlock: Option<u32> | undefined;
  owner: AccountId32 | undefined;
  trade_id: number;
  collection_id: number;
  nft_id: number;
  amount: number;
}

export default function NFT() {
  const { nft_id, collection_id } = useParams();
  const { account } = useAppSelector(state => state.injected.polkadot);

  const { NFTsItem, isLoading } = useNFTsItem({
    key: `nft_detail/${nft_id}/${collection_id}`,
    filter: 'collection_id',
    arg: [Number(collection_id)],
  });

  const { metaNFT } = useMetaNFT({
    key: `nft_detail/${nft_id}/${collection_id}/${JSON.stringify(NFTsItem)}`,
    filter: 'collection_id',
    arg: NFTsItem?.map(({ collection_id, nft_id }) => ({
      collection_id,
      nft_id,
    })),
  });

  const { MetaCollection } = useMetaCollection({
    key: `nft_detail/${nft_id}/${collection_id}`,
    filter: 'collection_id',
    arg: [Number(collection_id)],
  });

  const { bundleOf } = useBundleOf({
    key: `nft_detail/${nft_id}/${collection_id}`,
    filter: 'entries',
  });

  const filterBundleOf = bundleOf
    ?.filter(
      meta =>
        meta?.collection_id === Number(collection_id) &&
        meta?.nft_id === Number(nft_id)
    )
    .sort((a, b) => a.trade_id - b.trade_id);

  const { tradeConfigOf, refetch } = useTradeConfigOf({
    key: `nft_detail/${nft_id}/${collection_id}`,
    filter: filterBundleOf?.map(
      meta => meta.trade_id
    ) as keyof typeof filterBundleOf,
  });

  const filterTradeConfig = (type: GafiSupportGameTypesTradeType['type']) =>
    filterBundleOf
      ?.map(meta => {
        const option = tradeConfigOf?.find(
          data => data.trade_id === meta.trade_id
        );

        if (option && option.trade?.type === type) {
          return {
            maybePrice: option.maybePrice,
            endBlock: option.endBlock,
            owner: option.owner,
            trade_id: meta.trade_id,
            collection_id: meta.collection_id,
            nft_id: meta.nft_id,
            amount: meta.amount,
          };
        }
      })
      .filter((meta): meta is NonNullable<typeof meta> => !!meta);

  const newestListings = filterTradeConfig('SetPrice')?.sort(
    (a, b) => b.trade_id - a.trade_id
  );

  const isSelled = newestListings?.[0]?.maybePrice?.isSome || false;

  const currentMetaNFT = metaNFT?.find(
    meta => meta?.nft_id === Number(nft_id)
  ) as TypeMetadataOfItem;

  if (isLoading)
    return (
      <Center height="100vh">
        <CircularProgress isIndeterminate color="second.purple" />
      </Center>
    );

  return (
    <>
      {NFTsItem?.find(meta => meta.nft_id === Number(nft_id)) ? (
        <>
          <Grid
            gap={4}
            gridTemplateColumns={{
              lg: 'repeat(2, 1fr)',
            }}
          >
            <Box
              position={{ lg: 'sticky' }}
              top={24}
              zIndex={1}
              borderRadius="2xl"
              bg="white"
              border="0.0625rem solid"
              borderColor="shader.a.300"
              overflow="hidden"
              height="fit-content"
            >
              <RatioPicture
                alt={nft_id}
                src={
                  currentMetaNFT?.image
                    ? cloundinary_link(currentMetaNFT?.image)
                    : null
                }
                sx={{ ratio: { base: 16 / 9, lg: 1 / 1 } }}
              />

              <List
                padding={6}
                display="flex"
                fontWeight="medium"
                color="shader.a.900"
                gap={6}
                sx={{
                  li: {
                    display: 'inherit',
                    alignItems: 'center',
                    gap: 2,
                  },
                  svg: {
                    width: 5,
                    height: 5,
                  },
                }}
              >
                <ListItem>
                  <Button
                    variant="unstyled"
                    height="auto"
                    display="flex"
                    fontWeight="inherit"
                    leftIcon={<Icon as={HeartIcon} color="primary.a.500" />}
                  >
                    12
                  </Button>
                </ListItem>

                <ListItem>
                  <Icon as={EyesIcon} />

                  <Text>144</Text>
                </ListItem>

                <ListItem flex={1} justifyContent="flex-end">
                  <Button
                    variant="unstyled"
                    height="auto"
                    display="flex"
                    fontWeight="inherit"
                    leftIcon={<ShareIcon />}
                  >
                    Share
                  </Button>
                </ListItem>
              </List>
            </Box>

            <CardBox variant="baseStyle" height="fit-content">
              <VStack spacing={1} alignItems="flex-start">
                <Box>
                  <Heading
                    fontSize="lg"
                    color="primary.a.500"
                    fontWeight="medium"
                  >
                    {MetaCollection?.[0]?.title || '-'}
                  </Heading>

                  <Heading
                    as="h6"
                    fontSize="2xl"
                    color="shader.a.900"
                    fontWeight="bold"
                  >
                    {metaNFT?.[0]?.title || '-'}
                  </Heading>
                </Box>

                {NFTsItem?.[0]?.owner ? (
                  <BundleLayoutOwner
                    owner={NFTsItem[0].owner}
                    sx={{ mb: 'unset', as: 'h5' }}
                  />
                ) : null}

                {filterBundleOf?.[0]?.amount && (
                  <Text color="shader.a.500">
                    Amount&nbsp;
                    <Text as="span" color="primary.a.500" fontWeight="medium">
                      {filterBundleOf[0].amount || 0}
                    </Text>
                  </Text>
                )}
              </VStack>

              <CardBox variant="baseStyle" mt={6}>
                <Stack spacing={6}>
                  {newestListings?.[0] && isSelled && (
                    <Text color="shader.a.500" fontSize="sm">
                      Sell end at&nbsp;
                      <DateBlock
                        endBlock={
                          newestListings[0].endBlock?.value.toNumber() as number
                        }
                        sx={{
                          as: 'span',
                          color: 'shader.a.900',
                          fontWeight: 'medium',
                          fontSize: 'md',
                        }}
                      />
                    </Text>
                  )}

                  <Box
                    padding={4}
                    border="0.0625rem solid"
                    borderColor="shader.a.300"
                    bg="shader.a.200"
                    borderRadius="xl"
                  >
                    {newestListings?.[0] && isSelled ? (
                      <Stack spacing={0.5}>
                        <Text
                          fontSize="xl"
                          color="shader.a.900"
                          fontWeight="semibold"
                        >
                          {newestListings[0].maybePrice?.toString()}
                        </Text>

                        <Text fontSize="sm" color="shader.a.500">
                          {formatCurrency(
                            Number(
                              newestListings[0].maybePrice?.value.toNumber()
                            )
                          )}
                        </Text>
                      </Stack>
                    ) : (
                      <Stack spacing={0.5}>
                        <Text fontSize="sm" color="shader.a.500">
                          Price
                        </Text>

                        <Text
                          fontSize="lg"
                          color="shader.a.900"
                          fontWeight="medium"
                        >
                          Not for sale
                        </Text>
                      </Stack>
                    )}
                  </Box>

                  <Flex gap={2}>
                    <NFTDetailOffer
                      fee={
                        newestListings?.[0]?.maybePrice?.isSome
                          ? newestListings[0].maybePrice.value.toNumber()
                          : 0
                      }
                      amount={newestListings?.[0]?.amount || 0}
                      metaNFT={currentMetaNFT}
                      metaCollection={MetaCollection}
                    />

                    {newestListings?.[0] &&
                    NFTsItem?.[0].owner !== account?.address ? (
                      <NFTDetailBuy
                        trade_id={newestListings[0].trade_id}
                        fee={
                          newestListings[0].maybePrice?.value.toNumber() as number
                        }
                        amount={newestListings[0].amount}
                      />
                    ) : null}

                    {NFTsItem?.[0].owner === account?.address && (
                      <NFTDetailSell />
                    )}
                  </Flex>
                </Stack>
              </CardBox>
            </CardBox>
          </Grid>

          <CardBox mt={4} variant="baseStyle" padding={0}>
            <Tabs variant="baseStyle">
              <TabList>
                <Tab>Offers</Tab>
                <Tab>Listings</Tab>
              </TabList>
              <TabPanels
                sx={{
                  '> div': {
                    padding: 0,
                    overflowX: 'auto',
                  },
                }}
              >
                <TabPanel>
                  <NFTDetailListOffer
                    Offers={filterTradeConfig('SetBuy')?.sort(
                      (a, b) =>
                        Number(a.maybePrice?.value.toNumber()) -
                        Number(b.maybePrice?.value.toNumber())
                    )}
                    refetch={refetch}
                  />
                </TabPanel>

                <TabPanel>
                  <NFTDetailListing
                    Listings={filterTradeConfig('SetPrice')?.sort(
                      (a, b) => b.trade_id - a.trade_id
                    )}
                    refetch={refetch}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </CardBox>

          <NFTDetailListNFT />
        </>
      ) : (
        <Center height="100vh">Not Found</Center>
      )}
    </>
  );
}
