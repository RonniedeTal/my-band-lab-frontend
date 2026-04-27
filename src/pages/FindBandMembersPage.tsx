import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { SEARCH_ARTISTS_LOOKING_FOR_BAND } from '../graphql/queries/artist.queries';
import { GET_USER_ARTIST } from '../graphql/queries/user.queries';
import { Music, MapPin, Users, Loader2 } from 'lucide-react';
import { LookingForBandBadge } from '../components/LookingForBandBadge';
import { useAuth } from '../hooks/useAuth';

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
}

export const FindBandMembersPage: React.FC = () => {
  const { user } = useAuth();

  // Query para obtener el artista del usuario actual (para obtener su artistId)
  const {
    data: userArtistData,
    loading: userArtistLoading,
    error: userArtistError,
  } = useQuery(GET_USER_ARTIST, {
    variables: { userId: user?.id },
    skip: !user?.id,
    fetchPolicy: 'network-only',
  });

  // Query para obtener todos los artistas que buscan banda
  const {
    data: artistsData,
    loading: artistsLoading,
    error: artistsError,
  } = useQuery(SEARCH_ARTISTS_LOOKING_FOR_BAND, {
    fetchPolicy: 'network-only',
  });

  const [hoveredArtist, setHoveredArtist] = useState<string | null>(null);

  // Obtener el artistId del usuario actual
  const currentArtistId = userArtistData?.artistByUserId?.id;

  // Verificar si alguna query está cargando
  const loading = userArtistLoading || artistsLoading;

  // Verificar si hay algún error
  const error = userArtistError || artistsError;

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

  const allArtists = artistsData?.artistsLookingForBand || [];

  // 👈 FILTRAR: Excluir al artista del usuario actual por artistId
  const filteredArtists = allArtists.filter((artist: Artist) => {
    // Si el usuario no tiene artista, mostrar todos
    if (!currentArtistId) return true;
    // Excluir al artista actual
    return String(artist.id) !== String(currentArtistId);
  });

  // Función para renderizar instrumentos con límite
  const renderInstruments = (artist: Artist, artistId: string) => {
    const instruments = artist.lookingForInstruments || artist.instruments || [];
    const visibleInstruments = instruments.slice(0, 3);
    const remainingCount = instruments.length - 3;

    if (instruments.length === 0) return null;

    return (
      <div
        className="relative mt-3"
        onMouseEnter={() => setHoveredArtist(artistId)}
        onMouseLeave={() => setHoveredArtist(null)}
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

        {/* Tooltip con instrumentos completos */}
        {hoveredArtist === artistId && remainingCount > 0 && (
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
          ) : (
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

                  {renderInstruments(artist, artist.id)}
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
