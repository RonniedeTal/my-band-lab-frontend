import { useMutation, useQuery } from '@apollo/client';
import { ADD_FAVORITE_GROUP, REMOVE_FAVORITE_GROUP } from '../graphql/mutations/follow.mutations';
import { IS_FAVORITE_GROUP, GET_FAVORITE_GROUPS } from '../graphql/queries/follow.queries';
import { useAuth } from './useAuth';
import { useNotification } from '../context/NotificationContext';

export const useFavoriteGroup = (groupId: number) => {
  const { user } = useAuth();
  const { success, error: showError } = useNotification();

  const { data: favoriteData, refetch: refetchFavorite } = useQuery(IS_FAVORITE_GROUP, {
    variables: { userId: user?.id, groupId },
    skip: !user?.id,
    fetchPolicy: 'network-only',
  });

  const [addFavorite] = useMutation(ADD_FAVORITE_GROUP, {
    refetchQueries: [
      { query: IS_FAVORITE_GROUP, variables: { userId: user?.id, groupId } },
      { query: GET_FAVORITE_GROUPS, variables: { userId: user?.id, page: 0, size: 20 } },
    ],
  });

  const [removeFavorite] = useMutation(REMOVE_FAVORITE_GROUP, {
    refetchQueries: [
      { query: IS_FAVORITE_GROUP, variables: { userId: user?.id, groupId } },
      { query: GET_FAVORITE_GROUPS, variables: { userId: user?.id, page: 0, size: 20 } },
    ],
  });

  const isFavorite = favoriteData?.isFavoriteGroup || false;

  const handleAddFavorite = async () => {
    if (!user) {
      showError('Error', 'Debes iniciar sesión para añadir favoritos');
      return;
    }

    try {
      const response = await addFavorite({
        variables: { groupId },
      });

      if (response.data?.addFavoriteGroup.success) {
        success('¡Añadido!', response.data.addFavoriteGroup.message);
        refetchFavorite();
      }
    } catch {
      showError('Error', 'No se pudo añadir a favoritos');
    }
  };

  const handleRemoveFavorite = async () => {
    if (!user) return;

    try {
      const response = await removeFavorite({
        variables: { groupId },
      });

      if (response.data?.removeFavoriteGroup.success) {
        success('Eliminado', response.data.removeFavoriteGroup.message);
        refetchFavorite();
      }
    } catch {
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
