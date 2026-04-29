import React, { useState, useEffect } from 'react';
import { X, Loader2, Filter } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface Instrument {
  id: number;
  name: string;
  category: string;
}

interface InstrumentFilterProps {
  selectedInstrumentIds: number[];
  onInstrumentChange: (instrumentIds: number[]) => void;
}

export const InstrumentFilter: React.FC<InstrumentFilterProps> = ({
  selectedInstrumentIds,
  onInstrumentChange,
}) => {
  const { token } = useAuth();
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Cargar instrumentos
  useEffect(() => {
    const fetchInstruments = async () => {
      try {
        const response = await fetch('/api/instruments', {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setInstruments(data);
        }
      } catch (error) {
        console.error('Error loading instruments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInstruments();
  }, [token]);

  // Obtener categorías únicas
  const categories = ['all', ...new Set(instruments.map((i) => i.category))];

  // Filtrar instrumentos
  const filteredInstruments = instruments.filter((instrument) => {
    const matchesSearch = instrument.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || instrument.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Alternar selección de instrumento
  const toggleInstrument = (instrumentId: number) => {
    if (selectedInstrumentIds.includes(instrumentId)) {
      onInstrumentChange(selectedInstrumentIds.filter((id) => id !== instrumentId));
    } else {
      onInstrumentChange([...selectedInstrumentIds, instrumentId]);
    }
  };

  // Limpiar todos los filtros
  const clearFilters = () => {
    onInstrumentChange([]);
  };

  // Eliminar un instrumento específico
  const removeInstrument = (instrumentId: number) => {
    onInstrumentChange(selectedInstrumentIds.filter((id) => id !== instrumentId));
  };

  // Obtener nombre del instrumento por ID
  const getInstrumentName = (id: number) => {
    return instruments.find((i) => i.id === id)?.name || '';
  };

  return (
    <div className="relative">
      {/* Botón selector */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
      >
        <Filter className="w-4 h-4" />
        <span>Instrumentos</span>
        {selectedInstrumentIds.length > 0 && (
          <span className="ml-1 px-1.5 py-0.5 text-xs bg-purple-600 rounded-full">
            {selectedInstrumentIds.length}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-gray-700">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-white font-medium">Filtrar por instrumento</h4>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Búsqueda */}
            <input
              type="text"
              placeholder="Buscar instrumento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />

            {/* Categorías */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full mt-2 px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'Todas las categorías' : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Lista de instrumentos */}
          <div className="max-h-64 overflow-y-auto p-2">
            {loading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
              </div>
            ) : filteredInstruments.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No se encontraron instrumentos</p>
            ) : (
              filteredInstruments.map((instrument) => (
                <label
                  key={instrument.id}
                  className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded-lg cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedInstrumentIds.includes(instrument.id)}
                    onChange={() => toggleInstrument(instrument.id)}
                    className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-300">{instrument.name}</span>
                  <span className="text-xs text-gray-500 ml-auto">{instrument.category}</span>
                </label>
              ))
            )}
          </div>

          {/* Botones de acción */}
          <div className="p-3 border-t border-gray-700 flex gap-2">
            {selectedInstrumentIds.length > 0 && (
              <button
                onClick={clearFilters}
                className="flex-1 px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                Limpiar
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

      {/* Badges de instrumentos seleccionados */}
      {selectedInstrumentIds.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {selectedInstrumentIds.map((id) => (
            <span
              key={id}
              className="inline-flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs"
            >
              {getInstrumentName(id)}
              <button onClick={() => removeInstrument(id)} className="hover:text-white ml-1">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
