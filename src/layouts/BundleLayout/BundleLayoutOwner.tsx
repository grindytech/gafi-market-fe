import { Heading, HeadingProps, Text } from '@chakra-ui/react';
import { useAppSelector } from 'hooks/useRedux';
import { shorten } from 'utils/utils';

interface BundleLayoutOwnerProps {
  owner: string;
  sx?: HeadingProps;
}

export default function BundleLayoutOwner({
  owner,
  sx,
}: BundleLayoutOwnerProps) {
  const { account } = useAppSelector(state => state.injected.polkadot);

  return (
    <Heading
      fontSize="md"
      fontWeight="normal"
      color="shader.a.500"
      mb={6}
      {...sx}
    >
      Owned by&nbsp;
      <Text as="span" color="primary.a.500" fontWeight="medium">
        {account?.address === owner ? 'You' : shorten(owner)}
      </Text>
    </Heading>
  );
}
