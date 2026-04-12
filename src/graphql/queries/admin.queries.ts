import { gql } from '@apollo/client';

// Obtener todos los usuarios (solo admin)
export const GET_ALL_USERS_ADMIN = gql`
  query GetAllUsersAdmin($page: Int, $size: Int) {
    users {
      id
      name
      surname
      email
      role
      profileImageUrl
      createdAt
      updatedAt
      artist {
        id
        stageName
        verified
      }
      musicGroups {
        id
        name
      }
    }
  }
`;

// Obtener usuarios con paginación (admin)
export const GET_USERS_PAGINATED = gql`
  query GetUsersPaginated($page: Int, $size: Int, $role: String) {
    users {
      id
      name
      surname
      email
      role
      profileImageUrl
      createdAt
      artist {
        id
        stageName
        verified
      }
    }
  }
`;
// Obtener artistas no verificados
export const GET_UNVERIFIED_ARTISTS = gql`
  query GetUnverifiedArtists($page: Int, $size: Int) {
    unverifiedArtists(page: $page, size: $size) {
      content {
        id
        stageName
        biography
        genre
        verified
        user {
          id
          name
          surname
          email
        }
        instruments {
          id
          name
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
export const GET_UNVERIFIED_GROUPS = gql`
  query GetUnverifiedGroups($page: Int, $size: Int) {
    unverifiedGroups(page: $page, size: $size) {
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
          email
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
