import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Minimize2,
  X,
  Music,
} from 'lucide-react';
import { useRegisterPlay } from '../hooks/useSongPlay';
import { useAudioPlayer } from '@/context/AudioPlayerContext';

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

interface AudioPlayerProps {
  currentSong: Song | null;
  playlist: Song[];
  onNext: () => void;
  onPrevious: () => void;
  onClose?: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  currentSong,
  playlist,
  onNext,
  onPrevious,
  onClose,
}) => {
  // const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const hasRegisteredPlayRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const previousSongIdRef = useRef<number | undefined>(undefined);

  const { registerPlay } = useRegisterPlay();
  const { isPlaying, setIsPlaying } = useAudioPlayer();

  // Formatear tiempo (segundos a mm:ss)
  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Actualizar duración cuando se carga la canción
  // Resetear flag cuando cambia la canción
  useEffect(() => {
    if (previousSongIdRef.current !== currentSong?.id) {
      hasRegisteredPlayRef.current = false;
      previousSongIdRef.current = currentSong?.id;
    }

    if (audioRef.current && currentSong) {
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch((err) => console.log('Error playing:', err));
      }
    }
  }, [currentSong, isPlaying]);
  // Registrar reproducción cuando se reproduce más de 30 segundos
  useEffect(() => {
    let timer: number;
    if (isPlaying && currentTime > 30 && !hasRegisteredPlayRef.current && currentSong) {
      timer = setTimeout(() => {
        registerPlay(currentSong.id);
        hasRegisteredPlayRef.current = true;
        console.log(`✅ Reproducción registrada: ${currentSong.title}`);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentTime, currentSong, registerPlay]);

  // Manejar play/pause
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
      // setIsPlaying(!isPlaying);
    }
  };

  // Manejar cambio de tiempo
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Manejar carga de metadatos
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Manejar fin de canción
  const handleEnded = () => {
    // Registrar reproducción si la canción terminó sin registrarse (canciones cortas)
    if (!hasRegisteredPlayRef.current && currentSong) {
      registerPlay(currentSong.id);
      hasRegisteredPlayRef.current = true;
      console.log(`✅ Reproducción registrada al finalizar: ${currentSong.title}`);
    }
    onNext();
  };

  // Cambiar posición de reproducción
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  // Cambiar volumen
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(false);
  };

  // Toggle mute
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Guardar estado en localStorage
  useEffect(() => {
    if (currentSong) {
      localStorage.setItem(
        'lastPlayedSong',
        JSON.stringify({
          songId: currentSong.id,
          currentTime,
          playlist: playlist.map((s) => s.id),
          currentIndex: playlist.findIndex((s) => s.id === currentSong.id),
        })
      );
    }
  }, [currentSong, currentTime, playlist]);

  if (!currentSong) return null;

  return (
    <>
      {/* Reproductor normal */}
      {!isMinimized && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-md border-t border-gray-700 z-50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center gap-4">
              {/* Info de la canción */}
              <div className="flex items-center gap-3 w-64">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{currentSong.title}</p>
                  <p className="text-gray-400 text-sm truncate">
                    {currentSong.artistName || currentSong.groupName || 'Artista'}
                  </p>
                </div>
              </div>

              {/* Controles principales */}
              <div className="flex-1 flex flex-col items-center gap-2">
                <div className="flex items-center gap-4">
                  <button
                    onClick={onPrevious}
                    disabled={playlist.length <= 1}
                    className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                  >
                    <SkipBack className="w-5 h-5" />
                  </button>

                  <button
                    onClick={togglePlay}
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center hover:opacity-90 transition-opacity"
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 text-white" />
                    ) : (
                      <Play className="w-5 h-5 text-white ml-0.5" />
                    )}
                  </button>

                  <button
                    onClick={onNext}
                    disabled={playlist.length <= 1}
                    className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                  >
                    <SkipForward className="w-5 h-5" />
                  </button>
                </div>

                {/* Barra de progreso */}
                <div className="flex items-center gap-3 w-full max-w-md">
                  <span className="text-xs text-gray-400 w-10 text-right">
                    {formatTime(currentTime)}
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:rounded-full"
                  />
                  <span className="text-xs text-gray-400 w-10">{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controles secundarios */}
              <div className="flex items-center gap-3 w-64 justify-end">
                <div className="flex items-center gap-2">
                  <button onClick={toggleMute} className="text-gray-400 hover:text-white">
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <button
                  onClick={() => setIsMinimized(true)}
                  className="text-gray-400 hover:text-white"
                >
                  <Minimize2 className="w-5 h-5" />
                </button>

                {onClose && (
                  <button onClick={onClose} className="text-gray-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reproductor minimizado */}
      {isMinimized && (
        <div
          onClick={() => setIsMinimized(false)}
          className="fixed bottom-20 right-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full p-3 shadow-lg cursor-pointer hover:opacity-90 transition-opacity z-50 group"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-white" />
          ) : (
            <Play className="w-5 h-5 text-white" />
          )}
          <div className="absolute bottom-full right-0 mb-2 bg-gray-800 rounded-lg px-3 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {currentSong.title}
          </div>
        </div>
      )}

      {/* Elemento de audio */}
      <audio
        ref={audioRef}
        src={currentSong?.fileUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
    </>
  );
};
