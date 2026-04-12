import { gql } from '@apollo/client';

// Seguir artista
export const FOLLOW_ARTIST = gql`
  mutation FollowArtist($artistId: ID!) {
    followArtist(artistId: $artistId) {
      success
      message
      followersCount
    }
  }
`;

// Dejar de seguir artista
export const UNFOLLOW_ARTIST = gql`
  mutation UnfollowArtist($artistId: ID!) {
    unfollowArtist(artistId: $artistId) {
      success
      message
      followersCount
    }
  }
`;

// Añadir a favoritos
export const ADD_FAVORITE_ARTIST = gql`
  mutation AddFavoriteArtist($artistId: ID!) {
    addFavoriteArtist(artistId: $artistId) {
      success
      message
    }
  }
`;

// Eliminar de favoritos
export const REMOVE_FAVORITE_ARTIST = gql`
  mutation RemoveFavoriteArtist($artistId: ID!) {
    removeFavoriteArtist(artistId: $artistId) {
      success
      message
    }
  }
`;
// ============ GROUP FOLLOW ============
export const FOLLOW_GROUP = gql`
  mutation FollowGroup($groupId: ID!) {
    followGroup(groupId: $groupId) {
      success
      message
      followersCount
    }
  }
`;

export const UNFOLLOW_GROUP = gql`
  mutation UnfollowGroup($groupId: ID!) {
    unfollowGroup(groupId: $groupId) {
      success
      message
      followersCount
    }
  }
`;

// ============ GROUP FAVORITE ============
export const ADD_FAVORITE_GROUP = gql`
  mutation AddFavoriteGroup($groupId: ID!) {
    addFavoriteGroup(groupId: $groupId) {
      success
      message
    }
  }
`;

export const REMOVE_FAVORITE_GROUP = gql`
  mutation RemoveFavoriteGroup($groupId: ID!) {
    removeFavoriteGroup(groupId: $groupId) {
      success
      message
    }
  }
`;
