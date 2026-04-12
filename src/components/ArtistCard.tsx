import React from 'react';
import type { Artist } from '../types';
import { Link } from 'react-router-dom';
import { Heart, UserPlus, UserCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useFollowArtist } from '../hooks/useFollowArtist';
import { useFavoriteArtist } from '../hooks/useFavoriteArtist';

interface ArtistCardProps {
  artist: Artist;
}

export const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
  const { user } = useAuth();
  const { isFollowing, toggleFollow } = useFollowArtist(artist.id as number);
  const { isFavorite, toggleFavorite } = useFavoriteArtist(artist.id as number);

  return (
    <div className="block group">
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-5 backdrop-blur-sm border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-[1.02]">
        <Link to={`/artists/${artist.id}`} className="block">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
                {artist.stageName}
              </h3>
              <p className="text-sm text-gray-400">
                {artist.user?.name} {artist.user?.surname}
              </p>
            </div>
            {artist.verified && (
              <span className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white whitespace-nowrap ml-2">
                ✓ Verificado
              </span>
            )}
          </div>

          <div className="mb-3">
            <span className="inline-block px-2 py-1 text-xs bg-purple-500/20 text-purple-300 rounded-full">
              {artist.genre}
            </span>
          </div>

          <p className="text-sm text-gray-300 line-clamp-2 mb-3">
            {artist.biography || 'Sin biografía disponible'}
          </p>

          {artist.instruments && artist.instruments.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {artist.instruments.slice(0, 3).map((instrument) => (
                <span
                  key={instrument.id}
                  className="text-xs px-2 py-1 bg-gray-700/50 rounded-full text-gray-300"
                >
                  {instrument.name}
                </span>
              ))}
              {artist.instruments.length > 3 && (
                <span className="text-xs px-2 py-1 bg-gray-700/50 rounded-full text-gray-300">
                  +{artist.instruments.length - 3}
                </span>
              )}
            </div>
          )}
        </Link>

        {/* Botones de acción - solo visibles para usuarios autenticados */}
        {user && (
          <div className="flex gap-2 mt-3 pt-3 border-t border-gray-700">
            <button
              onClick={toggleFollow}
              className={`flex-1 flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-all ${
                isFollowing
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30'
              }`}
            >
              {isFollowing ? (
                <>
                  <UserCheck className="w-3 h-3" />
                  Siguiendo
                </>
              ) : (
                <>
                  <UserPlus className="w-3 h-3" />
                  Seguir
                </>
              )}
            </button>

            <button
              onClick={toggleFavorite}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                isFavorite
                  ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                  : 'bg-gray-700/50 text-gray-400 border border-gray-600 hover:text-pink-400 hover:border-pink-500/30'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-pink-400' : ''}`} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
