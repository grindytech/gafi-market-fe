import { UseFormSetValue } from 'react-hook-form';
import { useAppSelector } from 'hooks/useRedux';
import useItemBalanceOf from 'hooks/useItemBalanceOf';
import { Center, CircularProgress } from '@chakra-ui/react';
import { AccountSwapFieldProps } from '..';
import AccountswapListElement from '../AccountswapListElement';

interface AccountSwapMyPanelProps {
  setValue: UseFormSetValue<AccountSwapFieldProps>;
  my_self: AccountSwapFieldProps['my_self'];
}

export default ({ my_self, setValue }: AccountSwapMyPanelProps) => {
  const { account } = useAppSelector(state => state.injected.polkadot);

  const { itemBalanceOf, isLoading } = useItemBalanceOf({
    key: `swap/${account?.address}`,
    filter: 'address',
    arg: [account?.address as string],
  });

  if (isLoading)
    return (
      <Center>
        <CircularProgress isIndeterminate color="second.purple" />
      </Center>
    );

  return (
    <>
      {itemBalanceOf?.length && account?.address ? (
        <AccountswapListElement
          queryKey={`swap/${account.address}`}
          itemBalanceOf={itemBalanceOf}
          common={my_self}
          formState={{
            setValue,
            value: 'my_self',
          }}
        />
      ) : null}
    </>
  );
};
