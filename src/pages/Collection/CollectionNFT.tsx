import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  HStack,
  Icon,
  Select,
  Spinner,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { testOption1, testOption2, testOptionSort } from 'hooks/DataTest';
import FilterIcon from 'public/assets/line/filter.svg';

import MarketPlaceFilter from 'components/MarketPlaceFilter';

import { Link } from 'react-router-dom';

import RatioPicture from 'components/RatioPicture';

import { TypeSwaggerNFTData } from 'types/swagger.type';

interface CollectionNFTProps {
  data: TypeSwaggerNFTData | undefined;
  isLoading: boolean;
}

export default ({ data, isLoading }: CollectionNFTProps) => {
  const { isOpen, onToggle } = useDisclosure();

  if (isLoading) {
    return (
      <Center height="100vh">
        <Spinner color="primary.a.500" size="lg" />
      </Center>
    );
  }

  return (
    <>
      {data?.data.length ? (
        <Box
          padding={6}
          borderTop="0.0625rem solid"
          borderTopColor="shader.a.200"
        >
          <HStack gap={4} mb={4} flexWrap="wrap">
            <Button
              variant={isOpen ? 'primary' : 'baseStyle'}
              leftIcon={<Icon as={FilterIcon} />}
              onClick={onToggle}
            >
              Filter
            </Button>

            <Select variant="formFilter" width="fit-content">
              {testOption1.map(item => (
                <option key={item.value} value={item.value}>
                  {item.title}
                </option>
              ))}
            </Select>

            <Select variant="formFilter" width="fit-content">
              {testOption2.map(item => (
                <option key={item.value} value={item.value}>
                  {item.title}
                </option>
              ))}
            </Select>

            <Select variant="formFilter" width="fit-content">
              {testOptionSort.map(item => (
                <option key={item.value} value={item.value}>
                  {item.title}
                </option>
              ))}
            </Select>
          </HStack>

          <Flex gap={5}>
            {isOpen ? (
              <Box flexBasis="25%">
                <Box position="sticky" top={85} flexBasis="25%">
                  <MarketPlaceFilter isOpen={isOpen} />
                </Box>
              </Box>
            ) : null}

            <Grid
              flex={1}
              gap={4}
              gridTemplateColumns={{
                sm: 'repeat(2, 1fr)',
                lg: 'repeat(4, 1fr)',
              }}
            >
              {data.data.map(meta => (
                <Box
                  key={meta.token_id}
                  as={Link}
                  to={`/nft/${meta.token_id}/${meta.collection_id}`}
                  border="0.0625rem solid"
                  borderColor="shader.a.300"
                  bg="white"
                  borderRadius="xl"
                >
                  <RatioPicture src={meta.image || null} />

                  <Center justifyContent="space-between" padding={4}>
                    <Text color="shader.a.900" fontWeight="medium">
                      {meta.name}
                    </Text>

                    <Text color="shader.a.500">
                      ID:&nbsp;
                      <Text as="span" color="primary.a.500" fontWeight="medium">
                        {meta.token_id}
                      </Text>
                    </Text>
                  </Center>
                </Box>
              ))}
            </Grid>
          </Flex>
        </Box>
      ) : null}
    </>
  );
};
