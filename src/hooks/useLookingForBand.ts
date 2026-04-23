// src/hooks/useLookingForBand.ts
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

interface LookingForBandStatus {
  isLookingForBand: boolean;
  message?: string;
}

export const useLookingForBand = () => {
  const [isLookingForBand, setIsLookingForBand] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchStatus = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:9000/api/artists/looking-for-band/status', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data: LookingForBandStatus = await response.json();
      setIsLookingForBand(data.isLookingForBand);
    } catch (err) {
      console.error('Error fetching looking-for-band status:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar el estado');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const updateStatus = useCallback(
    async (newStatus: boolean) => {
      if (!token) {
        setError('No autenticado');
        return false;
      }

      try {
        setUpdating(true);
        setError(null);

        const response = await fetch('http://localhost:9000/api/artists/looking-for-band/status', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isLookingForBand: newStatus }),
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data: LookingForBandStatus = await response.json();
        setIsLookingForBand(data.isLookingForBand);
        return data.isLookingForBand;
      } catch (err) {
        console.error('Error updating looking-for-band status:', err);
        setError(err instanceof Error ? err.message : 'Error al actualizar el estado');
        return false;
      } finally {
        setUpdating(false);
      }
    },
    [token]
  );

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return {
    isLookingForBand,
    loading,
    updating,
    error,
    updateStatus,
    refetch: fetchStatus,
  };
};
