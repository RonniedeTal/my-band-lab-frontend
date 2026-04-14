import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_ARTIST_BY_ID } from '../graphql/queries/artist.queries';
import { Button } from '../components/ui/Button';
import {
  ArrowLeft,
  Music,
  Users,
  Calendar,
  CheckCircle,
  Heart,
  UserPlus,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useFollowArtist } from '../hooks/useFollowArtist';
import { useFavoriteArtist } from '../hooks/useFavoriteArtist';
import { LogoUploader } from '../components/LogoUploader';

export const ArtistDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data, loading, error, refetch } = useQuery(GET_ARTIST_BY_ID, {
    variables: { id: parseInt(id || '0') },
    skip: !id,
  });

  const artist = data?.artistById;

  const { isFollowing, toggleFollow } = useFollowArtist(artist?.id as number);
  const { isFavorite, toggleFavorite } = useFavoriteArtist(artist?.id as number);

  const isOwner = String(user?.id) === String(artist?.user?.id);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error || !data?.artistById) {
    return (
      <div className="text-center py-20">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-red-400 mb-4">Error al cargar el artista</p>
          <p className="text-gray-400 text-sm">{error?.message || 'Artista no encontrado'}</p>
          <Button onClick={() => navigate('/artists')} variant="outline" className="mt-4">
            Volver a artistas
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Hero Section con gradiente */}

      <div className="relative bg-gradient-to-r from-purple-900/50 via-pink-900/50 to-blue-900/50">
        <div className="container mx-auto px-4 py-12">
          <Button onClick={() => navigate('/artists')} variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar/Imagen placeholder */}
            {isOwner && (
              <LogoUploader
                currentLogoUrl={artist.logoUrl}
                entityId={artist.id}
                entityType="artist"
                onLogoUploaded={() => {
                  refetch();
                }}
                onError={(errorMsg) => {
                  console.error('Error al subir logo:', errorMsg);
                }}
              />
            )}

            {/* Si no es dueño pero hay logo, mostrarlo */}
            {!isOwner && artist.logoUrl && (
              <img
                src={artist.logoUrl}
                alt={artist.stageName}
                className="w-32 h-32 md:w-48 md:h-48 rounded-lg object-cover border-2 border-purple-500"
              />
            )}

            {/* Si no hay logo y no es dueño, mostrar iniciales */}
            {!isOwner && !artist.logoUrl && (
              <div className="w-32 h-32 md:w-48 md:h-48 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                <span className="text-5xl md:text-7xl font-bold text-white">
                  {artist.stageName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-3xl md:text-5xl font-bold text-white">{artist.stageName}</h1>
                {artist.verified && (
                  <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white text-sm font-medium flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Verificado
                  </span>
                )}
              </div>

              <p className="text-xl text-gray-300 mb-4">
                {artist.user?.name} {artist.user?.surname}
              </p>

              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                  {artist.genre}
                </span>
                {artist.mainInstrument && (
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm flex items-center gap-1">
                    <Music className="w-3 h-3" />
                    {artist.mainInstrument.name}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Biografía */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-800/30 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Biografía</h2>
              <p className="text-gray-300 leading-relaxed">
                {artist.biography || 'No hay biografía disponible para este artista.'}
              </p>
            </div>

            {/* Instrumentos */}
            {artist.instruments && artist.instruments.length > 0 && (
              <div className="bg-gray-800/30 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Instrumentos</h2>
                <div className="flex flex-wrap gap-2">
                  {artist.instruments.map(
                    (instrument: { id: number; name: string; category: string }) => (
                      <span
                        key={instrument.id}
                        className={`px-3 py-2 rounded-lg text-sm font-medium ${
                          instrument.id === artist.mainInstrument?.id
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                            : 'bg-gray-700/50 text-gray-300'
                        }`}
                      >
                        {instrument.name}
                        {instrument.id === artist.mainInstrument?.id && ' (Principal)'}
                      </span>
                    )
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar con estadísticas */}
          <div className="space-y-6">
            <div className="bg-gray-800/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Estadísticas</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Seguidores
                  </span>
                  <span className="text-white font-semibold">0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Miembro desde
                  </span>
                  <span className="text-white font-semibold">
                    {artist.createdAt ? new Date(artist.createdAt).getFullYear() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Botones de acción - solo visibles para usuarios autenticados */}
            <div className="bg-gray-800/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Acciones</h3>
              <div className="space-y-3">
                {user ? (
                  <>
                    <button
                      onClick={toggleFollow}
                      className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${
                        isFollowing
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90'
                      }`}
                    >
                      {isFollowing ? (
                        <>
                          <UserCheck className="w-4 h-4" />
                          Siguiendo
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          Seguir
                        </>
                      )}
                    </button>

                    <button
                      onClick={toggleFavorite}
                      className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg transition-all ${
                        isFavorite
                          ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                          : 'bg-gray-700/50 text-gray-300 hover:text-pink-400 hover:bg-pink-500/10'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isFavorite ? 'fill-pink-400' : ''}`} />
                      {isFavorite ? 'En Favoritos' : 'Añadir a Favoritos'}
                    </button>
                  </>
                ) : (
                  <Button onClick={() => navigate('/login')} variant="primary" className="w-full">
                    Inicia sesión para interactuar
                  </Button>
                )}
                <Button variant="outline" className="w-full">
                  Compartir
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistDetailPage;
