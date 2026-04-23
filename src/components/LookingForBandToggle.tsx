import React, { useState, useEffect } from 'react';
import { Users, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface LookingForBandToggleProps {
  value: boolean;
  onChange?: (newValue: boolean) => void;
}

export const LookingForBandToggle: React.FC<LookingForBandToggleProps> = ({ value, onChange }) => {
  const { token } = useAuth();
  const [isLookingForBand, setIsLookingForBand] = useState(value);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Solo actualizar cuando la prop cambia (NO durante el toggle)
  useEffect(() => {
    console.log('Prop value cambió a:', value);
    setIsLookingForBand(value);
  }, [value]);

  const handleToggle = async () => {
    if (!token) {
      setError('Debes iniciar sesión');
      return;
    }

    const newValue = !isLookingForBand;
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/artists/looking-for-band/status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isLookingForBand: newValue }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar estado');
      }

      const data = await response.json();
      console.log('Respuesta del servidor:', data);

      // Actualizar el estado local inmediatamente
      setIsLookingForBand(data.isLookingForBand);
      setSuccessMessage(data.message);

      // Notificar al padre que se completó el cambio
      onChange?.(data.isLookingForBand);

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message);
      console.error('Error:', err);
      // Revertir el estado local si hubo error
      setIsLookingForBand(value);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 p-4 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg border border-purple-500/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-purple-400" />
          <div>
            <h3 className="text-white font-medium">¿Buscas formar una banda?</h3>
            <p className="text-gray-400 text-sm">
              Activa esta opción para que otros músicos te encuentren
            </p>
          </div>
        </div>

        <button
          onClick={handleToggle}
          disabled={loading}
          className={`
            relative inline-flex h-6 w-11 items-center rounded-full transition-colors
            ${isLookingForBand ? 'bg-purple-600' : 'bg-gray-600'}
            ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <span
            className={`
              inline-block h-4 w-4 transform rounded-full bg-white transition-transform
              ${isLookingForBand ? 'translate-x-6' : 'translate-x-1'}
            `}
          />
        </button>
      </div>

      {error && <div className="mt-3 text-sm text-red-400">❌ {error}</div>}

      {successMessage && <div className="mt-3 text-sm text-green-400">{successMessage}</div>}

      {isLookingForBand && !error && !successMessage && (
        <div className="mt-3 text-sm text-green-400 flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          🎸 Visible para otros músicos
        </div>
      )}

      {loading && (
        <div className="mt-2 flex items-center gap-2 text-gray-400 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          Actualizando...
        </div>
      )}
    </div>
  );
};
