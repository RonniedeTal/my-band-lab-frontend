import React from 'react';

import { AudioPlayer } from './AudioPlayer';
import { AudioPlayerProvider, useAudioPlayer } from '@/context/AudioPlayerContext';

const AudioPlayerContent: React.FC = () => {
  const { currentSong, playlist, playNext, playPrevious, closePlayer } = useAudioPlayer();

  return (
    <AudioPlayer
      currentSong={currentSong}
      playlist={playlist}
      onNext={playNext}
      onPrevious={playPrevious}
      onClose={closePlayer}
    />
  );
};

export const AudioPlayerWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AudioPlayerProvider>
      {children}
      <AudioPlayerContent />
    </AudioPlayerProvider>
  );
};
