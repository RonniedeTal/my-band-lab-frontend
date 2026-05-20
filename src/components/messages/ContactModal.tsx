import React, { useState, useRef, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useSendMessage } from '../../hooks/useSendMessage';
import { useAuth } from '../../hooks/useAuth';
import { useWebSocket } from '../../hooks/useWebSocket';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  artistId: number;
  artistName: string;
  artistImageUrl?: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  artistId,
  artistName,
  artistImageUrl,
}) => {
  const { user } = useAuth();
  const { sendMessage, loading, error } = useSendMessage();
  const { isConnected, connect } = useWebSocket({ autoConnect: false });
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && user && !isConnected) {
      connect();
    }
  }, [isOpen, user, isConnected, connect]);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (error) {
      setStatus('error');
      setStatusMessage(error);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) return;
    if (!user) return;

    setStatus('sending');
    setStatusMessage('Enviando mensaje...');

    try {
      const result = await sendMessage(artistId, message.trim());

      if (result.success) {
        setStatus('success');
        setStatusMessage('¡Mensaje enviado!');
        setMessage('');

        setTimeout(() => {
          onClose();
          setStatus('idle');
          setStatusMessage('');
        }, 1500);
      } else {
        setStatus('error');
        setStatusMessage(result.error || 'Error al enviar mensaje');
      }
    } catch {
      setStatus('error');
      setStatusMessage('Error al enviar mensaje');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
              {artistImageUrl ? (
                <img
                  src={artistImageUrl}
                  alt={artistName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-lg font-bold text-white">
                  {artistName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h3 className="text-white font-semibold">Contactar a {artistName}</h3>
              {!user && (
                <p className="text-xs text-red-400">Debes iniciar sesión para enviar mensajes</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setStatus('idle');
                setStatusMessage('');
              }}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu mensaje..."
              disabled={!user || status === 'sending'}
              className={cn(
                'w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500',
                'focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500',
                'resize-none min-h-[120px] max-h-[200px]',
                'transition-colors',
                status === 'error' && 'border-red-500'
              )}
            />
          </div>

          {statusMessage && (
            <p
              className={cn(
                'mb-3 text-sm',
                status === 'success' && 'text-green-400',
                status === 'error' && 'text-red-400',
                status === 'sending' && 'text-purple-400'
              )}
            >
              {statusMessage}
            </p>
          )}

          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Enter para enviar, Shift+Enter para nueva línea
            </p>
            <button
              type="submit"
              disabled={!user || !message.trim() || status === 'sending'}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all',
                'bg-gradient-to-r from-purple-600 to-pink-600 text-white',
                'hover:opacity-90 hover:scale-105',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
                status === 'sending' && 'animate-pulse'
              )}
            >
              <Send className="w-4 h-4" />
              {status === 'sending' ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};