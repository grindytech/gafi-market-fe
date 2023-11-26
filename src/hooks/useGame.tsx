import { useQuery } from '@tanstack/react-query';
import { useAppSelector } from './useRedux';

export interface useGameProps {
  filter: 'entries';
  key: string | string[] | number | number[];
}

export interface GamesFieldProps {
  game_id: number;
  owner: string;
  admin: string;
}

export default ({ filter, key }: useGameProps) => {
  const { api } = useAppSelector(state => state.substrate);

  const { data, isLoading } = useQuery({
    queryKey: [`PalletGameGameDetails`, key],
    queryFn: async () => {
      if (api) {
        if (filter === 'entries') {
          const service = await api.query.game.game.entries();

          return service.map(([game_id, meta]) => ({
            game_id: game_id.args[0].toNumber(),
            owner: meta.value.owner.toString(),
            admin: meta.value.admin.toString(),
          })) as GamesFieldProps[];
        }
      }

      // not found group
      return [];
    },
    // enabled: !!filter,
  });

  return {
    Games: data,
    isLoading,
  };
};
