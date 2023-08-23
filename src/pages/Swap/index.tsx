import { Box, Center, Flex, Icon } from '@chakra-ui/react';
import { Option, Vec, u128, u32 } from '@polkadot/types';
import {
  GafiSupportGameTypesPackage,
  GafiSupportGameTypesTradeType,
} from '@polkadot/types/lookup';
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
import BundleLayoutModelSwiper from 'layouts/BundleLayout/BundleLayoutModelSwiper';
import BundleLayoutSocial from 'layouts/BundleLayout/BundleLayoutSocial';
import BundleLayoutMenu from 'layouts/BundleLayout/BundleLayoutMenu';
import BundleLayoutCardHeading from 'layouts/BundleLayout/BundleLayoutCardHeading';
import BundleLayoutHeading from 'layouts/BundleLayout/BundleLayoutHeading';
import BundleLayoutOwner from 'layouts/BundleLayout/BundleLayoutOwner';
import BundleLayoutExpires from 'layouts/BundleLayout/BundleLayoutExpires';
import BundleLayoutPrice from 'layouts/BundleLayout/BundleLayoutPrice';
import BundleLayoutItems from 'layouts/BundleLayout/BundleLayoutItems';

interface SwapServiceProps {
  bundleOf: {
    trade_id: number;
    collection_id: number;
    nft_id: number;
    amount: number;
  }[];
  tradeConfigOf: {
    trade_id: number;
    trade: GafiSupportGameTypesTradeType;
    owner: string;
    maybePrice: Option<u128>;
    maybeRequired: Option<Vec<GafiSupportGameTypesPackage>>;
    endBlock: Option<u32>;
  }[];
}

export default () => {
  const { id } = useParams();

  const { tradeConfigOf } = useTradeConfigOf({
    key: `swap_detail/${id}`,
    filter: 'trade_id',
    arg: [Number(id)],
  });

  const { bundleOf } = useBundleOf({
    key: `swap_detail/${id}`,
    filter: 'trade_id',
    arg: [Number(id)],
  });

  return (
    <>
      {tradeConfigOf?.length && bundleOf?.length ? (
        <SwapService bundleOf={bundleOf} tradeConfigOf={tradeConfigOf} />
      ) : null}
    </>
  );
};

function SwapService({ bundleOf, tradeConfigOf }: SwapServiceProps) {
  const { id } = useParams();
  const [tab, setTab] = useState(0);
  const navigation = useNavigate();

  const [thumbSwiper, setThumbSwiper] = useState<SwiperType | null>(null);
  const swiperRef = useRef<SwiperType>();

  const trade_array = tradeConfigOf[0].maybeRequired.value.map(meta => ({
    collection_id: meta.collection.toNumber(),
    nft_id: meta.item.toNumber(),
  }));

  const bundle_array = bundleOf.map(({ collection_id, nft_id }) => ({
    collection_id,
    nft_id,
  }));

  const { metaNFT } = useMetaNFT({
    key: tab === 0 ? `swap_detail_my/${id}` : `swap_detail_owner/${id}`,
    filter: 'collection_id',
    arg: tab === 0 ? bundle_array : trade_array,
  });

  const ListMenu = [
    {
      heading: 'Detail',
      onClick: () => {
        if (swiperRef.current) {
          const meta = bundleOf[swiperRef.current.realIndex];

          navigation({ pathname: `/nft/${meta.nft_id}/${meta.collection_id}` });
        }
      },
    },
  ];

  return (
    <DefaultDetail>
      <BundleLayoutModelSwiper
        bundleOf={tab === 0 ? bundle_array : trade_array}
        metaNFT={metaNFT}
        swiperRef={swiperRef}
        thumbs={thumbSwiper}
      >
        <BundleLayoutSocial />

        <BundleLayoutMenu menu={ListMenu} />
      </BundleLayoutModelSwiper>

      <Box>
        <CardBox variant="baseStyle">
          <BundleLayoutCardHeading>
            <BundleLayoutHeading heading="Swap detail" />

            <BundleLayoutOwner owner={tradeConfigOf[0].owner} />
          </BundleLayoutCardHeading>

          <CardBox variant="baseStyle" padding={0}>
            <BundleLayoutExpires
              heading="Swap"
              endBlock={tradeConfigOf[0].endBlock.value.toNumber()}
            />

            <BundleLayoutPrice
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
            <BundleLayoutItems
              queryKey={
                tab === 0 ? `swap_detail_my/${id}` : `swap_detail_owner/${id}`
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
  );
}
