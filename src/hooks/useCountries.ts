// src/hooks/useCountries.ts
import { useState, useEffect } from 'react';

interface Country {
  name: string;
  code: string;
  flag: string;
}

// Mapeo de nombres en inglés a español
const countryNamesToSpanish: Record<string, string> = {
  Spain: 'España',
  Mexico: 'México',
  Argentina: 'Argentina',
  Colombia: 'Colombia',
  Chile: 'Chile',
  Peru: 'Perú',
  Venezuela: 'Venezuela',
  'United States': 'Estados Unidos',
  'United States of America': 'Estados Unidos',
  Uruguay: 'Uruguay',
  Paraguay: 'Paraguay',
  Bolivia: 'Bolivia',
  Ecuador: 'Ecuador',
  'Costa Rica': 'Costa Rica',
  Panama: 'Panamá',
  Brazil: 'Brasil',
  Canada: 'Canadá',
  Germany: 'Alemania',
  France: 'Francia',
  Italy: 'Italia',
  'United Kingdom': 'Reino Unido',
  Portugal: 'Portugal',
  Netherlands: 'Países Bajos',
  Belgium: 'Bélgica',
  Switzerland: 'Suiza',
  Sweden: 'Suecia',
  Norway: 'Noruega',
  Denmark: 'Dinamarca',
  Finland: 'Finlandia',
  Ireland: 'Irlanda',
  Austria: 'Austria',
  Greece: 'Grecia',
  Turkey: 'Turquía',
  Russia: 'Rusia',
  China: 'China',
  Japan: 'Japón',
  'South Korea': 'Corea del Sur',
  India: 'India',
  Australia: 'Australia',
  'New Zealand': 'Nueva Zelanda',
};

export const useCountries = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('http://localhost:9000/api/countries');

        if (!response.ok) {
          throw new Error('Error al cargar países');
        }

        const data = await response.json();

        // Convertir nombres a español
        const countriesWithSpanishNames = data
          .map((country: Country) => ({
            ...country,
            name: countryNamesToSpanish[country.name] || country.name,
          }))
          .sort((a: Country, b: Country) => a.name.localeCompare(b.name));

        setCountries(countriesWithSpanishNames);
      } catch (err) {
        console.error('Error fetching countries:', err);
        setError('No se pudieron cargar los países');
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  return { countries, loading, error };
};
