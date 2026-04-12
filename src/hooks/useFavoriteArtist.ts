import { useMutation, useQuery } from '@apollo/client';
import { ADD_FAVORITE_ARTIST, REMOVE_FAVORITE_ARTIST } from '../graphql/mutations/follow.mutations';
import { IS_FAVORITE_ARTIST, GET_FAVORITE_ARTISTS } from '../graphql/queries/follow.queries';
import { useAuth } from './useAuth';
import { useNotification } from '../context/NotificationContext';

export const useFavoriteArtist = (artistId: number) => {
  const { user } = useAuth();
  const { success, error: showError } = useNotification();

  // Query para verificar si está en favoritos
  const { data: favoriteData, refetch: refetchFavorite } = useQuery(IS_FAVORITE_ARTIST, {
    variables: { userId: user?.id, artistId },
    skip: !user?.id,
    fetchPolicy: 'network-only', // Forzar consulta a la red
  });

  // Mutations
  const [addFavorite] = useMutation(ADD_FAVORITE_ARTIST, {
    refetchQueries: [
      { query: IS_FAVORITE_ARTIST, variables: { userId: user?.id, artistId } },
      { query: GET_FAVORITE_ARTISTS, variables: { userId: user?.id, page: 0, size: 20 } },
    ],
    awaitRefetchQueries: true,
  });

  const [removeFavorite] = useMutation(REMOVE_FAVORITE_ARTIST, {
    refetchQueries: [
      { query: IS_FAVORITE_ARTIST, variables: { userId: user?.id, artistId } },
      { query: GET_FAVORITE_ARTISTS, variables: { userId: user?.id, page: 0, size: 20 } },
    ],
    awaitRefetchQueries: true,
  });

  const isFavorite = favoriteData?.isFavoriteArtist || false;

  const handleAddFavorite = async () => {
    if (!user) {
      showError('Error', 'Debes iniciar sesión para añadir favoritos');
      return;
    }

    try {
      const response = await addFavorite({
        variables: { artistId },
      });

      if (response.data?.addFavoriteArtist.success) {
        success('¡Añadido!', response.data.addFavoriteArtist.message);
        await refetchFavorite();
      }
    } catch (err) {
      console.error('Error adding favorite:', err);
      showError('Error', 'No se pudo añadir a favoritos');
    }
  };

  const handleRemoveFavorite = async () => {
    if (!user) return;

    try {
      const response = await removeFavorite({
        variables: { artistId },
      });

      if (response.data?.removeFavoriteArtist.success) {
        success('Eliminado', response.data.removeFavoriteArtist.message);
        await refetchFavorite();
      }
    } catch (err) {
      console.error('Error removing favorite:', err);
      showError('Error', 'No se pudo eliminar de favoritos');
    }
  };

  const toggleFavorite = () => {
    if (isFavorite) {
      handleRemoveFavorite();
    } else {
      handleAddFavorite();
    }
  };

  return {
    isFavorite,
    toggleFavorite,
    refetchFavorite,
  };
};
