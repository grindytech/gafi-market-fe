import { Box, Center, Flex, Grid, Icon, Input, Text } from '@chakra-ui/react';
import { cloundinary_link } from 'axios/cloudinary_axios';
import RatioPicture from 'components/RatioPicture';
import useMetaCollection from 'hooks/useMetaCollection';
import useMetaNFT from 'hooks/useMetaNFT';

import BlockIcon from 'public/assets/line/block.svg';
import { useState } from 'react';
import { colors } from 'theme/theme';
import { ItemBalanceOfProps } from 'hooks/useItemBalanceOf';
import { UseFormSetValue } from 'react-hook-form';
import { AccountSwapFieldCommonProps } from '.';

interface AccountswapListElementProps {
  itemBalanceOf: ItemBalanceOfProps[];
  common: AccountSwapFieldCommonProps[] | undefined;
  queryKey: string;
  formState: {
    setValue: UseFormSetValue<any>;
    value: string;
  };
}

export default ({
  itemBalanceOf,
  common,
  queryKey,
  formState,
}: AccountswapListElementProps) => {
  const [search, setSearch] = useState('');

  const { metaNFT } = useMetaNFT({
    key: queryKey,
    filter: 'collection_id',
    arg: itemBalanceOf?.map(({ collection_id, nft_id }) => ({
      collection_id,
      nft_id,
    })),
  });

  const { MetaCollection } = useMetaCollection({
    key: queryKey,
    filter: 'collection_id',
    arg: itemBalanceOf?.map(meta => meta.collection_id),
  });

  const filterItemBalanceOf = itemBalanceOf
    ?.map(meta => {
      const currentMetaNFT = metaNFT?.find(
        data =>
          meta.collection_id === data?.collection_id &&
          meta.nft_id === data?.nft_id
      );

      const currentMetaCollection = MetaCollection?.find(
        data => data?.collection_id === meta.collection_id
      );

      const common = {
        ...meta,
        nft_meta: {
          title: currentMetaNFT?.title,
          image: currentMetaNFT?.image,
        },
        collection_meta: {
          title: currentMetaCollection?.title,
          image: currentMetaCollection?.image,
        },
      };

      // find Title Of NFT
      if (currentMetaNFT?.title.includes(search)) return common;

      // find NFT_ID
      if (search.includes(meta.nft_id as never)) return common;

      // find Title Of Collection
      if (currentMetaCollection?.title.includes(search)) return common;

      // when not search
      if (!search.length) return common;
    })
    .filter((meta): meta is NonNullable<typeof meta> => !!meta);

  return (
    <>
      <Input
        position="sticky"
        top="4.5rem"
        zIndex="11" // docked + 1 needs than <div> wrapper card
        bg="white"
        placeholder="Search by name or ID..."
        borderRadius="lg"
        borderColor="shader.a.300"
        color="shader.a.900"
        onChange={event => setSearch(event.target.value)}
        _focusVisible={{
          borderColor: 'blue.500',
        }}
        _placeholder={{
          color: 'shader.a.500',
        }}
      />

      {filterItemBalanceOf?.length ? (
        <Grid
          mt={4}
          gridTemplateColumns={{
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            xl: 'repeat(4, 1fr)',
          }}
          gap={4}
        >
          {filterItemBalanceOf.map((meta, index) => {
            const isActive = common?.find(
              data =>
                data?.collection_id === meta.collection_id &&
                data?.nft_id === meta.nft_id
            );

            return (
              <Box
                key={`${meta.collection_id}/${meta.nft_id}`}
                fontWeight="medium"
                color="shader.a.1000"
                overflow="hidden"
                bg="white"
                borderRadius="xl"
                boxShadow="0px 0.1875rem 0.875rem 0px rgba(0, 0, 0, 0.05)"
                outline={
                  isActive
                    ? `0.125rem solid ${colors.primary.a[500]}`
                    : `0.0625rem solid ${colors.shader.a[300]}`
                }
                onClick={() => {
                  if (!isActive) {
                    formState.setValue(`${formState.value}.${index}`, {
                      collection_id: meta.collection_id,
                      nft_id: meta.nft_id,
                      image: meta.nft_meta.image || null,
                      title: meta.nft_meta.title || null,
                      amount: 1,
                    });
                  }
                }}
              >
                <Center
                  margin={2}
                  py={1}
                  px={1.5}
                  gap={1}
                  fontSize="sm"
                  position="absolute"
                  zIndex="docked"
                  bg="white"
                  borderRadius="md"
                  border="0.0625rem solid"
                  borderColor="shader.a.300"
                >
                  <Icon
                    as={BlockIcon}
                    width={4}
                    height={4}
                    color="primary.a.500"
                  />
                  x{meta.amount}
                </Center>

                <RatioPicture
                  src={
                    meta.nft_meta?.image
                      ? cloundinary_link(meta.nft_meta.image)
                      : null
                  }
                  sx={{ height: 60 }}
                />

                <Box padding={4}>
                  <Text color="#71717A">
                    {meta.collection_meta.title || '-'}
                  </Text>

                  <Flex justifyContent="space-between">
                    <Text fontSize="md">{meta.nft_meta.title || '-'}</Text>

                    <Text>ID: {meta.nft_id}</Text>
                  </Flex>
                </Box>
              </Box>
            );
          })}
        </Grid>
      ) : null}
    </>
  );
};
