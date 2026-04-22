// src/components/CountryCityFilter.tsx
import React from 'react';
import { useCountries } from '../hooks/useCountries';
import { useCities } from '../hooks/useCities';

interface CountryCityFilterProps {
  selectedCountry: string;
  selectedCity: string;
  onCountryChange: (country: string) => void;
  onCityChange: (city: string) => void;
  className?: string;
}

export const CountryCityFilter: React.FC<CountryCityFilterProps> = ({
  selectedCountry,
  selectedCity,
  onCountryChange,
  onCityChange,
  className = '',
}) => {
  const { countries, loading: loadingCountries, error: countriesError } = useCountries();
  const { cities, loading: loadingCities } = useCities(selectedCountry);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onCountryChange(e.target.value);
    onCityChange(''); // Resetear ciudad cuando cambia el país
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
      {/* Selector de País */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">País de origen</label>
        <select
          value={selectedCountry}
          onChange={handleCountryChange}
          className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white"
        >
          <option value="">Todos los países</option>
          {loadingCountries ? (
            <option disabled>Cargando países...</option>
          ) : countriesError ? (
            <option disabled>Error al cargar países</option>
          ) : (
            countries.map((country) => (
              <option key={country.code} value={country.name}>
                {country.name}
              </option>
            ))
          )}
        </select>
      </div>

      {/* Selector de Ciudad (solo visible si hay país seleccionado) */}
      {selectedCountry && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Ciudad</label>
          <select
            value={selectedCity}
            onChange={(e) => onCityChange(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white"
          >
            <option value="">Todas las ciudades</option>
            {loadingCities ? (
              <option disabled>Cargando ciudades...</option>
            ) : (
              cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))
            )}
          </select>
        </div>
      )}
    </div>
  );
};
