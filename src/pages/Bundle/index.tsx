import { Box, Center, CircularProgress, Grid, VStack } from '@chakra-ui/react';
import CardBox from 'components/CardBox';
import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import useMetaNFT from 'hooks/useMetaNFT';

import { Swiper as SwiperType } from 'swiper/types';

import BundleLayoutModel from 'layouts/BundleLayout/BundleLayoutModel';
import BundleLayoutMenu from 'layouts/BundleLayout/BundleLayoutMenu';
import BundleLayoutDuration from 'layouts/BundleLayout/BundleLayoutDuration';
import BundleLayoutOwner from 'layouts/BundleLayout/BundleLayoutOwner';
import BundleLayoutItems from 'layouts/BundleLayout/BundleLayoutItems';
import BundleBid from './BundleBid';
import useTradeConfigOf from 'hooks/useTradeConfigOf';
import useBundleOf from 'hooks/useBundleOf';

export default function Bundle() {
  const { id } = useParams();
  const navigation = useNavigate();

  const { tradeConfigOf, isLoading } = useTradeConfigOf({
    key: `bundle_detail/${id}`,
    filter: [Number(id)],
  });

  const { bundleOf } = useBundleOf({
    key: `bundle_detail/${id}`,
    filter: 'trade_id',
    arg: [Number(id)],
  });

  const { metaNFT } = useMetaNFT({
    key: `bundle_detail/${id}/${JSON.stringify(bundleOf)}`,
    filter: 'collection_id',
    arg: bundleOf?.map(({ collection_id, nft_id }) => ({
      collection_id,
      nft_id,
    })),
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

  if (!tradeConfigOf?.length) return <Center height="100vh">Not Found</Center>;

  return (
    <Box>
      {tradeConfigOf?.length && bundleOf?.length ? (
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
                  owner={tradeConfigOf[0].owner?.toString() as string}
                />

                <BundleLayoutDuration
                  maybePrice={
                    tradeConfigOf[0].maybePrice?.isSome
                      ? tradeConfigOf[0].maybePrice.value.toHuman()
                      : '0'
                  }
                  duration={{
                    heading: 'Auction end at',
                    endBlock:
                      tradeConfigOf[0].endBlock?.value.toNumber() as number,
                  }}
                >
                  <BundleBid
                    maybePrice={
                      tradeConfigOf[0].maybePrice?.isSome
                        ? tradeConfigOf[0].maybePrice.value.toHuman()
                        : '0'
                    }
                  />
                </BundleLayoutDuration>
              </CardBox>

              <BundleLayoutItems
                queryKey={`bundle/${id}`}
                heading="Bundles detail"
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
