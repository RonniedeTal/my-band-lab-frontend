import React from 'react';
import { MapPin, X } from 'lucide-react';

interface ActiveFiltersProps {
  selectedInstrumentIds: number[];
  selectedCountry: string;
  selectedCity: string;
  onRemoveInstrument: (instrumentId: number) => void;
  onRemoveLocation: () => void;
  onClearAll: () => void;
  getInstrumentName: (id: number) => string;
}

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  selectedInstrumentIds,
  selectedCountry,
  selectedCity,
  onRemoveInstrument,
  onRemoveLocation,
  onClearAll,
  getInstrumentName,
}) => {
  const hasInstruments = selectedInstrumentIds.length > 0;
  const hasLocation = selectedCountry !== '';

  if (!hasInstruments && !hasLocation) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4 p-3 bg-gray-800/30 rounded-lg">
      <span className="text-sm text-gray-400">Filtros activos:</span>

      {/* Badges de instrumentos individuales */}
      {selectedInstrumentIds.map((id) => (
        <span
          key={id}
          className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs"
        >
          {getInstrumentName(id)}
          <button onClick={() => onRemoveInstrument(id)} className="hover:text-white ml-1">
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}

      {/* Badge de ubicación */}
      {hasLocation && (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
          <MapPin className="w-3 h-3" />
          {selectedCity ? `${selectedCity}, ${selectedCountry}` : selectedCountry}
          <button onClick={onRemoveLocation} className="hover:text-white ml-1">
            <X className="w-3 h-3" />
          </button>
        </span>
      )}

      {/* Botón limpiar todos */}
      {(hasInstruments || hasLocation) && (
        <button
          onClick={onClearAll}
          className="ml-2 px-2 py-1 text-xs text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
        >
          Limpiar todos
        </button>
      )}
    </div>
  );
};
