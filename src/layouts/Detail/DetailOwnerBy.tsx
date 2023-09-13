import { HeadingProps, Text } from '@chakra-ui/react';
import { useAppSelector } from 'hooks/useRedux';
import { shorten } from 'utils/utils';

interface BundleLayoutOwnerProps {
  owner: string;
  sx?: HeadingProps;
}

export default ({ owner, sx }: BundleLayoutOwnerProps) => {
  const { account } = useAppSelector(state => state.injected.polkadot);

  return (
    <Text color="shader.a.600" {...sx}>
      Owned by&nbsp;
      <Text as="span" color="primary.a.500" fontWeight="medium">
        {account?.address === owner ? 'You' : shorten(owner)}
      </Text>
    </Text>
  );
};
