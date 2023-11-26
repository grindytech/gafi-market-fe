import { Box, Center, CircularProgress, Flex, Stack } from '@chakra-ui/react';

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
import DefaultDetail from 'layouts/DefaultLayout/DefaultDetail';
import SwiperLayoutThumb from 'layouts/SwiperLayout/SwiperLayoutThumb';
import DetailSocial from 'layouts/Detail/DetailSocial';
import DetailMenu from 'layouts/Detail/DetailMenu';
import DetailCollectionName from 'layouts/Detail/DetailCollectionName';
import DetailOwnerBy from 'layouts/Detail/DetailOwnerBy';
import DetailExpires from 'layouts/Detail/DetailExpires';
import DetailPrice from 'layouts/Detail/DetailPrice';
import SwiperLayoutItems from 'layouts/SwiperLayout/SwiperLayoutItems';

export default function Auction() {
  const { id } = useParams();
  const navigation = useNavigate();

  const { auctionConfigOf, isLoading } = useAuctionConfigOf({
    key: `auction_detail/${id}`,
    filter: 'trade_id',
    arg: [Number(id)],
  });

  const { bundleOf, isLoading: bundleLoading } = useBundleOf({
    key: `auction_detail/${id}`,
    filter: 'trade_id',
    arg: [Number(id)],
  });

  const { highestBidOf, refetch } = useHighestBidOf({
    key: `auction_detail/${id}`,
    filter: 'trade_id',
    arg: auctionConfigOf?.map(meta => meta.trade_id),
    async: isLoading,
  });

  const { metaNFT } = useMetaNFT({
    key: `auction_detail/${id}/isLoading=${bundleLoading}`,
    filter: 'collection_id',
    arg: bundleOf?.map(({ collection_id, nft_id }) => ({
      collection_id,
      nft_id,
    })),
    async: bundleLoading,
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

  if (isLoading) {
    return (
      <Center height="100vh">
        <CircularProgress isIndeterminate color="second.purple" />
      </Center>
    );
  }

  if (!auctionConfigOf?.length) {
    return <Center height="100vh">Not Found</Center>;
  }

  return (
    <>
      {bundleOf?.length && auctionConfigOf?.length ? (
        <DefaultDetail>
          <SwiperLayoutThumb
            bundleOf={bundleOf.map(({ collection_id, nft_id }) => ({
              collection_id,
              nft_id,
            }))}
            metaNFT={metaNFT}
            swiperRef={swiperRef}
            thumbs={thumbsSwiper}
          >
            <DetailSocial />

            <DetailMenu menu={ListMenu} />
          </SwiperLayoutThumb>

          <Box>
            <CardBox variant="baseStyle">
              <Stack spacing={1}>
                <DetailCollectionName name="Auction detail" />

                <DetailOwnerBy owner={auctionConfigOf[0].owner} />
              </Stack>

              <CardBox variant="baseStyle" padding={0} mt={6}>
                <DetailExpires
                  heading="Auction"
                  endBlock={auctionConfigOf[0].duration.toNumber()}
                />

                <DetailPrice
                  amount={
                    highestBidOf?.[0]?.bidPrice.toHuman() ||
                    auctionConfigOf[0].maybePrice.value.toHuman()
                  }
                />

                <Flex gap={3} padding={6} pt={0}>
                  <AuctionBid refetch={refetch} />

                  <AuctionClaim />
                </Flex>
              </CardBox>

              <CardBox variant="baseStyle" mt={4}>
                <SwiperLayoutItems
                  queryKey={`auction_detail/${id}`}
                  setThumbsSwiper={setThumbsSwiper}
                  bundleOf={bundleOf.map(
                    ({ collection_id, nft_id, amount }) => ({
                      collection_id,
                      nft_id,
                      amount,
                    })
                  )}
                />
              </CardBox>
            </CardBox>
          </Box>
        </DefaultDetail>
      ) : null}
    </>
  );
}
