import type { Song } from './song.types';

export interface Album {
  id: number;
  title: string;
  description?: string;
  coverImageUrl?: string;
  releaseDate?: string;
  songs: Song[];
  artistId?: number;
  groupId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAlbumData {
  title: string;
  description?: string;
  releaseDate?: string;
  coverImageUrl?: string;
  artistId?: number;
  groupId?: number;
}

export interface UpdateAlbumData {
  title?: string;
  description?: string;
  releaseDate?: string;
  coverImageUrl?: string;
}
