import { Box, Flex } from '@chakra-ui/react';

import CardBox from 'components/CardBox';
import useLootTableOf, { lootTableOfProps } from 'hooks/useLootTableOf';
import useMetaNFT from 'hooks/useMetaNFT';
import usePoolOf, { poolOfProps } from 'hooks/usePoolOf';
import BundleLayoutCardHeading from 'layouts/BundleLayout/BundleLayoutCardHeading';
import BundleLayoutExpires from 'layouts/BundleLayout/BundleLayoutExpires';
import BundleLayoutHeading from 'layouts/BundleLayout/BundleLayoutHeading';
import BundleLayoutModelSwiper from 'layouts/BundleLayout/BundleLayoutModelSwiper';
import BundleLayoutOwner from 'layouts/BundleLayout/BundleLayoutOwner';
import BundleLayoutPrice from 'layouts/BundleLayout/BundleLayoutPrice';
import BundleLayoutSocial from 'layouts/BundleLayout/BundleLayoutSocial';
import DefaultDetail from 'layouts/DefaultLayout/DefaultDetail';
import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { formatGAFI } from 'utils/utils';

import { Swiper as SwiperType } from 'swiper/types';
import BundleLayoutMenu from 'layouts/BundleLayout/BundleLayoutMenu';
import PoolItems from './PoolItems';
import PoolNow from './PoolNow';

export interface PoolServiceProps {
  poolOf: poolOfProps[];
  lootTableOf: lootTableOfProps[];
  source: {
    weight: number;
    maybeNfT: {
      collection_id: number;
      nft_id: number;
    };
  }[];
}

export default () => {
  const { id } = useParams();

  const { poolOf } = usePoolOf({
    key: `pool_detail/${id}`,
    filter: 'pool_id',
    arg: [Number(id)],
  });

  const { lootTableOf } = useLootTableOf({
    key: `pool_detail/${id}`,
    filter: 'pool_id',
    arg: [Number(id)],
  });

  const source = lootTableOf?.filter(
    meta => !!meta.maybeNfT
  ) as PoolServiceProps['source'];

  return (
    <>
      {poolOf?.length && lootTableOf?.length ? (
        <PoolServiceProps
          poolOf={poolOf}
          lootTableOf={lootTableOf}
          source={source}
        />
      ) : null}
    </>
  );
};

function PoolServiceProps({ poolOf, lootTableOf, source }: PoolServiceProps) {
  const { id } = useParams();
  const navigation = useNavigate();

  const { metaNFT } = useMetaNFT({
    key: `mint_detail/${id}`,
    filter: 'collection_id',
    arg: source.map(({ maybeNfT }) => ({
      collection_id: maybeNfT.collection_id,
      nft_id: maybeNfT.nft_id,
    })),
  });

  const swiperRef = useRef<SwiperType>();

  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  const ListMenu = [
    {
      key: 0,
      heading: 'Detail',
      onClick: () => {
        if (swiperRef.current && lootTableOf) {
          const meta = lootTableOf[swiperRef.current.realIndex];

          if (meta?.maybeNfT) {
            navigation({
              pathname: `/nft/${meta.maybeNfT.nft_id}/${meta.maybeNfT.collection_id}`,
            });
          }
        }
      },
    },
  ];

  return (
    <DefaultDetail>
      <BundleLayoutModelSwiper
        bundleOf={
          lootTableOf.map(({ maybeNfT }) => ({
            collection_id: maybeNfT?.collection_id,
            nft_id: maybeNfT?.nft_id,
          })) as never
        }
        swiperRef={swiperRef}
        thumbs={thumbsSwiper}
        metaNFT={metaNFT}
      >
        <BundleLayoutSocial />

        <BundleLayoutMenu menu={ListMenu} />
      </BundleLayoutModelSwiper>

      <Box>
        <CardBox variant="baseStyle">
          <BundleLayoutCardHeading>
            <BundleLayoutHeading heading="Mint detail" />

            <BundleLayoutOwner owner={String(poolOf[0].owner)} />

            <BundleLayoutMenu menu={ListMenu} />
          </BundleLayoutCardHeading>

          <CardBox variant="baseStyle" padding={0}>
            <BundleLayoutExpires
              end={poolOf[0].endBlock.isEmpty ? 'Infinity' : 'Expired'}
              heading="Pool"
              endBlock={
                poolOf[0].endBlock.isSome
                  ? poolOf[0].endBlock.value.toNumber()
                  : -1
              }
            />

            <BundleLayoutPrice amount={formatGAFI(poolOf[0].price)} />

            <Flex gap={2} padding={6} pt={0}>
              <PoolNow
                pool_id={Number(id)}
                price={poolOf[0].price}
                metaNFT={metaNFT}
              />
            </Flex>
          </CardBox>

          <CardBox variant="baseStyle" mt={4}>
            <PoolItems
              lootTableOf={lootTableOf}
              source={source}
              setThumbsSwiper={setThumbsSwiper}
              metaNFT={metaNFT}
            />
          </CardBox>
        </CardBox>
      </Box>
    </DefaultDetail>
  );
}
