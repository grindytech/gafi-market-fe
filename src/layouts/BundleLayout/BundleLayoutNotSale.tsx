import { Box, Text } from '@chakra-ui/react';

export default () => {
  return (
    <Box padding={6}>
      <Box
        borderRadius="xl"
        border="0.0625rem solid"
        borderColor="shader.a.300"
        bg="shader.a.200"
        padding={4}
      >
        <Text fontSize="sm" color="shader.a.600">
          Price
        </Text>

        <Text as="span" fontSize="lg" fontWeight="medium" color="shader.a.1000">
          Not for sale
        </Text>
      </Box>
    </Box>
  );
};
