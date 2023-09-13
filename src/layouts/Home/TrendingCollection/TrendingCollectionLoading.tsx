import { Box, Flex, Skeleton } from '@chakra-ui/react';

import React from 'react';

export default function TrendingCollectionLoading() {
  return (
    <Flex overflowX="auto" gap={6}>
      {React.Children.toArray(
        [...Array(5)].map(() => (
          <Flex bg="white" borderRadius="xl" flex={1} padding={4} gap={4}>
            <Skeleton borderRadius="lg" width={16} height={16} />

            <Box flex={1}>
              <Skeleton width={12} height={1.5} />

              <Flex gap={6} mt={4} justifyContent="space-between">
                <Skeleton width={12} height={1.5} />
                <Skeleton width={12} height={1.5} />
              </Flex>
            </Box>
          </Flex>
        ))
      )}
    </Flex>
  );
}
