import { Box, Center, Flex, Skeleton } from '@chakra-ui/react';
import React from 'react';

export default () => {
  return (
    <Flex overflowX="auto" gap={6}>
      {React.Children.toArray(
        [...Array(5)].map(() => (
          <Box bg="white" borderRadius="xl" gap={4} flex={1}>
            <Box position="relative" height="144px">
              <Skeleton borderRadius="lg" width="full" height="full" />

              <Skeleton
                borderRadius="0.625rem"
                width={14}
                height={14}
                position="absolute"
                inset="auto auto 0 0"
                transform="translate(25%, 25%)"
              />
            </Box>

            <Box px={4} py={6}>
              <Center justifyContent="space-between">
                <Skeleton width={12} height={1.5} />
                <Skeleton width={12} height={1.5} />
              </Center>

              <Skeleton mt={2} width={12} height={1.5} />
            </Box>
          </Box>
        ))
      )}
    </Flex>
  );
};
