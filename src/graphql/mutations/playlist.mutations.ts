import { gql } from '@apollo/client';

export const CREATE_PLAYLIST = gql`
  mutation CreatePlaylist($title: String!, $description: String, $isPublic: Boolean) {
    createPlaylist(title: $title, description: $description, isPublic: $isPublic) {
      id
      title
      description
      isPublic
      songCount
      createdAt
    }
  }
`;

export const UPDATE_PLAYLIST = gql`
  mutation UpdatePlaylist($id: ID!, $title: String, $description: String, $isPublic: Boolean) {
    updatePlaylist(id: $id, title: $title, description: $description, isPublic: $isPublic) {
      id
      title
      description
      isPublic
    }
  }
`;

export const DELETE_PLAYLIST = gql`
  mutation DeletePlaylist($id: ID!) {
    deletePlaylist(id: $id)
  }
`;

export const ADD_SONG_TO_PLAYLIST = gql`
  mutation AddSongToPlaylist($playlistId: ID!, $songId: ID!) {
    addSongToPlaylist(playlistId: $playlistId, songId: $songId) {
      id
      position
      song {
        id
        title
      }
    }
  }
`;

export const REMOVE_SONG_FROM_PLAYLIST = gql`
  mutation RemoveSongFromPlaylist($playlistId: ID!, $songId: ID!) {
    removeSongFromPlaylist(playlistId: $playlistId, songId: $songId)
  }
`;

export const REORDER_PLAYLIST_SONGS = gql`
  mutation ReorderPlaylistSongs($playlistId: ID!, $songIds: [ID!]!) {
    reorderPlaylistSongs(playlistId: $playlistId, songIds: $songIds)
  }
`;
