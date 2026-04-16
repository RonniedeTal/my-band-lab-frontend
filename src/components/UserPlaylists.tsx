import React from 'react';
import { Link } from 'react-router-dom';
import { useMyPlaylists } from '../hooks/usePlaylists';
import { PlaylistCard } from './PlaylistCard';
import { Music, Plus } from 'lucide-react';
import type { Playlist } from '../types/playlist.types';

interface UserPlaylistsProps {
  limit?: number;
  showCreateButton?: boolean;
}

export const UserPlaylists: React.FC<UserPlaylistsProps> = ({
  limit = 4,
  showCreateButton = true,
}) => {
  const { playlists, loading } = useMyPlaylists(0, limit);
  const displayPlaylists = limit ? playlists.slice(0, limit) : playlists;

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (displayPlaylists.length === 0) {
    return (
      <div className="text-center py-8">
        <Music className="w-12 h-12 text-gray-500 mx-auto mb-3" />
        <p className="text-gray-400">No tienes playlists aún</p>
        <Link to="/playlists">
          <button className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm flex items-center gap-2 mx-auto">
            <Plus className="w-4 h-4" />
            Crear playlist
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Mis Playlists</h3>
        <Link to="/playlists" className="text-sm text-purple-400 hover:text-purple-300">
          Ver todas
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {displayPlaylists.map(
          (
            playlist: Playlist // ← Agregar tipo explícito
          ) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          )
        )}
        {showCreateButton && (
          <Link
            to="/playlists"
            className="bg-gray-800/50 rounded-xl p-4 border border-dashed border-gray-600 hover:border-purple-500 transition-colors flex flex-col items-center justify-center min-h-[200px]"
          >
            <Plus className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-gray-400 text-sm">Crear playlist</span>
          </Link>
        )}
      </div>
    </div>
  );
};
export default UserPlaylists;
