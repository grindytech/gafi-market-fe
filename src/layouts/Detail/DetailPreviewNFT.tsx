import CardBox from 'components/CardBox';
import { PropsWithChildren } from 'react';

export default ({ children }: PropsWithChildren) => {
  return (
    <CardBox
      variant="baseStyle"
      padding={0}
      position={{ base: 'relative', lg: 'sticky' }}
      top={24}
      overflow="hidden"
      height="fit-content"
      role="group"
    >
      {children}
    </CardBox>
  );
};
