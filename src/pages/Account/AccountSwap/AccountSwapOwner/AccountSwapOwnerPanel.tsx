import { Center, CircularProgress } from '@chakra-ui/react';

import { useParams } from 'react-router-dom';

import useItemBalanceOf from 'hooks/useItemBalanceOf';
import { UseFormSetValue } from 'react-hook-form';

import { AccountSwapFieldProps } from '..';
import AccountswapListElement from '../AccountswapListElement';

interface AccountSwapOwnerPanelProps {
  setValue: UseFormSetValue<AccountSwapFieldProps>;
  owner_self: AccountSwapFieldProps['owner_self'];
}

export default ({ setValue, owner_self }: AccountSwapOwnerPanelProps) => {
  const { address } = useParams();

  const { itemBalanceOf, isLoading } = useItemBalanceOf({
    key: `swap/${address}`,
    filter: 'address',
    arg: [address as string],
  });

  if (isLoading)
    return (
      <Center>
        <CircularProgress isIndeterminate color="second.purple" />
      </Center>
    );

  return (
    <>
      {itemBalanceOf?.length ? (
        <AccountswapListElement
          queryKey={`swap/${address}`}
          itemBalanceOf={itemBalanceOf}
          common={owner_self}
          formState={{
            setValue,
            value: 'owner_self',
          }}
        />
      ) : null}
    </>
  );
};
