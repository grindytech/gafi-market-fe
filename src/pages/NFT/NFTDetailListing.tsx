import { Table, Tbody, Td, Text, Tr } from '@chakra-ui/react';
import React from 'react';
import { formatCurrency, shorten } from 'utils/utils';

import NFTDetailBuy from './NFTDetailBuy';
import GafiAmount from 'components/GafiAmount';
import DateBlock from 'components/DateBlock';
import CancelTrade from 'components/CancelTrade';
import { Option, u128, u32 } from '@polkadot/types';

export interface NFTDetailListingProps {
  refetch: () => void;
  Listings?: {
    maybePrice: Option<u128>;
    endBlock: Option<u32>;
    owner: string;
    trade_id: number;
    collection_id: number;
    nft_id: number;
    amount: number;
  }[];
}

export default function NFTDetailListing({
  refetch,
  Listings,
}: NFTDetailListingProps) {
  return (
    <Table
      variant="unstyled"
      fontSize="sm"
      whiteSpace="pre"
      sx={{
        p: {
          fontWeight: 'medium',
          color: 'shader.a.900',
        },
        span: {
          color: 'shader.a.500',
        },
      }}
    >
      <Tbody>
        {Listings?.length ? (
          React.Children.toArray(
            Listings.map(meta => (
              <Tr>
                <Td>
                  <GafiAmount
                    amount={Number(meta.maybePrice.value.toNumber())}
                    sx={{
                      sx: {
                        '&, span': { color: 'shader.a.900', fontSize: 'sm' },
                      },
                    }}
                  />

                  <Text as="span">
                    {formatCurrency(Number(meta.maybePrice.value.toNumber()))}
                  </Text>
                </Td>

                <Td>
                  <Text as="span">Quantity</Text>

                  <Text>{meta.amount}</Text>
                </Td>

                <Td>
                  <Text as="span">From</Text>

                  <Text color="primary.a.500!">
                    {shorten(String(meta.owner.toString()), 12)}
                  </Text>
                </Td>

                <Td>
                  <Text as="span">Date</Text>

                  <DateBlock
                    endBlock={
                      meta.endBlock.isSome ? meta.endBlock.value.toNumber() : -1
                    }
                  />
                </Td>

                <Td textAlign="right">
                  <CancelTrade
                    trade_id={meta.trade_id}
                    type="SetPrice"
                    refetch={refetch}
                    sx={{ mr: 4 }}
                  />

                  <NFTDetailBuy
                    amount={meta.amount}
                    fee={meta.maybePrice.value.toNumber()}
                    trade_id={meta.trade_id}
                    refetch={refetch}
                    sx={{ borderRadius: 'lg' }}
                  />
                </Td>
              </Tr>
            ))
          )
        ) : (
          <Tr>
            <Td textAlign="center">Empty</Td>
          </Tr>
        )}
      </Tbody>
    </Table>
  );
}
