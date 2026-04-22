// src/hooks/useArtists.ts
import { useQuery } from '@apollo/client';
import { useState, useEffect } from 'react';
import { GET_ARTISTS_PAGINATED, SEARCH_ARTISTS } from '../graphql/queries/artist.queries';
import type { Artist } from '../types';

interface ArtistsPaginatedResponse {
  artistsPaginated: {
    content: Artist[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    size: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

interface SearchArtistsResponse {
  searchArtists: {
    content: Artist[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    size: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

interface UseArtistsOptions {
  page?: number;
  size?: number;
  country?: string;
  city?: string;
  genre?: string;
  searchQuery?: string;
}

// Interfaz para el retorno del hook
interface UseArtistsReturn {
  artists: Artist[];
  loading: boolean;
  error: any;
  totalElements: number;
  totalPages: number;
  pagination: {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    goToNextPage: () => void;
    goToPreviousPage: () => void;
    goToPage: (pageNumber: number) => void;
  };
  refetch: (variables?: any) => Promise<any>;
  filters: {
    country: string;
    city: string;
    genre: string;
    hasFilters: boolean;
  };
}

// Type guard para verificar si es SearchArtistsResponse
function isSearchArtistsResponse(data: any): data is SearchArtistsResponse {
  return data && data.searchArtists !== undefined;
}

// Type guard para verificar si es ArtistsPaginatedResponse
function isArtistsPaginatedResponse(data: any): data is ArtistsPaginatedResponse {
  return data && data.artistsPaginated !== undefined;
}

export const useArtists = (options: UseArtistsOptions = {}): UseArtistsReturn => {
  const [page, setPage] = useState(options.page || 0);
  const [size] = useState(options.size || 9);

  // Filtros
  const country = options.country || '';
  const city = options.city || '';
  const genre = options.genre || '';
  const searchQuery = options.searchQuery || '';

  // Determinar si hay filtros activos
  const hasFilters = !!(country || city || genre);
  const hasSearch = !!searchQuery;
  const hasActiveFilters = hasFilters || hasSearch;

  // Resetear página cuando cambian los filtros
  useEffect(() => {
    setPage(0);
  }, [country, city, genre, searchQuery]);

  // Query con filtros (usando SEARCH_ARTISTS)
  const searchResult = useQuery<SearchArtistsResponse>(SEARCH_ARTISTS, {
    variables: {
      query: searchQuery || '*',
      page,
      size,
      country: country || null,
      city: city || null,
      genre: genre || null,
    },
    skip: !hasActiveFilters,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  // Query sin filtros (usando GET_ARTISTS_PAGINATED)
  const normalResult = useQuery<ArtistsPaginatedResponse>(GET_ARTISTS_PAGINATED, {
    variables: { page, size },
    skip: hasActiveFilters,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  // Determinar qué resultados usar
  const { data, loading, error, refetch } = hasActiveFilters ? searchResult : normalResult;

  // Extraer los datos de manera segura usando type guards
  let artists: Artist[] = [];
  let totalElements = 0;
  let totalPages = 0;
  let currentPage = 0;
  let hasNext = false;
  let hasPrevious = false;

  if (data) {
    if (isSearchArtistsResponse(data)) {
      // Es una respuesta de búsqueda
      artists = data.searchArtists.content;
      totalElements = data.searchArtists.totalElements;
      totalPages = data.searchArtists.totalPages;
      currentPage = data.searchArtists.currentPage;
      hasNext = data.searchArtists.hasNext;
      hasPrevious = data.searchArtists.hasPrevious;
    } else if (isArtistsPaginatedResponse(data)) {
      // Es una respuesta normal paginada
      artists = data.artistsPaginated.content;
      totalElements = data.artistsPaginated.totalElements;
      totalPages = data.artistsPaginated.totalPages;
      currentPage = data.artistsPaginated.currentPage;
      hasNext = data.artistsPaginated.hasNext;
      hasPrevious = data.artistsPaginated.hasPrevious;
    }
  }

  const goToNextPage = () => {
    if (hasNext) {
      setPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPreviousPage = () => {
    if (hasPrevious) {
      setPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 0 && pageNumber < totalPages) {
      setPage(pageNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return {
    artists,
    loading,
    error,
    totalElements,
    totalPages,
    pagination: {
      currentPage,
      totalPages,
      hasNextPage: hasNext,
      hasPreviousPage: hasPrevious,
      goToNextPage,
      goToPreviousPage,
      goToPage,
    },
    refetch,
    filters: {
      country,
      city,
      genre,
      hasFilters: hasActiveFilters,
    },
  };
};
