// src/types/instrument.types.ts
import { InstrumentCategory } from './enums';

export interface Instrument {
  id: number;
  name: string;
  category: InstrumentCategory;
  icon?: string;
}

export interface UpdateArtistInstrumentsData {
  instrumentIds: number[];
  mainInstrumentId: number;
}
