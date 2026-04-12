import { useMutation, useQuery } from '@apollo/client';
import { FOLLOW_GROUP, UNFOLLOW_GROUP } from '../graphql/mutations/follow.mutations';
import { IS_FOLLOWING_GROUP, GET_FOLLOWED_GROUPS } from '../graphql/queries/follow.queries';
import { useAuth } from './useAuth';
import { useNotification } from '../context/NotificationContext';

export const useFollowGroup = (groupId: number) => {
  const { user } = useAuth();
  const { success, error: showError } = useNotification();

  const { data: followingData, refetch: refetchFollowing } = useQuery(IS_FOLLOWING_GROUP, {
    variables: { userId: user?.id, groupId },
    skip: !user?.id,
    fetchPolicy: 'network-only',
  });

  const [followGroup] = useMutation(FOLLOW_GROUP, {
    refetchQueries: [
      { query: IS_FOLLOWING_GROUP, variables: { userId: user?.id, groupId } },
      { query: GET_FOLLOWED_GROUPS, variables: { userId: user?.id, page: 0, size: 20 } },
    ],
  });

  const [unfollowGroup] = useMutation(UNFOLLOW_GROUP, {
    refetchQueries: [
      { query: IS_FOLLOWING_GROUP, variables: { userId: user?.id, groupId } },
      { query: GET_FOLLOWED_GROUPS, variables: { userId: user?.id, page: 0, size: 20 } },
    ],
  });

  const isFollowing = followingData?.isFollowingGroup || false;

  const handleFollow = async () => {
    if (!user) {
      showError('Error', 'Debes iniciar sesión para seguir grupos');
      return;
    }

    try {
      const response = await followGroup({
        variables: { groupId },
      });

      if (response.data?.followGroup.success) {
        success('¡Siguiendo!', response.data.followGroup.message);
        refetchFollowing();
      }
    } catch {
      showError('Error', 'No se pudo seguir al grupo');
    }
  };

  const handleUnfollow = async () => {
    if (!user) return;

    try {
      const response = await unfollowGroup({
        variables: { groupId },
      });

      if (response.data?.unfollowGroup.success) {
        success('Dejaste de seguir', response.data.unfollowGroup.message);
        refetchFollowing();
      }
    } catch {
      showError('Error', 'No se pudo dejar de seguir al grupo');
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
