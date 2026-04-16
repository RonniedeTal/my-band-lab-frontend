import React, { useState, useEffect } from 'react';

import { useAuth } from '../hooks/useAuth';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { Button } from '../components/ui/Button';
import { ArrowLeft, Music, Play, Trash2, Lock, Globe, MoreVertical } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import type { Playlist } from '../types/playlist.types';
import { useNavigate, useParams } from 'react-router-dom';

// Tipo simplificado para evitar errores
interface PlaylistSongItem {
  id: number;
  position: number;
  addedAt: string;
  song: {
    id: number;
    title: string;
    duration: number;
    fileUrl: string;
    playCount: number;
    artistId?: number;
    groupId?: number;
    artist?: { id: number; stageName: string };
    musicGroup?: { id: number; name: string };
  };
}

export const PlaylistDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { playSong } = useAudioPlayer();
  const { success, error: showError } = useNotification();

  const [playlist, setPlaylist] = useState<Playlist | null>(null);
  const [songs, setSongs] = useState<PlaylistSongItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isOwner = String(user?.id) === String(playlist?.user?.id);

  // Cargar playlist y canciones
  const loadPlaylist = async () => {
    if (!token || !id) return;

    setLoading(true);
    try {
      // Cargar información de la playlist
      const playlistResponse = await fetch('http://localhost:9000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `
            query {
              playlistById(id: ${id}) {
                id
                title
                description
                coverImageUrl
                isPublic
                createdAt
                updatedAt
                user {
                  id
                  name
                  surname
                  email
                }
              }
            }
          `,
        }),
      });

      const playlistResult = await playlistResponse.json();
      console.log('Playlist:', playlistResult);

      if (playlistResult.errors) {
        console.error('Errores:', playlistResult.errors);
        setLoading(false);
        return;
      }

      setPlaylist(playlistResult.data?.playlistById || null);

      // Cargar canciones de la playlist - CON artist y musicGroup
      const songsResponse = await fetch('http://localhost:9000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `
            query {
              playlistSongs(playlistId: ${id}) {
                id
                position
                addedAt
                song {
                  id
                  title
                  duration
                  fileUrl
                  playCount
                  artist {
                    id
                    stageName
                  }
                  musicGroup {
                    id
                    name
                  }
                }
              }
            }
          `,
        }),
      });

      const songsResult = await songsResponse.json();
      console.log('Canciones:', songsResult);

      if (!songsResult.errors) {
        setSongs(songsResult.data?.playlistSongs || []);
      }
    } catch (err) {
      console.error('Error loading playlist:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlaylist();
  }, [id, token]);

  const handleDeletePlaylist = async () => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta playlist?')) return;

    setDeleting(true);
    try {
      const response = await fetch('http://localhost:9000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `
            mutation {
              deletePlaylist(id: ${id})
            }
          `,
        }),
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      success('Éxito', 'Playlist eliminada');
      navigate('/playlists');
    } catch (err) {
      showError('Error', 'No se pudo eliminar la playlist');
    } finally {
      setDeleting(false);
    }
  };

  const handleRemoveSong = async (songId: number) => {
    try {
      const response = await fetch('http://localhost:9000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `
            mutation {
              removeSongFromPlaylist(playlistId: ${id}, songId: ${songId})
            }
          `,
        }),
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      success('Éxito', 'Canción removida de la playlist');
      loadPlaylist();
    } catch (err) {
      showError('Error', 'No se pudo remover la canción');
    }
  };

  const handlePlayAll = () => {
    if (songs.length > 0) {
      const playlistSongs = songs.map((ps) => ({
        id: ps.song.id,
        title: ps.song.title,
        fileUrl: ps.song.fileUrl,
        duration: ps.song.duration,
        playCount: ps.song.playCount,
        artistName: ps.song.artist?.stageName,
        groupName: ps.song.musicGroup?.name,
      }));

      const firstSong = playlistSongs[0];
      console.log('🎵 Reproducir todo - Primera canción:', firstSong);

      if (firstSong && firstSong.fileUrl) {
        playSong(firstSong, playlistSongs);
      }
    }
  };

  const getArtistName = (song: any) => {
    if (song.artist?.stageName) {
      return song.artist.stageName;
    }
    if (song.musicGroup?.name) {
      return song.musicGroup.name;
    }
    return 'Artista';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">Playlist no encontrada</p>
        <Button onClick={() => navigate('/playlists')} variant="outline" className="mt-4">
          Volver a playlists
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="container mx-auto px-4 py-8">
        <Button onClick={() => navigate('/playlists')} variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a playlists
        </Button>

        {/* Cabecera */}
        <div className="bg-gradient-to-r from-purple-900/50 via-pink-900/50 to-blue-900/50 rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-48 h-48 flex-shrink-0">
              {playlist.coverImageUrl ? (
                <img
                  src={playlist.coverImageUrl}
                  alt={playlist.title}
                  className="w-full h-full rounded-lg object-cover shadow-lg"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <Music className="w-16 h-16 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {playlist.isPublic ? (
                  <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded-full flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    Pública
                  </span>
                ) : (
                  <span className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded-full flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Privada
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">{playlist.title}</h1>
              {playlist.description && <p className="text-gray-300 mb-4">{playlist.description}</p>}
              <p className="text-gray-400 text-sm">
                Creada por {playlist.user.name} {playlist.user.surname} • {songs.length} canciones
              </p>

              <div className="flex gap-3 mt-6">
                {songs.length > 0 && (
                  <button
                    onClick={handlePlayAll}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Reproducir todo
                  </button>
                )}

                {isOwner && (
                  <div className="relative">
                    <button
                      onClick={() => setShowMenu(!showMenu)}
                      className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    {showMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-10">
                        <button
                          onClick={handleDeletePlaylist}
                          disabled={deleting}
                          className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-700 rounded-lg flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          {deleting ? 'Eliminando...' : 'Eliminar playlist'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Lista de canciones */}
        {songs.length === 0 ? (
          <div className="text-center py-20 bg-gray-800/30 rounded-xl">
            <Music className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Esta playlist no tiene canciones aún</p>
          </div>
        ) : (
          <div className="bg-gray-800/30 rounded-xl">
            <div className="divide-y divide-gray-700">
              {songs.map((playlistSong, index) => (
                <div
                  key={playlistSong.id}
                  className="group flex items-center justify-between p-4 hover:bg-gray-700/30 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <span className="text-gray-500 w-8">{index + 1}</span>
                    <div>
                      <p className="text-white font-medium">{playlistSong.song.title}</p>
                      <p className="text-sm text-gray-400">{getArtistName(playlistSong.song)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        const playlistSongs = songs.map((ps) => ({
                          id: ps.song.id,
                          title: ps.song.title,
                          fileUrl: ps.song.fileUrl,
                          duration: ps.song.duration,
                          playCount: ps.song.playCount,
                          artistName: ps.song.artist?.stageName || ps.song.musicGroup?.name,
                        }));
                        const currentSong = playlistSongs.find(
                          (s) => s.id === playlistSong.song.id
                        );
                        if (currentSong && currentSong.fileUrl) {
                          playSong(currentSong, playlistSongs);
                        }
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full hover:bg-purple-500/20"
                    >
                      <Play className="w-4 h-4 text-purple-400" />
                    </button>

                    {isOwner && (
                      <button
                        onClick={() => handleRemoveSong(playlistSong.song.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-full hover:bg-red-500/20"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistDetailPage;
