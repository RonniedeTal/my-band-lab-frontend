// src/components/ShareSongButton.tsx
import React from 'react';
import { Share2 } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

interface ShareSongButtonProps {
  songId: number;
  songTitle: string;
  artistName?: string;
  groupName?: string;
  className?: string;
}

export const ShareSongButton: React.FC<ShareSongButtonProps> = ({
  songId,
  songTitle,
  artistName,
  groupName,
  className = '',
}) => {
  const { success, error: showError } = useNotification();
  const entityName = artistName || groupName || 'MyBandLab';

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const fullUrl = `${window.location.origin}/song/${songId}`;
    const shareText = `${songTitle} - ${entityName}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: songTitle,
          text: shareText,
          url: fullUrl,
        });
      } catch (err) {
        console.log('Compartir cancelado');
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText}: ${fullUrl}`);
        success('Enlace copiado', 'El enlace se ha copiado al portapapeles');
      } catch (err) {
        showError('Error', 'No se pudo copiar el enlace');
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`p-2 rounded-full hover:bg-purple-500/20 transition-colors ${className}`}
      title="Compartir canción"
    >
      <Share2 className="w-4 h-4 text-gray-400 hover:text-purple-400" />
    </button>
  );
};
