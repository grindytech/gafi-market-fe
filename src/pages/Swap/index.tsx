import {
  Box,
  Center,
  CircularProgress,
  Flex,
  Icon,
  Stack,
} from '@chakra-ui/react';

import CardBox from 'components/CardBox';
import useBundleOf from 'hooks/useBundleOf';

import useTradeConfigOf from 'hooks/useTradeConfigOf';

import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Swiper as SwiperType } from 'swiper/types';

import SwapProfile from './SwapProfile';
import Swap01Icon from 'public/assets/line/swap-01.svg';
import SwapAccept from './SwapAccept';
import DefaultDetail from 'layouts/DefaultLayout/DefaultDetail';
import useMetaNFT from 'hooks/useMetaNFT';
import SwiperLayoutThumb from 'layouts/SwiperLayout/SwiperLayoutThumb';
import DetailSocial from 'layouts/Detail/DetailSocial';
import DetailMenu from 'layouts/Detail/DetailMenu';
import DetailCollectionName from 'layouts/Detail/DetailCollectionName';
import DetailOwnerBy from 'layouts/Detail/DetailOwnerBy';
import DetailExpires from 'layouts/Detail/DetailExpires';
import DetailPrice from 'layouts/Detail/DetailPrice';
import SwiperLayoutItems from 'layouts/SwiperLayout/SwiperLayoutItems';

export default () => {
  const { id } = useParams();

  const [tab, setTab] = useState(0);
  const navigation = useNavigate();
  const [thumbSwiper, setThumbSwiper] = useState<SwiperType | null>(null);
  const swiperRef = useRef<SwiperType>();

  const { tradeConfigOf, isLoading } = useTradeConfigOf({
    key: `swap_detail/${id}`,
    filter: 'trade_id',
    arg: [Number(id)],
  });

  const { bundleOf, isLoading: bundleOfIsLoading } = useBundleOf({
    key: `swap_detail/${id}`,
    filter: 'trade_id',
    arg: [Number(id)],
  });

  const trade_array = tradeConfigOf?.[0].maybeRequired.value.map(meta => ({
    collection_id: meta.collection.toNumber(),
    nft_id: meta.item.toNumber(),
  }));

  const bundle_array = bundleOf?.map(({ collection_id, nft_id }) => ({
    collection_id,
    nft_id,
  }));

  const { metaNFT } = useMetaNFT({
    key: tab === 0 ? `swap_detail_my/${id}` : `swap_detail_owner/${id}`,
    filter: 'collection_id',
    arg: tab === 0 ? bundle_array : trade_array,
    async: bundle_array ? bundleOfIsLoading : isLoading,
  });

  const ListMenu = [
    {
      heading: 'Detail',
      onClick: () => {
        if (swiperRef.current) {
          const meta = bundleOf?.[swiperRef.current.realIndex];

          navigation({
            pathname: `/nft/${meta?.nft_id}/${meta?.collection_id}`,
          });
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

  if (tradeConfigOf?.[0].maybeRequired.isNone)
    return <Center height="100vh">not found</Center>;

  return (
    <>
      {tradeConfigOf?.length && bundleOf?.length ? (
        <DefaultDetail>
          <SwiperLayoutThumb
            bundleOf={tab === 0 ? bundle_array : (trade_array as any)}
            metaNFT={metaNFT}
            swiperRef={swiperRef}
            thumbs={thumbSwiper}
          >
            <DetailSocial />

            <DetailMenu menu={ListMenu} />
          </SwiperLayoutThumb>

          <Box>
            <CardBox variant="baseStyle">
              <Stack spacing={1}>
                <DetailCollectionName name="Swap detail" />

                <DetailOwnerBy owner={tradeConfigOf[0].owner} />
              </Stack>

              <CardBox variant="baseStyle" padding={0} mt={6}>
                <DetailExpires
                  heading="Swap"
                  endBlock={tradeConfigOf[0].endBlock.value.toNumber()}
                />

                <DetailPrice
                  amount={tradeConfigOf[0].maybePrice.value.toHuman()}
                />

                <SwapAccept
                  maybePrice={tradeConfigOf[0].maybePrice.value.toNumber()}
                />
              </CardBox>
            </CardBox>

            <CardBox variant="baseStyle" mt={4}>
              <Flex mb={4} position="relative">
                <Center
                  padding={1.5}
                  bg="primary.a.500"
                  color="white"
                  position="absolute"
                  inset="50% auto auto 50%"
                  transform="translate(-50%, -50%)"
                  borderRadius="full"
                >
                  <Icon as={Swap01Icon} width={5} height={5} />
                </Center>

                <SwapProfile
                  address={Math.random().toString(36).slice(2, 12)}
                  name="-"
                  isActive={tab === 0}
                  sx={{
                    onClick: () => setTab(0),
                    borderRadius: '0.75rem 0 0 0.75rem',
                  }}
                />

                <SwapProfile
                  address={tradeConfigOf[0].owner}
                  name="-"
                  isActive={tab === 1}
                  sx={{
                    onClick: () => setTab(1),
                    borderRadius: '0 0.75rem 0.75rem 0',
                  }}
                />
              </Flex>

              <Box>
                <SwiperLayoutItems
                  queryKey={
                    tab === 0
                      ? `swap_detail_my/${id}`
                      : `swap_detail_owner/${id}`
                  }
                  setThumbsSwiper={setThumbSwiper}
                  bundleOf={
                    tab === 0
                      ? bundleOf.map(({ collection_id, nft_id, amount }) => ({
                          collection_id,
                          nft_id,
                          amount,
                        }))
                      : tradeConfigOf[0].maybeRequired.value.map(
                          ({ collection, item, amount }) => ({
                            collection_id: collection.toNumber(),
                            nft_id: item.toNumber(),
                            amount: amount.toNumber(),
                          })
                        )
                  }
                />
              </Box>
            </CardBox>
          </Box>
        </DefaultDetail>
      ) : null}
    </>
  );
};
