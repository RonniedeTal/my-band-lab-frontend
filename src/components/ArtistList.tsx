import React, { useState, useCallback } from 'react';
import { useArtists } from '../hooks/useArtists';
import { useSearchArtists } from '../hooks/useSearchArtists';
import { useArtistsByGenre } from '../hooks/useArtistsByGenre';
import { ArtistCard } from './ArtistCard';
import { Button } from './ui/Button';
import { SearchBar } from './SearchBar';
import { GenreFilter } from './GenreFilter';
import { X } from 'lucide-react';
import type { Artist } from '../types/artist.types';

export const ArtistList: React.FC = () => {
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<string>('');

  const {
    artists: allArtists,
    loading: loadingAll,
    error: errorAll,
    pagination: paginationAll,
  } = useArtists();

  const {
    artists: searchResults,
    loading: searching,
    error: searchError,
    performSearch,
    clearSearch,
    pagination: searchPagination,
  } = useSearchArtists();

  const {
    artists: genreArtists,
    loading: loadingGenre,
    error: genreError,
  } = useArtistsByGenre({ genre: selectedGenre });

  const isGenreFilterActive = selectedGenre !== '';
  const isLoading = isSearchMode ? searching : isGenreFilterActive ? loadingGenre : loadingAll;
  const error = isSearchMode ? searchError : isGenreFilterActive ? genreError : errorAll;

  let artists: Artist[] = [];
  let currentPage = 0;
  let totalPages = 0;
  let hasNextPage = false;
  let hasPreviousPage = false;
  let goToNextPage = () => {};
  let goToPreviousPage = () => {};

  if (isSearchMode) {
    artists = searchResults;
    currentPage = searchPagination.currentPage;
    totalPages = searchPagination.totalPages;
    hasNextPage = searchPagination.hasNextPage;
    hasPreviousPage = searchPagination.hasPreviousPage;
    goToNextPage = searchPagination.goToNextPage;
    goToPreviousPage = searchPagination.goToPreviousPage;
  } else if (isGenreFilterActive) {
    artists = genreArtists;
    totalPages = 1;
  } else {
    artists = allArtists;
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

  if (isLoading && artists.length === 0) {
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
          <p className="text-red-400 mb-4">Error al cargar los artistas</p>
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
          <SearchBar
            onSearch={handleSearch}
            isLoading={searching}
            placeholder="Buscar artistas..."
          />
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

      {artists.length === 0 && !isLoading ? (
        <div className="text-center py-20">
          <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-8 max-w-md mx-auto">
            <p className="text-gray-400 text-lg mb-2">
              {isSearchMode
                ? 'No se encontraron artistas'
                : selectedGenre
                  ? `No hay artistas en el género ${selectedGenre}`
                  : 'No hay artistas disponibles'}
            </p>
            <p className="text-gray-500 text-sm">
              {isSearchMode
                ? 'Intenta con otra búsqueda'
                : selectedGenre
                  ? 'Prueba con otro género'
                  : 'Vuelve más tarde para descubrir nuevos talentos'}
            </p>
            {hasActiveFilters && (
              <Button onClick={clearFilters} variant="outline" className="mt-4">
                Ver todos los artistas
              </Button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
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
              Mostrando {artists.length} artista{artists.length !== 1 ? 's' : ''}
            </div>
          )}
        </>
      )}
    </div>
  );
};
