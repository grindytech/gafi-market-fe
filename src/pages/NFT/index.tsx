import {
  Box,
  Center,
  CircularProgress,
  Flex,
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
import BundleLayoutModel from 'layouts/BundleLayout/BundleLayoutModel';
import BundleLayoutSocial from 'layouts/BundleLayout/BundleLayoutSocial';
import BundleLayoutCardHeading from 'layouts/BundleLayout/BundleLayoutCardHeading';
import BundleLayoutHeading from 'layouts/BundleLayout/BundleLayoutHeading';
import BundleLayoutAmount from 'layouts/BundleLayout/BundleLayoutAmount';
import BundleLayoutOwner from 'layouts/BundleLayout/BundleLayoutOwner';
import BundleLayoutNotSale from 'layouts/BundleLayout/BundleLayoutNotSale';
import BundleLayoutExpires from 'layouts/BundleLayout/BundleLayoutExpires';
import BundleLayoutPrice from 'layouts/BundleLayout/BundleLayoutPrice';

interface NFTServiceProps {
  filterBundleOf?: {
    trade_id: number;
    collection_id: number;
    nft_id: number;
    amount: number;
  }[];
  bundleRefetch: () => void;
}

export default () => {
  const { nft_id, collection_id } = useParams();

  const {
    bundleOf,
    isLoading,
    refetch: bundleRefetch,
  } = useBundleOf({
    key: `nft_detail/${nft_id}/${collection_id}`,
    filter: 'entries',
  });

  const filterBundleOf = bundleOf?.filter(
    meta =>
      meta?.collection_id === Number(collection_id) &&
      meta?.nft_id === Number(nft_id)
  );

  if (isLoading)
    return (
      <Center height="100vh">
        <CircularProgress isIndeterminate color="second.purple" />
      </Center>
    );

  return (
    <NFTService filterBundleOf={filterBundleOf} bundleRefetch={bundleRefetch} />
  );
};

function NFTService({ filterBundleOf, bundleRefetch }: NFTServiceProps) {
  const { nft_id, collection_id } = useParams();
  const { account } = useAppSelector(state => state.injected.polkadot);

  const uniqueKey =
    `nft_detail/${nft_id}/${collection_id}/` +
    JSON.stringify(filterBundleOf?.map(({ trade_id }) => trade_id));

  const { tradeConfigOf, refetch } = useTradeConfigOf({
    key: uniqueKey,
    filter: 'trade_id',
    arg: filterBundleOf?.map(meta => meta.trade_id),
  });

  const { NFTsItem } = useNFTsItem({
    key: uniqueKey,
    filter: 'nft_id',
    arg: [[Number(nft_id), Number(collection_id)]],
  });

  const { metaNFT } = useMetaNFT({
    key: uniqueKey,
    filter: 'collection_id',
    arg: [{ collection_id: Number(collection_id), nft_id: Number(nft_id) }],
  });

  const { MetaCollection } = useMetaCollection({
    key: uniqueKey,
    filter: 'collection_id',
    arg: [Number(collection_id)],
  });

  const filterTradeConfig = (type: GafiSupportGameTypesTradeType['type']) => {
    return filterBundleOf
      ?.map(meta => {
        const option = tradeConfigOf?.find(
          data => data.trade_id === meta.trade_id
        );

        if (option?.trade?.type === type) {
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

  const onSuccess = () => {
    bundleRefetch();
    refetch();
  };

  const listing = filterTradeConfig('SetPrice')?.[0];

  return (
    <>
      <DefaultDetail>
        <BundleLayoutModel
          bundleOf={{
            collection_id: Number(collection_id),
            nft_id: Number(nft_id),
          }}
          metaNFT={metaNFT}
        >
          <BundleLayoutSocial />
        </BundleLayoutModel>

        <Box>
          <CardBox variant="baseStyle">
            <BundleLayoutCardHeading>
              <BundleLayoutHeading
                heading={MetaCollection?.[0]?.title || '-'}
                sx={{
                  fontSize: 'lg',
                }}
              />

              <BundleLayoutHeading
                heading={metaNFT?.[0]?.title || '-'}
                sx={{
                  as: 'h3',
                  fontWeight: 'bold',
                }}
              />

              <BundleLayoutOwner owner={String(NFTsItem?.[0]?.owner)} />

              {listing?.amount && (
                <BundleLayoutAmount amount={listing.amount} />
              )}
            </BundleLayoutCardHeading>

            <CardBox variant="baseStyle" padding={0}>
              {listing ? (
                <BundleLayoutExpires
                  heading="Sell"
                  endBlock={
                    listing?.endBlock.isSome
                      ? listing.endBlock.value.toNumber()
                      : -1
                  }
                />
              ) : null}

              {listing?.maybePrice.isSome ? (
                <BundleLayoutPrice
                  amount={listing?.maybePrice.value.toHuman()}
                />
              ) : (
                <BundleLayoutNotSale />
              )}

              <Flex gap={2} padding={6} pt={0}>
                <NFTDetailOffer
                  fee={listing?.maybePrice.value.toNumber()}
                  amount={listing?.amount}
                  metaNFT={metaNFT?.find(
                    meta =>
                      meta?.collection_id === Number(collection_id) &&
                      meta.nft_id === Number(nft_id)
                  )}
                  metaCollection={MetaCollection}
                  refetch={onSuccess}
                />

                {listing && NFTsItem?.[0].owner !== account?.address ? (
                  <NFTDetailBuy
                    trade_id={listing.trade_id}
                    fee={listing.maybePrice.value.toNumber()}
                    amount={listing.amount}
                    refetch={onSuccess}
                  />
                ) : null}

                {NFTsItem?.[0].owner === account?.address && (
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
  );
}
