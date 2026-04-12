import { useMutation, useQuery } from '@apollo/client';
import { FOLLOW_ARTIST, UNFOLLOW_ARTIST } from '../graphql/mutations/follow.mutations';
import { IS_FOLLOWING_ARTIST } from '../graphql/queries/follow.queries';
import { useAuth } from './useAuth';
import { useNotification } from '../context/NotificationContext';

export const useFollowArtist = (artistId: number) => {
  const { user } = useAuth();
  const { success, error: showError } = useNotification();

  const { data: followingData, refetch: refetchFollowing } = useQuery(IS_FOLLOWING_ARTIST, {
    variables: { userId: user?.id, artistId },
    skip: !user?.id,
  });

  const [followArtist] = useMutation(FOLLOW_ARTIST);
  const [unfollowArtist] = useMutation(UNFOLLOW_ARTIST);

  const isFollowing = followingData?.isFollowingArtist || false;

  const handleFollow = async () => {
    if (!user) {
      showError('Error', 'Debes iniciar sesión para seguir artistas');
      return;
    }

    try {
      const response = await followArtist({
        variables: { artistId },
      });

      if (response.data?.followArtist.success) {
        success('¡Seguido!', response.data.followArtist.message);
        refetchFollowing();
      }
    } catch {
      showError('Error', 'No se pudo seguir al artista');
    }
  };

  const handleUnfollow = async () => {
    if (!user) return;

    try {
      const response = await unfollowArtist({
        variables: { artistId },
      });

      if (response.data?.unfollowArtist.success) {
        success('Dejaste de seguir', response.data.unfollowArtist.message);
        refetchFollowing();
      }
    } catch {
      showError('Error', 'No se pudo dejar de seguir al artista');
    }
  };

  const toggleFollow = () => {
    if (isFollowing) {
      handleUnfollow();
    } else {
      handleFollow();
    }
  };

  return {
    isFollowing,
    toggleFollow,
    refetchFollowing,
  };
};
