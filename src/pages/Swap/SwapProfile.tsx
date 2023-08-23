import { Box, Flex, FlexProps, Text } from '@chakra-ui/react';
import AccountJazzicon from 'components/AccountJazzicon/AccountJazzicon';
import ButtonCopy from 'components/ButtonCopy';
import { shorten } from 'utils/utils';

interface SwapProfileProps {
  address: string;
  name: string;
  isActive: boolean;
  sx?: FlexProps;
}

export default ({ address, name, isActive, sx }: SwapProfileProps) => {
  return (
    <Flex
      gap={{ '2sm': 3 }}
      width="full"
      padding={6}
      textAlign="unset"
      color="shader.a.600"
      fontSize="sm"
      border={isActive ? '0.125rem solid' : '0.0625rem solid'}
      borderColor={isActive ? 'primary.a.500' : 'shader.a.300'}
      bg={isActive ? 'rgba(42, 122, 215, 0.05)' : undefined}
      flexDirection={{ base: 'column', '2sm': 'unset' }}
      {...sx}
    >
      <AccountJazzicon address={address} />

      <Box>
        <Text color="shader.a.1000" fontWeight="medium">
          {name}
        </Text>

        <Text
          display="flex"
          flexDirection={{ base: 'column-reverse', '2sm': 'row' }}
          gap={2}
          alignItems={{ base: 'flex-start', md: 'center' }}
        >
          {shorten(address, 4)}
          <ButtonCopy value={address} />
        </Text>
      </Box>
    </Flex>
  );
};
