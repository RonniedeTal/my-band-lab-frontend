// src/types/api.types.ts

export interface ApiError {
  code?: string;
  message: string;
  details?: Record<string, string[]>;
  timestamp?: string;
}

export interface AppState {
  loading: boolean;
  error: string | null;
  isReady: boolean;
}

export interface QueryOptions {
  skip?: boolean;
  fetchPolicy?: 'cache-first' | 'network-only' | 'cache-only' | 'no-cache' | 'standby';
  pollInterval?: number;
}
