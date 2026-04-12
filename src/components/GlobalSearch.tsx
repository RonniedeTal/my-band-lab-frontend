import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { SEARCH_ARTISTS } from '../graphql/queries/artist.queries';
import { SEARCH_GROUPS } from '../graphql/queries/group.queries';
import { Search, Users, Music, X } from 'lucide-react';
import { LoadingSpinner } from './ui/LoadingSpinner';

export const GlobalSearch: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [searchArtists, { data: artistsData, loading: loadingArtists }] =
    useLazyQuery(SEARCH_ARTISTS);
  const [searchGroups, { data: groupsData, loading: loadingGroups }] = useLazyQuery(SEARCH_GROUPS);

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

  // Actualizar isOpen cuando cambian los resultados o la query
  const hasArtists = artistsData?.searchArtists?.content?.length > 0;
  const hasGroups = groupsData?.searchGroups?.content?.length > 0;
  const hasResults = hasArtists || hasGroups;
  const hasQuery = query.trim().length > 0;
  const shouldBeOpen = hasQuery && hasResults;

  // Sincronizar isOpen con shouldBeOpen
  useEffect(() => {
    setIsOpen(shouldBeOpen);
  }, [shouldBeOpen]);

  // Cerrar al hacer click fuera
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

  const handleViewAll = useCallback(() => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setIsOpen(false);
      setQuery('');
    }
  }, [query, navigate]);

  const handleClear = useCallback(() => {
    setQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  }, []);

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            const hasResults =
              artistsData?.searchArtists?.content?.length > 0 ||
              groupsData?.searchGroups?.content?.length > 0;
            if (query.trim() && hasResults) {
              setIsOpen(true);
            }
          }}
          placeholder="Buscar artistas o grupos..."
          className="w-full pl-10 pr-10 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white placeholder-gray-400"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

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
                onClick={handleViewAll}
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
