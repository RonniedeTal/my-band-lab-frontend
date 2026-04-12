import { gql } from '@apollo/client';

export const CREATE_ARTIST = gql`
  mutation CreateArtist(
    $stageName: String!
    $biography: String
    $genre: MusicGenre!
    $instrumentIds: [Int!]!
    $mainInstrumentId: Int
  ) {
    createArtist(
      stageName: $stageName
      biography: $biography
      genre: $genre
      instrumentIds: $instrumentIds
      mainInstrumentId: $mainInstrumentId
    ) {
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

export const UPDATE_ARTIST = gql`
  mutation UpdateArtist($id: ID!, $stageName: String, $biography: String, $genre: MusicGenre) {
    updateArtist(id: $id, stageName: $stageName, biography: $biography, genre: $genre) {
      id
      stageName
      biography
      genre
      verified
    }
  }
`;
export const CREATE_ARTIST_FOR_CURRENT_USER = gql`
  mutation CreateArtistForCurrentUser(
    $stageName: String!
    $biography: String
    $genre: MusicGenre!
    $instrumentIds: [ID!]!
    $mainInstrumentId: ID
  ) {
    createArtistForCurrentUser(
      stageName: $stageName
      biography: $biography
      genre: $genre
      instrumentIds: $instrumentIds
      mainInstrumentId: $mainInstrumentId
    ) {
      id
      stageName
      biography
      genre
      verified
      instruments {
        id
        name
      }
      mainInstrument {
        id
        name
      }
      user {
        id
        name
        surname
        role
      }
    }
  }
`;
