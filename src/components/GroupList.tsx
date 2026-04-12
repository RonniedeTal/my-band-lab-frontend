import React, { useState, useCallback } from 'react';
import { useGroups } from '../hooks/useGroups';
import { useSearchGroups } from '../hooks/useSearchGroups';
import { useGroupsByGenre } from '../hooks/useGroupsByGenre';
import { GroupCard } from './GroupCard';
import { Button } from './ui/Button';
import { SearchBar } from './SearchBar';
import { GenreFilter } from './GenreFilter';
import { X } from 'lucide-react';
import type { MusicGroup } from '../types/group.types';

export const GroupList: React.FC = () => {
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<string>('');

  const {
    groups: allGroups,
    loading: loadingAll,
    error: errorAll,
    pagination: paginationAll,
  } = useGroups();

  const {
    groups: searchResults,
    loading: searching,
    error: searchError,
    performSearch,
    clearSearch,
    pagination: searchPagination,
  } = useSearchGroups();

  const {
    groups: genreGroups,
    loading: loadingGenre,
    error: genreError,
  } = useGroupsByGenre({ genre: selectedGenre });

  const isGenreFilterActive = selectedGenre !== '';
  const isLoading = isSearchMode ? searching : isGenreFilterActive ? loadingGenre : loadingAll;
  const error = isSearchMode ? searchError : isGenreFilterActive ? genreError : errorAll;

  let groups: MusicGroup[] = [];
  let currentPage = 0;
  let totalPages = 0;
  let hasNextPage = false;
  let hasPreviousPage = false;
  let goToNextPage = () => {};
  let goToPreviousPage = () => {};

  if (isSearchMode) {
    groups = searchResults;
    currentPage = searchPagination.currentPage;
    totalPages = searchPagination.totalPages;
    hasNextPage = searchPagination.hasNextPage;
    hasPreviousPage = searchPagination.hasPreviousPage;
    goToNextPage = searchPagination.goToNextPage;
    goToPreviousPage = searchPagination.goToPreviousPage;
  } else if (isGenreFilterActive) {
    groups = genreGroups;
    totalPages = 1;
  } else {
    groups = allGroups;
    currentPage = paginationAll.currentPage;
    totalPages = paginationAll.totalPages;
    hasNextPage = paginationAll.hasNextPage;
    hasPreviousPage = paginationAll.hasPreviousPage;
    goToNextPage = paginationAll.goToNextPage;
    goToPreviousPage = paginationAll.goToPreviousPage;
  }

  const handleSearch = useCallback(
    (query: string) => {
      if (query && query.trim()) {
        setIsSearchMode(true);
        setSelectedGenre('');
        performSearch(query);
      } else if (!query) {
        setIsSearchMode(false);
        clearSearch();
      }
    },
    [performSearch, clearSearch]
  );

  const handleGenreFilter = (genre: string) => {
    setSelectedGenre(genre);
    setIsSearchMode(false);
    clearSearch();
  };

  const clearFilters = () => {
    setSelectedGenre('');
    setIsSearchMode(false);
    clearSearch();
  };

  const hasActiveFilters = selectedGenre !== '' || isSearchMode;

  if (isLoading && groups.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-red-400 mb-4">Error al cargar los grupos</p>
          <p className="text-gray-400 text-sm">{error.message}</p>
          <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
            Intentar nuevamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-end sticky top-0 z-10 bg-dark-bg/95 backdrop-blur-sm py-4">
        <div className="flex-1">
          <SearchBar onSearch={handleSearch} isLoading={searching} placeholder="Buscar grupos..." />
        </div>
        <div>
          <GenreFilter selectedGenre={selectedGenre} onGenreChange={handleGenreFilter} />
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex justify-between items-center bg-gray-800/30 rounded-lg p-3">
          <div className="flex flex-wrap gap-2">
            {selectedGenre && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                Género: {selectedGenre}
                <button onClick={() => setSelectedGenre('')} className="ml-1 hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {isSearchMode && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                Búsqueda: activa
                <button onClick={() => handleSearch('')} className="ml-1 hover:text-white">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
          <Button onClick={clearFilters} variant="ghost" size="sm">
            Limpiar filtros
          </Button>
        </div>
      )}

      {groups.length === 0 && !isLoading ? (
        <div className="text-center py-20">
          <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-8 max-w-md mx-auto">
            <p className="text-gray-400 text-lg mb-2">
              {isSearchMode
                ? 'No se encontraron grupos'
                : selectedGenre
                  ? `No hay grupos en el género ${selectedGenre}`
                  : 'No hay grupos disponibles'}
            </p>
            <p className="text-gray-500 text-sm">
              {isSearchMode
                ? 'Intenta con otra búsqueda'
                : selectedGenre
                  ? 'Prueba con otro género'
                  : 'Sé el primero en crear un grupo'}
            </p>
            {hasActiveFilters && (
              <Button onClick={clearFilters} variant="outline" className="mt-4">
                Ver todos los grupos
              </Button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>

          {!isGenreFilterActive && totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 pt-8 pb-12">
              <Button
                onClick={goToPreviousPage}
                disabled={!hasPreviousPage}
                variant="outline"
                className="px-6"
              >
                ← Anterior
              </Button>

              <div className="flex items-center gap-2">
                <span className="text-gray-300">Página {currentPage + 1}</span>
                <span className="text-gray-600">de</span>
                <span className="text-gray-300">{totalPages}</span>
              </div>

              <Button
                onClick={goToNextPage}
                disabled={!hasNextPage}
                variant="outline"
                className="px-6"
              >
                Siguiente →
              </Button>
            </div>
          )}

          {isGenreFilterActive && (
            <div className="text-center text-gray-400 text-sm">
              Mostrando {groups.length} grupo{groups.length !== 1 ? 's' : ''}
            </div>
          )}
        </>
      )}
    </div>
  );
};
