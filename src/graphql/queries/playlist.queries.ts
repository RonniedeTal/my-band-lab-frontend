import { gql } from '@apollo/client';

export const GET_MY_PLAYLISTS = gql`
  query GetMyPlaylists($page: Int, $size: Int) {
    myPlaylists(page: $page, size: $size) {
      content {
        id
        title
        description
        coverImageUrl
        isPublic
        songCount
        createdAt
        updatedAt
        user {
          id
          name
          surname
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

export const GET_PUBLIC_PLAYLISTS = gql`
  query GetPublicPlaylists($page: Int, $size: Int) {
    publicPlaylists(page: $page, size: $size) {
      content {
        id
        title
        description
        coverImageUrl
        isPublic
        songCount
        createdAt
        updatedAt
        user {
          id
          name
          surname
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

export const GET_PLAYLIST_BY_ID = gql`
  query GetPlaylistById($id: ID!) {
    playlistById(id: $id) {
      id
      title
      description
      coverImageUrl
      isPublic
      songCount
      createdAt
      updatedAt
      user {
        id
        name
        surname
        email
      }
    }
  }
`;

export const GET_PLAYLIST_SONGS = gql`
  query GetPlaylistSongs($playlistId: ID!) {
    playlistSongs(playlistId: $playlistId) {
      id
      position
      addedAt
      song {
        id
        title
        duration
        fileUrl
        playCount
        artist {
          id
          stageName
        }
        musicGroup {
          id
          name
        }
      }
    }
  }
`;

export const SEARCH_PUBLIC_PLAYLISTS = gql`
  query SearchPublicPlaylists($query: String!, $page: Int, $size: Int) {
    searchPublicPlaylists(query: $query, page: $page, size: $size) {
      content {
        id
        title
        description
        coverImageUrl
        isPublic
        songCount
        user {
          id
          name
          surname
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
