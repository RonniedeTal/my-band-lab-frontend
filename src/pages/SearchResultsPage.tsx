// src/pages/SearchResultsPage.tsx
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { SEARCH_ARTISTS } from '../graphql/queries/artist.queries';
import { SEARCH_GROUPS } from '../graphql/queries/group.queries';
import { ArtistCard } from '../components/ArtistCard';
import { GroupCard } from '../components/GroupCard';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Search, Users, Music, AlertCircle, X } from 'lucide-react';
import type { Artist } from '../types/artist.types';
import type { MusicGroup } from '../types/group.types';

type TabType = 'artists' | 'groups';

export const SearchResultsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Leer filtros de la URL
  const query = searchParams.get('q') || '';
  const country = searchParams.get('country') || '';
  const city = searchParams.get('city') || '';
  const genre = searchParams.get('genre') || '';

  const [activeTab, setActiveTab] = useState<TabType>('artists');
  const [artistPage, setArtistPage] = useState(0);
  const [groupPage, setGroupPage] = useState(0);

  // Resetear páginas cuando cambian los filtros
  useEffect(() => {
    setArtistPage(0);
    setGroupPage(0);
  }, [query, country, city, genre]);

  // Búsqueda de artistas
  const {
    data: artistsData,
    loading: loadingArtists,
    error: artistsError,
  } = useQuery(SEARCH_ARTISTS, {
    variables: {
      query: query || '*',
      page: artistPage,
      size: 9,
      country: country || null,
      city: city || null,
      genre: genre || null,
    },
    skip: (!query && !country && !city && !genre) || activeTab !== 'artists',
  });

  // Búsqueda de grupos
  const {
    data: groupsData,
    loading: loadingGroups,
    error: groupsError,
  } = useQuery(SEARCH_GROUPS, {
    variables: {
      query: query || '*',
      page: groupPage,
      size: 9,
      country: country || null,
      city: city || null,
      genre: genre || null,
    },
    skip: (!query && !country && !city && !genre) || activeTab !== 'groups',
  });

  const artists = artistsData?.searchArtists?.content || [];
  const artistTotal = artistsData?.searchArtists?.totalElements || 0;
  const artistTotalPages = artistsData?.searchArtists?.totalPages || 0;
  const artistHasNext = artistsData?.searchArtists?.hasNext || false;
  const artistHasPrevious = artistsData?.searchArtists?.hasPrevious || false;

  const groups = groupsData?.searchGroups?.content || [];
  const groupTotal = groupsData?.searchGroups?.totalElements || 0;
  const groupTotalPages = groupsData?.searchGroups?.totalPages || 0;
  const groupHasNext = groupsData?.searchGroups?.hasNext || false;
  const groupHasPrevious = groupsData?.searchGroups?.hasPrevious || false;

  // Función para actualizar filtros en URL
  const updateFilters = (newFilters: { country?: string; city?: string; genre?: string }) => {
    const params = new URLSearchParams(searchParams);

    if (newFilters.country !== undefined) {
      if (newFilters.country) {
        params.set('country', newFilters.country);
      } else {
        params.delete('country');
      }
    }

    if (newFilters.city !== undefined) {
      if (newFilters.city) {
        params.set('city', newFilters.city);
      } else {
        params.delete('city');
      }
    }

    if (newFilters.genre !== undefined) {
      if (newFilters.genre) {
        params.set('genre', newFilters.genre);
      } else {
        params.delete('genre');
      }
    }

    // Mantener la query de búsqueda si existe
    if (query) {
      params.set('q', query);
    }

    setSearchParams(params);
  };

  // Función para eliminar un filtro específico
  const removeFilter = (filterName: 'country' | 'city' | 'genre') => {
    updateFilters({ [filterName]: '' });
  };

  // Función para limpiar todos los filtros
  const clearAllFilters = () => {
    const params = new URLSearchParams();
    if (query) {
      params.set('q', query);
    }
    setSearchParams(params);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const handleArtistNextPage = () => {
    setArtistPage(artistPage + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleArtistPreviousPage = () => {
    setArtistPage(Math.max(0, artistPage - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGroupNextPage = () => {
    setGroupPage(groupPage + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGroupPreviousPage = () => {
    setGroupPage(Math.max(0, groupPage - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Si no hay query ni filtros, mostrar mensaje
  if (!query && !country && !city && !genre) {
    return (
      <div className="min-h-screen bg-dark-bg">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Buscar en MyBandLab</h1>
            <p className="text-gray-400">
              Ingresa un término de búsqueda o usa los filtros para encontrar artistas o grupos
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Resultados de búsqueda
          </h1>
          <p className="text-gray-400 mt-2">
            {query ? (
              <>
                Mostrando resultados para:{' '}
                <span className="text-white font-semibold">"{query}"</span>
              </>
            ) : (
              <>Mostrando resultados filtrados</>
            )}
          </p>
        </div>

        {/* Filtros activos - Badges */}
        {(country || city || genre) && (
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-400">Filtros activos:</span>
              {country && (
                <div className="flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                  <span>🌍 {country}</span>
                  <button
                    onClick={() => removeFilter('country')}
                    className="ml-1 hover:text-purple-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {city && (
                <div className="flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                  <span>🏙️ {city}</span>
                  <button
                    onClick={() => removeFilter('city')}
                    className="ml-1 hover:text-purple-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {genre && (
                <div className="flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                  <span>🎵 {genre}</span>
                  <button
                    onClick={() => removeFilter('genre')}
                    className="ml-1 hover:text-purple-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              <button
                onClick={clearAllFilters}
                className="text-sm text-gray-400 hover:text-white transition-colors ml-2"
              >
                Limpiar todos
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-700 mb-6">
          <button
            onClick={() => handleTabChange('artists')}
            className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
              activeTab === 'artists'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            Artistas
            {artistTotal > 0 && (
              <span className="text-xs bg-gray-700 px-1.5 py-0.5 rounded-full">{artistTotal}</span>
            )}
          </button>
          <button
            onClick={() => handleTabChange('groups')}
            className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
              activeTab === 'groups'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Music className="w-4 h-4" />
            Grupos
            {groupTotal > 0 && (
              <span className="text-xs bg-gray-700 px-1.5 py-0.5 rounded-full">{groupTotal}</span>
            )}
          </button>
        </div>

        {/* Resultados - Artist Tab */}
        {activeTab === 'artists' && (
          <>
            {loadingArtists && (
              <div className="flex justify-center py-20">
                <LoadingSpinner />
              </div>
            )}

            {artistsError && (
              <div className="text-center py-20">
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md mx-auto">
                  <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                  <p className="text-red-400">Error al cargar los artistas</p>
                  <p className="text-gray-400 text-sm mt-2">{artistsError.message}</p>
                </div>
              </div>
            )}

            {!loadingArtists && !artistsError && (
              <>
                {artists.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-8 max-w-md mx-auto">
                      <Search className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                      <p className="text-gray-400 text-lg mb-2">No se encontraron artistas</p>
                      <p className="text-gray-500 text-sm">
                        Intenta con otros términos de búsqueda o filtros
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-4 text-sm text-gray-400">
                      {artistTotal} artista{artistTotal !== 1 ? 's' : ''}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {artists.map((artist: Artist) => (
                        <ArtistCard key={artist.id} artist={artist} />
                      ))}
                    </div>

                    {artistTotalPages > 1 && (
                      <div className="flex justify-center items-center gap-4 mt-8 pt-8">
                        <Button
                          onClick={handleArtistPreviousPage}
                          disabled={!artistHasPrevious}
                          variant="outline"
                          className="px-6"
                        >
                          ← Anterior
                        </Button>
                        <span className="text-gray-300">
                          Página {artistPage + 1} de {artistTotalPages}
                        </span>
                        <Button
                          onClick={handleArtistNextPage}
                          disabled={!artistHasNext}
                          variant="outline"
                          className="px-6"
                        >
                          Siguiente →
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}

        {/* Resultados - Group Tab */}
        {activeTab === 'groups' && (
          <>
            {loadingGroups && (
              <div className="flex justify-center py-20">
                <LoadingSpinner />
              </div>
            )}

            {groupsError && (
              <div className="text-center py-20">
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md mx-auto">
                  <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                  <p className="text-red-400">Error al cargar los grupos</p>
                  <p className="text-gray-400 text-sm mt-2">{groupsError.message}</p>
                </div>
              </div>
            )}

            {!loadingGroups && !groupsError && (
              <>
                {groups.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-8 max-w-md mx-auto">
                      <Search className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                      <p className="text-gray-400 text-lg mb-2">No se encontraron grupos</p>
                      <p className="text-gray-500 text-sm">
                        Intenta con otros términos de búsqueda o filtros
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-4 text-sm text-gray-400">
                      {groupTotal} grupo{groupTotal !== 1 ? 's' : ''}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {groups.map((group: MusicGroup) => (
                        <GroupCard key={group.id} group={group} />
                      ))}
                    </div>

                    {groupTotalPages > 1 && (
                      <div className="flex justify-center items-center gap-4 mt-8 pt-8">
                        <Button
                          onClick={handleGroupPreviousPage}
                          disabled={!groupHasPrevious}
                          variant="outline"
                          className="px-6"
                        >
                          ← Anterior
                        </Button>
                        <span className="text-gray-300">
                          Página {groupPage + 1} de {groupTotalPages}
                        </span>
                        <Button
                          onClick={handleGroupNextPage}
                          disabled={!groupHasNext}
                          variant="outline"
                          className="px-6"
                        >
                          Siguiente →
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
