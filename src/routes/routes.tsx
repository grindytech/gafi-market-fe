import { createBrowserRouter } from 'react-router-dom';
import DefaultRoot from 'layouts/DefaultLayout/DefaultRoot';

import Account from 'pages/Account';
import AccountSetting from 'pages/Account/AccountSetting';

import Home from 'pages';
import Bundle from 'pages/Bundle';
import Auction from 'pages/Auction';
import Pool from 'pages/Pool';
import Collection from 'pages/Collection';
import NFT from 'pages/NFT';
import Blockchain, { ListBlockchain } from 'pages/Blockchain';
import AccountSwap from 'pages/Account/AccountSwap';
import Swap from 'pages/Swap';

const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultRoot />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'bundle/:id',
        element: <Bundle />,
      },
      {
        path: 'auction/:id',
        element: <Auction />,
      },
      {
        path: 'pool/:id',
        element: <Pool />,
      },
      {
        path: 'swap/:id',
        element: <Swap />,
      },
      {
        path: 'collection/:collection_id',
        element: <Collection />,
      },
      {
        path: 'nft/:nft_id/:collection_id',
        element: <NFT />,
      },
      {
        path: 'blockchain',
        element: <Blockchain />,
        children: ListBlockchain.map(blockchain => ({
          path: blockchain.link,
          element: blockchain.element,
        })),
      },
      {
        path: 'account',
        children: [
          {
            path: ':address',
            element: <Account />,
          },
          {
            path: ':address/setting',
            element: <AccountSetting />,
          },
          {
            path: 'swap/:address',
            element: <AccountSwap />,
          },
        ],
      },
    ],
  },
]);

export default router;
