import {
  Center,
  Icon,
  IconButton,
  List,
  ListItem,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import { convertHex } from 'utils/utils';
import SelectIcon from 'public/assets/line/select.svg';
import TrashIcon from 'public/assets/line/trash.svg';
import MenuIcon from 'public/assets/line/menu.svg';
import HeartIcon from 'public/assets/line/heart.svg';

import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from 'hooks/useRedux';
import { UseFormSetValue } from 'react-hook-form';
import { AccountOwnerFieldProps } from '.';
import { ItemBalanceOfProps } from 'hooks/useItemBalanceOf';
import React from 'react';
import { WISHLIST_STORAGE_KEY } from 'utils/contants.utils';

interface AccountOwnerMenuProps {
  setValue: UseFormSetValue<AccountOwnerFieldProps>;
  meta: {
    amount: number;
    collection_id: number;
    token_id: number;
    image: string;
    name: string;
  };
  index: number;
}

export default function AccountOwnerMenu({
  setValue,
  meta,
  index,
}: AccountOwnerMenuProps) {
  const navigation = useNavigate();
  const { address } = useParams();
  const { account } = useAppSelector(state => state.injected.polkadot);

  const ListMenu = [
    {
      icon: SelectIcon,
      text: 'Select',
      onClick: () => setValue(`product.${index}`, meta),
      private: true,
    },
    {
      icon: SelectIcon,
      text: 'Swap',
      onClick: () => navigation(`/account/swap/${address}`),
    },
    {
      icon: TrashIcon,
      text: 'Delete',
      onClick: () => {},
      private: true,
    },
    {
      icon: HeartIcon,
      text: 'Add to Wishlist',
      onClick: () => {
        const wishlist_storage = localStorage.getItem(WISHLIST_STORAGE_KEY);

        if (wishlist_storage) {
          const current: ItemBalanceOfProps[] = JSON.parse(wishlist_storage);

          return localStorage.setItem(
            WISHLIST_STORAGE_KEY,
            JSON.stringify([{ ...meta }, ...current])
          );
        }

        return localStorage.setItem(
          WISHLIST_STORAGE_KEY,
          JSON.stringify([{ ...meta }])
        );
      },
    },
  ];

  return (
    <Center
      opacity={0}
      transitionDuration="ultra-slow"
      inset="0 0 auto auto"
      margin={2}
      position="absolute"
      backdropFilter="blur(0.75rem)"
      bg={convertHex('#000000', 0.2)}
      borderRadius="lg"
      pointerEvents="none"
      _groupHover={{
        opacity: 1,
        pointerEvents: 'unset',
      }}
    >
      <Menu placement="bottom-end">
        <MenuButton
          as={IconButton}
          variant="unstyled"
          display="flex"
          color="white"
          icon={<MenuIcon />}
        />

        <MenuList padding={0} minWidth="unset">
          <MenuItem padding={0} bg="transparent">
            <List
              padding={2}
              display="flex"
              flexDirection="column"
              gap={2}
              sx={{
                li: {
                  transitionDuration: 'ultra-slow',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  borderRadius: 'lg',
                  padding: 2,
                  color: 'shader.a.600',
                  _hover: {
                    color: 'shader.a.900',
                    bg: 'shader.a.200',
                  },
                },
                p: {
                  pr: 24,
                  fontSize: 'sm',
                },
                svg: {
                  width: 5,
                  height: 5,
                },
              }}
            >
              {React.Children.toArray(
                ListMenu.map(meta => {
                  if (meta.private) {
                    if (account?.address === address) {
                      return (
                        <ListItem onClick={meta.onClick}>
                          <Icon as={meta.icon} width={5} height={5} />

                          <Text>{meta.text}</Text>
                        </ListItem>
                      );
                    }
                  }

                  if (!meta.private) {
                    return (
                      <ListItem onClick={meta.onClick}>
                        <Icon as={meta.icon} width={5} height={5} />

                        <Text>{meta.text}</Text>
                      </ListItem>
                    );
                  }
                })
              )}
            </List>
          </MenuItem>
        </MenuList>
      </Menu>
    </Center>
  );
}
