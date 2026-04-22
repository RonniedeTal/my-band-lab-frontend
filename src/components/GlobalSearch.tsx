import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { SEARCH_ARTISTS } from '../graphql/queries/artist.queries';
import { SEARCH_GROUPS } from '../graphql/queries/group.queries';
import { Search, Users, Music, X, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { LoadingSpinner } from './ui/LoadingSpinner';
import { useCountries } from '../hooks/useCountries';
import { useCities } from '../hooks/useCities';

export const GlobalSearch: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { countries, loading: loadingCountries } = useCountries();
  const { cities, loading: loadingCities } = useCities(selectedCountry);

  const [searchArtists, { data: artistsData, loading: loadingArtists }] =
    useLazyQuery(SEARCH_ARTISTS);
  const [searchGroups, { data: groupsData, loading: loadingGroups }] = useLazyQuery(SEARCH_GROUPS);

  // Detectar móvil
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Ejecutar búsqueda cuando cambia debouncedQuery
  useEffect(() => {
    if (debouncedQuery.trim()) {
      searchArtists({ variables: { query: debouncedQuery, page: 0, size: 5 } });
      searchGroups({ variables: { query: debouncedQuery, page: 0, size: 5 } });
    }
  }, [debouncedQuery, searchArtists, searchGroups]);

  const hasArtists = artistsData?.searchArtists?.content?.length > 0;
  const hasGroups = groupsData?.searchGroups?.content?.length > 0;
  const hasResults = hasArtists || hasGroups;
  const hasQuery = query.trim().length > 0;
  const shouldBeOpen = hasQuery && hasResults;

  useEffect(() => {
    setIsOpen(shouldBeOpen);
  }, [shouldBeOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const artists = artistsData?.searchArtists?.content || [];
  const groups = groupsData?.searchGroups?.content || [];
  const isLoading = loadingArtists || loadingGroups;

  const handleSelect = useCallback(
    (id: number, type: string) => {
      setQuery('');
      setIsOpen(false);
      navigate(`/${type}s/${id}`);
    },
    [navigate]
  );

  const handleClear = useCallback(() => {
    setQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  }, []);

  const handleSearchWithFilters = useCallback(() => {
    // Permitir búsqueda con término O con filtros
    if (query.trim() || selectedCountry || selectedCity || selectedGenre) {
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (selectedCountry) params.set('country', selectedCountry);
      if (selectedCity) params.set('city', selectedCity);
      if (selectedGenre) params.set('genre', selectedGenre);
      navigate(`/search?${params.toString()}`);
      setIsOpen(false);
      if (isMobile) setShowFilters(false);
      // Limpiar filtros después de la búsqueda
      setSelectedCountry('');
      setSelectedCity('');
      setSelectedGenre('');
    }
  }, [query, selectedCountry, selectedCity, selectedGenre, navigate, isMobile]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchWithFilters();
    }
  };

  const clearFilters = () => {
    setSelectedCountry('');
    setSelectedCity('');
    setSelectedGenre('');
  };

  const hasActiveFilters = selectedCountry || selectedCity || selectedGenre;

  const genres = [
    'ROCK',
    'POP',
    'JAZZ',
    'METAL',
    'CLASSICAL',
    'ELECTRONIC',
    'HIP_HOP',
    'REGGAE',
    'BLUES',
    'COUNTRY',
    'LATIN',
    'INDIE',
  ];

  // Componente de filtros (se reutiliza)
  const FiltersPanel = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
        {/* País */}
        <select
          value={selectedCountry}
          onChange={(e) => {
            setSelectedCountry(e.target.value);
            setSelectedCity('');
          }}
          className="w-full px-3 py-2 text-sm bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
        >
          <option value="">🌍 Todos los países</option>
          {loadingCountries ? (
            <option disabled>Cargando países...</option>
          ) : (
            countries.map((c) => (
              <option key={c.code} value={c.name}>
                {c.name}
              </option>
            ))
          )}
        </select>

        {/* Ciudad */}
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          disabled={!selectedCountry}
          className="w-full px-3 py-2 text-sm bg-gray-800/50 border border-gray-700 rounded-lg text-white disabled:opacity-50 focus:outline-none focus:border-purple-500"
        >
          <option value="">🏙️ Todas las ciudades</option>
          {loadingCities ? (
            <option disabled>Cargando ciudades...</option>
          ) : (
            cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))
          )}
        </select>

        {/* Género */}
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="w-full px-3 py-2 text-sm bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
        >
          <option value="">🎵 Todos los géneros</option>
          {genres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        {/* Botón buscar */}
        <button
          onClick={handleSearchWithFilters}
          className="px-4 py-2 text-sm bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          Buscar
        </button>
      </div>

      {/* Limpiar filtros */}
      {hasActiveFilters && (
        <div className="flex justify-end">
          <button onClick={clearFilters} className="text-xs text-purple-400 hover:text-purple-300">
            Limpiar filtros ✕
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      {/* Input de búsqueda con botón de filtros */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Buscar artistas o grupos..."
          className="w-full pl-10 pr-16 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white placeholder-gray-400"
        />

        {/* Botón de filtros */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded transition-colors ${
            hasActiveFilters ? 'text-purple-400' : 'text-gray-400 hover:text-white'
          }`}
          title="Filtros"
        >
          <Filter className="w-4 h-4" />
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full" />
          )}
        </button>

        {/* Botón limpiar búsqueda */}
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Panel de filtros - Responsive */}
      {showFilters && (
        <div className="mt-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-medium text-white">Filtros avanzados</h4>
            <button
              onClick={() => setShowFilters(false)}
              className="text-gray-400 hover:text-white md:hidden"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
          <FiltersPanel />
        </div>
      )}

      {/* Filtros siempre visibles en desktop (si no están desplegados en móvil) */}
      {!isMobile && !showFilters && hasActiveFilters && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedCountry && (
            <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full">
              🌍 {selectedCountry}
            </span>
          )}
          {selectedCity && (
            <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full">
              🏙️ {selectedCity}
            </span>
          )}
          {selectedGenre && (
            <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full">
              🎵 {selectedGenre}
            </span>
          )}
          <button
            onClick={clearFilters}
            className="text-xs px-2 py-1 text-gray-400 hover:text-white"
          >
            Limpiar ✕
          </button>
        </div>
      )}

      {/* Dropdown de resultados */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : artists.length === 0 && groups.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No se encontraron resultados</p>
            </div>
          ) : (
            <>
              {artists.length > 0 && (
                <div className="border-b border-gray-700">
                  <div className="px-3 py-2 bg-gray-800/50">
                    <h4 className="text-xs font-semibold text-purple-400 uppercase flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      Artistas
                    </h4>
                  </div>
                  {artists.map((artist: { id: number; stageName: string; genre: string }) => (
                    <button
                      key={`artist-${artist.id}`}
                      onClick={() => handleSelect(artist.id, 'artist')}
                      className="w-full text-left px-3 py-2 hover:bg-gray-700 transition-colors flex items-center gap-3"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {artist.stageName.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">{artist.stageName}</p>
                        <p className="text-xs text-gray-400">{artist.genre}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {groups.length > 0 && (
                <div className="border-b border-gray-700">
                  <div className="px-3 py-2 bg-gray-800/50">
                    <h4 className="text-xs font-semibold text-purple-400 uppercase flex items-center gap-1">
                      <Music className="w-3 h-3" />
                      Grupos
                    </h4>
                  </div>
                  {groups.map((group: { id: number; name: string; genre: string }) => (
                    <button
                      key={`group-${group.id}`}
                      onClick={() => handleSelect(group.id, 'group')}
                      className="w-full text-left px-3 py-2 hover:bg-gray-700 transition-colors flex items-center gap-3"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                        <Music className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">{group.name}</p>
                        <p className="text-xs text-gray-400">{group.genre}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={() => {
                  handleSearchWithFilters();
                  setIsOpen(false);
                }}
                className="w-full text-center px-3 py-2 text-purple-400 hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                Ver todos los resultados →
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
