import { gql } from '@apollo/client';

export const GET_INSTRUMENTS = gql`
  query GetInstruments {
    instruments {
      id
      name
      category
      icon
    }
  }
`;
