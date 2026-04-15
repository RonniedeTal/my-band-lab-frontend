import type { User } from './user.types';
import type { MusicGenre } from './enums';
import type { Instrument } from './instrument.types';
import type { Song } from './song.types';

export interface Artist {
  id: string | number;
  stageName: string;
  biography?: string;
  genre: MusicGenre;
  verified: boolean;
  user?: User;
  instruments?: Instrument[];
  mainInstrument?: Instrument;
  createdAt?: string;
  updatedAt?: string;
  profileImageUrl?: string;
  logoUrl?: string;
  songs?: Song[];
}

export interface CreateArtistData {
  stageName: string;
  biography?: string;
  genre: MusicGenre;
  instrumentIds?: number[];
  mainInstrumentId?: number;
}

export interface UpdateArtistData {
  stageName?: string;
  biography?: string;
  genre?: MusicGenre;
  profileImageUrl?: string;
  logoUrl?: string;
}
