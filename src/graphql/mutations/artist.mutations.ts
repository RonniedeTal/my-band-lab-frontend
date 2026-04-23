import { gql } from '@apollo/client';

export const CREATE_ARTIST = gql`
  mutation CreateArtist(
    $stageName: String!
    $biography: String
    $genre: MusicGenre!
    $instrumentIds: [Int!]!
    $mainInstrumentId: Int
    $country: String
    $city: String
  ) {
    createArtist(
      stageName: $stageName
      biography: $biography
      genre: $genre
      instrumentIds: $instrumentIds
      mainInstrumentId: $mainInstrumentId
      country: $country
      city: $city
    ) {
      id
      stageName
      biography
      genre
      verified
      country
      city
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
    $country: String
    $city: String
  ) {
    createArtistForCurrentUser(
      stageName: $stageName
      biography: $biography
      genre: $genre
      instrumentIds: $instrumentIds
      mainInstrumentId: $mainInstrumentId
      country: $country
      city: $city
    ) {
      id
      stageName
      biography
      genre
      verified
      country
      city
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

export const UPDATE_ARTIST_LOOKING_FOR_BAND = gql`
  mutation UpdateArtistLookingForBand($artistId: ID!, $isLookingForBand: Boolean!) {
    updateArtistLookingForBand(artistId: $artistId, isLookingForBand: $isLookingForBand) {
      id
      isLookingForBand
      stageName
      genre
    }
  }
`;
