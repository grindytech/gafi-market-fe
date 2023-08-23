import { useState } from 'react';
import AccountOwnerAuction from './AccountOwnerAuction';
import AccountOwnerSale from './AccountOwnerSale';
import { ListDurationProps } from 'components/DurationBlock';
import { BLOCK_TIME } from 'utils/constants';
import {
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import { Control, UseFormWatch } from 'react-hook-form';
import { AccountOwnerFieldProps } from '.';

interface AccountOwnerModalTabProps {
  onSuccess: () => void;
  formState: {
    control: Control<AccountOwnerFieldProps, any>;
    watch: UseFormWatch<AccountOwnerFieldProps>;
  };
}

export default ({ onSuccess, formState }: AccountOwnerModalTabProps) => {
  const ListDuration: ListDurationProps[] = [
    {
      text: '1 Minutes',
      time: 60 / BLOCK_TIME,
    },
    {
      text: '5 Minutes',
      time: 300 / BLOCK_TIME,
    },
    {
      text: '1 Hours',
      time: 3600 / BLOCK_TIME,
    },
    {
      text: '1 Day',
      time: (86400 * 1) / BLOCK_TIME,
    },
    {
      text: '1 Week',
      time: (86400 * 7) / BLOCK_TIME,
    },
    {
      text: '2 Weeks',
      time: (86400 * 14) / BLOCK_TIME,
    },
    {
      text: '1 Month',
      time: (86400 * 30) / BLOCK_TIME,
    },
  ];

  const [duration, setDuration] = useState(ListDuration[0]);

  const [tab, setTab] = useState(0);

  const ListTab = [
    {
      id: 0,
      heading: 'Ordinary Sale',
      body: `Sale your NFTs with your set price.`,
      submit: (
        <AccountOwnerSale
          watch={formState.watch}
          control={formState.control}
          onSuccess={onSuccess}
          duration={duration}
          setDuration={setDuration}
          listDuration={ListDuration}
        />
      ),
    },
    {
      id: 1,
      heading: 'Auction',
      body: `The highest bid wins when the auction ends.`,
      submit: (
        <AccountOwnerAuction
          watch={formState.watch}
          control={formState.control}
          onSuccess={onSuccess}
          duration={duration}
          setDuration={setDuration}
          listDuration={ListDuration}
        />
      ),
    },
    {
      id: 2,
      heading: 'Candles auction',
      body: `Auction ends unknown, highest bid wins.`,
      isDisabled: true,
    },
  ];

  return (
    <Tabs variant="unstyled" onChange={e => setTab(e)} index={tab}>
      <TabList gap={2} overflowX="auto" padding={6} paddingBottom={4}>
        {ListTab.map(meta => (
          <Tab
            key={meta.heading}
            isDisabled={meta.isDisabled}
            flex={1}
            borderRadius="xl"
            textAlign="unset"
            padding={4}
            gap={4}
            _selected={{
              borderColor: 'primary.a.500',

              strong: {
                bg: 'primary.a.500',

                _before: {
                  borderColor: 'primary.a.500',
                },
              },
            }}
          >
            <Box
              as="strong"
              position="relative"
              width={4}
              height={4}
              borderRadius="full"
              _before={{
                content: `''`,
                position: 'absolute',
                inset: 0,
                border: '0.0625rem solid',
                borderColor: 'shader.a.500',
                borderRadius: 'inherit',
                transform: 'scale(1.4)',
              }}
            />

            <Box width={36}>
              <Text fontSize="sm" fontWeight="medium" color="shader.a.900">
                {meta.heading}
              </Text>

              <Text as="span" fontSize="xs" color="shader.a.600">
                {meta.body}
              </Text>
            </Box>
          </Tab>
        ))}
      </TabList>

      <TabPanels>
        {ListTab.map(meta => (
          <TabPanel key={meta.id} padding={0}>
            {meta.id === tab ? meta.submit : null}
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};
