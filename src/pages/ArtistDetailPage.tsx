import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_ARTIST_BY_ID } from '../graphql/queries/artist.queries';
import { Button } from '../components/ui/Button';
import {
  ArrowLeft,
  Music,
  CheckCircle,
  Heart,
  UserPlus,
  UserCheck,
  MapPin,
  BookOpen,
  Disc,
  ListMusic,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useFollowArtist } from '../hooks/useFollowArtist';
import { useFavoriteArtist } from '../hooks/useFavoriteArtist';
import { LogoUploader } from '../components/LogoUploader';
import { SongUploader } from '../components/SongUploader';
import type { Song } from '../types/song.types';
import { AlbumList } from '@/components/AlbumList';
import { useAudioPlayer } from '../context/AudioPlayerContext';

import { TopSongs } from '../components/TopSongs';
import { useTopSongsByArtist } from '../hooks/useSongPlay';
import { AddToPlaylistButton } from '../components/AddToPlaylistButton';
import { MetaTags } from '../components/MetaTags';
import { ShareButtons } from '../components/ShareButtons';
import { ShareSongButton } from '@/components/ShareSongButton';

type TabType = 'info' | 'songs' | 'albums';

const TABS = [
  { id: 'info' as TabType, label: 'Información', icon: BookOpen },
  { id: 'songs' as TabType, label: 'Canciones', icon: ListMusic },
  { id: 'albums' as TabType, label: 'Álbumes', icon: Disc },
];

