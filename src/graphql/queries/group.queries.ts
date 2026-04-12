import { gql } from '@apollo/client';

// Obtener grupos con paginación
export const GET_GROUPS_PAGINATED = gql`
  query GetGroupsPaginated($page: Int, $size: Int) {
    musicGroupsPaginated(page: $page, size: $size) {
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
        formedDate
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

// Buscar grupos por nombre
export const SEARCH_GROUPS = gql`
  query SearchGroups($query: String!, $page: Int, $size: Int) {
    searchGroups(query: $query, page: $page, size: $size) {
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
        formedDate
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

// Obtener grupo por ID
export const GET_GROUP_BY_ID = gql`
  query GetGroupById($id: ID!) {
    musicGroupById(id: $id) {
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
        email
      }
      formedDate
      createdAt
      updatedAt
    }
  }
`;

// Obtener grupos por género
export const GET_GROUPS_BY_GENRE = gql`
  query GetGroupsByGenre($genre: MusicGenre!) {
    musicGroupsByGenre(genre: $genre) {
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
      }
    }
  }
`;
