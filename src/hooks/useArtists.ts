import { useQuery } from '@apollo/client';
import { useState } from 'react';
import { GET_ARTISTS_PAGINATED } from '../graphql/queries/artist.queries';
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

interface UseArtistsOptions {
  page?: number;
  size?: number;
}

export const useArtists = (options: UseArtistsOptions = {}) => {
  const [page, setPage] = useState(options.page || 0);
  const [size] = useState(options.size || 9);

  const { data, loading, error, refetch } = useQuery<ArtistsPaginatedResponse>(
    GET_ARTISTS_PAGINATED,
    {
      variables: { page, size },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
    }
  );

  const artists = data?.artistsPaginated?.content || [];
  const totalPages = data?.artistsPaginated?.totalPages || 0;
  const currentPage = data?.artistsPaginated?.currentPage || 0;
  const hasNext = data?.artistsPaginated?.hasNext || false;
  const hasPrevious = data?.artistsPaginated?.hasPrevious || false;

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
