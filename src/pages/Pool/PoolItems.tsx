import { Box, Center, Flex, Progress, Text } from '@chakra-ui/react';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper/types';
import { Thumbs } from 'swiper';
import RatioPicture from 'components/RatioPicture';
import { cloundinary_link } from 'axios/cloudinary_axios';
import { useParams } from 'react-router-dom';
import { lootTableOfProps } from 'hooks/useLootTableOf';
import { CalculatorOfRarity, ColorOfRarity } from 'utils/utils';
import useSupplyOf from 'hooks/useSupplyOf';
import { PoolServiceProps } from '.';
import { MetaNFTFieldProps } from 'hooks/useMetaNFT';
import { isNull } from '@polkadot/util';

interface PoolItemsProps {
  setThumbsSwiper: React.Dispatch<SwiperType>;
  lootTableOf: lootTableOfProps[];
  source: PoolServiceProps['source'];
  metaNFT: MetaNFTFieldProps[] | undefined;
}

export default ({
  setThumbsSwiper,
  lootTableOf,
  source,
  metaNFT,
}: PoolItemsProps) => {
  const { id } = useParams();

  const { supplyOf } = useSupplyOf({
    key: `pool_detail/${id}`,
    filter: 'collection_id',
    arg: source.map(({ maybeNfT }) => [
      maybeNfT.collection_id,
      maybeNfT.nft_id,
    ]),
  });

  return (
    <Box>
      <Text as="span" fontSize="sm" color="shader.a.600" mb={4}>
        {lootTableOf.length} Items
      </Text>

      <Box
        sx={{
          '.swiper-slide-thumb-active': {
            '> div': { borderColor: 'primary.a.500' },
          },
        }}
      >
        <Swiper
          modules={[Thumbs]}
          slidesPerView={lootTableOf.length}
          onSwiper={setThumbsSwiper}
          direction="vertical"
        >
          {React.Children.toArray(
            lootTableOf.map(meta => {
              const rarity = CalculatorOfRarity(
                meta.weight,
                lootTableOf.map(data => data.weight)
              );

              const currentMetaNFT = metaNFT?.find(
                data =>
                  data?.collection_id === meta.maybeNfT?.collection_id &&
                  data?.nft_id === meta.maybeNfT?.nft_id
              );

              const currentSupply = supplyOf?.find(
                ({ collection_id, nft_id }) =>
                  collection_id === meta.maybeNfT?.collection_id &&
                  nft_id === meta.maybeNfT.nft_id
              );

              return (
                <SwiperSlide>
                  <Flex
                    wordBreak="break-word"
                    borderRadius="xl"
                    gap={4}
                    mt={3}
                    padding={3}
                    border="0.0625rem solid"
                    borderColor="shader.a.300"
                  >
                    <RatioPicture
                      src={
                        currentMetaNFT?.avatar
                          ? cloundinary_link(currentMetaNFT.avatar)
                          : null
                      }
                      sx={{ width: 20, height: 20 }}
                    />

                    <Box flex={1}>
                      {meta.maybeNfT ? (
                        <Center justifyContent="space-between">
                          <Box>
                            <Text
                              as="strong"
                              color="shader.a.1000"
                              fontWeight="medium"
                            >
                              {currentMetaNFT?.title || 'unknown'}&nbsp;
                              <Text
                                as="span"
                                fontSize="sm"
                                color="shader.a.800"
                                fontWeight="normal"
                              >
                                ID: {meta.maybeNfT.nft_id}
                              </Text>
                            </Text>

                            <Text color="shader.a.600" fontSize="sm">
                              Rarity:&nbsp;
                              <Text
                                as="span"
                                fontWeight="medium"
                                color="shader.a.1000"
                              >
                                {rarity}%
                              </Text>
                            </Text>
                          </Box>

                          <Text color="shader.a.1000" fontWeight="medium">
                            {isNull(currentSupply?.supply)
                              ? 'Infinity'
                              : currentSupply?.supply}
                          </Text>
                        </Center>
                      ) : (
                        <>
                          <Text color="second.red" fontWeight="medium">
                            Failed
                          </Text>

                          <Text color="shader.a.1000" fontSize="sm">
                            Rarity:&nbsp;
                            <Text as="span" fontWeight="medium">
                              {rarity}%
                            </Text>
                          </Text>
                        </>
                      )}

                      <Progress
                        mt={4}
                        height={2}
                        borderRadius="lg"
                        value={Number(rarity)}
                        bg="shader.a.300"
                        sx={{
                          div: {
                            bg: ColorOfRarity(rarity),
                          },
                        }}
                      />
                    </Box>
                  </Flex>
                </SwiperSlide>
              );
            })
          )}
        </Swiper>
      </Box>
    </Box>
  );
};
