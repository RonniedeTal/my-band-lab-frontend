import React from 'react';
import { SongStats } from '../types/song.types';
import { Play, TrendingUp, Users } from 'lucide-react';
import { useAudioPlayer } from '../context/AudioPlayerContext';

interface TopSongsProps {
  songs: SongStats[];
  entityType: 'artist' | 'group';
  entityName?: string;
  loading?: boolean;
  onPlaySong?: (song: SongStats) => void;
}

export const TopSongs: React.FC<TopSongsProps> = ({
  songs,
  entityType,
  entityName,
  loading,
  onPlaySong,
}) => {
  const { playSong } = useAudioPlayer();

  const handlePlay = (song: SongStats) => {
    if (onPlaySong) {
      onPlaySong(song);
    } else {
      // Crear objeto simulando una canción
      const fakeSong = {
        id: song.songId,
        title: song.title,
        fileUrl: '', // Esto debería venir de los datos reales
        duration: 0,
        playCount: song.playCount,
        artistId: entityType === 'artist' ? (entityName ? parseInt(entityName) : 0) : undefined,
        groupId: entityType === 'group' ? (entityName ? parseInt(entityName) : 0) : undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      playSong(fakeSong, [fakeSong]);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800/30 rounded-xl p-6">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  if (songs.length === 0) {
    return (
      <div className="bg-gray-800/30 rounded-xl p-6">
        <div className="text-center py-8">
          <TrendingUp className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <p className="text-gray-400">No hay suficientes datos de reproducción aún</p>
          <p className="text-gray-500 text-sm mt-1">
            Las canciones más reproducidas aparecerán aquí
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/30 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-purple-400" />
        <h2 className="text-xl font-bold text-white">Top Canciones</h2>
      </div>

      <div className="space-y-3">
        {songs.map((song, index) => (
          <div
            key={song.songId}
            onClick={() => handlePlay(song)}
            className="flex items-center gap-4 p-3 bg-gray-700/30 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors group"
          >
            <div className="w-8 text-center">
              <span className="text-2xl font-bold text-gray-500">#{index + 1}</span>
            </div>

            <div className="flex-1">
              <p className="text-white font-medium">{song.title}</p>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Play className="w-3 h-3" />
                  {song.playCount} reproducciones
                </span>
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {song.uniqueListeners} oyentes únicos
                </span>
              </div>
            </div>

            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Play className="w-5 h-5 text-purple-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
