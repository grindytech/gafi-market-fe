import { Grid, GridProps } from '@chakra-ui/react';
import { PropsWithChildren } from 'react';

interface DetailDetailProps extends PropsWithChildren {
  sx?: GridProps;
}

export default ({ children, sx }: DetailDetailProps) => {
  return (
    <Grid
      gap={5}
      gridTemplateColumns={{
        lg: 'repeat(2, 1fr)',
      }}
      {...sx}
    >
      {children}
    </Grid>
  );
};
