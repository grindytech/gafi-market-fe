import {
  Button,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
  Icon,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from 'hooks/useRedux';
import React from 'react';

import {
  CHROME_EXT_URL,
  FIREFOX_ADDON_URL,
  GAFI_WALLET_ACCOUNT_KEY,
  GAFI_WALLET_STORAGE_KEY,
} from 'utils/contants.utils';

import PolkadotIcon from 'public/assets/wallet/polkadot-js.svg';
import SubWalletIcon from 'public/assets/wallet/subwallet.svg';
import CloverWallet from 'public/assets/wallet/clover.svg';

import { injectedAccount } from 'redux/injected';
import { getInjectedWeb3 } from 'utils/utils';
import { loadAccounts } from 'utils/substrate.utils';

export default function ConnectSubstrate() {
  const extensionName = localStorage.getItem(GAFI_WALLET_STORAGE_KEY);
  const accountName = localStorage.getItem(GAFI_WALLET_ACCOUNT_KEY);

  const pairsAccount = accountName?.includes('address')
    ? JSON.parse(accountName)
    : undefined;

  const { apiState } = useAppSelector(state => state.substrate);
  const { keyringState } = useAppSelector(state => state.injected);

  const dispatch = useAppDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();

  React.useEffect(() => {
    // load all accounts extension
    if (apiState === 'READY' && extensionName) {
      loadAccounts({ extensionName, dispatch });
    }

    // parse pair account
    if (pairsAccount) {
      const { address, name } = pairsAccount;

      dispatch(injectedAccount({ polkadot: { account: { address, name } } }));
    }
  }, [apiState]);

  const wallets = [
    {
      title: 'Polkadot Wallet',
      icon: PolkadotIcon,
      extensionName: 'polkadot-js',
      onClick: async () => {
        loadAccounts({ extensionName: 'polkadot-js', dispatch });

        const injected = await getInjectedWeb3('polkadot-js');

        const account = await injected?.accounts.get();

        if (account) {
          const address = account[0].address;
          const name = account[0].name;

          localStorage.setItem(
            GAFI_WALLET_ACCOUNT_KEY,
            JSON.stringify({ address, name })
          );

          dispatch(
            injectedAccount({ polkadot: { account: { address, name } } })
          );
        }
      },
    },
    {
      title: 'SubWallet',
      icon: SubWalletIcon,
      extensionName: 'subwallet-js',
      onClick: () => {
        loadAccounts({ extensionName: 'subwallet-js', dispatch });
      },
    },
    {
      title: 'CloverWallet',
      icon: CloverWallet,
      extensionName: 'clover',
      onClick: () => {
        loadAccounts({ extensionName: 'clover', dispatch });
      },
    },
  ];

  return (
    <>
      <Button variant="baseStyle" onClick={onOpen}>
        Connect Wallet
      </Button>

      {isOpen && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />

          <ModalContent padding={6} width="fit-content">
            <ModalHeader padding={0} mb={5}>
              Connect Wallet
            </ModalHeader>

            <ModalBody padding={0}>
              <ButtonGroup flexDirection="column" spacing={0} gap={2.5}>
                {React.Children.toArray(
                  wallets.map(button => (
                    <Button
                      variant="unstyled"
                      justifyContent="start"
                      width="full"
                      px={4}
                      py={1.5}
                      iconSpacing={4}
                      onClick={button.onClick}
                      leftIcon={<Icon as={button.icon} width={8} height={8} />}
                    >
                      {button.title}
                    </Button>
                  ))
                )}

                <FormControl
                  isInvalid={
                    keyringState === 'ERROR' || keyringState === 'INSTALL'
                  }
                >
                  <FormErrorMessage textAlign="center" justifyContent="center">
                    {keyringState === 'ERROR'
                      ? 'not found wallet polkadot'
                      : 'please install extension'}
                  </FormErrorMessage>
                </FormControl>
              </ButtonGroup>
            </ModalBody>

            {!window.injectedWeb3 && (
              <ModalFooter justifyContent="center" letterSpacing={1}>
                <Text textAlign="center">
                  Create an account with Polkadot-JS Extension (
                  <Link
                    color="primary"
                    target="_blank"
                    rel="noreferrer"
                    href={CHROME_EXT_URL}
                  >
                    Chrome
                  </Link>
                  ,&nbsp;
                  <Link
                    color="primary"
                    target="_blank"
                    rel="noreferrer"
                    href={FIREFOX_ADDON_URL}
                  >
                    Firefox
                  </Link>
                  )&nbsp;
                </Text>
              </ModalFooter>
            )}
          </ModalContent>
        </Modal>
      )}
    </>
  );
}
