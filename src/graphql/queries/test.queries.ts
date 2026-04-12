// src/graphql/queries/test.queries.ts
import { gql } from '@apollo/client';

// Query para probar la conexión
export const TEST_CONNECTION = gql`
  query TestConnection {
    __typename
  }
`;

// Query para obtener artistas públicos
export const GET_ARTISTS = gql`
  query GetArtists($page: Int, $size: Int) {
    artistsPaginated(page: $page, size: $size) {
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

// Query para obtener géneros disponibles
export const GET_GENRES = gql`
  query GetGenres {
    availableGenres
  }
`;

// Query para obtener instrumentos
export const GET_INSTRUMENTS = gql`
  query GetInstruments {
    instruments {
      id
      name
      category
    }
  }
`;
