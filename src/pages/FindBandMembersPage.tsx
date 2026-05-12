import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { SEARCH_ARTISTS_LOOKING_FOR_BAND } from '../graphql/queries/artist.queries';
import { GET_USER_ARTIST } from '../graphql/queries/user.queries';
import { Music, MapPin, Users, Loader2, X } from 'lucide-react';
import { LookingForBandBadge } from '../components/LookingForBandBadge';
import { useAuth } from '../hooks/useAuth';
import { InstrumentFilter } from '@/components/InstrumentFilter';
import { LocationFilter } from '@/components/LocationFilter';
import { useInstruments } from '@/hooks/useInstruments';
import { SwipeCard } from '../components/SwipeCard';

interface Instrument {
  id: string;
  name: string;
  category?: string;
}

interface Artist {
  id: string;
  stageName: string;
  genre: string;
  city: string;
  country: string;
  isLookingForBand: boolean;
  profileImageUrl?: string;
  lookingForInstruments?: Instrument[];
  instruments?: Instrument[];
  lookingForGenres?: string[];
}

// Componente para instrumentos
const InstrumentsDisplay: React.FC<{ artist: Artist }> = ({ artist }) => {
  const [hovered, setHovered] = useState<string | null>(null);
  const instruments = artist.lookingForInstruments || artist.instruments || [];
  const visibleInstruments = instruments.slice(0, 3);
  const remainingCount = instruments.length - 3;

  if (instruments.length === 0) return null;

  return (
    <div
      className="relative mt-3"
      onMouseEnter={() => setHovered(artist.id)}
      onMouseLeave={() => setHovered(null)}
    >
      <div className="flex flex-wrap gap-2">
        {visibleInstruments.map((instrument) => (
          <span
            key={instrument.id}
            className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full"
          >
            {instrument.name}
          </span>
        ))}
        {remainingCount > 0 && (
          <span className="bg-gray-700/50 text-gray-400 text-xs px-2 py-1 rounded-full cursor-help">
            +{remainingCount} más
          </span>
        )}
      </div>

      {hovered === artist.id && remainingCount > 0 && (
        <div className="absolute bottom-full left-0 mb-2 z-10 bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-2 min-w-[180px]">
          <p className="text-xs text-gray-400 mb-1">Instrumentos:</p>
          <div className="flex flex-wrap gap-1">
            {instruments.map((instrument) => (
              <span
                key={instrument.id}
                className="text-xs px-1.5 py-0.5 bg-purple-500/20 text-purple-300 rounded"
              >
                {instrument.name}
              </span>
            ))}
          </div>
          <div className="absolute top-full left-4 -mt-1 w-2 h-2 bg-gray-900 border-r border-b border-gray-700 rotate-45"></div>
        </div>
      )}
    </div>
  );
};

// Componente para géneros
const GenresDisplay: React.FC<{ genres: string[] }> = ({ genres }) => {
  if (!genres || genres.length === 0) return null;

  return (
    <div className="mt-3">
      <p className="text-xs text-gray-500 mb-1">Géneros que busca:</p>
      <div className="flex flex-wrap gap-1">
        {genres.slice(0, 3).map((genre) => (
          <span
            key={genre}
            className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full"
          >
            {genre}
          </span>
        ))}
        {genres.length > 3 && (
          <span className="text-xs px-2 py-0.5 bg-gray-700/50 text-gray-400 rounded-full">
            +{genres.length - 3}
          </span>
        )}
      </div>
    </div>
  );
};

