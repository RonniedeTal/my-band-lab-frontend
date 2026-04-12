import { gql } from '@apollo/client';

// Verificar si sigue a un artista
export const IS_FOLLOWING_ARTIST = gql`
  query IsFollowingArtist($userId: ID!, $artistId: ID!) {
    isFollowingArtist(userId: $userId, artistId: $artistId)
  }
`;

// Obtener artistas seguidos
export const GET_FOLLOWED_ARTISTS = gql`
  query GetFollowedArtists($userId: ID!, $page: Int, $size: Int) {
    followedArtists(userId: $userId, page: $page, size: $size) {
      content {
        id
        stageName
        genre
        verified
        user {
          id
          name
          surname
        }
        instruments {
          id
          name
        }
      }
      totalElements
      totalPages
      currentPage
      size
      hasNext
      hasPrevious
    }
  }
`;

// Verificar si está en favoritos
export const IS_FAVORITE_ARTIST = gql`
  query IsFavoriteArtist($userId: ID!, $artistId: ID!) {
    isFavoriteArtist(userId: $userId, artistId: $artistId)
  }
`;

// Obtener artistas favoritos
export const GET_FAVORITE_ARTISTS = gql`
  query GetFavoriteArtists($userId: ID!, $page: Int, $size: Int) {
    favoriteArtists(userId: $userId, page: $page, size: $size) {
      content {
        id
        stageName
        genre
        verified
        user {
          id
          name
          surname
        }
        instruments {
          id
          name
        }
      }
      totalElements
      totalPages
      currentPage
      size
      hasNext
      hasPrevious
    }
  }
`;
// ============ GROUP FOLLOW ============
export const IS_FOLLOWING_GROUP = gql`
  query IsFollowingGroup($userId: ID!, $groupId: ID!) {
    isFollowingGroup(userId: $userId, groupId: $groupId)
  }
`;

export const GET_FOLLOWED_GROUPS = gql`
  query GetFollowedGroups($userId: ID!, $page: Int, $size: Int) {
    followedGroups(userId: $userId, page: $page, size: $size) {
      content {
        id
        name
        description
        genre
        verified
        founder {
          id
          name
          surname
        }
        members {
          id
          name
          surname
        }
        createdAt
      }
      totalElements
      totalPages
      currentPage
      size
      hasNext
      hasPrevious
    }
  }
`;

// ============ GROUP FAVORITE ============
export const IS_FAVORITE_GROUP = gql`
  query IsFavoriteGroup($userId: ID!, $groupId: ID!) {
    isFavoriteGroup(userId: $userId, groupId: $groupId)
  }
`;

export const GET_FAVORITE_GROUPS = gql`
  query GetFavoriteGroups($userId: ID!, $page: Int, $size: Int) {
    favoriteGroups(userId: $userId, page: $page, size: $size) {
      content {
        id
        name
        description
        genre
        verified
        founder {
          id
          name
          surname
        }
        members {
          id
          name
          surname
        }
        createdAt
      }
      totalElements
      totalPages
      currentPage
      size
      hasNext
      hasPrevious
    }
  }
`;
