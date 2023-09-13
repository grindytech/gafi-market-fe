import Extraordinary from 'layouts/Home/Extraordinary';
import TopAuction from 'layouts/Home/TopAuction';
import TopBundle from 'layouts/Home/TopBundle';
import TopGames from 'layouts/Home/TopGames';
import TopPools from 'layouts/Home/TopPools';

import TrendingCollection from 'layouts/Home/TrendingCollection';

export default function Home() {
  return (
    <>
      <Extraordinary />

      <TrendingCollection />

      <TopGames />

      <TopAuction />

      <TopBundle />

      <TopPools />
    </>
  );
}
