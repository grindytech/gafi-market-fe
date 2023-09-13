import { Box, Center, Flex, Progress, Text } from '@chakra-ui/react';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper/types';
import { Thumbs } from 'swiper';
import RatioPicture from 'components/RatioPicture';
import { CalculatorOfRarity, ColorOfRarity } from 'utils/utils';
import { TypeSwaggerNFTData } from 'types/swagger.type';

interface PoolItemsProps {
  data: TypeSwaggerNFTData['data'] | undefined;
  lootTable: {
    nft: { collection: number; item: number };
    weight: number;
  }[];
  setThumbsSwiper: React.Dispatch<SwiperType>;
}

export default ({ lootTable, setThumbsSwiper, data }: PoolItemsProps) => {
  return (
    <Box>
      <Text as="span" fontSize="sm" color="shader.a.600" mb={4}>
        {lootTable.length} Items
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
          slidesPerView={lootTable.length}
          onSwiper={setThumbsSwiper}
          direction="vertical"
        >
          {React.Children.toArray(
            lootTable.map(meta => {
              const rarity = CalculatorOfRarity(
                meta.weight,
                lootTable.map(data => data.weight)
              );

              const currentMetaNFT = data?.find(
                children =>
                  children?.collection_id === meta.nft?.collection &&
                  children?.token_id === meta.nft?.item
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
                    cursor="pointer"
                  >
                    <RatioPicture
                      src={currentMetaNFT?.image || null}
                      sx={{ width: 20, height: 20 }}
                    />

                    <Box flex={1}>
                      {meta.nft ? (
                        <Center justifyContent="space-between">
                          <Box>
                            <Text
                              as="strong"
                              color="shader.a.1000"
                              fontWeight="medium"
                            >
                              {currentMetaNFT?.name}&nbsp;
                              <Text
                                as="span"
                                fontSize="sm"
                                color="shader.a.800"
                                fontWeight="normal"
                              >
                                ID: {meta.nft.item}
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
                            {currentMetaNFT?.supply
                              ? currentMetaNFT.supply
                              : 'Infinity'}
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
