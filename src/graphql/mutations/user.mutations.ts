import { gql } from '@apollo/client';

export const UPDATE_USER = gql`
  mutation UpdateUser(
    $id: ID!
    $name: String
    $surname: String
    $email: String
    $password: String
    $profileImageUrl: String
  ) {
    updateUser(
      id: $id
      name: $name
      surname: $surname
      email: $email
      password: $password
      profileImageUrl: $profileImageUrl
    ) {
      id
      name
      surname
      email
      profileImageUrl
      createdAt
      updatedAt
    }
  }
`;
