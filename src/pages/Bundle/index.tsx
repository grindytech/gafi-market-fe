import { Box, Center, CircularProgress, Stack } from '@chakra-ui/react';
import CardBox from 'components/CardBox';
import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import useMetaNFT from 'hooks/useMetaNFT';

import { Swiper as SwiperType } from 'swiper/types';

import BundleBid from './BundleBid';
import useTradeConfigOf from 'hooks/useTradeConfigOf';
import useBundleOf from 'hooks/useBundleOf';

import DefaultDetail from 'layouts/DefaultLayout/DefaultDetail';

import SwiperLayoutThumb from 'layouts/SwiperLayout/SwiperLayoutThumb';
import DetailSocial from 'layouts/Detail/DetailSocial';
import DetailMenu from 'layouts/Detail/DetailMenu';

import DetailCollectionName from 'layouts/Detail/DetailCollectionName';
import DetailOwnerBy from 'layouts/Detail/DetailOwnerBy';
import DetailExpires from 'layouts/Detail/DetailExpires';
import DetailPrice from 'layouts/Detail/DetailPrice';
import SwiperLayoutItems from 'layouts/SwiperLayout/SwiperLayoutItems';

export default function Bundle() {
  const { id } = useParams();
  const navigation = useNavigate();

  const swiperRef = useRef<SwiperType>();

  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  const { tradeConfigOf, isLoading } = useTradeConfigOf({
    key: `bundle_detail/${id}`,
    filter: 'trade_id',
    arg: [Number(id)],
  });

  const { bundleOf, isLoading: isLoadingBundle } = useBundleOf({
    key: `bundle_detail/${id}`,
    filter: 'trade_id',
    arg: [Number(id)],
  });

  const { metaNFT } = useMetaNFT({
    key: `bundle_detail/${id}`,
    filter: 'collection_id',
    arg: bundleOf?.map(({ collection_id, nft_id }) => ({
      collection_id,
      nft_id,
    })),
    async: isLoadingBundle,
  });

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
              <Stack>
                <DetailCollectionName name="Bundle detail" />

                <DetailOwnerBy owner={tradeConfigOf[0].owner} />
              </Stack>

              <CardBox variant="baseStyle" padding={0} mt={6}>
                <DetailExpires
                  heading="Bundle"
                  endBlock={tradeConfigOf[0].endBlock.value.toNumber()}
                />

                <DetailPrice
                  amount={tradeConfigOf[0].maybePrice.value.toHuman()}
                />

                <Box padding={6} pt={0}>
                  <BundleBid
                    maybePrice={tradeConfigOf[0].maybePrice.value.toNumber()}
                  />
                </Box>
              </CardBox>
            </CardBox>

            <CardBox variant="baseStyle" mt={4}>
              <Box>
                <SwiperLayoutItems
                  queryKey={`bundle_detail/${id}`}
                  setThumbsSwiper={setThumbsSwiper}
                  bundleOf={bundleOf.map(
                    ({ collection_id, nft_id, amount }) => ({
                      collection_id,
                      nft_id,
                      amount,
                    })
                  )}
                />
              </Box>
            </CardBox>
          </Box>
        </DefaultDetail>
      ) : null}
    </Box>
  );
}
