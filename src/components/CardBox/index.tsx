import { Box, BoxProps, useStyleConfig } from '@chakra-ui/react';

export interface CardBoxProps extends BoxProps {
  variant?: string;
}

export default function CardBox({ variant, children, ...rest }: CardBoxProps) {
  const styles = useStyleConfig('CardBox', { variant });

  return (
    <Box __css={styles} {...rest}>
      {children}
    </Box>
  );
}
