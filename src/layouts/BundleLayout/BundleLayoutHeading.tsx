import { Heading, HeadingProps } from '@chakra-ui/react';

interface BundleLayoutHeadingProps {
  heading: string;
  sx?: HeadingProps;
}

export default ({ heading, sx }: BundleLayoutHeadingProps) => {
  return (
    <Heading fontSize="xl" fontWeight="semibold" color="shader.a.1000" {...sx}>
      {heading}
    </Heading>
  );
};
