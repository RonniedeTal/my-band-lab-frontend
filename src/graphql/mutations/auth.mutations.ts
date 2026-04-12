// src/graphql/mutations/auth.mutations.ts
import { gql } from '@apollo/client';

export const REGISTER_USER = gql`
  mutation Register($name: String!, $surname: String!, $email: String!, $password: String!) {
    register(name: $name, surname: $surname, email: $email, password: $password) {
      success
      message
      user {
        id
        name
        surname
        email
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        surname
        email
        role
      }
    }
  }
`;