export const FindBandMembersPage: React.FC = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedInstrumentIds, setSelectedInstrumentIds] = useState<number[]>(() => {
    const instruments = searchParams.get('instrumentIds');
    return instruments ? instruments.split(',').map(Number) : [];
  });

  const [selectedCountry, setSelectedCountry] = useState<string>(() => {
    return searchParams.get('country') || '';
  });

  const [selectedCity, setSelectedCity] = useState<string>(() => {
    return searchParams.get('city') || '';
  });

  const { instruments: instrumentsList } = useInstruments();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Referencia para evitar re-renders en handlers
  const filteredArtistsLengthRef = useRef(0);

  const getInstrumentName = (id: number): string => {
    const instrument = instrumentsList.find((i: { id: number; name: string }) => i.id === id);
    return instrument?.name || `Instrumento ${id}`;
  };

  // Queries (hooks)
  const {
    data: userArtistData,
    loading: userArtistLoading,
    error: userArtistError,
  } = useQuery(GET_USER_ARTIST, {
    variables: { userId: user?.id },
    skip: !user?.id,
    fetchPolicy: 'cache-first', //network-only
  });

  const {
    data: artistsData,
    loading: artistsLoading,
    error: artistsError,
    refetch,
  } = useQuery(SEARCH_ARTISTS_LOOKING_FOR_BAND, {
    variables: {
      instrumentIds: selectedInstrumentIds.length > 0 ? selectedInstrumentIds : null,
      country: selectedCountry || null,
      city: selectedCity || null,
    },
    fetchPolicy: 'network-only',
  });

  // Sincronizar filtros con URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (selectedInstrumentIds.length > 0) {
      params.set('instrumentIds', selectedInstrumentIds.join(','));
    } else {
      params.delete('instrumentIds');
    }
    if (selectedCountry) {
      params.set('country', selectedCountry);
    } else {
      params.delete('country');
    }
    if (selectedCity) {
      params.set('city', selectedCity);
    } else {
      params.delete('city');
    }
    setSearchParams(params);
  }, [selectedInstrumentIds, selectedCountry, selectedCity]);

  // Refetch cuando cambian los filtros
  useEffect(() => {
    refetch({
      instrumentIds: selectedInstrumentIds.length > 0 ? selectedInstrumentIds : null,
      country: selectedCountry || null,
      city: selectedCity || null,
    });
  }, [selectedInstrumentIds, selectedCountry, selectedCity, refetch]);

  // Detectar móvil
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Resetear índice cuando cambian los filtros
  useEffect(() => {
    setCurrentIndex(0);
  }, [artistsData?.artistsLookingForBand?.length]);

  // Handlers UI
  const handleRemoveInstrument = (instrumentId: number) => {
    setSelectedInstrumentIds((prev) => prev.filter((id) => id !== instrumentId));
  };

  const handleRemoveLocation = () => {
    setSelectedCountry('');
    setSelectedCity('');
  };

  const handleClearAll = () => {
    setSelectedInstrumentIds([]);
    setSelectedCountry('');
    setSelectedCity('');
  };

  // Calcular filteredArtists
  const currentArtistId = userArtistData?.artistByUserId?.id;
  const loading = userArtistLoading || artistsLoading;
  const error = userArtistError || artistsError;

  const allArtists = artistsData?.artistsLookingForBand || [];
  const filteredArtists = allArtists.filter((artist: Artist) => {
    if (!currentArtistId) return true;
    return String(artist.id) !== String(currentArtistId);
  });

  // Actualizar referencia cuando cambie filteredArtists
  useEffect(() => {
    filteredArtistsLengthRef.current = filteredArtists.length;
  }, [filteredArtists.length]);

  // Handlers de swipe memoizados sin dependencias problemáticas
  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev + 1 < filteredArtistsLengthRef.current) {
        return prev + 1;
      }
      return prev;
    });
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev - 1 >= 0) {
        return prev - 1;
      }
      return prev;
    });
  }, []);

  const hasActiveFilters = selectedInstrumentIds.length > 0 || selectedCountry !== '';
  const activeFiltersCount = (selectedInstrumentIds.length > 0 ? 1 : 0) + (selectedCountry ? 1 : 0);

  // Early returns (después de todos los hooks)
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400">Error al cargar: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Músicos que Buscan Proyecto
            </h1>
            <p className="text-gray-400 text-lg">
              Conecta con artistas que están buscando formar o unirse a un proyecto musical
            </p>
          </div>

          {/* Barra de filtros */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <InstrumentFilter
                selectedInstrumentIds={selectedInstrumentIds}
                onInstrumentChange={setSelectedInstrumentIds}
              />
              <LocationFilter
                selectedCountry={selectedCountry}
                selectedCity={selectedCity}
                onCountryChange={setSelectedCountry}
                onCityChange={setSelectedCity}
              />
              {activeFiltersCount > 0 && (
                <button
                  onClick={handleClearAll}
                  className="px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  Limpiar todos ({activeFiltersCount})
                </button>
              )}
            </div>
            <p className="text-sm text-gray-400">
              {filteredArtists.length}{' '}
              {filteredArtists.length === 1 ? 'músico encontrado' : 'músicos encontrados'}
            </p>
          </div>

          {/* Badges de filtros activos */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-gray-800/30 rounded-lg">
              <span className="text-sm text-gray-400">Filtros activos:</span>
              {selectedInstrumentIds.map((id) => (
                <span
                  key={id}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs"
                >
                  {getInstrumentName(id)}
                  <button
                    onClick={() => handleRemoveInstrument(id)}
                    className="hover:text-white ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {selectedCountry && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                  <MapPin className="w-3 h-3" />
                  {selectedCity ? `${selectedCity}, ${selectedCountry}` : selectedCountry}
                  <button onClick={handleRemoveLocation} className="hover:text-white ml-1">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={handleClearAll}
                className="ml-2 px-2 py-1 text-xs text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                Limpiar todos
              </button>
            </div>
          )}

          {filteredArtists.length === 0 ? (
            <div className="text-center py-20 bg-gray-800/30 rounded-xl">
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">
                No hay músicos buscando proyecto en este momento
              </p>
              <p className="text-gray-500 text-sm mt-2">
                ¡Vuelve más tarde o activa tu propio estado!
              </p>
            </div>
          ) : isMobile ? (
            // MÓVIL: SWIPE CARD
            <div className="relative min-h-[70vh] flex flex-col items-center justify-center">
              {filteredArtists.length > 0 && currentIndex < filteredArtists.length ? (
                <>
                  <SwipeCard
                    key={filteredArtists[currentIndex].id}
                    artist={filteredArtists[currentIndex]}
                    onSwipeLeft={handleNext}
                    onSwipeRight={handlePrev}
                    instrumentsNode={<InstrumentsDisplay artist={filteredArtists[currentIndex]} />}
                    genresNode={
                      <GenresDisplay
                        genres={filteredArtists[currentIndex].lookingForGenres || []}
                      />
                    }
                  />
                  <div className="mt-6 flex justify-center gap-2">
                    {filteredArtists.map((_: Artist, idx: number) => (
                      <div
                        key={idx}
                        className={`h-1 rounded-full transition-all ${
                          idx === currentIndex ? 'w-6 bg-purple-500' : 'w-2 bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-4 text-gray-500 text-sm">
                    {currentIndex + 1} de {filteredArtists.length}
                  </p>
                </>
              ) : (
                <div className="text-center py-20">
                  <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No hay más músicos disponibles</p>
                  <button
                    onClick={() => setCurrentIndex(0)}
                    className="mt-4 px-4 py-2 bg-purple-600 rounded-lg text-white"
                  >
                    Volver a empezar
                  </button>
                </div>
              )}
            </div>
          ) : (
            // DESKTOP: GRID NORMAL
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArtists.map((artist: Artist) => (
                <Link
                  key={artist.id}
                  to={`/artists/${artist.id}`}
                  className="bg-gray-800/50 rounded-xl p-6 hover:bg-gray-800/70 transition-all hover:transform hover:scale-105 duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    {artist.profileImageUrl ? (
                      <img
                        src={artist.profileImageUrl}
                        alt={artist.stageName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                        <Music className="w-6 h-6 text-white" />
                      </div>
                    )}
                    <LookingForBandBadge size="sm" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{artist.stageName}</h3>
                  <p className="text-gray-400 text-sm mb-3">Género: {artist.genre}</p>
                  {artist.city && (
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {artist.city}, {artist.country || ''}
                      </span>
                    </div>
                  )}
                  <InstrumentsDisplay artist={artist} />
                  <GenresDisplay genres={artist.lookingForGenres || []} />
                  {user && (
                    <div className="mt-4 pt-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          window.location.href = `/artists/${artist.id}?contact=true`;
                        }}
                        className="w-full px-3 py-1.5 text-sm bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        💬 Contactar
                      </button>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindBandMembersPage;
