// src/components/SwipeCard.tsx
import React, { useRef, useState } from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { Music, MapPin } from 'lucide-react';
import { LookingForBandBadge } from './LookingForBandBadge';
import { Link } from 'react-router-dom';

interface Artist {
  id: string;
  stageName: string;
  genre: string;
  city: string;
  country: string;
  isLookingForBand: boolean;
  profileImageUrl?: string;
}

interface SwipeCardProps {
  artist: Artist;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  instrumentsNode: React.ReactNode;
  genresNode: React.ReactNode;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({
  artist,
  onSwipeLeft,
  onSwipeRight,
  instrumentsNode,
  genresNode,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-30, 0, 30]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 0.5, 1, 0.5, 0]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false);
    const swipe = info.offset.x;

    if (swipe > 100) {
      onSwipeRight();
    } else if (swipe < -100) {
      onSwipeLeft();
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <motion.div
        style={{ x, rotate, opacity }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.7}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        className="cursor-grab active:cursor-grabbing"
      >
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700 shadow-2xl">
          <div className="flex flex-col items-center text-center">
            {artist.profileImageUrl ? (
              <img
                src={artist.profileImageUrl}
                alt={artist.stageName}
                className="w-40 h-40 rounded-full object-cover mx-auto mb-4 border-4 border-purple-500"
              />
            ) : (
              <div className="w-40 h-40 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-purple-500">
                <Music className="w-16 h-16 text-white" />
              </div>
            )}

            <LookingForBandBadge size="md" />

            <h2 className="text-2xl font-bold text-white mt-3 mb-1">{artist.stageName}</h2>
            <p className="text-gray-400 mb-3">Género: {artist.genre}</p>

            {artist.city && (
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                <MapPin className="w-4 h-4" />
                <span>
                  {artist.city}, {artist.country || ''}
                </span>
              </div>
            )}

            <div className="w-full text-left">
              {instrumentsNode}
              {genresNode}
            </div>

            <div className="mt-6 pt-4 w-full">
              <Link
                to={`/artists/${artist.id}`}
                className="block w-full px-4 py-3 text-base bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-colors text-center"
              >
                💬 Contactar
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {isDragging && x.get() > 50 && (
        <div className="absolute top-1/2 right-4 -translate-y-1/2 bg-green-500/80 text-white px-3 py-2 rounded-full text-sm font-bold">
          Siguiente
        </div>
      )}
      {isDragging && x.get() < -50 && (
        <div className="absolute top-1/2 left-4 -translate-y-1/2 bg-red-500/80 text-white px-3 py-2 rounded-full text-sm font-bold">
          Anterior
        </div>
      )}
    </div>
  );
};
