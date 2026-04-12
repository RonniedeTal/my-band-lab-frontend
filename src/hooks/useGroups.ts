import { useQuery } from '@apollo/client';
import { useState } from 'react';
import { GET_GROUPS_PAGINATED } from '../graphql/queries/group.queries';
import type { GroupPageResponse } from '../types/group.types';

interface UseGroupsOptions {
  page?: number;
  size?: number;
}

export const useGroups = (options: UseGroupsOptions = {}) => {
  const [page, setPage] = useState(options.page || 0);
  const [size] = useState(options.size || 9);

  const { data, loading, error, refetch } = useQuery<{ musicGroupsPaginated: GroupPageResponse }>(
    GET_GROUPS_PAGINATED,
    {
      variables: { page, size },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
    }
  );

  const groups = data?.musicGroupsPaginated?.content || [];
  const totalPages = data?.musicGroupsPaginated?.totalPages || 0;
  const currentPage = data?.musicGroupsPaginated?.currentPage || 0;
  const hasNext = data?.musicGroupsPaginated?.hasNext || false;
  const hasPrevious = data?.musicGroupsPaginated?.hasPrevious || false;

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
  };
};
