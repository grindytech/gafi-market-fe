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

import { useEffect } from 'react';
import {
  SetURLSearchParams,
  useParams,
  useSearchParams,
} from 'react-router-dom';

import BlockIcon from 'public/assets/line/block.svg';

import AccountOwnerMenu from './AccountOwnerMenu';
import useMetaCollection from 'hooks/useMetaCollection';
import useMetaNFT from 'hooks/useMetaNFT';
import { cloundinary_link } from 'axios/cloudinary_axios';

import { colors } from 'theme/theme';
import { hexToString } from '@polkadot/util';
import AccountOwnerModal from './AccountOwnerModal';
import {
  Control,
  UseFormReset,
  UseFormSetValue,
  UseFormWatch,
  useForm,
} from 'react-hook-form';
import { Link } from 'react-router-dom';
import { convertHex } from 'utils/utils';
import useItemBalanceOf, { ItemBalanceOfProps } from 'hooks/useItemBalanceOf';

export interface AccountOwnerFieldProps {
  price: number;
  selected?: number[];
  product?: {
    amount: string;
    collection_id: number;
    nft_id: number;
  }[];
}

interface AccountOwnerServiceProps {
  itemBalanceOf: ItemBalanceOfProps[];

  // react-form
  setValue: UseFormSetValue<AccountOwnerFieldProps>;
  reset: UseFormReset<AccountOwnerFieldProps>;
  control: Control<AccountOwnerFieldProps, any>;
  watch: UseFormWatch<AccountOwnerFieldProps>;

  // query
  setSearchParams: SetURLSearchParams;
  searchParams: URLSearchParams;
}

export default function AccountOwner() {
  const { address } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const select_nft = searchParams.get('select_nft');

  const { itemBalanceOf, isLoading } = useItemBalanceOf({
    key: `account/${address}`,
    filter: 'address',
    arg: [address as string],
  });

  const { setValue, reset, control, watch } = useForm<AccountOwnerFieldProps>();

  // select by query
  useEffect(() => {
    if (select_nft) {
      const parse_select: string[] = JSON.parse(hexToString(select_nft));

      parse_select.forEach((meta, index) => {
        const [collection_id, nft_id] = meta.split('/');

        const found_select = itemBalanceOf?.find(
          data =>
            data.collection_id === Number(collection_id) &&
            data.nft_id === Number(nft_id)
        );

        setValue(`product.${index}`, found_select as never);
      });
    }
  }, [searchParams, itemBalanceOf]);

  if (isLoading)
    return (
      <Center height="100vh">
        <CircularProgress isIndeterminate color="second.purple" />
      </Center>
    );

  return (
    <>
      {itemBalanceOf?.length ? (
        <AccountOwnerService
          itemBalanceOf={itemBalanceOf}
          // query
          searchParams={searchParams}
          setSearchParams={setSearchParams}
          // formControl
          setValue={setValue}
          control={control}
          watch={watch}
          reset={reset}
        />
      ) : (
        <Center>Empty</Center>
      )}
    </>
  );
}

function AccountOwnerService({
  itemBalanceOf,
  setValue,
  control,
  watch,
  reset,
  searchParams,
  setSearchParams,
}: AccountOwnerServiceProps) {
  const { product } = watch();
  const { address } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { metaNFT } = useMetaNFT({
    key: `account/${address}`,
    filter: 'collection_id',
    arg: itemBalanceOf?.map(({ collection_id, nft_id }) => ({
      collection_id,
      nft_id,
    })),
  });

  const { MetaCollection } = useMetaCollection({
    key: `account/${address}`,
    filter: 'collection_id',
    arg: itemBalanceOf.map(({ collection_id }) => collection_id),
  });

  const isSelected = Object.values(product || []).filter(meta => !!meta).length;

  return (
    <>
      <Grid
        gridTemplateColumns={{
          '2sm': 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
          xl: 'repeat(5, 1fr)',
        }}
        gap={4}
      >
        {itemBalanceOf.map((meta, index) => {
          const currentMetaNFT = metaNFT?.find(
            data =>
              data?.collection_id === meta.collection_id &&
              data.nft_id === meta.nft_id
          );

          const currentMetaCollection = MetaCollection?.find(
            data => data?.collection_id === meta.collection_id
          );

          const key = `${meta.nft_id}/${meta.collection_id}`;

          const isActive = product?.find(
            data =>
              data?.collection_id === meta.collection_id &&
              data?.nft_id === meta.nft_id
          );

          return (
            <Box
              key={key}
              borderRadius="xl"
              border="0.0625rem solid"
              borderColor="shader.a.300"
              boxShadow={
                isActive
                  ? `0px 0px 0px 0.125rem ${colors.primary.a[500]}`
                  : `0px 0.1875rem 0.875rem 0px ${convertHex('#000000', 0.05)}`
              }
              bg="white"
              overflow="hidden"
              position="relative"
              role={isSelected ? undefined : 'group'}
            >
              <Box
                as={Link}
                to={`/nft/${key}`}
                onClick={(event: any) => {
                  // isSelected will not navigation
                  if (isSelected) {
                    event.preventDefault();
                  }

                  // remove
                  if (isActive && product) {
                    product[index] = undefined as never;

                    setValue(`product`, product);
                  }

                  // add
                  if (!isActive) {
                    setValue(`product.${index}`, meta);
                  }
                }}
              >
                <RatioPicture
                  src={
                    currentMetaNFT?.avatar
                      ? cloundinary_link(currentMetaNFT.avatar)
                      : null
                  }
                  sx={{ height: 56, borderRadius: 'inherit' }}
                />

                <Box padding={4} position="relative" fontWeight="medium">
                  <Text as="strong" fontSize="sm" color="shader.a.500">
                    {currentMetaCollection?.title || 'unknown'}
                  </Text>

                  <Center justifyContent="space-between" color="shader.a.900">
                    <Text>{currentMetaNFT?.title || 'unknown'}</Text>

                    <Text as="span" fontSize="sm">
                      ID: {meta.nft_id}
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

                  <Text color="shader.a.900" fontSize="sm" fontWeight="medium">
                    x{meta.amount}
                  </Text>
                </Center>
              </Box>

              <AccountOwnerMenu index={index} setValue={setValue} meta={meta} />
            </Box>
          );
        })}
      </Grid>

      <Box
        opacity={isSelected ? 1 : 0}
        pointerEvents={isSelected ? undefined : 'none'}
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
          <Button variant="cancel" px={6} onClick={() => reset()}>
            Clear selected ({isSelected})
          </Button>

          <Button
            variant="primary"
            px={6}
            _hover={{}}
            bg={isSelected >= 2 ? 'shader.a.900' : undefined}
            onClick={onOpen}
          >
            {isSelected >= 2 ? 'Sell Bundles' : 'Sell Now'}
          </Button>

          {isOpen && (
            <AccountOwnerModal
              onClose={onClose}
              onSuccess={() => {
                onClose();

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
        </Container>
      </Box>
    </>
  );
}
