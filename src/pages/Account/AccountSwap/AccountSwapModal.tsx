import {
  Box,
  Button,
  Center,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
} from '@chakra-ui/react';

import { useParams } from 'react-router-dom';
import { formatCurrency, shorten } from 'utils/utils';
import RatioPicture from 'components/RatioPicture';
import GafiAmount from 'components/GafiAmount';

import { UseFormWatch } from 'react-hook-form';
import useSignAndSend from 'hooks/useSignAndSend';
import { useAppSelector } from 'hooks/useRedux';
import useBlockTime from 'hooks/useBlockTime';
import { AccountSwapFieldProps } from '.';
import { unitGAFI } from 'utils/contants.utils';

interface AccountSwapModalProps {
  watch: UseFormWatch<AccountSwapFieldProps>;
  onSuccess: () => void;
}

export default ({ watch, onSuccess }: AccountSwapModalProps) => {
  const { blockNumber } = useBlockTime('bestNumber');
  const { address } = useParams();
  const { isOpen, onToggle, onClose } = useDisclosure();

  const { account } = useAppSelector(state => state.injected.polkadot);
  const { api } = useAppSelector(state => state.substrate);

  const { price, duration, my_self, owner_self } = watch();

  const { mutation, isLoading } = useSignAndSend({
    key: [`setSwap/${account?.address}`],
    address: account?.address as string,
    onSuccess() {
      onClose();
      onSuccess();
    },
  });

  const get_my_self = Object.values(my_self || []);
  const get_owner_self = Object.values(owner_self || []);

  return (
    <>
      <Button
        isDisabled={owner_self?.length && my_self?.length ? false : true}
        color="white"
        width="auto"
        fontSize="sm"
        fontWeight="medium"
        borderRadius="xl"
        bg="shader.a.1000"
        onClick={onToggle}
      >
        Continue
      </Button>

      {isOpen ? (
        <Modal
          isOpen={isOpen}
          onClose={onClose}
          size="lg"
          closeOnOverlayClick={!isLoading}
        >
          <ModalOverlay />

          <ModalContent>
            <ModalHeader
              padding={6}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Text fontSize="xl" fontWeight="semibold" color="shader.a.1000">
                Submit swap
              </Text>

              <ModalCloseButton position="unset" />
            </ModalHeader>

            <ModalBody padding={0}>
              <Tabs variant="unstyled">
                <TabList
                  gap={3}
                  px={6}
                  sx={{
                    button: {
                      padding: 0,
                      borderRadius: 'lg',
                      border: '0.0625rem solid',
                      borderColor: 'shader.a.300',
                      bg: 'shader.a.100',
                      fontSize: 'sm',
                      fontWeight: 'medium',
                      color: 'shader.a.1000',
                      py: 1.5,
                      flex: 1,

                      _selected: {
                        color: 'white',
                        bg: 'primary.a.500',
                        borderColor: 'transparent',
                      },
                    },
                  }}
                >
                  <Tab>My NFTS</Tab>

                  <Tab>{shorten(address as string)}</Tab>
                </TabList>

                <TabPanels
                  sx={{
                    div: {
                      padding: 0,
                    },
                    ul: {
                      color: 'shader.a.1000',
                      fontWeight: 'medium',
                      overflowY: 'auto',
                      px: 6,
                    },
                    li: {
                      _first: {
                        color: 'shader.a.700',
                        fontSize: 'sm',
                        mt: 3,
                        mb: 1,
                      },

                      _notFirst: {
                        mt: 2,

                        borderRadius: 'xl',
                        border: '0.0625rem solid',
                        borderColor: 'shader.a.300',
                        display: 'flex',
                        gap: 3,
                        padding: 2,
                      },
                    },
                  }}
                >
                  <TabPanel>
                    <List
                      height={get_my_self.length >= 5 ? '20.625rem' : undefined}
                    >
                      <ListItem>{get_my_self.length} Items</ListItem>

                      {get_my_self.map(meta => (
                        <ListItem key={`${meta.collection_id}/${meta.nft_id}`}>
                          <RatioPicture
                            src={meta.image || null}
                            sx={{ width: 12, height: 12 }}
                          />

                          <Box>
                            <Text
                              as="strong"
                              fontWeight="inherit"
                              color="inherit"
                              fontSize="sm"
                            >
                              {meta.name}&nbsp;
                              <Text
                                as="span"
                                fontWeight="normal"
                                color="shader.a.600"
                              >
                                ID:{meta.nft_id}
                              </Text>
                            </Text>

                            <Text fontSize="xs">x{meta.amount}</Text>
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                  </TabPanel>

                  <TabPanel>
                    <List
                      height={
                        get_owner_self.length >= 5 ? '20.625rem' : undefined
                      }
                    >
                      <ListItem>{get_owner_self.length} Items</ListItem>

                      {get_owner_self.map(meta => (
                        <ListItem key={`${meta.collection_id}/${meta.nft_id}`}>
                          <RatioPicture
                            src={meta.image || null}
                            sx={{ width: 12, height: 12 }}
                          />

                          <Box>
                            <Text
                              as="strong"
                              fontWeight="inherit"
                              color="inherit"
                              fontSize="sm"
                            >
                              {meta.name}&nbsp;
                              <Text
                                as="span"
                                fontWeight="normal"
                                color="shader.a.600"
                              >
                                ID:{meta.nft_id}
                              </Text>
                            </Text>

                            <Text fontSize="xs">x{meta.amount}</Text>
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </ModalBody>

            <ModalFooter
              display="block"
              padding={6}
              paddingTop="4!"
              color="shader.a.600"
              fontWeight="medium"
            >
              <Center justifyContent="space-between">
                <Text>Duration</Text>

                <Text as="span" color="shader.a.1000">
                  {duration.text}
                </Text>
              </Center>

              <Center justifyContent="space-between" mt={2}>
                <Text>Price</Text>

                <Box textAlign="right">
                  <GafiAmount
                    amount={price || 0}
                    sx={{
                      sx: {
                        '&, span': {
                          color: 'shader.a.1000',
                          fontWeight: 'inherit',
                          fontSize: 'md',
                        },
                      },
                    }}
                  />

                  <Text fontSize="sm">{formatCurrency(price || 0)}</Text>
                </Box>
              </Center>

              <Button
                variant="primary"
                width="full"
                borderRadius="xl"
                mt={6}
                isLoading={isLoading}
                onClick={() => {
                  if (api) {
                    mutation(
                      api.tx.game.createSwap(
                        get_my_self.map(meta => ({
                          collection: meta.collection_id,
                          item: meta.nft_id,
                          amount: meta.amount,
                        })),
                        get_owner_self.map(meta => ({
                          collection: meta.collection_id,
                          item: meta.nft_id,
                          amount: meta.amount,
                        })),
                        BigInt(unitGAFI(price) || 0),
                        blockNumber,
                        blockNumber + duration.time
                      )
                    );
                  }
                }}
              >
                Sign & Submit
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      ) : null}
    </>
  );
};
