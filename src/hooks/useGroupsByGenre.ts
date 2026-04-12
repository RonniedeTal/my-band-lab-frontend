import { useQuery } from '@apollo/client';
import { GET_GROUPS_BY_GENRE } from '../graphql/queries/group.queries';
import type { MusicGroup } from '../types/group.types';
import { MusicGenre } from '../types/enums';

interface UseGroupsByGenreProps {
  genre: MusicGenre | string;
}

export const useGroupsByGenre = ({ genre }: UseGroupsByGenreProps) => {
  const { data, loading, error, refetch } = useQuery<{ musicGroupsByGenre: MusicGroup[] }>(
    GET_GROUPS_BY_GENRE,
    {
      variables: { genre },
      skip: !genre, // Solo ejecutar si hay un género seleccionado
    }
  );

  const groups = data?.musicGroupsByGenre || [];

  return {
    groups,
    loading,
    error,
    refetch,
  };
};
