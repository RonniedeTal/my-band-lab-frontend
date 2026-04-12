import { useQuery } from '@apollo/client';
import { GET_ARTISTS_BY_GENRE } from '../graphql/queries/artist.queries';
import type { Artist } from '../types/artist.types';
import type { MusicGenre } from '../types/enums';

interface UseArtistsByGenreProps {
  genre: MusicGenre | string;
}

export const useArtistsByGenre = ({ genre }: UseArtistsByGenreProps) => {
  const { data, loading, error, refetch } = useQuery<{ artistsByGenre: Artist[] }>(
    GET_ARTISTS_BY_GENRE,
    {
      variables: { genre },
      skip: !genre, // Solo ejecutar si hay un género seleccionado
    }
  );

  const artists = data?.artistsByGenre || [];

  return {
    artists,
    loading,
    error,
    refetch,
  };
};
