import { Text } from '@chakra-ui/react';
import DateBlock from 'components/DateBlock';

interface BundleLayoutExpiresProps {
  heading: string;
  endBlock: number;
}

export default ({ heading, endBlock }: BundleLayoutExpiresProps) => {
  return (
    <Text
      py={4}
      px={6}
      fontSize="sm"
      color="shader.a.600"
      borderBottom="0.0625rem solid"
      borderColor="shader.a.200"
    >
      {heading} ends&nbsp;
      <DateBlock
        endBlock={endBlock}
        sx={{
          as: 'span',
          fontSize: 'md',
          fontWeight: 'medium',
          color: 'shader.a.1000',
        }}
      />
    </Text>
  );
};
