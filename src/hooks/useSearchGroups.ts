import { useLazyQuery } from '@apollo/client';
import { useCallback, useState } from 'react';
import { SEARCH_GROUPS } from '../graphql/queries/group.queries';
import type { GroupPageResponse } from '../types/group.types';

export const useSearchGroups = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  const [searchGroups, { data, loading, error }] = useLazyQuery<{
    searchGroups: GroupPageResponse;
  }>(SEARCH_GROUPS, {
    fetchPolicy: 'network-only',
  });

  const performSearch = useCallback(
    (query: string, page: number = 0) => {
      if (query.trim()) {
        setSearchQuery(query);
        setCurrentPage(page);
        searchGroups({ variables: { query: query.trim(), page, size: 9 } });
      }
    },
    [searchGroups]
  );

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setCurrentPage(0);
  }, []);

  const goToNextPage = useCallback(() => {
    if (data?.searchGroups?.hasNext && searchQuery) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      searchGroups({
        variables: {
          query: searchQuery,
          page: nextPage,
          size: 9,
        },
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [data?.searchGroups?.hasNext, searchQuery, currentPage, searchGroups]);

  const goToPreviousPage = useCallback(() => {
    if (data?.searchGroups?.hasPrevious && searchQuery) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      searchGroups({
        variables: {
          query: searchQuery,
          page: prevPage,
          size: 9,
        },
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [data?.searchGroups?.hasPrevious, searchQuery, currentPage, searchGroups]);

  return {
    searchQuery,
    groups: data?.searchGroups?.content || [],
    loading,
    error,
    performSearch,
    clearSearch,
    pagination: {
      currentPage: data?.searchGroups?.currentPage || 0,
      totalPages: data?.searchGroups?.totalPages || 0,
      hasNextPage: data?.searchGroups?.hasNext || false,
      hasPreviousPage: data?.searchGroups?.hasPrevious || false,
      goToNextPage,
      goToPreviousPage,
    },
  };
};
