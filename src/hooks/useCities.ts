// src/hooks/useCities.ts
import { useState, useEffect } from 'react';

export const useCities = (countryName: string) => {
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!countryName || countryName === '') {
      setCities([]);
      return;
    }

    const fetchCities = async () => {
      setLoading(true);
      setError(null);

      try {
        // El nombre ya viene en español (Ej: "España")
        const encodedCountry = encodeURIComponent(countryName);
        const response = await fetch(
          `http://localhost:9000/api/countries/${encodedCountry}/cities`
        );

        if (!response.ok) {
          throw new Error('Error al cargar ciudades');
        }

        const data = await response.json();
        setCities(data || []);
      } catch (err) {
        console.error('Error fetching cities:', err);
        setError('No se pudieron cargar las ciudades');
        setCities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, [countryName]);

  return { cities, loading, error };
};
