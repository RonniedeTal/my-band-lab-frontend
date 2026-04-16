import React from 'react';
import { Link } from 'react-router-dom';
import { Music, Lock, Globe } from 'lucide-react';
import type { Playlist } from '../types/playlist.types';

interface PlaylistCardProps {
  playlist: Playlist;
  showUser?: boolean;
}

export const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist, showUser = false }) => {
  // Función para obtener la configuración del badge (evita ternario anidado)
  const getBadgeConfig = () => {
    if (playlist.isPublic) {
      return {
        icon: <Globe className="w-3 h-3" />,
        text: 'Pública',
        className: 'bg-green-500/80 text-white',
      };
    }
    return {
      icon: <Lock className="w-3 h-3" />,
      text: 'Privada',
      className: 'bg-gray-700/80 text-gray-300',
    };
  };

  const badgeConfig = getBadgeConfig();

  return (
    <Link to={`/playlists/${playlist.id}`} className="block group">
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-5 backdrop-blur-sm border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-[1.02]">
        {/* Portada */}
        <div className="relative mb-3">
          {playlist.coverImageUrl ? (
            <img
              src={playlist.coverImageUrl}
              alt={playlist.title}
              className="w-full aspect-square rounded-lg object-cover"
            />
          ) : (
            <div className="w-full aspect-square bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
              <Music className="w-12 h-12 text-white" />
            </div>
          )}

          {/* Badge público/privado */}
          <div className="absolute top-2 right-2">
            <span
              className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${badgeConfig.className}`}
            >
              {badgeConfig.icon}
              {badgeConfig.text}
            </span>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors truncate">
          {playlist.title}
        </h3>

        {playlist.description && (
          <p className="text-sm text-gray-400 line-clamp-2 mt-1">{playlist.description}</p>
        )}

        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
          <span>{playlist.songCount} canciones</span>
          {showUser && (
            <span>
              por {playlist.user.name} {playlist.user.surname}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};
export default PlaylistCard;
