import { Text } from '@chakra-ui/react';

interface DetailCollectionNameProps {
  name: string;
}
export default ({ name }: DetailCollectionNameProps) => {
  return (
    <Text fontSize="xl" fontWeight="bold" color="shader.a.1000">
      {name}
    </Text>
  );
};
