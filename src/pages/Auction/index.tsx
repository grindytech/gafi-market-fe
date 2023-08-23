import { Box, Center, CircularProgress, Flex } from '@chakra-ui/react';

import CardBox from 'components/CardBox';
import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useMetaNFT from 'hooks/useMetaNFT';

import { Swiper as SwiperType } from 'swiper/types';

import useHighestBidOf from 'hooks/useHighestBidOf';
import AuctionBid from './AuctionBid';
import AuctionClaim from './AuctionClaim';

import useBundleOf from 'hooks/useBundleOf';
import useAuctionConfigOf from 'hooks/useAuctionConfigOf';
import { Option, u128, u32 } from '@polkadot/types';
import DefaultDetail from 'layouts/DefaultLayout/DefaultDetail';
import BundleLayoutModelSwiper from 'layouts/BundleLayout/BundleLayoutModelSwiper';
import BundleLayoutMenu from 'layouts/BundleLayout/BundleLayoutMenu';
import BundleLayoutSocial from 'layouts/BundleLayout/BundleLayoutSocial';
import BundleLayoutCardHeading from 'layouts/BundleLayout/BundleLayoutCardHeading';
import BundleLayoutHeading from 'layouts/BundleLayout/BundleLayoutHeading';
import BundleLayoutOwner from 'layouts/BundleLayout/BundleLayoutOwner';
import BundleLayoutExpires from 'layouts/BundleLayout/BundleLayoutExpires';
import BundleLayoutPrice from 'layouts/BundleLayout/BundleLayoutPrice';
import BundleLayoutItems from 'layouts/BundleLayout/BundleLayoutItems';

interface AuctionServiceProps {
  auctionConfigOf: {
    trade_id: number;
    owner: string;
    maybePrice: Option<u128>;
    startBlock: u32;
    duration: u32;
  }[];
  bundleOf: {
    trade_id: number;
    collection_id: number;
    nft_id: number;
    amount: number;
  }[];
}

export default function Auction() {
  const { id } = useParams();

  const { auctionConfigOf, isLoading } = useAuctionConfigOf({
    key: `auction_detail/${id}`,
    filter: 'trade_id',
    arg: [Number(id)],
  });

  const { bundleOf } = useBundleOf({
    key: `auction_detail/${id}`,
    filter: 'trade_id',
    arg: [Number(id)],
  });

  if (isLoading)
    return (
      <Center height="100vh">
        <CircularProgress isIndeterminate color="second.purple" />
      </Center>
    );

  if (!auctionConfigOf?.length)
    return <Center height="100vh">Not Found</Center>;

  return (
    <>
      {bundleOf?.length && auctionConfigOf?.length ? (
        <AuctionService auctionConfigOf={auctionConfigOf} bundleOf={bundleOf} />
      ) : null}
    </>
  );
}

function AuctionService({ bundleOf, auctionConfigOf }: AuctionServiceProps) {
  const { id } = useParams();
  const navigation = useNavigate();

  const { metaNFT } = useMetaNFT({
    key: `auction_detail/${id}`,
    filter: 'collection_id',
    arg: bundleOf.map(({ collection_id, nft_id }) => ({
      collection_id,
      nft_id,
    })),
  });

  const { highestBidOf, refetch } = useHighestBidOf({
    key: `auction_detail/${id}`,
    filter: 'trade_id',
    arg: auctionConfigOf.map(meta => meta.trade_id),
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

  return (
    <>
      <DefaultDetail>
        <BundleLayoutModelSwiper
          bundleOf={bundleOf.map(({ collection_id, nft_id }) => ({
            collection_id,
            nft_id,
          }))}
          metaNFT={metaNFT}
          swiperRef={swiperRef}
          thumbs={thumbsSwiper}
        >
          <BundleLayoutSocial />

          <BundleLayoutMenu menu={ListMenu} />
        </BundleLayoutModelSwiper>

        <Box>
          <CardBox variant="baseStyle">
            <BundleLayoutCardHeading>
              <BundleLayoutHeading
                heading="Auction detail"
                sx={{
                  as: 'h3',
                }}
              />

              <BundleLayoutOwner owner={auctionConfigOf[0].owner} />
            </BundleLayoutCardHeading>

            <CardBox variant="baseStyle" padding={0}>
              <BundleLayoutExpires
                heading="Auction"
                endBlock={auctionConfigOf[0].duration.toNumber()}
              />

              <BundleLayoutPrice
                amount={
                  highestBidOf?.[0]?.bidPrice ||
                  auctionConfigOf[0].maybePrice.value.toHuman()
                }
              />

              <Flex gap={3} padding={6} pt={0}>
                <AuctionBid refetch={refetch} />

                <AuctionClaim />
              </Flex>
            </CardBox>

            <CardBox variant="baseStyle" mt={4}>
              <BundleLayoutItems
                queryKey={`auction_detail/${id}`}
                setThumbsSwiper={setThumbsSwiper}
                bundleOf={bundleOf.map(({ collection_id, nft_id, amount }) => ({
                  collection_id,
                  nft_id,
                  amount,
                }))}
              />
            </CardBox>
          </CardBox>
        </Box>
      </DefaultDetail>
    </>
  );
}
