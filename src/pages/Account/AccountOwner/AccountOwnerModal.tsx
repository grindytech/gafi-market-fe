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

import AccountOwnerIncrement from './AccountOwnerIncrement';
import { Control, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { AccountOwnerFieldProps } from '.';

import { MetaCollectionFieldProps } from 'hooks/useMetaCollection';

import AccountOwnerModalTab from './AccountOwnerModalTab';
import { useEffect } from 'react';

interface AccountOwnerModalProps {
  onClose: () => void;
  onSuccess: () => void;
  MetaCollection: MetaCollectionFieldProps[] | undefined;

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
  MetaCollection,
}: AccountOwnerModalProps) {
  const { product: productForm } = formState.watch();

  const product = Object.values(productForm || []).filter(meta => !!meta);

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
            {product.map(
              ({ collection_id, amount, image, name, token_id }, index) => {
                const key = `${token_id}/${collection_id}`;

                const currentMetaCollection = MetaCollection?.find(
                  data => Number(data?.collection_id) === Number(collection_id)
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
                      src={image || null}
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
                        {currentMetaCollection?.name}
                      </Text>

                      <Text as="strong">
                        {name}&nbsp;
                        <Text
                          as="span"
                          fontWeight="normal"
                          color="shader.a.700"
                        >
                          ID: {token_id}
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
              }
            )}
          </List>

          <AccountOwnerModalTab onSuccess={onSuccess} formState={formState} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
