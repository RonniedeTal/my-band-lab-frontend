// src/types/enums.ts

/**
 * Roles de usuario en la plataforma
 */
export enum UserRole {
  /** Usuario normal, puede crear artista y grupos */
  USER = 'USER',
  /** Artista verificado, puede crear grupos y tener perfil de artista */
  ARTIST = 'ARTIST',
  /** Administrador, tiene todos los permisos */
  ADMIN = 'ADMIN',
}

/**
 * Géneros musicales disponibles
 */
export enum MusicGenre {
  ROCK = 'ROCK',
  POP = 'POP',
  JAZZ = 'JAZZ',
  CLASSICAL = 'CLASSICAL',
  HIP_HOP = 'HIP_HOP',
  ELECTRONIC = 'ELECTRONIC',
  REGGAE = 'REGGAE',
  BLUES = 'BLUES',
  COUNTRY = 'COUNTRY',
  METAL = 'METAL',
  PUNK = 'PUNK',
  SOUL = 'SOUL',
  FUNK = 'FUNK',
  LATIN = 'LATIN',
  INDIE = 'INDIE',
  ALTERNATIVE = 'ALTERNATIVE',
}

/**
 * Categorías de instrumentos musicales
 */
export enum InstrumentCategory {
  STRING = 'cuerda',
  WIND = 'viento',
  PERCUSSION = 'percusion',
  KEYBOARD = 'teclado',
  VOICE = 'voz',
}

/**
 * Estado de verificación
 */
export enum VerificationStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}
