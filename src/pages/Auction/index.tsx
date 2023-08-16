import {
  Box,
  Center,
  CircularProgress,
  Flex,
  Grid,
  VStack,
} from '@chakra-ui/react';

import CardBox from 'components/CardBox';
import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useMetaNFT from 'hooks/useMetaNFT';

import { Swiper as SwiperType } from 'swiper/types';

import BundleLayoutModel from 'layouts/BundleLayout/BundleLayoutModel';
import BundleLayoutMenu from 'layouts/BundleLayout/BundleLayoutMenu';
import BundleLayoutDuration from 'layouts/BundleLayout/BundleLayoutDuration';
import BundleLayoutItems from 'layouts/BundleLayout/BundleLayoutItems';
import BundleLayoutOwner from 'layouts/BundleLayout/BundleLayoutOwner';

import useHighestBidOf from 'hooks/useHighestBidOf';
import AuctionBid from './AuctionBid';
import AuctionClaim from './AuctionClaim';

import useBundleOf from 'hooks/useBundleOf';
import useAuctionConfigOf from 'hooks/useAuctionConfigOf';

export default function Auction() {
  const { id } = useParams();
  const navigation = useNavigate();

  const { auctionConfigOf, isLoading } = useAuctionConfigOf({
    key: `auction_detail/${id}`,
    filter: [Number(id)],
  });

  const { bundleOf } = useBundleOf({
    key: `auction_detail/${id}`,
    filter: 'trade_id',
    arg: [Number(id)],
  });

  const { metaNFT } = useMetaNFT({
    key: `auction_detail/${id}/${JSON.stringify(bundleOf)}`,
    filter: 'collection_id',
    arg: bundleOf?.map(({ collection_id, nft_id }) => ({
      collection_id,
      nft_id,
    })),
  });

  const { highestBidOf } = useHighestBidOf({
    key: 'topAuction',
    filter: auctionConfigOf?.map(
      meta => meta?.trade_id
    ) as keyof typeof auctionConfigOf,
  });

  const swiperRef = useRef<SwiperType>();
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  const ListMenu = [
    {
      key: 0,
      heading: 'Detail',
      onClick: () => {
        if (swiperRef.current && bundleOf) {
          const meta = bundleOf[swiperRef.current.realIndex];

          navigation({ pathname: `/nft/${meta.nft_id}/${meta.collection_id}` });
        }
      },
    },
  ];

  if (isLoading)
    return (
      <Center height="100vh">
        <CircularProgress isIndeterminate color="second.purple" />
      </Center>
    );

  if (!auctionConfigOf?.length)
    return <Center height="100vh">Not Found</Center>;

  return (
    <Box>
      {bundleOf?.length && auctionConfigOf?.length ? (
        <>
          <Grid gridTemplateColumns={{ lg: 'repeat(2, 1fr)' }} gap={5}>
            <BundleLayoutModel
              bundleOf={bundleOf}
              metaNFT={metaNFT}
              swiperRef={swiperRef}
              thumbs={thumbsSwiper}
            >
              <BundleLayoutMenu swiperRef={swiperRef} menu={ListMenu} />
            </BundleLayoutModel>

            <VStack alignItems="flex-start" gap={4}>
              <CardBox variant="baseStyle">
                <BundleLayoutOwner
                  owner={auctionConfigOf[0]?.owner as string}
                />

                <BundleLayoutDuration
                  maybePrice={
                    highestBidOf?.[0]?.bidPrice ||
                    auctionConfigOf[0]?.maybePrice.isSome
                      ? (auctionConfigOf[0]?.maybePrice.value.toHuman() as string)
                      : '0'
                  }
                  duration={{
                    heading: 'Auction end at',
                    endBlock: auctionConfigOf[0]?.duration.toNumber() as number,
                  }}
                >
                  <Flex gap={3}>
                    <AuctionBid />

                    <AuctionClaim />
                  </Flex>
                </BundleLayoutDuration>
              </CardBox>

              <BundleLayoutItems
                queryKey={`auction/${id}`}
                heading="Auctions detail"
                bundleOf={bundleOf}
                setThumbsSwiper={setThumbsSwiper}
              />
            </VStack>
          </Grid>
        </>
      ) : null}
    </Box>
  );
}
