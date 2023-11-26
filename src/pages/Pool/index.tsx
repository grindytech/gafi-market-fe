import { Box, Center, CircularProgress, Flex, Stack } from '@chakra-ui/react';

import CardBox from 'components/CardBox';
import { lootTableOfProps } from 'hooks/useLootTableOf';
import { MetaNFTFieldProps } from 'hooks/useMetaNFT';
import { poolOfProps } from 'hooks/usePoolOf';

import DefaultDetail from 'layouts/DefaultLayout/DefaultDetail';
import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Swiper as SwiperType } from 'swiper/types';

import PoolItems from './PoolItems';
import PoolNow from './PoolNow';
import SwiperLayoutThumb from 'layouts/SwiperLayout/SwiperLayoutThumb';
import DetailSocial from 'layouts/Detail/DetailSocial';
import DetailMenu from 'layouts/Detail/DetailMenu';
import DetailCollectionName from 'layouts/Detail/DetailCollectionName';
import DetailOwnerBy from 'layouts/Detail/DetailOwnerBy';
import DetailExpires from 'layouts/Detail/DetailExpires';
import DetailPrice from 'layouts/Detail/DetailPrice';
import { useQuery } from '@tanstack/react-query';
import axiosSwagger from 'axios/axios.swagger';
import { TypeSwaggerNFTData } from 'types/swagger.type';

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
  const navigation = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: [`pool_detail ne/${id}`],
    queryFn: async () => {
      return axiosSwagger.poolSearch({
        body: {
          query: {
            pool_id: id as never,
          },
        },
      });
    },
  });

  const lootTable = data?.data.map(({ loot_table }) => loot_table).flat();

  const { data: dataNFT } = useQuery({
    queryKey: [`pool_detail_nft/${id}`],
    queryFn: async () => {
      if (lootTable?.length) {
        return Promise.all(
          lootTable.map(async meta => {
            if (meta.nft) {
              const service = await axiosSwagger.nftSearch({
                body: {
                  query: {
                    collection_id: meta.nft?.collection as never,
                    token_id: meta.nft?.item as never,
                  },
                },
              });

              return service.data;
            }
          })
        ).then(data =>
          data.flat().filter((meta): meta is NonNullable<typeof meta> => !!meta)
        );
      }

      return [] as Partial<TypeSwaggerNFTData['data']>;
    },
    enabled: !!lootTable?.length,
  });

  const swiperRef = useRef<SwiperType>();

  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  const ListMenu = [
    {
      key: 0,
      heading: 'Detail',
      onClick: () => {
        if (swiperRef.current && lootTable?.length) {
          const meta = lootTable[swiperRef.current.realIndex];

          if (meta?.nft) {
            navigation({
              pathname: `/nft/${meta.nft.item}/${meta.nft.collection}`,
            });
          }
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

  if (!data?.data.length || isError || !lootTable?.length) {
    return <Center height="100vh">Not Found</Center>;
  }

  return (
    <DefaultDetail>
      <SwiperLayoutThumb
        metaNFT={
          dataNFT?.map(meta => ({
            collection_id: meta?.collection_id,
            nft_id: meta?.token_id,
            image: meta?.image,
          })) as MetaNFTFieldProps[]
        }
        bundleOf={lootTable
          .filter(meta => !!meta.nft)
          .map(({ nft }) => ({
            collection_id: nft.collection,
            nft_id: nft.item,
          }))}
        swiperRef={swiperRef}
        thumbs={thumbsSwiper}
      >
        <DetailSocial />

        <DetailMenu menu={ListMenu} />
      </SwiperLayoutThumb>

      <Box>
        <CardBox variant="baseStyle">
          <Stack>
            <DetailCollectionName name="Mint detail" />

            <DetailOwnerBy owner={data.data[0].owner} />
          </Stack>

          <CardBox variant="baseStyle" padding={0} mt={6}>
            <DetailExpires
              end={data.data[0].end_at ? 'Expired' : 'Infinity'}
              heading="Pool"
              endBlock={data.data[0].end_at || -1}
            />

            <DetailPrice amount={data.data[0].minting_fee} />

            <Flex gap={2} padding={6} pt={0}>
              <PoolNow pool_id={Number(id)} />
            </Flex>
          </CardBox>

          <CardBox variant="baseStyle" mt={4}>
            <PoolItems
              lootTable={lootTable}
              data={dataNFT as TypeSwaggerNFTData['data']}
              setThumbsSwiper={setThumbsSwiper}
            />
          </CardBox>
        </CardBox>
      </Box>
    </DefaultDetail>
  );
};
