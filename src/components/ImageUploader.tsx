import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

interface ImageUploaderProps {
  currentImageUrl?: string;
  onImageUploaded: (imageUrl: string) => void;
  onError?: (error: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImageUrl,
  onImageUploaded,
  onError,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { error: showError } = useNotification();

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

    // Aquí irá la subida a Cloudinary o backend
    // Por ahora simulamos la subida con un timeout
    setTimeout(() => {
      const fakeUrl = URL.createObjectURL(file);
      onImageUploaded(fakeUrl);
      setIsUploading(false);
    }, 1000);

    // Limpiar input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    onImageUploaded('');
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Preview */}
      <div className="relative group">
        {previewUrl ? (
          <div className="relative">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-24 h-24 rounded-full object-cover border-2 border-purple-500"
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
            className="w-24 h-24 rounded-full bg-gray-700 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-600 transition-colors border-2 border-dashed border-gray-500"
          >
            <ImageIcon className="w-8 h-8 text-gray-400" />
            <span className="text-xs text-gray-400 mt-1">Subir</span>
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
          Cambiar foto
        </button>
      )}
    </div>
  );
};
