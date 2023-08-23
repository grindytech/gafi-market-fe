import { Box, Center, CircularProgress } from '@chakra-ui/react';
import CardBox from 'components/CardBox';
import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import useMetaNFT from 'hooks/useMetaNFT';

import { Swiper as SwiperType } from 'swiper/types';

import BundleBid from './BundleBid';
import useTradeConfigOf from 'hooks/useTradeConfigOf';
import useBundleOf from 'hooks/useBundleOf';
import { Option, Vec, u128, u32 } from '@polkadot/types';
import {
  GafiSupportGameTypesPackage,
  GafiSupportGameTypesTradeType,
} from '@polkadot/types/lookup';
import DefaultDetail from 'layouts/DefaultLayout/DefaultDetail';
import BundleLayoutModelSwiper from 'layouts/BundleLayout/BundleLayoutModelSwiper';
import BundleLayoutSocial from 'layouts/BundleLayout/BundleLayoutSocial';
import BundleLayoutMenu from 'layouts/BundleLayout/BundleLayoutMenu';
import BundleLayoutCardHeading from 'layouts/BundleLayout/BundleLayoutCardHeading';
import BundleLayoutHeading from 'layouts/BundleLayout/BundleLayoutHeading';
import BundleLayoutOwner from 'layouts/BundleLayout/BundleLayoutOwner';
import BundleLayoutExpires from 'layouts/BundleLayout/BundleLayoutExpires';
import BundleLayoutPrice from 'layouts/BundleLayout/BundleLayoutPrice';
import BundleLayoutItems from 'layouts/BundleLayout/BundleLayoutItems';

interface BundleServiceProps {
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

export default function Bundle() {
  const { id } = useParams();

  const { tradeConfigOf, isLoading } = useTradeConfigOf({
    key: `bundle_detail/${id}`,
    filter: 'trade_id',
    arg: [Number(id)],
  });

  const { bundleOf } = useBundleOf({
    key: `bundle_detail/${id}`,
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
    <Box>
      {tradeConfigOf?.length && bundleOf?.length ? (
        <BundleService bundleOf={bundleOf} tradeConfigOf={tradeConfigOf} />
      ) : null}
    </Box>
  );
}

function BundleService({ bundleOf, tradeConfigOf }: BundleServiceProps) {
  const navigation = useNavigate();
  const { id } = useParams();

  const { metaNFT } = useMetaNFT({
    key: `bundle_detail/${id}`,
    filter: 'collection_id',
    arg: bundleOf.map(({ collection_id, nft_id }) => ({
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
                heading="Bundle detail"
                sx={{
                  as: 'h3',
                }}
              />

              <BundleLayoutOwner owner={tradeConfigOf[0].owner} />
            </BundleLayoutCardHeading>

            <CardBox variant="baseStyle" padding={0}>
              <BundleLayoutExpires
                heading="Bundle"
                endBlock={tradeConfigOf[0].endBlock.value.toNumber()}
              />

              <BundleLayoutPrice
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
              <BundleLayoutItems
                queryKey={`bundle_detail/${id}`}
                setThumbsSwiper={setThumbsSwiper}
                bundleOf={bundleOf.map(({ collection_id, nft_id, amount }) => ({
                  collection_id,
                  nft_id,
                  amount,
                }))}
              />
            </Box>
          </CardBox>
        </Box>
      </DefaultDetail>
    </>
  );
}
