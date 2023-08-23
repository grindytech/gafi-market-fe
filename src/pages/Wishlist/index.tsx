import { Box, Center, CircularProgress, Flex } from '@chakra-ui/react';
import CardBox from 'components/CardBox';
import useBundleOf from 'hooks/useBundleOf';

import useMetaNFT from 'hooks/useMetaNFT';
import useTradeConfigOf, { tradeConfigProps } from 'hooks/useTradeConfigOf';
import BundleLayoutCardHeading from 'layouts/BundleLayout/BundleLayoutCardHeading';
import BundleLayoutExpires from 'layouts/BundleLayout/BundleLayoutExpires';
import BundleLayoutHeading from 'layouts/BundleLayout/BundleLayoutHeading';
import BundleLayoutModelSwiper from 'layouts/BundleLayout/BundleLayoutModelSwiper';
import BundleLayoutOwner from 'layouts/BundleLayout/BundleLayoutOwner';
import BundleLayoutPrice from 'layouts/BundleLayout/BundleLayoutPrice';
import BundleLayoutSocial from 'layouts/BundleLayout/BundleLayoutSocial';
import DefaultDetail from 'layouts/DefaultLayout/DefaultDetail';
import { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper as SwiperType } from 'swiper/types';
import WishlistCancel from './WishlistCancel';
import BundleLayoutItems from 'layouts/BundleLayout/BundleLayoutItems';
import { useAppSelector } from 'hooks/useRedux';
import WishlistClaim from './WishlistClaim';

interface WishlistServiceProps {
  tradeConfigOf: tradeConfigProps[];
  bundleOf: {
    trade_id: number;
    collection_id: number;
    nft_id: number;
    amount: number;
  }[];
}

export default () => {
  const { id } = useParams();

  const { tradeConfigOf, isLoading } = useTradeConfigOf({
    key: `wishlist_detail/${id}`,
    filter: 'trade_id',
    arg: [Number(id)],
  });

  const { bundleOf } = useBundleOf({
    key: `wishlist_detail/${id}`,
    filter: 'trade_id',
    arg: [Number(id)],
  });

  if (isLoading)
    return (
      <Center height="100vh">
        <CircularProgress isIndeterminate color="second.purple" />
      </Center>
    );

  if (!tradeConfigOf?.length) return <Center height="100vh">Not Found</Center>;

  return (
    <>
      {bundleOf?.length ? (
        <WishlistService bundleOf={bundleOf} tradeConfigOf={tradeConfigOf} />
      ) : null}
    </>
  );
};

function WishlistService({ tradeConfigOf, bundleOf }: WishlistServiceProps) {
  const { id } = useParams();
  const { account } = useAppSelector(state => state.injected.polkadot);

  const { metaNFT } = useMetaNFT({
    key: `wishlist_detail/${id}`,
    filter: 'collection_id',
    arg: bundleOf.map(({ collection_id, nft_id }) => ({
      collection_id,
      nft_id,
    })),
  });

  const swiperRef = useRef<SwiperType>();

  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  return (
    <>
      <DefaultDetail>
        <BundleLayoutModelSwiper
          bundleOf={bundleOf}
          swiperRef={swiperRef}
          thumbs={thumbsSwiper}
          metaNFT={metaNFT}
        >
          <BundleLayoutSocial />
        </BundleLayoutModelSwiper>

        <Box>
          <CardBox variant="baseStyle">
            <BundleLayoutCardHeading>
              <BundleLayoutHeading heading="I really wanna own these items" />

              <BundleLayoutOwner owner={String(tradeConfigOf[0].owner)} />
            </BundleLayoutCardHeading>

            <CardBox variant="baseStyle" padding={0}>
              <BundleLayoutExpires
                heading="Wishlist"
                endBlock={tradeConfigOf[0].endBlock.value.toNumber()}
              />

              <BundleLayoutPrice
                amount={tradeConfigOf[0].maybePrice.value.toNumber()}
              />

              <Flex gap={2} padding={6} pt={0}>
                {tradeConfigOf[0].owner === account?.address ? (
                  <WishlistClaim
                    trade_id={tradeConfigOf[0].trade_id}
                    maybePrice={tradeConfigOf[0].maybePrice.value.toNumber()}
                  />
                ) : (
                  <WishlistCancel
                    trade_id={tradeConfigOf[0].trade_id}
                    maybePrice={tradeConfigOf[0].maybePrice.value.toNumber()}
                  />
                )}
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
