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
  Play,
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

export const ArtistDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

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

  // Preparar canciones para el reproductor con información del artista
  const songsWithArtistInfo =
    artist.songs?.map((song: Song) => ({
      ...song,
      artistName: artist.stageName,
      artistId: artist.id,
      coverImage: artist.logoUrl,
    })) || [];

  return (
    <>
      <MetaTags
        title={artist.stageName}
        description={artist.biography || `Escucha la música de ${artist.stageName} en MyBandLab`}
        image={artist.logoUrl || artist.profileImageUrl}
        url={`/artists/${artist.id}`}
        type="music.song"
      />
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
              {/* Subir canciones - solo para dueños verificados */}
              {isOwner && artist.verified && (
                <SongUploader
                  entityId={artist.id}
                  entityType="artist"
                  onSongUploaded={() => {
                    refetch();
                  }}
                />
              )}

              {/* Lista de canciones */}
              {artist.songs && artist.songs.length > 0 && (
                <div className="bg-gray-800/30 rounded-xl p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">Canciones</h2>
                  <div className="space-y-3">
                    {artist.songs.map((song: Song) => (
                      <div
                        key={song.id}
                        className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors group"
                      >
                        <div
                          className="flex-1 cursor-pointer"
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
                          <p className="text-white font-medium">{song.title}</p>
                          <p className="text-xs text-gray-400">
                            {Math.floor(song.duration / 60)}:
                            {(song.duration % 60).toString().padStart(2, '0')} • {song.playCount}{' '}
                            reproducciones
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <ShareSongButton
                            songId={song.id}
                            songTitle={song.title}
                            artistName={artist.stageName}
                          />
                          <AddToPlaylistButton songId={song.id} songTitle={song.title} />
                          {/* <button
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
                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-purple-500/20"
                          >
                            {/* <Play className="w-5 h-5 text-purple-400" /> */}
                          {/* </button> */}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Álbumes */}
              {artist.albums && (
                <div className="bg-gray-800/30 rounded-xl p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">Álbumes</h2>
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
              )}

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

              <TopSongs
                songs={topSongs}
                entityType="artist"
                entityName={artist?.stageName}
                loading={topSongsLoading}
              />

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
                  {/* ✅ AGREGAR BOTONES DE COMPARTIR AQUÍ */}
                  <div className="bg-gray-800/30 rounded-xl p-6">
                    <ShareButtons
                      title={artist.stageName}
                      description={
                        artist.biography || `Escucha la música de ${artist.stageName} en MyBandLab`
                      }
                      url={`/artists/${artist.id}`}
                      imageUrl={artist.logoUrl || artist.profileImageUrl}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ArtistDetailPage;
