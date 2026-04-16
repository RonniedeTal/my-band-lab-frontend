import type { Song } from './song.types';
import type { User } from './user.types';

export interface Playlist {
  id: number;
  title: string;
  description?: string;
  coverImageUrl?: string;
  isPublic: boolean;
  user: User;
  songs: PlaylistSong[];
  songCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PlaylistSong {
  id: number;
  playlist: Playlist;
  song: Song;
  position: number;
  addedAt: string;
}

export interface CreatePlaylistData {
  title: string;
  description?: string;
  isPublic?: boolean;
}

export interface UpdatePlaylistData {
  title?: string;
  description?: string;
  isPublic?: boolean;
}

export interface PlaylistPageResponse {
  content: Playlist[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
