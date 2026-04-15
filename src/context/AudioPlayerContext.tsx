import React, { createContext, useContext, useState, useEffect } from 'react';

interface Song {
  id: number;
  title: string;
  fileUrl: string;
  duration: number;
  artistName?: string;
  artistId?: number;
  groupName?: string;
  groupId?: number;
  coverImage?: string;
}

interface AudioPlayerContextType {
  currentSong: Song | null;
  playlist: Song[];
  currentIndex: number;
  playSong: (song: Song, songsList: Song[]) => void;
  playNext: () => void;
  playPrevious: () => void;
  closePlayer: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used within AudioPlayerProvider');
  }
  return context;
};

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  // Cargar última canción del localStorage
  useEffect(() => {
    const saved = localStorage.getItem('lastPlayedSong');
    if (saved) {
      try {
        JSON.parse(saved);
        // Opcional: restaurar estado si la canción aún existe
      } catch (e) {
        console.error('Error loading saved state:', e);
      }
    }
  }, []);

  const playSong = (song: Song, songsList: Song[]) => {
    setPlaylist(songsList);
    const index = songsList.findIndex((s) => s.id === song.id);
    setCurrentIndex(index);
    setCurrentSong(song);

    // Guardar en localStorage
    localStorage.setItem(
      'lastPlayedSong',
      JSON.stringify({
        songId: song.id,
        playlist: songsList.map((s) => s.id),
        currentIndex: index,
      })
    );
  };

  const playNext = () => {
    if (playlist.length > 0 && currentIndex < playlist.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCurrentSong(playlist[nextIndex]);
    }
  };

  const playPrevious = () => {
    if (playlist.length > 0 && currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setCurrentSong(playlist[prevIndex]);
    }
  };

  const closePlayer = () => {
    setCurrentSong(null);
    setPlaylist([]);
    setCurrentIndex(-1);
    localStorage.removeItem('lastPlayedSong');
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        currentSong,
        playlist,
        currentIndex,
        playSong,
        playNext,
        playPrevious,
        closePlayer,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};
