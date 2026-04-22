// src/pages/ExplorePage.tsx
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useArtists } from '../hooks/useArtists';
import { useGroups } from '../hooks/useGroups';
import { ArtistCard } from '../components/ArtistCard';
import { GroupCard } from '../components/GroupCard';
import { Button } from '../components/ui/Button';
import { Users, Music, TrendingUp, Sparkles, Filter, X } from 'lucide-react';
import { FiltersModal } from '../components/FiltersModal';

export const ExplorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'artists' | 'groups'>('artists');
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);

  // Leer filtros de la URL
  const country = searchParams.get('country') || '';
  const city = searchParams.get('city') || '';
  const genre = searchParams.get('genre') || '';

  // Estado para la página (aunque en Explore mostramos solo 6, mantenemos para consistencia)
  const [artistPage] = useState(0);
  const [groupPage] = useState(0);

  // Resetear páginas cuando cambian los filtros
  useEffect(() => {
    // Las páginas se resetearían aquí si usáramos paginación interna
  }, [country, city, genre]);

  // Usar los hooks con filtros
  const {
    artists,
    loading: loadingArtists,
    totalElements: artistTotal,
  } = useArtists({
    page: artistPage,
    size: 6,
    country: country || undefined,
    city: city || undefined,
    genre: genre || undefined,
  });

  const {
    groups,
    loading: loadingGroups,
    totalElements: groupTotal,
  } = useGroups({
    page: groupPage,
    size: 6,
    country: country || undefined,
    city: city || undefined,
    genre: genre || undefined,
  });

  // Función para eliminar un filtro específico
  const removeFilter = (filterName: 'country' | 'city' | 'genre') => {
    const params = new URLSearchParams(searchParams);
    params.delete(filterName);
    setSearchParams(params);
  };

  // Función para limpiar todos los filtros
  const clearAllFilters = () => {
    const params = new URLSearchParams();
    setSearchParams(params);
  };

  // Verificar si hay filtros activos
  const hasActiveFilters = !!(country || city || genre);

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Header con botón de filtros */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Explorar
            </h1>
            <p className="text-gray-400 mt-2">Descubre nuevos artistas y grupos musicales</p>
          </div>

          {/* Botón de filtros */}
          <button
            onClick={() => setIsFiltersModalOpen(true)}
            className={`p-2 rounded-lg transition-all duration-200 ${
              hasActiveFilters
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800/50 text-gray-400 hover:text-white'
            }`}
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Badges de filtros activos */}
        {hasActiveFilters && (
          <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
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
                <button onClick={() => removeFilter('city')} className="ml-1 hover:text-purple-100">
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
        )}

        {/* Result count */}
        {hasActiveFilters && (
          <div className="text-center mb-4 text-sm text-gray-400">
            {activeTab === 'artists'
              ? `Se encontraron ${artistTotal} artista${artistTotal !== 1 ? 's' : ''}`
              : `Se encontraron ${groupTotal} grupo${groupTotal !== 1 ? 's' : ''}`}
          </div>
        )}

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab('artists')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all duration-200 ${
              activeTab === 'artists'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-gray-800/50 text-gray-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            Artistas
            {hasActiveFilters && artistTotal > 0 && (
              <span className="text-xs ml-1">({artistTotal})</span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all duration-200 ${
              activeTab === 'groups'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-gray-800/50 text-gray-400 hover:text-white'
            }`}
          >
            <Music className="w-4 h-4" />
            Grupos
            {hasActiveFilters && groupTotal > 0 && (
              <span className="text-xs ml-1">({groupTotal})</span>
            )}
          </button>
        </div>

        {/* Contenido */}
        {activeTab === 'artists' ? (
          <>
            {loadingArtists ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
              </div>
            ) : (
              <>
                {artists.length === 0 && hasActiveFilters ? (
                  <div className="text-center py-20">
                    <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-8 max-w-md mx-auto">
                      <p className="text-gray-400 text-lg mb-2">No se encontraron artistas</p>
                      <p className="text-gray-500 text-sm">
                        Intenta con otros filtros o limpiar la búsqueda
                      </p>
                      <button
                        onClick={clearAllFilters}
                        className="mt-4 text-purple-400 hover:text-purple-300"
                      >
                        Limpiar filtros
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {artists.slice(0, 6).map((artist) => (
                        <ArtistCard key={artist.id} artist={artist} />
                      ))}
                    </div>
                    {!hasActiveFilters && (
                      <div className="text-center mt-8">
                        <Link to="/artists">
                          <Button variant="outline">Ver todos los artistas →</Button>
                        </Link>
                      </div>
                    )}
                    {hasActiveFilters && artists.length >= 6 && (
                      <div className="text-center mt-8">
                        <Link to={`/search?${searchParams.toString()}`}>
                          <Button variant="outline">Ver todos los resultados →</Button>
                        </Link>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </>
        ) : (
          <>
            {loadingGroups ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
              </div>
            ) : (
              <>
                {groups.length === 0 && hasActiveFilters ? (
                  <div className="text-center py-20">
                    <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-8 max-w-md mx-auto">
                      <p className="text-gray-400 text-lg mb-2">No se encontraron grupos</p>
                      <p className="text-gray-500 text-sm">
                        Intenta con otros filtros o limpiar la búsqueda
                      </p>
                      <button
                        onClick={clearAllFilters}
                        className="mt-4 text-purple-400 hover:text-purple-300"
                      >
                        Limpiar filtros
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {groups.slice(0, 6).map((group) => (
                        <GroupCard key={group.id} group={group} />
                      ))}
                    </div>
                    {!hasActiveFilters && (
                      <div className="text-center mt-8">
                        <Link to="/groups">
                          <Button variant="outline">Ver todos los grupos →</Button>
                        </Link>
                      </div>
                    )}
                    {hasActiveFilters && groups.length >= 6 && (
                      <div className="text-center mt-8">
                        <Link to={`/search?${searchParams.toString()}`}>
                          <Button variant="outline">Ver todos los resultados →</Button>
                        </Link>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </>
        )}

        {/* Sección de destacados (solo visible sin filtros) */}
        {!hasActiveFilters && (
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-semibold text-white">Tendencias</h2>
            </div>
            <div className="bg-gradient-to-r from-purple-900/30 via-pink-900/30 to-blue-900/30 rounded-2xl p-8 text-center">
              <TrendingUp className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <p className="text-gray-300">Próximamente: Artistas y grupos más populares</p>
            </div>
          </div>
        )}
      </div>

      {/* Modal de filtros */}
      <FiltersModal isOpen={isFiltersModalOpen} onClose={() => setIsFiltersModalOpen(false)} />
    </div>
  );
};

export default ExplorePage;
