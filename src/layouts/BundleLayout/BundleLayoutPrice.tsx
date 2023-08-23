import { Box, Text } from '@chakra-ui/react';
import { formatCurrency } from 'utils/utils';

interface BundleLayoutPriceProps {
  amount: number | string;
}

export default ({ amount }: BundleLayoutPriceProps) => {
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
          {amount} GAFI
        </Text>

        <Text as="span" fontSize="sm" color="shader.a.600">
          {formatCurrency(Number(String(amount).replaceAll(',', '')))}
        </Text>
      </Box>
    </Box>
  );
};
