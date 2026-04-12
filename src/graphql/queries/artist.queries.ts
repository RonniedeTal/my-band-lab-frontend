import { gql } from '@apollo/client';

// Query correcta según tu documentación
export const GET_ARTISTS_PAGINATED = gql`
  query GetArtistsPaginated($page: Int, $size: Int) {
    artistsPaginated(page: $page, size: $size) {
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
          category
        }
        mainInstrument {
          id
          name
        }
        createdAt
        updatedAt
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

// Query para búsqueda de artistas
export const SEARCH_ARTISTS = gql`
  query SearchArtists($query: String!, $page: Int, $size: Int) {
    searchArtists(query: $query, page: $page, size: $size) {
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

// Query para obtener artista por ID
export const GET_ARTIST_BY_ID = gql`
  query GetArtistById($id: ID!) {
    artistById(id: $id) {
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
        category
      }
      mainInstrument {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

// Query para artistas por género
export const GET_ARTISTS_BY_GENRE = gql`
  query GetArtistsByGenre($genre: MusicGenre!) {
    artistsByGenre(genre: $genre) {
      id
      stageName
      biography
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
      mainInstrument {
        id
        name
      }
    }
  }
`;
