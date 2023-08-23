import {
  Box,
  Button,
  Center,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';

import { colors } from 'theme/theme';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ListDurationProps } from 'components/DurationBlock';
import AccountSwapMy from './AccountSwapMy';
import AccountSwapMyPanel from './AccountSwapMy/AccountSwapMyPanel';
import AccountSwapOwner from './AccountSwapOwner';
import AccountSwapOwnerPanel from './AccountSwapOwner/AccountSwapOwnerPanel';
import AccountSwapModal from './AccountSwapModal';
import useSubscribeSystem from 'hooks/useSubscribeSystem';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from 'hooks/useRedux';

export type AccountSwapFieldCommonProps = {
  collection_id: number;
  nft_id: number;
  image: string | null;
  title: string | null;
  amount: number;
};

export interface AccountSwapFieldProps {
  price: string;
  duration: ListDurationProps;
  my_self: AccountSwapFieldCommonProps[];
  owner_self: AccountSwapFieldCommonProps[];
}

export default () => {
  const { event, setEvent } = useSubscribeSystem('game::SwapSet');
  const { account } = useAppSelector(state => state.injected.polkadot);
  const navigation = useNavigate();
  const { setValue, watch, control, reset } = useForm<AccountSwapFieldProps>();
  const { my_self, owner_self } = watch();

  const [tab, setTab] = useState(1);

  const ListTab = [
    {
      id: 0,
      tab: (
        <AccountSwapMy control={control} setValue={setValue} watch={watch} />
      ),
      panel: <AccountSwapMyPanel setValue={setValue} my_self={my_self} />,
    },
    {
      id: 1,
      tab: (
        <AccountSwapOwner
          control={control}
          setValue={setValue}
          owner_self={owner_self}
        />
      ),
      panel: (
        <AccountSwapOwnerPanel setValue={setValue} owner_self={owner_self} />
      ),
    },
  ];

  useEffect(() => {
    if (event) {
      event.forEach(({ eventValue }) => {
        const [trade_id, who] = JSON.parse(eventValue);

        if (who === account?.address) {
          navigation(`/swap/${trade_id}`);
        }

        setEvent([]);
      });
    }
  }, [event]);

  return (
    <>
      <Tabs
        gap={5}
        variant="unstyled"
        index={tab}
        onChange={index => setTab(index)}
        display="flex"
        flexDirection={{
          base: 'column',
          lg: 'row',
        }}
      >
        <TabList flexDirection="column" gap={2.5}>
          {ListTab.map(meta => (
            <Tab
              key={meta.id}
              padding={0}
              as="div"
              bg="white"
              borderRadius="xl"
              outline={`0.0625rem solid ${colors.shader.a[300]}`}
              boxShadow={'0px 0.1875rem 0.875rem 0px rgba(0, 0, 0, 0.05)'}
              _selected={{ outline: `0.125rem solid ${colors.primary.a[500]}` }}
              _focus={{ boxShadow: 'unset' }}
              sx={{
                '> div': { width: 'full' },
              }}
            >
              {meta.tab}
            </Tab>
          ))}
        </TabList>

        <TabPanels>
          {ListTab.map(meta => (
            <TabPanel key={meta.id} padding={0}>
              {tab === meta.id ? meta.panel : null}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>

      <Box
        opacity={owner_self?.length || my_self?.length ? 1 : 0}
        transitionDuration="ultra-slow"
        position="fixed"
        zIndex="dropdown"
        inset="auto 0 0 0"
        bg="white"
        width="full"
        padding={4}
      >
        <Container as={Center} justifyContent="space-between">
          <Button variant="cancel" onClick={() => reset()}>
            Clear selected
          </Button>

          <AccountSwapModal
            watch={watch}
            onSuccess={() => {
              reset();
            }}
          />
        </Container>
      </Box>
    </>
  );
};
