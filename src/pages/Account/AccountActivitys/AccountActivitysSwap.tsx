import { Button, Td, Tr } from '@chakra-ui/react';
import DateBlock from 'components/DateBlock';

import useItemBalanceOf from 'hooks/useItemBalanceOf';

import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { shorten } from 'utils/utils';
import AccountActivitysSwapClaim from './AccountActivitysSwapClaim';
import useTradeConfigOf from 'hooks/useTradeConfigOf';

export default function AccountActivitysSwap() {
  const { address } = useParams();
  const navigation = useNavigate();

  const { tradeConfigOf, refetch } = useTradeConfigOf({
    key: [`account/${address}`],
    filter: 'entries',
  });

  const { itemBalanceOf } = useItemBalanceOf({
    key: `account/${address}`,
    filter: 'address',
    arg: [address as string],
  });

  const getSwapOfOwner = tradeConfigOf
    ?.map(({ maybeRequired, maybePrice, trade_id, owner, endBlock, trade }) => {
      if (trade.isSwap) {
        const service = maybeRequired.value
          .toArray()
          .find(({ collection, item }) => {
            return itemBalanceOf?.find(meta => {
              return (
                meta.collection_id === collection.toNumber() &&
                meta.nft_id === item.toNumber()
              );
            });
          });

        if (service) {
          return {
            service,
            maybePrice,
            trade_id,
            owner,
            endBlock,
          };
        }
      }
    })
    .filter((meta): meta is NonNullable<typeof meta> => !!meta);

  return (
    <>
      {getSwapOfOwner?.length
        ? React.Children.toArray(
            getSwapOfOwner.map(meta => (
              <Tr>
                <Td>Swap</Td>

                <Td>{meta.maybePrice.value.toHuman()}</Td>

                <Td>{shorten(meta.owner)}</Td>

                <Td>
                  <DateBlock endBlock={meta.endBlock.value.toNumber()} />
                </Td>

                <Td
                  sx={{
                    button: { _first: { mr: 3 } },
                  }}
                >
                  <AccountActivitysSwapClaim
                    trade_id={meta.trade_id}
                    maybePrice={meta.maybePrice.value.toNumber()}
                    onSuccess={refetch}
                  />

                  <Button
                    variant="primary"
                    onClick={() => navigation(`/swap/${meta.trade_id}`)}
                  >
                    Detail
                  </Button>
                </Td>
              </Tr>
            ))
          )
        : null}
    </>
  );
}
