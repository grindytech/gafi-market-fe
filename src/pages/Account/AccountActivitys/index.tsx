import { Box, Table, Tbody, Th, Thead, Tr } from '@chakra-ui/react';
import AccountActivitysSwap from './AccountActivitysSwap';

export default function AccountActivitys() {
  return (
    <>
      <Box
        bg="white"
        borderRadius="xl"
        border="0.0625rem solid"
        borderColor="shader.a.300"
      >
        <Table variant="poolBlockchain">
          <Thead>
            <Tr>
              <Th>Event</Th>
              <Th>Price</Th>
              <Th>From</Th>
              <Th>Date</Th>
              <Th></Th>
            </Tr>
          </Thead>

          <Tbody>
            <AccountActivitysSwap />
          </Tbody>
        </Table>
      </Box>
    </>
  );
}
