import {
  Box,
  Center,
  CircularProgress,
  Flex,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';

import CardBox from 'components/CardBox';

import { useParams } from 'react-router-dom';

import { useAppSelector } from 'hooks/useRedux';

import { GafiSupportGameTypesTradeType } from '@polkadot/types/lookup';
import NFTDetailSell from './NFTDetailSell';
import NFTDetailBuy from './NFTDetailBuy';

import NFTDetailOffer from './NFTDetailOffer';
import NFTDetailListOffer from './NFTDetailListOffer';
import NFTDetailListing from './NFTDetailListing';

import useMetaCollection from 'hooks/useMetaCollection';
import useMetaNFT from 'hooks/useMetaNFT';

import useNFTsItem from 'hooks/useNFTsItem';
import useTradeConfigOf from 'hooks/useTradeConfigOf';
import useBundleOf from 'hooks/useBundleOf';

import DefaultDetail from 'layouts/DefaultLayout/DefaultDetail';

import NFTDetailListNFT from './NFTDetailListNFT';

import DetailNotSale from 'layouts/Detail/DetailNotSale';
import DetailPrice from 'layouts/Detail/DetailPrice';
import DetailExpires from 'layouts/Detail/DetailExpires';
import DetailNFTName from 'layouts/Detail/DetailNFTName';
import DetailCollectionName from 'layouts/Detail/DetailCollectionName';
import DetailOwnerBy from 'layouts/Detail/DetailOwnerBy';
import DetailAmount from 'layouts/Detail/DetailAmount';
import DetailSocial from 'layouts/Detail/DetailSocial';
import DetailPreviewNFT from 'layouts/Detail/DetailPreviewNFT';
import RatioPicture from 'components/RatioPicture';

export default () => {
  const { account } = useAppSelector(state => state.injected.polkadot);

  const { nft_id, collection_id } = useParams();

  const { bundleOf, isLoading, refetch } = useBundleOf({
    key: `nft_detail/${nft_id}/${collection_id}`,
    filter: 'entries',
  });

  const filterBundleOf = bundleOf?.filter(
    meta =>
      meta?.collection_id === Number(collection_id) &&
      meta?.nft_id === Number(nft_id)
  );

  const { tradeConfigOf, refetch: tradeRefetch } = useTradeConfigOf({
    key: `nft_detail/${nft_id}/${collection_id}/isLoading=${isLoading}`,
    filter: 'trade_id',
    arg: filterBundleOf?.map(meta => meta.trade_id),
  });

  const { NFTsItem } = useNFTsItem({
    key: `nft_detail/${nft_id}/${collection_id}`,
    filter: 'nft_id',
    arg: [[Number(nft_id), Number(collection_id)]],
  });

  const { metaNFT } = useMetaNFT({
    key: `nft_detail/${nft_id}/${collection_id}`,
    filter: 'collection_id',
    arg: [{ collection_id: Number(collection_id), nft_id: Number(nft_id) }],
  });

  const { MetaCollection } = useMetaCollection({
    key: `nft_detail/${nft_id}/${collection_id}`,
    filter: 'collection_id',
    arg: [Number(collection_id)],
  });

  const filterTradeConfig = (type: GafiSupportGameTypesTradeType['type']) => {
    return filterBundleOf
      ?.map(meta => {
        const option = tradeConfigOf?.find(
          data => data.trade_id === meta.trade_id
        );

        if (option?.trade.type === type) {
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
  };

  const listing = filterTradeConfig('SetPrice')?.[0];

  const onSuccess = () => {
    refetch();
    tradeRefetch();
  };

  const currentMetaNFT = metaNFT?.find(
    data =>
      data?.collection_id === Number(collection_id) &&
      data?.nft_id === bundleOf?.[0].nft_id
  );

  if (isLoading)
    return (
      <Center height="100vh">
        <CircularProgress isIndeterminate color="second.purple" />
      </Center>
    );

  return NFTsItem?.length ? (
    <>
      <DefaultDetail>
        <DetailPreviewNFT>
          <RatioPicture
            src={currentMetaNFT?.image || null}
            sx={{ ratio: { base: 16 / 9, lg: 1 / 1 } }}
          />

          <DetailSocial />
        </DetailPreviewNFT>

        <Box>
          <CardBox variant="baseStyle">
            <Stack>
              <Stack spacing={1}>
                <DetailNFTName name={MetaCollection?.[0]?.name as string} />

                <DetailCollectionName name={metaNFT?.[0]?.name as string} />
              </Stack>

              <DetailOwnerBy owner={NFTsItem[0].owner} />

              {listing?.amount && <DetailAmount amount={listing.amount} />}
            </Stack>

            <CardBox variant="baseStyle" padding={0} mt={6}>
              {listing ? (
                <DetailExpires
                  heading="Sell"
                  endBlock={
                    listing?.endBlock.isSome
                      ? listing.endBlock.value.toNumber()
                      : -1
                  }
                />
              ) : null}

              {listing?.maybePrice.isSome ? (
                <DetailPrice amount={listing?.maybePrice.value.toHuman()} />
              ) : (
                <DetailNotSale />
              )}

              <Flex gap={2} padding={6} pt={0}>
                <NFTDetailOffer
                  fee={
                    listing?.maybePrice.isSome
                      ? listing.maybePrice.value.toNumber()
                      : 0
                  }
                  amount={listing?.amount}
                  metaNFT={metaNFT?.find(
                    meta =>
                      meta?.collection_id === listing?.collection_id &&
                      meta.nft_id === listing?.nft_id
                  )}
                  metaCollection={MetaCollection}
                />

                {listing && NFTsItem[0].owner !== account?.address ? (
                  <NFTDetailBuy
                    trade_id={listing.trade_id}
                    fee={listing.maybePrice.value.toString()}
                    amount={listing.amount}
                    refetch={onSuccess}
                  />
                ) : null}

                {NFTsItem[0].owner === account?.address && (
                  <NFTDetailSell refetch={onSuccess} />
                )}
              </Flex>
            </CardBox>
          </CardBox>
        </Box>
      </DefaultDetail>

      <CardBox mt={4} variant="baseStyle" padding={0}>
        <Tabs variant="baseStyle">
          <TabList
            sx={{
              button: {
                fontWeight: 'medium',
                color: 'shader.a.500',

                _selected: {
                  color: 'shader.a.1000',
                },
              },
            }}
          >
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
                Offers={filterTradeConfig('SetBuy')}
                refetch={onSuccess}
              />
            </TabPanel>

            <TabPanel>
              <NFTDetailListing
                Listings={filterTradeConfig('SetPrice')}
                refetch={onSuccess}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </CardBox>

      <NFTDetailListNFT />
    </>
  ) : null;
};
