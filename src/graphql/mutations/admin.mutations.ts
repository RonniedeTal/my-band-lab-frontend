import { gql } from '@apollo/client';

// Cambiar rol de usuario (solo admin)
export const CHANGE_USER_ROLE = gql`
  mutation ChangeUserRole($userId: ID!, $newRole: String!) {
    changeUserRole(userId: $userId, newRole: $newRole) {
      id
      name
      surname
      email
      role
    }
  }
`;

// Eliminar usuario (solo admin)
export const DELETE_USER_BY_ADMIN = gql`
  mutation DeleteUserByAdmin($userId: ID!) {
    deleteUserByAdmin(userId: $userId)
  }
`;
// Verificar artista (solo admin)
export const VERIFY_ARTIST = gql`
  mutation VerifyArtist($id: ID!) {
    verifyArtist(id: $id) {
      id
      stageName
      verified
    }
  }
`;
// Verificar grupo (solo admin)
export const VERIFY_GROUP = gql`
  mutation VerifyGroup($id: ID!) {
    verifyGroup(id: $id) {
      id
      name
      verified
    }
  }
`;
