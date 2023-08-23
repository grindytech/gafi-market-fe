import { Box, Flex, HStack, Text } from '@chakra-ui/react';

import { useParams } from 'react-router-dom';

import { Control, UseFormSetValue } from 'react-hook-form';
import AccountSwapReceive from '../AccountSwapReceive';
import { AccountSwapFieldProps } from '..';
import AccountJazzicon from 'components/AccountJazzicon/AccountJazzicon';
import ButtonCopy from 'components/ButtonCopy';
import { shorten } from 'utils/utils';

interface AccountSwapOwnerProps {
  setValue: UseFormSetValue<AccountSwapFieldProps>;
  owner_self: AccountSwapFieldProps['owner_self'];
  control: Control<AccountSwapFieldProps, any>;
}

export default ({ setValue, owner_self, control }: AccountSwapOwnerProps) => {
  const { address } = useParams();

  return (
    <>
      {address && (
        <Box>
          <HStack
            overflow="hidden"
            flexWrap={{
              base: 'wrap',
              sm: 'unset',
            }}
            spacing={4}
            padding={4}
            borderBottom="0.0625rem solid"
            borderColor="shader.a.200"
          >
            <AccountJazzicon address={address} />

            <Box textAlign="left">
              <Text fontWeight="medium" color="shader.a.1000">
                -
              </Text>

              <Flex
                gap={2}
                fontSize="sm"
                color="shader.a.600"
                flexWrap={{
                  base: 'wrap',
                  sm: 'unset',
                }}
              >
                {shorten(address, 12)}
                <ButtonCopy value={address} />
              </Flex>
            </Box>
          </HStack>

          <AccountSwapReceive
            control={control}
            data={owner_self}
            setValue={setValue}
            value="owner_self"
          />
        </Box>
      )}
    </>
  );
};
