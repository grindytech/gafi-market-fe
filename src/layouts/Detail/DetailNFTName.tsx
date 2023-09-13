import { Text } from '@chakra-ui/react';

interface DetailNFTNameProps {
  name: string;
}
export default ({ name }: DetailNFTNameProps) => {
  return (
    <Text fontSize="lg" fontWeight="medium" color="shader.a.600">
      {name}
    </Text>
  );
};
