import { Box, Text } from '@chakra-ui/react';
import { formatCurrency, formatGAFI } from 'utils/utils';

interface DetailPriceProps {
  amount: number | string;
}

export default ({ amount }: DetailPriceProps) => {
  return (
    <Box padding={6}>
      <Box
        borderRadius="xl"
        border="0.0625rem solid"
        borderColor="shader.a.300"
        bg="shader.a.200"
        padding={4}
      >
        <Text
          fontSize="xl"
          fontWeight="semibold"
          color="shader.a.1000"
          lineHeight={6}
        >
          {formatGAFI(amount)} GAFI
        </Text>

        <Text as="span" fontSize="sm" color="shader.a.600">
          {formatCurrency(formatGAFI(amount))}
        </Text>
      </Box>
    </Box>
  );
};
