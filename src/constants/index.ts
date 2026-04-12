// src/constants/index.ts
import { MusicGenre, InstrumentCategory } from '@/types';

export const GENRE_OPTIONS = Object.values(MusicGenre).map((genre) => ({
  value: genre,
  label: genre.charAt(0) + genre.slice(1).toLowerCase(),
}));

export const INSTRUMENT_CATEGORY_OPTIONS = Object.values(InstrumentCategory).map((category) => ({
  value: category,
  label: category.charAt(0).toUpperCase() + category.slice(1),
}));

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  ARTISTS: '/artists',
  ARTIST_DETAIL: '/artists/:id',
  GROUPS: '/groups',
  GROUP_DETAIL: '/groups/:id',
  PROFILE: '/profile',
  FAVORITES: '/favorites',
  ADMIN: '/admin',
  SEARCH: '/search',
  NOT_FOUND: '/404',
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER: 'user',
  THEME: 'theme',
} as const;

export const DEFAULT_PAGINATION = {
  PAGE: 0,
  SIZE: 10,
  SIZE_OPTIONS: [5, 10, 20, 50],
} as const;

export const ERROR_MESSAGES = {
  NETWORK: 'Error de conexión. Verifica tu internet.',
  UNAUTHORIZED: 'No autorizado. Por favor inicia sesión.',
  FORBIDDEN: 'No tienes permiso para realizar esta acción.',
  NOT_FOUND: 'El recurso no existe.',
  SERVER_ERROR: 'Error en el servidor. Intenta más tarde.',
  VALIDATION: 'Por favor revisa los campos del formulario.',
} as const;

export const SUCCESS_MESSAGES = {
  LOGIN: '¡Bienvenido de vuelta!',
  REGISTER: '¡Registro exitoso! Por favor inicia sesión.',
  LOGOUT: 'Has cerrado sesión correctamente.',
  PROFILE_UPDATED: 'Perfil actualizado correctamente.',
  ARTIST_CREATED: '¡Perfil de artista creado exitosamente!',
  ARTIST_UPDATED: 'Perfil de artista actualizado.',
  GROUP_CREATED: '¡Grupo creado exitosamente!',
  GROUP_UPDATED: 'Grupo actualizado correctamente.',
} as const;
