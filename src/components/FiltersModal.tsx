// src/components/FiltersModal.tsx
import React, { useState, useEffect } from 'react';
import { X, Filter } from 'lucide-react';
import { useCountries } from '../hooks/useCountries';
import { useCities } from '../hooks/useCities';
import { useSearchParams } from 'react-router-dom';

interface FiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFilters?: { country: string; city: string; genre: string };
}

export const FiltersModal: React.FC<FiltersModalProps> = ({ isOpen, onClose }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Leer filtros actuales de la URL
  const [country, setCountry] = useState(searchParams.get('country') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [genre, setGenre] = useState(searchParams.get('genre') || '');

  const { countries, loading: loadingCountries } = useCountries();
  const { cities, loading: loadingCities } = useCities(country);

  // Resetear ciudad cuando cambia el país
  useEffect(() => {
    setCity('');
  }, [country]);

  if (!isOpen) return null;

  const handleApply = () => {
    const params = new URLSearchParams(searchParams);

    if (country) {
      params.set('country', country);
    } else {
      params.delete('country');
    }

    if (city) {
      params.set('city', city);
    } else {
      params.delete('city');
    }

    if (genre) {
      params.set('genre', genre);
    } else {
      params.delete('genre');
    }

    setSearchParams(params);
    onClose();
  };

  const handleClear = () => {
    setCountry('');
    setCity('');
    setGenre('');

    const params = new URLSearchParams(searchParams);
    params.delete('country');
    params.delete('city');
    params.delete('genre');

    setSearchParams(params);
    onClose();
  };

  const genres = [
    'ROCK',
    'POP',
    'JAZZ',
    'METAL',
    'CLASSICAL',
    'ELECTRONIC',
    'HIP_HOP',
    'REGGAE',
    'BLUES',
    'COUNTRY',
    'LATIN',
    'INDIE',
  ];

  return (
    <>
      {/* Overlay oscuro */}
      <div className="fixed inset-0 bg-black/70 z-50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-gray-800 rounded-xl shadow-2xl z-50 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-semibold text-white">Filtros de búsqueda</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-700 transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* País */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">País de origen</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 text-white"
            >
              <option value="">Todos los países</option>
              {loadingCountries ? (
                <option disabled>Cargando países...</option>
              ) : (
                countries.map((c) => (
                  <option key={c.code} value={c.name}>
                    {c.name}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Ciudad (solo si hay país seleccionado) */}
          {country && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Ciudad</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 text-white"
              >
                <option value="">Todas las ciudades</option>
                {loadingCities ? (
                  <option disabled>Cargando ciudades...</option>
                ) : (
                  cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))
                )}
              </select>
            </div>
          )}

          {/* Género musical */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Género musical</label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 text-white"
            >
              <option value="">Todos los géneros</option>
              {genres.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-4 border-t border-gray-700">
          <button
            onClick={handleApply}
            className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Aplicar filtros
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Limpiar
          </button>
        </div>
      </div>
    </>
  );
};
