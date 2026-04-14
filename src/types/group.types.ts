import type { User } from './user.types';
import type { MusicGenre } from './enums';

export interface MusicGroup {
  id: string | number;
  name: string;
  description?: string;
  formedDate?: string;
  genre: MusicGenre;
  members: User[];
  founder: User;
  verified: boolean;
  createdAt?: string;
  updatedAt?: string;
  logoUrl?: string;
}

export interface CreateGroupData {
  name: string;
  description?: string;
  genre: MusicGenre;
}

export interface UpdateGroupData {
  name?: string;
  description?: string;
  genre?: MusicGenre;
  logoUrl?: string;
}

export interface GroupPageResponse {
  content: MusicGroup[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
