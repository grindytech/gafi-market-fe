import { Text } from '@chakra-ui/react';

interface BundleLayoutAmountProps {
  amount: number;
}

export default ({ amount }: BundleLayoutAmountProps) => {
  return (
    <Text fontSize="sm" color="shader.a.500">
      Amount&nbsp;
      <Text as="span" color="primary.a.500" fontWeight="medium">
        {amount}
      </Text>
    </Text>
  );
};
