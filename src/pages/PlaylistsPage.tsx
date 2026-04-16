import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { PlaylistCard } from '../components/PlaylistCard';
import { Button } from '../components/ui/Button';
import { Plus, Music } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import type { Playlist } from '../types/playlist.types';

export const PlaylistsPage: React.FC = () => {
  const { user, token } = useAuth();
  const { success, error: showError } = useNotification();

  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newIsPublic, setNewIsPublic] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Cargar playlists
  const loadPlaylists = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:9000/graphql', {
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
                  description
                  coverImageUrl
                  isPublic
                  
                  createdAt
                  updatedAt
                  user {
                    id
                    name
                    surname
                  }
                }
              }
            }
          `,
        }),
      });

      const result = await response.json();
      console.log('Respuesta playlists:', result);

      if (result.errors) {
        console.error('Errores GraphQL:', result.errors);
      }

      const playlistsData = result.data?.myPlaylists?.content || [];
      setPlaylists(playlistsData);
    } catch (err) {
      console.error('Error loading playlists:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlaylists();
  }, [token]);

  const handleCreate = async () => {
    if (!newTitle.trim()) {
      showError('Error', 'El título es obligatorio');
      return;
    }

    setIsCreating(true);
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
              createPlaylist(title: "${newTitle}", description: "${newDescription}", isPublic: ${newIsPublic}) {
                id
                title
              }
            }
          `,
        }),
      });

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      success('Éxito', 'Playlist creada exitosamente');
      setShowCreateForm(false);
      setNewTitle('');
      setNewDescription('');
      setNewIsPublic(false);
      loadPlaylists(); // Recargar playlists
    } catch (err) {
      showError('Error', 'Error al crear la playlist');
    } finally {
      setIsCreating(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">Debes iniciar sesión para ver tus playlists</p>
        <Link to="/login">
          <Button variant="primary" className="mt-4">
            Iniciar Sesión
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Mis Playlists
          </h1>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {showCreateForm ? 'Cancelar' : 'Crear playlist'}
          </button>
        </div>

        {/* Formulario de creación */}
        {showCreateForm && (
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Crear nueva playlist</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Título *</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                  placeholder="Ej: Mis favoritas"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Descripción</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                  rows={3}
                  placeholder="Descripción de la playlist..."
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={newIsPublic}
                  onChange={(e) => setNewIsPublic(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-700 focus:ring-purple-500"
                />
                <label htmlFor="isPublic" className="text-gray-300">
                  Hacer pública (cualquier usuario puede verla)
                </label>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleCreate}
                  disabled={isCreating}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 disabled:opacity-50"
                >
                  {isCreating ? 'Creando...' : 'Crear playlist'}
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

        {/* Lista de playlists */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : playlists.length === 0 ? (
          <div className="text-center py-20 bg-gray-800/30 rounded-xl">
            <Music className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No tienes playlists aún</p>
            <p className="text-gray-500 mt-2">Haz clic en "Crear playlist" para comenzar</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {playlists.map((playlist: Playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistsPage;
