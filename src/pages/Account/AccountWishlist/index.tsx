import {
  Box,
  Button,
  Center,
  Container,
  Grid,
  Icon,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { cloundinary_link } from 'axios/cloudinary_axios';
import RatioPicture from 'components/RatioPicture';
import { ItemBalanceOfProps } from 'hooks/useItemBalanceOf';
import useMetaCollection from 'hooks/useMetaCollection';
import useMetaNFT from 'hooks/useMetaNFT';
import {
  Control,
  UseFormReset,
  UseFormSetValue,
  UseFormWatch,
  useForm,
} from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { WISHLIST_STORAGE_KEY } from 'utils/constants';
import BlockIcon from 'public/assets/line/block.svg';
import { colors } from 'theme/theme';
import { convertHex } from 'utils/utils';
import AccountWishlistMenu from './AccountWishlistMenu';
import useForceMount from 'hooks/useForceMount';
import AccountWishlistModal from './AccountWishlistModal';

interface AccountWishlistServiceProps {
  getWishlist: ItemBalanceOfProps[];
  setValue: UseFormSetValue<AccountWishlistFieldProps>;
  reset: UseFormReset<AccountWishlistFieldProps>;
  control: Control<AccountWishlistFieldProps, any>;
  watch: UseFormWatch<AccountWishlistFieldProps>;
}

export interface AccountWishlistFieldProps {
  price: number;
  selected?: number[];
  product?: {
    amount: string;
    collection_id: number;
    nft_id: number;
  }[];
}

export default () => {
  const wishlist_storage = localStorage.getItem(WISHLIST_STORAGE_KEY);

  const getWishlist: ItemBalanceOfProps[] = wishlist_storage
    ? JSON.parse(wishlist_storage)
    : [];

  const { setValue, reset, control, watch } =
    useForm<AccountWishlistFieldProps>();

  return (
    <>
      {getWishlist?.length ? (
        <AccountWishlistService
          getWishlist={getWishlist}
          setValue={setValue}
          reset={reset}
          control={control}
          watch={watch}
        />
      ) : (
        <Center>Empty</Center>
      )}
    </>
  );
};

function AccountWishlistService({
  getWishlist,
  setValue,
  reset,
  control,
  watch,
}: AccountWishlistServiceProps) {
  const { product } = watch();
  const { address } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { setMounting } = useForceMount();

  const { metaNFT } = useMetaNFT({
    key: `account_wishlist/${address}`,
    filter: 'collection_id',
    arg: getWishlist.map(({ collection_id, nft_id }) => ({
      collection_id,
      nft_id,
    })),
  });

  const { MetaCollection } = useMetaCollection({
    key: `account_wishlist/${address}`,
    filter: 'collection_id',
    arg: getWishlist.map(({ collection_id }) => collection_id),
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
        {getWishlist.map((meta, index) => {
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
                    {currentMetaCollection?.title || '-'}
                  </Text>

                  <Center justifyContent="space-between" color="shader.a.900">
                    <Text>{currentMetaNFT?.title || '-'}</Text>

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

              <AccountWishlistMenu
                index={index}
                setValue={setValue}
                getWishlist={getWishlist}
                meta={meta}
                refetch={setMounting}
              />
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
            bg="shader.a.1000"
            onClick={onOpen}
          >
            Create wishlist
          </Button>

          {isOpen && (
            <AccountWishlistModal
              onClose={onClose}
              onSuccess={() => {
                onClose();

                // reset react-form-hook
                reset();

                const filter = getWishlist.filter(
                  ({ collection_id, nft_id }) =>
                    !product?.some(
                      meta =>
                        meta.collection_id === collection_id &&
                        meta.nft_id === nft_id
                    )
                );

                localStorage.setItem(
                  WISHLIST_STORAGE_KEY,
                  JSON.stringify(filter)
                );

                setMounting();
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
