import {
  Box,
  Button,
  Center,
  CircularProgress,
  Container,
  Grid,
  Icon,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import RatioPicture from 'components/RatioPicture';

import { useAppSelector } from 'hooks/useRedux';
import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import BlockIcon from 'public/assets/line/block.svg';

import AccountOwnerMenu from './AccountOwnerMenu';
import useMetaCollection from 'hooks/useMetaCollection';
import useMetaNFT from 'hooks/useMetaNFT';
import { cloundinary_link } from 'axios/cloudinary_axios';

import useToggleMultiple from 'hooks/useToggleMultiple';
import { colors } from 'theme/theme';
import { hexToString } from '@polkadot/util';
import AccountOwnerModal from './AccountOwnerModal';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { convertHex } from 'utils/utils';
import useItemBalanceOf from 'hooks/useItemBalanceOf';

export interface AccountOwnerFieldProps {
  price: number;
  duration: number;
  product: {
    collection: {
      id: number;
      title: string | undefined;
    };
    nft: {
      id: number;
      amount: number;
      title: string | undefined;
      image: string | undefined;
      selected: number;
    };
  }[];
}

export default function AccountOwner() {
  const { account } = useAppSelector(state => state.injected.polkadot);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { address } = useParams();

  const [searchParams, setSearchParams] = useSearchParams();
  const select_nft = searchParams.get('select_nft');

  const { itemBalanceOf, isLoading } = useItemBalanceOf({
    key: `account/${address}`,
    filter: 'address',
    arg: [address as string],
  });

  const { metaNFT } = useMetaNFT({
    key: `account/${address}/${JSON.stringify(itemBalanceOf)}`,
    filter: 'collection_id',
    arg: itemBalanceOf?.map(({ collection_id, nft_id }) => ({
      collection_id,
      nft_id,
    })),
  });

  const { MetaCollection } = useMetaCollection({
    key: `account/${address}/${JSON.stringify(itemBalanceOf)}`,
    filter: 'collection_id',
    arg: itemBalanceOf?.map(({ collection_id }) => collection_id),
  });

  const { isExpanded, setIsExpanded, setExpanded, removeIsExpanded } =
    useToggleMultiple({});

  const { setValue, reset, control, watch } = useForm<AccountOwnerFieldProps>();

  // found query URL
  React.useEffect(() => {
    if (select_nft) {
      const formatSelected: number[] = JSON.parse(hexToString(select_nft));

      formatSelected.forEach(select => {
        const [collection_id, nft_id] = String(select).split('/');

        itemBalanceOf?.some(meta => {
          const isCollection = meta.collection_id === Number(collection_id);
          const isNFT = meta.nft_id === Number(nft_id);
          const isAmount = meta.amount;

          if (isCollection && isNFT && isAmount) {
            setIsExpanded(select);
          }
        });
      });
    }
  }, [select_nft, itemBalanceOf]);

  // isExpaded changed
  React.useEffect(() => {
    Object.keys(isExpanded).forEach(meta => {
      const [collection_id, nft_id] = meta.split('/');

      const currentMetaNFT = metaNFT?.find(
        meta =>
          meta?.collection_id === Number(collection_id) &&
          meta.nft_id === Number(nft_id)
      );

      const currentMetaCollection = MetaCollection?.find(
        meta => meta?.collection_id === Number(collection_id)
      );

      const currentMetaAmount = itemBalanceOf?.find(
        meta =>
          meta.collection_id === Number(collection_id) &&
          meta.nft_id === Number(nft_id)
      );

      setValue(`product.${meta as unknown as number}`, {
        collection: {
          id: Number(collection_id),
          title: currentMetaCollection?.title,
        },
        nft: {
          id: Number(nft_id),
          image: currentMetaNFT?.image,
          title: currentMetaNFT?.title,
          amount: currentMetaAmount?.amount,
        },
      } as keyof typeof setValue);
    });
  }, [isExpanded]);

  const selecting = Object.values(isExpanded || []);

  if (isLoading)
    return (
      <Center height="100vh">
        <CircularProgress isIndeterminate color="second.purple" />
      </Center>
    );

  return (
    <>
      {itemBalanceOf?.length ? (
        <>
          <Grid gridTemplateColumns="repeat(5, 1fr)" gap={4}>
            {itemBalanceOf.map(({ collection_id, nft_id, amount }) => {
              const currentMetaNFT = metaNFT?.find(
                meta =>
                  meta?.collection_id === collection_id &&
                  meta.nft_id === nft_id
              );

              const currentMetaCollection = MetaCollection?.find(
                meta => meta?.collection_id === collection_id
              );

              const key = `${collection_id}/${nft_id}` as unknown as number;
              const isActive = isExpanded[key];
              const isSelected = selecting.some(item => !!item);
              const isOwner = account?.address === address;

              return (
                <Box
                  key={key}
                  borderRadius="xl"
                  border="0.0625rem solid"
                  borderColor="shader.a.300"
                  boxShadow={
                    isActive
                      ? `0px 0px 0px 0.125rem ${colors.primary.a[500]}`
                      : `
                      0px 0.1875rem 0.875rem 0px ${convertHex('#000000', 0.05)}`
                  }
                  bg="white"
                  overflow="hidden"
                  position="relative"
                  role={isSelected ? undefined : 'group'}
                >
                  <Box
                    as={Link}
                    to={`/nft/${nft_id}/${collection_id}`}
                    onClick={(
                      event: React.MouseEvent<HTMLDivElement, MouseEvent>
                    ) => {
                      if (isSelected) {
                        event.preventDefault();
                      }

                      if (amount && isSelected) {
                        setIsExpanded(key);
                      }

                      if (isActive) {
                        removeIsExpanded(key);
                        reset();
                      }
                    }}
                  >
                    <RatioPicture
                      src={
                        currentMetaNFT?.image
                          ? cloundinary_link(currentMetaNFT.image)
                          : null
                      }
                      sx={{ height: 56, borderRadius: 'inherit' }}
                    />

                    <Box padding={4} position="relative" fontWeight="medium">
                      <Text as="strong" fontSize="sm" color="shader.a.500">
                        {currentMetaCollection?.title || '-'}
                      </Text>

                      <Center
                        justifyContent="space-between"
                        color="shader.a.900"
                      >
                        <Text>{currentMetaNFT?.title || '-'}</Text>

                        <Text as="span" fontSize="sm">
                          ID: {nft_id}
                        </Text>
                      </Center>
                    </Box>

                    <Center
                      borderRadius="md"
                      gap={1}
                      px={1.5}
                      py={1}
                      margin={2}
                      bg="white"
                      position="absolute"
                      inset="0 auto auto 0"
                      border="0.0625rem solid"
                      borderColor="shader.a.300"
                    >
                      <Icon
                        width={4}
                        height={4}
                        as={BlockIcon}
                        color="primary.a.500"
                      />

                      <Text
                        color="shader.a.900"
                        fontSize="sm"
                        fontWeight="medium"
                      >
                        x{amount}
                      </Text>
                    </Center>
                  </Box>

                  {isOwner && (
                    <AccountOwnerMenu
                      target={key}
                      setIsExpanded={setIsExpanded}
                    />
                  )}
                </Box>
              );
            })}
          </Grid>

          <Box
            opacity={selecting.length ? 1 : 0}
            pointerEvents={selecting.length ? undefined : 'none'}
            transitionDuration="ultra-slow"
            position="fixed"
            inset="auto 0 0 0"
            borderTop="0.0625rem solid"
            borderColor="shader.a.300"
            py={4}
            bg="white"
            zIndex="dropdown"
          >
            <Container as={Center} justifyContent="space-between">
              <Button
                variant="cancel"
                px={6}
                onClick={() => {
                  setExpanded({});
                  reset();
                }}
              >
                Clear selected
              </Button>

              <Button
                variant="primary"
                px={6}
                _hover={{}}
                bg={selecting.length >= 2 ? 'shader.a.900' : undefined}
                onClick={onOpen}
              >
                {selecting.length >= 2 ? 'Sell Bundles' : 'Sell Now'}

                {isOpen && (
                  <AccountOwnerModal
                    onClose={onClose}
                    onSuccess={() => {
                      onClose();
                      setExpanded({});

                      // reset react-form-hook
                      reset();

                      // reset query
                      searchParams.delete('select_nft');
                      setSearchParams(searchParams);
                    }}
                    formState={{
                      control,
                      setValue,
                      watch,
                    }}
                  />
                )}
              </Button>
            </Container>
          </Box>
        </>
      ) : (
        <Center>Empty</Center>
      )}
    </>
  );
}
