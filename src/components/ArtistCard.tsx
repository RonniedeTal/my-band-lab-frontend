import React, { useState } from 'react';
import type { Artist } from '../types';
import { Link } from 'react-router-dom';
import { Heart, UserPlus, UserCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useFollowArtist } from '../hooks/useFollowArtist';
import { useFavoriteArtist } from '../hooks/useFavoriteArtist';
import { LookingForBandBadge } from './LookingForBandBadge';

interface ArtistCardProps {
  artist: Artist;
}

export const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
  const { user } = useAuth();
  const { isFollowing, toggleFollow } = useFollowArtist(artist.id as number);
  const { isFavorite, toggleFavorite } = useFavoriteArtist(artist.id as number);
  const [showTooltip, setShowTooltip] = useState(false);

  const instruments = artist.lookingForInstruments || artist.instruments || [];
  const visibleInstruments = instruments.slice(0, 3);
  const remainingCount = instruments.length - 3;

  return (
    <div className="block group">
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-5 backdrop-blur-sm border border-gray-700 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-[1.02]">
        <Link to={`/artists/${artist.id}`} className="block">
          {/* Logo y nombre en la misma fila */}
          <div className="flex items-center gap-3 mb-3">
            {/* Logo del artista */}
            {artist.logoUrl ? (
              <img
                src={artist.logoUrl}
                alt={artist.stageName}
                className="w-12 h-12 rounded-lg object-cover border border-purple-500"
              />
            ) : (
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold text-white">
                  {artist.stageName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
                  {artist.stageName}
                </h3>
                {artist.isLookingForBand && <LookingForBandBadge size="sm" />}
              </div>
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

          {/* ✅ INSTRUMENTOS CON LIMITACIÓN Y TOOLTIP */}
          {instruments.length > 0 && (
            <div
              className="relative mt-2"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <div className="flex flex-wrap gap-1">
                {visibleInstruments.map((instrument) => (
                  <span
                    key={instrument.id}
                    className="text-xs px-2 py-1 bg-gray-700/50 rounded-full text-gray-300"
                  >
                    {instrument.name}
                  </span>
                ))}
                {remainingCount > 0 && (
                  <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full cursor-help">
                    +{remainingCount} más
                  </span>
                )}
              </div>

              {/* Tooltip con lista completa */}
              {showTooltip && remainingCount > 0 && (
                <div className="absolute bottom-full left-0 mb-2 z-10 bg-gray-900 border border-gray-700 rounded-lg shadow-lg p-2 min-w-[150px]">
                  <p className="text-xs text-gray-400 mb-1">Instrumentos:</p>
                  <div className="flex flex-wrap gap-1">
                    {instruments.map((instrument) => (
                      <span
                        key={instrument.id}
                        className="text-xs px-1.5 py-0.5 bg-purple-500/20 text-purple-300 rounded"
                      >
                        {instrument.name}
                      </span>
                    ))}
                  </div>
                  <div className="absolute top-full left-4 -mt-1 w-2 h-2 bg-gray-900 border-r border-b border-gray-700 rotate-45"></div>
                </div>
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
