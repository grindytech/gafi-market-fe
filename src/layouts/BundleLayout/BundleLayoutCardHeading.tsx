import { Stack } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

export default ({ children }: PropsWithChildren) => {
  return (
    <Stack spacing={2} mb={6}>
      {children}
    </Stack>
  );
};
