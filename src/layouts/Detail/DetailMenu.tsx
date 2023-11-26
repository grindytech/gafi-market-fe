import {
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuItemProps,
  MenuList,
  Text,
} from '@chakra-ui/react';
import { convertHex } from 'utils/utils';
import MenuIcon from 'public/assets/line/menu.svg';
import React from 'react';

interface DetailMenuProps {
  menu: {
    heading: string;
    icon?: any;
    onClick?: () => void;
  }[];
  sx?: MenuItemProps;
}

export default ({ menu, sx }: DetailMenuProps) => {
  return (
    <Menu placement="bottom-end">
      <MenuButton
        as={IconButton}
        variant="unstyled"
        position="absolute"
        inset="0 0 auto auto"
        display="flex"
        bg={convertHex('#000000', 0.2)}
        color="white"
        margin={4}
        zIndex="docked"
        icon={<MenuIcon />}
      />

      <MenuList
        padding={0}
        minWidth="unset"
        bg="transparent"
        overflow="hidden"
        borderRadius="lg"
      >
        {React.Children.toArray(
          menu.map(menu => (
            <MenuItem
              padding={2}
              color="shader.a.900"
              bg="white"
              gap={2}
              onClick={menu.onClick}
              _hover={{ bg: 'shader.a.200' }}
              {...sx}
            >
              {menu.icon && <Icon width={5} height={5} as={menu.icon} />}

              <Text pr={24}>{menu.heading}</Text>
            </MenuItem>
          ))
        )}
      </MenuList>
    </Menu>
  );
};
