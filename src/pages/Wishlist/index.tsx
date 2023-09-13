import { Box, Center, CircularProgress, Flex, Stack } from '@chakra-ui/react';
import CardBox from 'components/CardBox';
import useBundleOf from 'hooks/useBundleOf';

import useMetaNFT from 'hooks/useMetaNFT';
import useTradeConfigOf from 'hooks/useTradeConfigOf';
import DefaultDetail from 'layouts/DefaultLayout/DefaultDetail';
import { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper as SwiperType } from 'swiper/types';
import WishlistCancel from './WishlistCancel';

import WishlistClaim from './WishlistClaim';
import SwiperLayoutThumb from 'layouts/SwiperLayout/SwiperLayoutThumb';
import DetailSocial from 'layouts/Detail/DetailSocial';
import DetailCollectionName from 'layouts/Detail/DetailCollectionName';
import DetailOwnerBy from 'layouts/Detail/DetailOwnerBy';
import DetailExpires from 'layouts/Detail/DetailExpires';
import DetailPrice from 'layouts/Detail/DetailPrice';
import SwiperLayoutItems from 'layouts/SwiperLayout/SwiperLayoutItems';

export default () => {
  const { id } = useParams();

  const { tradeConfigOf, isLoading } = useTradeConfigOf({
    key: `wishlist_detail/${id}`,
    filter: 'trade_id',
    arg: [Number(id)],
  });

  const { bundleOf, isLoading: bundleOfIsLoading } = useBundleOf({
    key: `wishlist_detail/${id}`,
    filter: 'trade_id',
    arg: [Number(id)],
  });

  const { metaNFT } = useMetaNFT({
    key: `wishlist_detail/${id}`,
    filter: 'collection_id',
    arg: bundleOf?.map(({ collection_id, nft_id }) => ({
      collection_id,
      nft_id,
    })),
    async: bundleOfIsLoading,
  });

  const swiperRef = useRef<SwiperType>();

  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  if (isLoading)
    return (
      <Center height="100vh">
        <CircularProgress isIndeterminate color="second.purple" />
      </Center>
    );

  if (!tradeConfigOf?.length) return <Center height="100vh">Not Found</Center>;

  console.log(tradeConfigOf?.[0].maybePrice.toString());

  return (
    <>
      {bundleOf?.length ? (
        <DefaultDetail>
          <SwiperLayoutThumb
            bundleOf={bundleOf}
            swiperRef={swiperRef}
            thumbs={thumbsSwiper}
            metaNFT={metaNFT}
          >
            <DetailSocial />
          </SwiperLayoutThumb>

          <Box>
            <CardBox variant="baseStyle">
              <Stack spacing={1}>
                <DetailCollectionName name="i really wanna own these items" />

                <DetailOwnerBy owner={tradeConfigOf[0].owner} />
              </Stack>

              <CardBox variant="baseStyle" padding={0} mt={6}>
                <DetailExpires
                  heading="Wishlist"
                  endBlock={tradeConfigOf[0].endBlock.value.toNumber()}
                />

                <DetailPrice
                  amount={tradeConfigOf[0].maybePrice.value.toNumber()}
                />

                <Flex gap={2} padding={6} pt={0}>
                  <WishlistClaim
                    trade_id={tradeConfigOf[0].trade_id}
                    maybePrice={tradeConfigOf[0].maybePrice.value.toNumber()}
                  />

                  <WishlistCancel trade_id={tradeConfigOf[0].trade_id} />
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
};
