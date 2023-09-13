import {
  Box,
  Center,
  Heading,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react';

import RatioPicture from 'components/RatioPicture';

import { cloundinary_link } from 'axios/cloudinary_axios';
import AccountOwnerIncrement from './AccountOwnerIncrement';
import { Control, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { AccountOwnerFieldProps } from '.';

import useMetaNFT from 'hooks/useMetaNFT';
import useMetaCollection from 'hooks/useMetaCollection';
import { useParams } from 'react-router-dom';
import AccountOwnerModalTab from './AccountOwnerModalTab';
import { useEffect } from 'react';

interface AccountOwnerModalProps {
  onClose: () => void;
  onSuccess: () => void;
  formState: {
    control: Control<AccountOwnerFieldProps, any>;
    setValue: UseFormSetValue<AccountOwnerFieldProps>;
    watch: UseFormWatch<AccountOwnerFieldProps>;
  };
}

export default function AccountOwnerModal({
  formState,
  onClose,
  onSuccess,
}: AccountOwnerModalProps) {
  const { address } = useParams();

  const { product: productForm } = formState.watch();

  const product = Object.values(productForm || []).filter(meta => !!meta);

  const { metaNFT } = useMetaNFT({
    key: `account/${address}`,
    filter: 'collection_id',
    arg: product.map(({ collection_id, nft_id }) => ({
      collection_id,
      nft_id,
    })),
  });

  const { MetaCollection } = useMetaCollection({
    key: `account/${address}`,
    filter: 'collection_id',
    arg: product.map(({ collection_id }) => collection_id),
  });

  useEffect(() => {
    product.forEach((_, index) => {
      formState.setValue(`selected.${index}`, 1);
    });
  }, []);

  return (
    <Modal isOpen={true} onClose={onClose} size="3xl" isCentered>
      <ModalOverlay />

      <ModalContent as="form">
        <ModalHeader fontWeight="medium" paddingBottom={4}>
          <Center justifyContent="space-between">
            <Heading fontSize="lg" color="shader.a.900" fontWeight="inherit">
              Sale NFTs
            </Heading>

            <ModalCloseButton position="unset" />
          </Center>

          <Text fontSize="sm" color="shader.a.500">
            NFT selected&nbsp;
            <Text as="span" color="primary.a.500">
              {product.length} Items
            </Text>
          </Text>
        </ModalHeader>

        <ModalBody padding={0}>
          <List
            borderWidth="0.0625rem 0px 0.0625rem 0px"
            borderColor="shader.a.300"
            py={4}
            px={6}
            height={{
              base: product.length > 3 ? 72 : undefined,
              md: product.length > 4 ? 72 : undefined,
            }}
            overflowY="auto"
            display="grid"
            gridTemplateColumns={{
              md: 'repeat(2, 1fr)',
            }}
            gap={2}
          >
            {product.map(({ collection_id, nft_id, amount }, index) => {
              const key = `${nft_id}/${collection_id}`;

              const currentMetaNFT = metaNFT?.find(
                data =>
                  data?.collection_id === collection_id &&
                  data?.nft_id === nft_id
              );

              const currentMetaCollection = MetaCollection?.find(
                data => data?.collection_id === collection_id
              );

              return (
                <ListItem
                  key={key}
                  border="0.0625rem solid"
                  borderColor="shader.a.300"
                  borderRadius="xl"
                  display="flex"
                  alignItems="start"
                  padding={2}
                  gap={4}
                >
                  <RatioPicture
                    src={
                      currentMetaNFT?.avatar
                        ? cloundinary_link(currentMetaNFT.avatar)
                        : null
                    }
                    sx={{ width: 20, height: 20 }}
                  />

                  <Box
                    fontWeight="medium"
                    color="shader.a.900"
                    flex={1}
                    width={24}
                    wordBreak="break-word"
                  >
                    <Text fontSize="sm" color="shader.a.500">
                      {currentMetaCollection?.title || '-'}
                    </Text>

                    <Text as="strong">
                      {currentMetaNFT?.title || '-'}&nbsp;
                      <Text as="span" fontWeight="normal" color="shader.a.700">
                        ID: {nft_id}
                      </Text>
                    </Text>

                    <Text fontSize="xs" fontWeight="normal">
                      x{amount}
                    </Text>
                  </Box>

                  <AccountOwnerIncrement
                    formState={{
                      control: formState.control,
                      value: `selected.${index}`,
                    }}
                  />
                </ListItem>
              );
            })}
          </List>

          <AccountOwnerModalTab onSuccess={onSuccess} formState={formState} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
