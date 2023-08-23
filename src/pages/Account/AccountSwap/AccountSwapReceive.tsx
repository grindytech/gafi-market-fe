import { Box, Icon, IconButton, List, ListItem, Text } from '@chakra-ui/react';
import RatioPicture from 'components/RatioPicture';

import { cloundinary_link } from 'axios/cloudinary_axios';
import { Control, UseFormSetValue } from 'react-hook-form';

import CloseIcon from 'public/assets/line/close.svg';
import AccountSwapIncremental from './AccountSwapIncremental';
import { AccountSwapFieldCommonProps, AccountSwapFieldProps } from '.';

interface AccountSwapReceiveProps {
  setValue: UseFormSetValue<AccountSwapFieldProps>;
  value: string;
  data: AccountSwapFieldCommonProps[] | undefined;
  control: Control<AccountSwapFieldProps, any>;
}

export default ({
  setValue,
  value,
  data,
  control,
}: AccountSwapReceiveProps) => {
  const length_source = Object.values(data || []).length;

  return (
    <List
      padding={4}
      height={length_source >= 5 ? '20.625rem' : undefined}
      overflowY="auto"
    >
      {data?.length ? (
        data.map((meta, index) => {
          return (
            <ListItem
              key={`${meta.collection_id}/${meta.nft_id}`}
              display="flex"
              borderRadius="xl"
              border="0.0625rem solid"
              borderColor="shader.a.300"
              padding={2}
              _notFirst={{ mt: 2 }}
            >
              <RatioPicture
                src={meta?.image ? cloundinary_link(meta.image) : null}
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: 'lg',
                }}
              />

              <Box
                ml={3}
                flex={1}
                onClick={event => {
                  // because input inside <Tabs /> (this button so we should prevent Propagation)
                  event.stopPropagation();
                }}
              >
                <Text fontSize="sm" color="shader.a.1000" fontWeight="medium">
                  {meta?.title || '-'}&nbsp;
                  <Text as="span" color="#71717A">
                    ID:{meta.nft_id}
                  </Text>
                </Text>

                <AccountSwapIncremental
                  control={control}
                  value={`${value}.${index}.amount`}
                  sx={{
                    mt: 2,
                    sx: {
                      '.chakra-numberinput__field': {
                        height: 'auto',
                        padding: 0,
                        width: 10,
                        textAlign: 'center',
                      },
                    },
                  }}
                />
              </Box>

              <IconButton
                variant="unstyled"
                color="primary.a.500"
                aria-label={`remove-${meta.collection_id}-${meta.nft_id}`}
                icon={<Icon as={CloseIcon} width={5} height={5} />}
                onClick={() => {
                  const removeField = data.filter((_, ind) => ind !== index);

                  setValue(value as never, removeField as never);
                }}
              />
            </ListItem>
          );
        })
      ) : (
        <ListItem fontSize="sm" color="primary.a.500">
          Select NFTs to receive
        </ListItem>
      )}
    </List>
  );
};
