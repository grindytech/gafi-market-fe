import { Text } from '@chakra-ui/react';
import DateBlock from 'components/DateBlock';

interface DetailExpiresProps {
  heading: string;
  endBlock: number;
  end?: 'Expired' | 'Infinity';
}

export default ({ heading, end, endBlock }: DetailExpiresProps) => {
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
        end={end}
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
