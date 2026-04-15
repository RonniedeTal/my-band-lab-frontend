import React, { useRef, useState } from 'react';
import { Upload, X, Music, Loader2 } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../hooks/useAuth';

interface SongUploaderProps {
  entityId: number;
  entityType: 'artist' | 'group';
  onSongUploaded: () => void;
}

export const SongUploader: React.FC<SongUploaderProps> = ({
  entityId,
  entityType,
  onSongUploaded,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { error: showError, success } = useNotification();
  const { token } = useAuth();

  const validateFile = (file: File): boolean => {
    // Validar tipo (solo MP3)
    if (file.type !== 'audio/mpeg') {
      showError('Error', 'Solo se permiten archivos MP3');
      return false;
    }

    // Validar tamaño (máximo 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      showError('Error', 'El archivo no puede superar los 10MB');
      return false;
    }

    return true;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
      // Auto-llenar título con nombre del archivo (sin extensión)
      const fileName = file.name.replace(/\.[^/.]+$/, '');
      setTitle(fileName);
    }
  };

  const handleUpload = async () => {
    if (!title.trim()) {
      showError('Error', 'Por favor ingresa un título para la canción');
      return;
    }

    if (!selectedFile) {
      showError('Error', 'Por favor selecciona un archivo MP3');
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('title', title);
    formData.append(`${entityType}Id`, entityId.toString());

    try {
      const response = await fetch('http://localhost:9000/api/songs/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al subir la canción');
      }

      success('Éxito', 'Canción subida exitosamente');
      setSelectedFile(null);
      setTitle('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onSongUploaded();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al subir la canción';
      showError('Error', errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  const cancelUpload = () => {
    setSelectedFile(null);
    setTitle('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-gray-800/30 rounded-xl p-6 mb-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Music className="w-5 h-5 text-purple-400" />
        Subir nueva canción
      </h3>

      <div className="space-y-4">
        {/* Título */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Título de la canción</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: Mi primera canción"
            className="w-full px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 text-white"
            disabled={isUploading}
          />
        </div>

        {/* Selección de archivo */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Archivo MP3 (máx. 10MB)</label>
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/mpeg"
              onChange={handleFileChange}
              className="hidden"
              disabled={isUploading}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              {selectedFile ? 'Cambiar archivo' : 'Seleccionar MP3'}
            </button>
            {selectedFile && (
              <span className="text-sm text-gray-400">
                {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            )}
          </div>
        </div>

        {/* Botones de acción */}
        {selectedFile && (
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Subiendo...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Subir canción
                </>
              )}
            </button>
            <button
              onClick={cancelUpload}
              disabled={isUploading}
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
