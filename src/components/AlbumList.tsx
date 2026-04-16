import React, { useState } from 'react';
import { Album } from '../types/album.types';
import { Song } from '../types/song.types';
import {
  Plus,
  Calendar,
  Music,
  FolderPlus,
  PlayCircleIcon,
  Loader2,
  ImageIcon,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../context/NotificationContext';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { AddToPlaylistButton } from './AddToPlaylistButton';

interface AlbumListProps {
  albums: Album[];
  songs?: Song[];
  entityId: number;
  entityType: 'artist' | 'group';
  onAlbumCreated: () => void;
  onSongAddedToAlbum: () => void;
  isOwner: boolean;
  entityName?: string;
  entityImage?: string;
}

export const AlbumList: React.FC<AlbumListProps> = ({
  albums,
  songs = [],
  entityId,
  entityType,
  onAlbumCreated,
  onSongAddedToAlbum,
  isOwner,
  entityName,
  entityImage,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAddToAlbum, setShowAddToAlbum] = useState<number | null>(null);
  const [selectedSongId, setSelectedSongId] = useState<number | null>(null);
  const [uploadingCoverId, setUploadingCoverId] = useState<number | null>(null);
  const [newAlbumTitle, setNewAlbumTitle] = useState('');
  const [newAlbumDescription, setNewAlbumDescription] = useState('');
  const [newAlbumReleaseDate, setNewAlbumReleaseDate] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { token } = useAuth();
  const { error: showError, success } = useNotification();
  const { playSong } = useAudioPlayer();

  // const coverInputRef = useRef<HTMLInputElement>(null);

  const handleCreateAlbum = async () => {
    if (!newAlbumTitle.trim()) {
      showError('Error', 'El título es obligatorio');
      return;
    }

    setIsCreating(true);

    const formData = new FormData();
    formData.append('title', newAlbumTitle);
    if (newAlbumDescription) formData.append('description', newAlbumDescription);
    if (newAlbumReleaseDate) formData.append('releaseDate', newAlbumReleaseDate);
    formData.append(`${entityType}Id`, entityId.toString());

    try {
      const response = await fetch('http://localhost:9000/api/albums/create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al crear el álbum');
      }

      success('Éxito', 'Álbum creado exitosamente');
      setShowCreateForm(false);
      setNewAlbumTitle('');
      setNewAlbumDescription('');
      setNewAlbumReleaseDate('');
      onAlbumCreated();
    } catch (err) {
      showError('Error', err instanceof Error ? err.message : 'Error al crear el álbum');
    } finally {
      setIsCreating(false);
    }
  };

  const handleUploadCover = async (albumId: number, file: File) => {
    // Validar tipo
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      showError('Error', 'Formato no soportado. Usa JPG, PNG o GIF');
      return;
    }

    // Validar tamaño (máx 2MB)
    if (file.size > 2 * 1024 * 1024) {
      showError('Error', 'La imagen no puede superar los 2MB');
      return;
    }

    setUploadingCoverId(albumId);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`http://localhost:9000/api/albums/${albumId}/cover`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al subir la portada');
      }

      success('Éxito', 'Portada subida exitosamente');
      onAlbumCreated(); // Recargar datos
    } catch (err) {
      showError('Error', err instanceof Error ? err.message : 'Error al subir la portada');
    } finally {
      setUploadingCoverId(null);
    }
  };

  const handleAddSongToAlbum = async (albumId: number) => {
    if (!selectedSongId) {
      showError('Error', 'Selecciona una canción');
      return;
    }

    setIsAdding(true);

    try {
      const response = await fetch(
        `http://localhost:9000/api/albums/${albumId}/songs/${selectedSongId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Error al añadir la canción');
      }

      success('Éxito', 'Canción añadida al álbum');
      setShowAddToAlbum(null);
      setSelectedSongId(null);
      onSongAddedToAlbum();
    } catch (err) {
      showError('Error', err instanceof Error ? err.message : 'Error al añadir la canción');
    } finally {
      setIsAdding(false);
    }
  };

  const handlePlaySong = (song: Song) => {
    // Crear playlist con las canciones del álbum actual
    console.log('🎵 handlePlaySong llamado:', song);
    console.log('Título:', song.title);
    console.log('URL:', song.fileUrl);
    const playlist = albums.find((a) => a.id === song.albumId)?.songs || [];
    const enrichedSong = {
      ...song,
      artistName: entityType === 'artist' ? entityName : undefined,
      groupName: entityType === 'group' ? entityName : undefined,
      coverImage: entityImage,
    };
    console.log('Enriched song:', enrichedSong);
    playSong(enrichedSong, playlist);
  };

  // Función para formatear fecha
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Fecha no especificada';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Canciones que no están en ningún álbum
  const songsNotInAlbum = songs.filter((song) => !song.albumId);

  return (
    <div className="space-y-6">
      {/* Botón para crear álbum */}
      {isOwner && (
        <div className="flex justify-end">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {showCreateForm ? 'Cancelar' : 'Crear álbum'}
          </button>
        </div>
      )}

      {/* Formulario de creación */}
      {showCreateForm && (
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-4">Crear nuevo álbum</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Título *</label>
              <input
                type="text"
                value={newAlbumTitle}
                onChange={(e) => setNewAlbumTitle(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                placeholder="Ej: Álbum Inicial"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Descripción</label>
              <textarea
                value={newAlbumDescription}
                onChange={(e) => setNewAlbumDescription(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                rows={3}
                placeholder="Descripción del álbum..."
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Fecha de lanzamiento</label>
              <input
                type="date"
                value={newAlbumReleaseDate}
                onChange={(e) => setNewAlbumReleaseDate(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 text-white"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCreateAlbum}
                disabled={isCreating}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 disabled:opacity-50"
              >
                {isCreating ? 'Creando...' : 'Crear álbum'}
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de álbumes */}
      {albums.length === 0 ? (
        <div className="text-center py-12 bg-gray-800/30 rounded-xl">
          <Music className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <p className="text-gray-400">No hay álbumes aún</p>
          {isOwner && (
            <p className="text-gray-500 text-sm mt-2">Haz clic en "Crear álbum" para comenzar</p>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {albums.map((album) => (
            <div key={album.id} className="bg-gray-800/30 rounded-xl p-6">
              {/* Cabecera del álbum */}
              <div className="flex items-start gap-4 mb-4">
                <div className="relative group">
                  {album.coverImageUrl ? (
                    <img
                      src={album.coverImageUrl}
                      alt={album.title}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                      <Music className="w-10 h-10 text-white" />
                    </div>
                  )}

                  {isOwner && (
                    <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/jpg,image/gif"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUploadCover(album.id, file);
                          }}
                        />
                        {uploadingCoverId === album.id ? (
                          <Loader2 className="w-6 h-6 text-white animate-spin" />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-white" />
                        )}
                      </label>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white">{album.title}</h3>
                  {album.description && (
                    <p className="text-gray-400 text-sm mt-1">{album.description}</p>
                  )}
                  {album.releaseDate && (
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(album.releaseDate)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Canciones del álbum */}
              {album.songs && album.songs.length > 0 ? (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-gray-400 mb-2">Canciones</h4>
                  {album.songs.map((song) => (
                    <div
                      key={song.id}
                      className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors group"
                    >
                      {/* Contenido clickeable para reproducir */}
                      <div onClick={() => handlePlaySong(song)} className="flex-1 cursor-pointer">
                        <p className="text-white font-medium">{song.title}</p>
                        <p className="text-xs text-gray-400">
                          {Math.floor(song.duration / 60)}:
                          {(song.duration % 60).toString().padStart(2, '0')} • {song.playCount}{' '}
                          reproducciones
                        </p>
                      </div>

                      {/* Botones de acción */}
                      <div className="flex items-center gap-2">
                        <AddToPlaylistButton songId={song.id} songTitle={song.title} />
                        <button
                          onClick={() => handlePlaySong(song)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-purple-500/20"
                        >
                          <PlayCircleIcon className="w-5 h-5 text-purple-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">
                  Este álbum no tiene canciones aún
                </p>
              )}

              {/* Botón para añadir canciones (solo para dueños) */}
              {isOwner && songsNotInAlbum.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  {showAddToAlbum === album.id ? (
                    <div className="flex items-center gap-3">
                      <select
                        value={selectedSongId || ''}
                        onChange={(e) => setSelectedSongId(Number(e.target.value))}
                        className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                      >
                        <option value="">Selecciona una canción</option>
                        {songsNotInAlbum.map((song) => (
                          <option key={song.id} value={song.id}>
                            {song.title}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleAddSongToAlbum(album.id)}
                        disabled={isAdding}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        {isAdding ? 'Añadiendo...' : 'Añadir'}
                      </button>
                      <button
                        onClick={() => {
                          setShowAddToAlbum(null);
                          setSelectedSongId(null);
                        }}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowAddToAlbum(album.id)}
                      className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300"
                    >
                      <FolderPlus className="w-4 h-4" />
                      Añadir canción a este álbum
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
