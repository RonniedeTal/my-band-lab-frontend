import React, { useState, useEffect } from 'react';
import { X, Loader2, MapPin } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface Country {
  name: string;
  code?: string;
}

interface LocationFilterProps {
  selectedCountry: string;
  selectedCity: string;
  onCountryChange: (country: string) => void;
  onCityChange: (city: string) => void;
}

export const LocationFilter: React.FC<LocationFilterProps> = ({
  selectedCountry,
  selectedCity,
  onCountryChange,
  onCityChange,
}) => {
  const { token } = useAuth();
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Cargar países
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('/api/countries', {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        });
        if (response.ok) {
          const data = await response.json();
          // Asegurar que data es un array
          const countriesArray = Array.isArray(data) ? data : [];
          setCountries(countriesArray);
        }
      } catch (error) {
        console.error('Error loading countries:', error);
      } finally {
        setLoadingCountries(false);
      }
    };
    fetchCountries();
  }, [token]);

  // Cargar ciudades cuando se selecciona un país
  useEffect(() => {
    if (!selectedCountry) {
      setCities([]);
      return;
    }

    const fetchCities = async () => {
      setLoadingCities(true);
      try {
        const encodedCountry = encodeURIComponent(selectedCountry);
        const response = await fetch(`/api/countries/${encodedCountry}/cities`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        });
        if (response.ok) {
          const data = await response.json();
          const citiesArray = Array.isArray(data) ? data : [];
          setCities(citiesArray);
        }
      } catch (error) {
        console.error('Error loading cities:', error);
      } finally {
        setLoadingCities(false);
      }
    };
    fetchCities();
  }, [selectedCountry, token]);

  const handleCountryChange = (countryName: string) => {
    onCountryChange(countryName);
    onCityChange('');
  };

  const clearLocation = () => {
    onCountryChange('');
    onCityChange('');
  };

  const hasActiveFilter = selectedCountry !== '';

  // Obtener el nombre del país para mostrar (si es objeto o string)
  const getCountryDisplayName = (country: Country | string): string => {
    if (typeof country === 'string') return country;
    return country.name || country.code || '';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 border rounded-lg transition-colors ${
          hasActiveFilter
            ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
            : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
        }`}
      >
        <MapPin className="w-4 h-4" />
        <span>Ubicación</span>
        {hasActiveFilter && (
          <span className="ml-1 px-1.5 py-0.5 text-xs bg-purple-600 rounded-full">1</span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-gray-700">
            <div className="flex justify-between items-center">
              <h4 className="text-white font-medium">Filtrar por ubicación</h4>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-3 space-y-3">
            {/* Selector de país */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">País</label>
              {loadingCountries ? (
                <div className="flex justify-center py-2">
                  <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                </div>
              ) : countries.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-2">No hay países disponibles</p>
              ) : (
                <select
                  value={selectedCountry}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
                >
                  <option value="">Todos los países</option>
                  {countries.map((country) => (
                    <option
                      key={getCountryDisplayName(country)}
                      value={getCountryDisplayName(country)}
                    >
                      {getCountryDisplayName(country)}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Selector de ciudad (solo si hay país seleccionado) */}
            {selectedCountry && (
              <div>
                <label className="block text-xs text-gray-400 mb-1">Ciudad</label>
                {loadingCities ? (
                  <div className="flex justify-center py-2">
                    <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                  </div>
                ) : cities.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-2">
                    No hay ciudades disponibles para {selectedCountry}
                  </p>
                ) : (
                  <select
                    value={selectedCity}
                    onChange={(e) => onCityChange(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
                  >
                    <option value="">Todas las ciudades</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}
          </div>

          <div className="p-3 border-t border-gray-700 flex gap-2">
            {hasActiveFilter && (
              <button
                onClick={clearLocation}
                className="flex-1 px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                Limpiar ubicación
              </button>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="flex-1 px-3 py-1.5 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Badge de filtro activo */}
      {hasActiveFilter && (
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
            <MapPin className="w-3 h-3" />
            {selectedCity ? `${selectedCity}, ${selectedCountry}` : selectedCountry}
            <button onClick={clearLocation} className="hover:text-white ml-1">
              <X className="w-3 h-3" />
            </button>
          </span>
        </div>
      )}
    </div>
  );
};
