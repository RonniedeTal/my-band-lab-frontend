import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { useAuth } from '../hooks/useAuth';

interface LogoUploaderProps {
  currentLogoUrl?: string | null;
  entityId: string | number;
  entityType: 'artist' | 'group';
  onLogoUploaded: (logoUrl: string) => void;
  onError?: (error: string) => void;
  className?: string;
}

export const LogoUploader: React.FC<LogoUploaderProps> = ({
  currentLogoUrl,
  entityId,
  entityType,
  onLogoUploaded,
  onError,
  className = '',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentLogoUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { error: showError } = useNotification();
  const { token } = useAuth();

  const validateFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!validTypes.includes(file.type)) {
      const errorMsg = 'Formato no soportado. Usa JPG, PNG o GIF';
      if (onError) onError(errorMsg);
      showError('Error', errorMsg);
      return false;
    }

    if (file.size > maxSize) {
      const errorMsg = 'La imagen no puede superar los 2MB';
      if (onError) onError(errorMsg);
      showError('Error', errorMsg);
      return false;
    }

    return true;
  };

  const getUploadUrl = (): string => {
    if (entityType === 'artist') {
      return `http://localhost:9000/api/artists/${entityId}/logo`;
    }
    return `http://localhost:9000/api/groups/${entityId}/logo`;
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!validateFile(file)) return;

    // Mostrar preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    setIsUploading(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(getUploadUrl(), {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Error al subir el logo');
      }

      const data = await response.json();
      console.log(`✅ Logo de ${entityType} subido:`, data.imageUrl);

      setPreviewUrl(data.imageUrl);
      onLogoUploaded(data.imageUrl);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error al subir el logo';
      console.error('❌ Upload error:', err);
      if (onError) onError(errorMsg);
      showError('Error', errorMsg);
      setPreviewUrl(currentLogoUrl || null);
    } finally {
      setIsUploading(false);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    onLogoUploaded('');
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="relative group">
        {previewUrl ? (
          <div className="relative">
            <img
              src={previewUrl}
              alt="Logo"
              className="w-24 h-24 rounded-lg object-cover border-2 border-purple-500"
            />
            <button
              onClick={handleRemove}
              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div
            onClick={triggerFileInput}
            className="w-24 h-24 rounded-lg bg-gray-700 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors border-2 border-dashed border-gray-500"
          >
            <ImageIcon className="w-8 h-8 text-gray-400" />
            <span className="text-xs text-gray-400 mt-1">Logo</span>
          </div>
        )}
      </div>

      {isUploading && (
        <div className="text-sm text-purple-400 flex items-center gap-2">
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-purple-500"></div>
          Subiendo...
        </div>
      )}

      {!previewUrl && !isUploading && (
        <button
          onClick={triggerFileInput}
          className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
        >
          <Upload className="w-3 h-3" />
          {currentLogoUrl ? 'Cambiar logo' : 'Subir logo'}
        </button>
      )}
    </div>
  );
};