export const ArtistDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('info');

  const { data, loading, error, refetch } = useQuery(GET_ARTIST_BY_ID, {
    variables: { id: parseInt(id || '0') },
    skip: !id,
  });

  const artist = data?.artistById;

  const { playSong } = useAudioPlayer();
  const { isFollowing, toggleFollow } = useFollowArtist(artist?.id as number);
  const { isFavorite, toggleFavorite } = useFavoriteArtist(artist?.id as number);

  const isOwner = String(user?.id) === String(artist?.user?.id);

  const { topSongs, loading: topSongsLoading } = useTopSongsByArtist(artist?.id as number, 5);

  const songsWithArtistInfo =
    artist?.songs?.map((song: Song) => ({
      ...song,
      artistName: artist.stageName,
      artistId: artist.id,
      coverImage: artist.logoUrl,
    })) || [];

  const getSongsCount = () => artist?.songs?.length || 0;
  const getAlbumsCount = () => artist?.albums?.length || 0;

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
    <>
      <MetaTags
        title={artist.stageName}
        description={artist.biography || `Escucha la música de ${artist.stageName} en MyBandLab`}
        image={artist.logoUrl || artist.profileImageUrl}
        url={`/artists/${artist.id}`}
        type="music.song"
      />
      <div className="min-h-screen bg-dark-bg pb-20 md:pb-0">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-purple-900/50 via-pink-900/50 to-blue-900/50">
          <div className="container mx-auto px-4 py-6 md:py-12">
            <Button onClick={() => navigate('/artists')} variant="ghost" className="mb-4 md:mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>

            <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-start">
              {isOwner ? (
                <LogoUploader
                  currentLogoUrl={artist.logoUrl}
                  entityId={artist.id}
                  entityType="artist"
                  onLogoUploaded={() => refetch()}
                  onError={(errorMsg) => console.error('Error al subir logo:', errorMsg)}
                />
              ) : artist.logoUrl ? (
                <img
                  src={artist.logoUrl}
                  alt={artist.stageName}
                  className="w-24 h-24 md:w-48 md:h-48 rounded-lg md:rounded-xl object-cover border-2 border-purple-500"
                />
              ) : (
                <div className="w-24 h-24 md:w-48 md:h-48 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg md:rounded-xl flex items-center justify-center">
                  <span className="text-4xl md:text-7xl font-bold text-white">
                    {artist.stageName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              <div className="flex-1">
                <div className="flex items-center gap-2 md:gap-3 mb-2 flex-wrap">
                  <h1 className="text-2xl md:text-5xl font-bold text-white">{artist.stageName}</h1>
                  {artist.verified && (
                    <span className="px-2 md:px-3 py-0.5 md:py-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white text-xs md:text-sm font-medium flex items-center gap-1">
                      <CheckCircle className="w-3 md:w-4 h-3 md:h-4" />
                      Verificado
                    </span>
                  )}
                </div>

                <p className="text-base md:text-xl text-gray-300 mb-3 md:mb-4">
                  {artist.user?.name} {artist.user?.surname}
                </p>

                <div className="flex flex-wrap gap-2 md:gap-3">
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

        {/* Tabs Navigation */}
        <div className="sticky top-0 z-40 bg-dark-bg/95 backdrop-blur-md border-b border-gray-800">
          <div className="container mx-auto px-4">
            <div className="flex overflow-x-auto scrollbar-hide">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 md:px-6 py-3 md:py-4 text-sm md:text-base font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'text-purple-400 border-purple-400'
                      : 'text-gray-400 border-transparent hover:text-white'
                  }`}
                >
                  <tab.icon className="w-4 h-4 md:w-5 h-5" />
                  {tab.label}
                  {tab.id === 'songs' && getSongsCount() > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                      {getSongsCount()}
                    </span>
                  )}
                  {tab.id === 'albums' && getAlbumsCount() > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                      {getAlbumsCount()}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="container mx-auto px-4 py-6 md:py-8">
          {/* Tab: Información */}
          {activeTab === 'info' && (
            <div className="space-y-6">
              {/* Biografía */}
              <div className="bg-gray-800/30 rounded-xl p-4 md:p-6">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-400" />
                  Biografía
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  {artist.biography || 'No hay biografía disponible para este artista.'}
                </p>
              </div>

              {/* Ubicación */}
              {(artist.city || artist.country) && (
                <div className="bg-gray-800/30 rounded-xl p-4 md:p-6">
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-purple-400" />
                    Ubicación
                  </h2>
                  <p className="text-gray-300 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {[artist.city, artist.country].filter(Boolean).join(', ')}
                  </p>
                </div>
              )}

              {/* Instrumentos */}
              {artist.instruments && artist.instruments.length > 0 && (
                <div className="bg-gray-800/30 rounded-xl p-4 md:p-6">
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Music className="w-5 h-5 text-purple-400" />
                    Instrumentos
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {artist.instruments.map((instrument: { id: number; name: string }) => (
                      <span
                        key={instrument.id}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                          instrument.id === artist.mainInstrument?.id
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                            : 'bg-gray-700/50 text-gray-300'
                        }`}
                      >
                        {instrument.name}
                        {instrument.id === artist.mainInstrument?.id && ' (Principal)'}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Géneros */}
              {artist.lookingForGenres && artist.lookingForGenres.length > 0 && (
                <div className="bg-gray-800/30 rounded-xl p-4 md:p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Géneros que busca</h2>
                  <div className="flex flex-wrap gap-2">
                    {artist.lookingForGenres.map((genre: string) => (
                      <span
                        key={genre}
                        className="px-3 py-1.5 bg-purple-500/20 text-purple-300 rounded-lg text-sm"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Estadísticas */}
              <div className="bg-gray-800/30 rounded-xl p-4 md:p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Estadísticas</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-700/30 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-purple-400">{getSongsCount()}</p>
                    <p className="text-gray-400 text-sm">Canciones</p>
                  </div>
                  <div className="bg-gray-700/30 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-purple-400">{getAlbumsCount()}</p>
                    <p className="text-gray-400 text-sm">Álbumes</p>
                  </div>
                  <div className="bg-gray-700/30 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-purple-400">0</p>
                    <p className="text-gray-400 text-sm">Seguidores</p>
                  </div>
                  <div className="bg-gray-700/30 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-gray-400">
                      {artist.createdAt ? new Date(artist.createdAt).getFullYear() : 'N/A'}
                    </p>
                    <p className="text-gray-400 text-sm">Miembro desde</p>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="bg-gray-800/30 rounded-xl p-4 md:p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Acciones</h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  {user ? (
                    <>
                      <button
                        onClick={toggleFollow}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all ${
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
                        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all ${
                          isFavorite
                            ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                            : 'bg-gray-700/50 text-gray-300 hover:text-pink-400'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${isFavorite ? 'fill-pink-400' : ''}`} />
                        {isFavorite ? 'En Favoritos' : 'Favorito'}
                      </button>
                    </>
                  ) : (
                    <Button onClick={() => navigate('/login')} variant="primary" className="w-full sm:w-auto">
                      Inicia sesión para interactuar
                    </Button>
                  )}
                </div>
              </div>

              {/* Compartir */}
              <div className="bg-gray-800/30 rounded-xl p-4 md:p-6">
                <ShareButtons
                  title={artist.stageName}
                  description={artist.biography || `Escucha la música de ${artist.stageName} en MyBandLab`}
                  url={`/artists/${artist.id}`}
                  imageUrl={artist.logoUrl || artist.profileImageUrl}
                />
              </div>
            </div>
          )}

          {/* Tab: Canciones */}
          {activeTab === 'songs' && (
            <div className="space-y-6">
              {/* Subir canciones - solo para dueños verificados */}
              {isOwner && artist.verified && (
                <SongUploader
                  entityId={artist.id}
                  entityType="artist"
                  onSongUploaded={() => refetch()}
                />
              )}

              {/* Lista de canciones */}
              {artist.songs && artist.songs.length > 0 ? (
                <div className="bg-gray-800/30 rounded-xl p-4 md:p-6">
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <ListMusic className="w-5 h-5 text-purple-400" />
                    Canciones ({artist.songs.length})
                  </h2>
                  <div className="space-y-2">
                    {artist.songs.map((song: Song) => (
                      <div
                        key={song.id}
                        className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors group"
                      >
                        <div
                          className="flex-1 cursor-pointer min-w-0"
                          onClick={() =>
                            playSong(
                              {
                                ...song,
                                artistName: artist.stageName,
                                artistId: artist.id,
                                coverImage: artist.logoUrl,
                              },
                              songsWithArtistInfo
                            )
                          }
                        >
                          <p className="text-white font-medium truncate">{song.title}</p>
                          <p className="text-xs text-gray-400">
                            {Math.floor(song.duration / 60)}:
                            {(song.duration % 60).toString().padStart(2, '0')} •{' '}
                            {song.playCount || 0} reproducciones
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-2">
                          <ShareSongButton
                            songId={song.id}
                            songTitle={song.title}
                            artistName={artist.stageName}
                          />
                          <AddToPlaylistButton songId={song.id} songTitle={song.title} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-800/30 rounded-xl p-8 text-center">
                  <ListMusic className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No hay canciones disponibles</p>
                  {isOwner && artist.verified && (
                    <p className="text-gray-500 text-sm mt-2">Sube tu primera canción</p>
                  )}
                </div>
              )}

              {/* Top canciones */}
              <TopSongs
                songs={topSongs}
                entityType="artist"
                entityName={artist?.stageName}
                loading={topSongsLoading}
              />
            </div>
          )}

          {/* Tab: Álbumes */}
          {activeTab === 'albums' && (
            <div className="space-y-6">
              {artist.albums && artist.albums.length > 0 ? (
                <div className="bg-gray-800/30 rounded-xl p-4 md:p-6">
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Disc className="w-5 h-5 text-purple-400" />
                    Álbumes ({artist.albums.length})
                  </h2>
                  <AlbumList
                    albums={artist.albums}
                    songs={artist.songs}
                    entityId={artist.id}
                    entityType="artist"
                    onAlbumCreated={() => refetch()}
                    onSongAddedToAlbum={() => refetch()}
                    isOwner={isOwner}
                    entityName={artist.stageName}
                    entityImage={artist.logoUrl}
                  />
                </div>
              ) : (
                <div className="bg-gray-800/30 rounded-xl p-8 text-center">
                  <Disc className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No hay álbumes disponibles</p>
                  {isOwner && (
                    <p className="text-gray-500 text-sm mt-2">Crea tu primer álbum</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ArtistDetailPage;
