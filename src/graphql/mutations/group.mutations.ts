import { gql } from '@apollo/client';

// Crear grupo
export const CREATE_MUSIC_GROUP = gql`
  mutation CreateMusicGroup(
    $name: String!
    $description: String
    $genre: MusicGenre!
    $founderId: ID!
    $country: String
    $city: String
  ) {
    createMusicGroup(
      name: $name
      description: $description
      genre: $genre
      founderId: $founderId
      country: $country
      city: $city
    ) {
      id
      name
      description
      genre
      verified
      country
      city
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
  }
`;

// Añadir miembro al grupo
export const ADD_MEMBER_TO_GROUP = gql`
  mutation AddMemberToGroup($groupId: ID!, $userId: ID!) {
    addMemberToGroup(groupId: $groupId, userId: $userId) {
      id
      name
      members {
        id
        name
        surname
      }
    }
  }
`;

// Remover miembro del grupo
export const REMOVE_MEMBER_FROM_GROUP = gql`
  mutation RemoveMemberFromGroup($groupId: ID!, $userId: ID!) {
    removeMemberFromGroup(groupId: $groupId, userId: $userId) {
      id
      name
      members {
        id
        name
        surname
      }
    }
  }
`;

// Actualizar género del grupo
export const UPDATE_MUSIC_GROUP_GENRE = gql`
  mutation UpdateMusicGroupGenre($groupId: ID!, $genre: MusicGenre!) {
    updateMusicGroupGenre(groupId: $groupId, genre: $genre) {
      id
      name
      genre
    }
  }
`;

// Eliminar grupo
export const DELETE_MUSIC_GROUP = gql`
  mutation DeleteMusicGroup($id: ID!) {
    deleteMusicGroup(id: $id)
  }
`;
