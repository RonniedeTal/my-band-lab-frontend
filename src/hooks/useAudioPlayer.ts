import { useState, useEffect } from 'react';

interface Song {
  id: number;
  title: string;
  fileUrl: string;
  duration: number;
  artistName?: string;
  artistId?: number;
  groupName?: string;
  groupId?: number;
}

export const useAudioPlayer = () => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  // Cargar última canción del localStorage
  useEffect(() => {
    const saved = localStorage.getItem('lastPlayedSong');
    if (saved) {
      try {
        JSON.parse(saved);
        // Opcional: restaurar estado
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
  };

  return {
    currentSong,
    playlist,
    playSong,
    playNext,
    playPrevious,
    closePlayer,
  };
};
