import { Box, Flex, Skeleton, SkeletonText } from '@chakra-ui/react';
import React from 'react';

export default () => {
  return (
    <Flex overflowX="auto" gap={6}>
      {React.Children.toArray(
        [...Array(5)].map(() => (
          <Box bg="white" borderRadius="xl" gap={4} flex={1}>
            <Skeleton borderRadius="lg" height="144px" />

            <Flex px={4} py={6} gap={4} justifyContent="space-between">
              <SkeletonText width="full" noOfLines={2} spacing="2" />

              <SkeletonText width="full" noOfLines={2} spacing="2" />
            </Flex>
          </Box>
        ))
      )}
    </Flex>
  );
};
