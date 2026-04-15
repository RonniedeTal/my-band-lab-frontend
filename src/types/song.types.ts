export interface Song {
  id: number;
  title: string;
  duration: number;
  fileUrl: string;
  playCount: number;
  artistId?: number;
  groupId?: number;
  albumId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface SongStats {
  songId: number;
  title: string;
  playCount: number;
  uniqueListeners: number;
}

export interface CreateSongData {
  title: string;
  file: File;
  artistId?: number;
  groupId?: number;
}

export interface SongUploadResponse {
  imageUrl: string;
  message: string;
  success: boolean;
}
