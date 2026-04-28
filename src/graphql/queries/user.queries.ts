import { gql } from '@apollo/client';

export const GET_ALL_USERS = gql`
  query GetAllUsers {
    users {
      id
      name
      surname
      email
      role
    }
  }
`;

export const GET_USER_ARTIST = gql`
  query GetUserArtist($userId: ID!) {
    artistByUserId(userId: $userId) {
      id
      stageName
      biography
      genre
      verified
      isLookingForBand
      lookingForInstruments {
        id
        name
        category
      }
      lookingForGenres
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
