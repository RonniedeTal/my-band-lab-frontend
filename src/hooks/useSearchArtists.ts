import { useLazyQuery } from '@apollo/client';
import { useCallback, useState } from 'react';
import { SEARCH_ARTISTS } from '../graphql/queries/artist.queries';
import type { Artist } from '../types/artist.types';

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

export const useSearchArtists = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  const [searchArtists, { data, loading, error }] = useLazyQuery<SearchArtistsResponse>(
    SEARCH_ARTISTS,
    {
      fetchPolicy: 'network-only',
    }
  );

  const performSearch = useCallback(
    (query: string, page: number = 0) => {
      if (query.trim()) {
        setSearchQuery(query);
        setCurrentPage(page);
        searchArtists({ variables: { query: query.trim(), page, size: 9 } });
      }
    },
    [searchArtists]
  );

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setCurrentPage(0);
  }, []);

  const goToNextPage = useCallback(() => {
    if (data?.searchArtists?.hasNext && searchQuery) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      searchArtists({
        variables: {
          query: searchQuery,
          page: nextPage,
          size: 9,
        },
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [data?.searchArtists?.hasNext, searchQuery, currentPage, searchArtists]);

  const goToPreviousPage = useCallback(() => {
    if (data?.searchArtists?.hasPrevious && searchQuery) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      searchArtists({
        variables: {
          query: searchQuery,
          page: prevPage,
          size: 9,
        },
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [data?.searchArtists?.hasPrevious, searchQuery, currentPage, searchArtists]);

  return {
    searchQuery,
    artists: data?.searchArtists?.content || [],
    loading,
    error,
    performSearch,
    clearSearch,
    pagination: {
      currentPage: data?.searchArtists?.currentPage || 0,
      totalPages: data?.searchArtists?.totalPages || 0,
      hasNextPage: data?.searchArtists?.hasNext || false,
      hasPreviousPage: data?.searchArtists?.hasPrevious || false,
      goToNextPage,
      goToPreviousPage,
    },
  };
};
