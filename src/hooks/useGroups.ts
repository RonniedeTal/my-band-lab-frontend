// src/hooks/useGroups.ts
import { useQuery } from '@apollo/client';
import { useState, useEffect } from 'react';
import { GET_GROUPS_PAGINATED, SEARCH_GROUPS } from '../graphql/queries/group.queries';
import type { MusicGroup } from '../types';

interface GroupsPaginatedResponse {
  musicGroupsPaginated: {
    content: MusicGroup[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    size: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

interface SearchGroupsResponse {
  searchGroups: {
    content: MusicGroup[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    size: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

interface UseGroupsOptions {
  page?: number;
  size?: number;
  country?: string;
  city?: string;
  genre?: string;
  searchQuery?: string;
}

// Interfaz para el retorno del hook
interface UseGroupsReturn {
  groups: MusicGroup[];
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

// Type guard para verificar si es SearchGroupsResponse
function isSearchGroupsResponse(data: any): data is SearchGroupsResponse {
  return data && data.searchGroups !== undefined;
}

// Type guard para verificar si es GroupsPaginatedResponse
function isGroupsPaginatedResponse(data: any): data is GroupsPaginatedResponse {
  return data && data.musicGroupsPaginated !== undefined;
}

export const useGroups = (options: UseGroupsOptions = {}): UseGroupsReturn => {
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

  // Query con filtros (usando SEARCH_GROUPS)
  const searchResult = useQuery<SearchGroupsResponse>(SEARCH_GROUPS, {
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

  // Query sin filtros (usando GET_GROUPS_PAGINATED)
  const normalResult = useQuery<GroupsPaginatedResponse>(GET_GROUPS_PAGINATED, {
    variables: { page, size },
    skip: hasActiveFilters,
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  // Determinar qué resultados usar
  const { data, loading, error, refetch } = hasActiveFilters ? searchResult : normalResult;

  // Extraer los datos de manera segura usando type guards
  let groups: MusicGroup[] = [];
  let totalElements = 0;
  let totalPages = 0;
  let currentPage = 0;
  let hasNext = false;
  let hasPrevious = false;

  if (data) {
    if (isSearchGroupsResponse(data)) {
      // Es una respuesta de búsqueda
      groups = data.searchGroups.content;
      totalElements = data.searchGroups.totalElements;
      totalPages = data.searchGroups.totalPages;
      currentPage = data.searchGroups.currentPage;
      hasNext = data.searchGroups.hasNext;
      hasPrevious = data.searchGroups.hasPrevious;
    } else if (isGroupsPaginatedResponse(data)) {
      // Es una respuesta normal paginada
      groups = data.musicGroupsPaginated.content;
      totalElements = data.musicGroupsPaginated.totalElements;
      totalPages = data.musicGroupsPaginated.totalPages;
      currentPage = data.musicGroupsPaginated.currentPage;
      hasNext = data.musicGroupsPaginated.hasNext;
      hasPrevious = data.musicGroupsPaginated.hasPrevious;
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
    groups,
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
