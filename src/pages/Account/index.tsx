import { Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';

import CardBox from 'components/CardBox';

import React from 'react';
import AccountInformation from './AccountInformation';
import AccountOwner from './AccountOwner';
import AccountActivitys from './AccountActivitys';

export default function Account() {
  const [tab, setTab] = React.useState(0);

  const ListTab = [
    {
      id: 0,
      tab: 'Onwer',
      panel: <AccountOwner />,
    },
    {
      id: 1,
      tab: 'Activitys',
      panel: <AccountActivitys />,
    },
  ];

  return (
    <>
      <CardBox variant="createGames" padding={0}>
        <AccountInformation />
      </CardBox>

      <CardBox variant="createGames" padding={0} mt={4}>
        <Tabs variant="baseStyle" onChange={e => setTab(e)} index={tab}>
          <TabList flexWrap="wrap">
            {ListTab.map(({ id, tab }) => (
              <Tab
                key={id}
                color="shader.a.600"
                fontWeight="medium"
                fontSize="lg"
                _selected={{
                  color: 'shader.a.1000',
                }}
              >
                {tab}
              </Tab>
            ))}
          </TabList>

          <TabPanels>
            {ListTab.map(meta => (
              <TabPanel key={meta.id} padding={6}>
                {tab === meta.id ? meta.panel : null}
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </CardBox>
    </>
  );
}
