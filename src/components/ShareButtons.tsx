import React, { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

interface ShareButtonsProps {
  title: string;
  description?: string;
  url: string;
  imageUrl?: string;
  className?: string;
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({
  title,
  description,
  url,
  imageUrl,
  className = '',
}) => {
  const { success, error: showError } = useNotification();
  const [copied, setCopied] = useState(false);

  const fullUrl = `${window.location.origin}${url}`;
  const shareText = `${title} - ${description || 'Escucha esta música en MyBandLab'}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      success('Enlace copiado', 'El enlace se ha copiado al portapapeles');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      showError('Error', 'No se pudo copiar el enlace');
    }
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: shareText,
          url: fullUrl,
        });
      } catch (err) {
        console.log('Compartir cancelado o error:', err);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <button
      onClick={shareNative}
      className={`rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-purple-500 text-purple-400 hover:bg-purple-500/10 px-4 py-2 text-base w-full flex items-center justify-center gap-2 ${className}`}
      title="Compartir"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4" />
          <span>¡Copiado!</span>
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4" />
          <span>Compartir</span>
        </>
      )}
    </button>
  );
};
