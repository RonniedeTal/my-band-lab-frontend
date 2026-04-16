import React, { useState, useEffect } from 'react';
import { Plus, Check, Music } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useAddSongToPlaylist } from '../hooks/usePlaylists';
import { useNotification } from '../context/NotificationContext';

interface Playlist {
  id: number;
  title: string;
  coverImageUrl?: string;
}

interface AddToPlaylistButtonProps {
  songId: number;
  songTitle: string;
  className?: string;
}

export const AddToPlaylistButton: React.FC<AddToPlaylistButtonProps> = ({
  songId,
  songTitle: _songTitle,
  className = '',
}) => {
  const { user, token } = useAuth();
  const { addSongToPlaylist, loading: adding } = useAddSongToPlaylist();
  const { success, error: showError } = useNotification();

  const [showDropdown, setShowDropdown] = useState(false);
  const [addedTo, setAddedTo] = useState<Set<number>>(new Set());
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(false);

  // Cargar playlists cuando se abre el dropdown
  useEffect(() => {
    if (showDropdown && playlists.length === 0 && token) {
      setLoading(true);
      fetch('http://localhost:9000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `
            query {
              myPlaylists(page: 0, size: 50) {
                content {
                  id
                  title
                  coverImageUrl
                }
              }
            }
          `,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          const playlistsData = data.data?.myPlaylists?.content || [];
          setPlaylists(playlistsData);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error loading playlists:', err);
          setLoading(false);
        });
    }
  }, [showDropdown, token, playlists.length]);

  if (!user) return null;

  const handleAddToPlaylist = async (playlistId: number) => {
    try {
      await addSongToPlaylist(playlistId, songId);
      setAddedTo((prev) => new Set(prev).add(playlistId));
      success('Éxito', `Canción añadida a la playlist`);
      setTimeout(() => {
        setAddedTo((prev) => {
          const newSet = new Set(prev);
          newSet.delete(playlistId);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      showError('Error', 'No se pudo añadir la canción');
    }
  };

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="p-2 rounded-full bg-purple-600 hover:bg-purple-700 transition-colors"
        title="Añadir a playlist"
      >
        <Plus className="w-4 h-4 text-white" />
      </button>

      {showDropdown && (
        <>
          {/* Overlay para cerrar al hacer clic fuera */}
          <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />

          <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-20">
            <div className="p-2 border-b border-gray-700">
              <h3 className="text-sm font-semibold text-white">Añadir a playlist</h3>
            </div>

            <div className="max-h-64 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500 mx-auto"></div>
                </div>
              ) : playlists.length === 0 ? (
                <div className="p-4 text-center text-gray-400 text-sm">No tienes playlists</div>
              ) : (
                playlists.map((playlist) => (
                  <button
                    key={playlist.id}
                    onClick={() => handleAddToPlaylist(playlist.id)}
                    disabled={adding}
                    className="w-full px-3 py-2 text-left hover:bg-gray-700 transition-colors flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-2">
                      {playlist.coverImageUrl ? (
                        <img
                          src={playlist.coverImageUrl}
                          alt=""
                          className="w-6 h-6 rounded object-cover"
                        />
                      ) : (
                        <Music className="w-4 h-4 text-gray-400" />
                      )}
                      <span className="text-sm text-gray-300 truncate">{playlist.title}</span>
                    </div>
                    {addedTo.has(playlist.id) && <Check className="w-4 h-4 text-green-400" />}
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
