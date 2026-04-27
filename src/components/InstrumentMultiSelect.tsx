import React, { useState, useEffect } from 'react';
import { X, Plus, Loader2, Music } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface Instrument {
  id: number;
  name: string;
  category: string;
}

interface InstrumentMultiSelectProps {
  selectedInstrumentIds: number[];
  onSave: (instrumentIds: number[]) => void;
  onCancel?: () => void;
}

export const InstrumentMultiSelect: React.FC<InstrumentMultiSelectProps> = ({
  selectedInstrumentIds,
  onSave,
  onCancel,
}) => {
  const { token } = useAuth();
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>(selectedInstrumentIds);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Cargar instrumentos disponibles
  useEffect(() => {
    fetchInstruments();
  }, []);

  const fetchInstruments = async () => {
    try {
      const response = await fetch('/api/instruments', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Error al cargar instrumentos');

      const data = await response.json();
      setInstruments(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Obtener categorías únicas
  const categories = ['all', ...new Set(instruments.map((i) => i.category))];

  // Filtrar instrumentos
  const filteredInstruments = instruments.filter((instrument) => {
    const matchesSearch = instrument.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || instrument.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Alternar selección
  const toggleInstrument = (instrumentId: number) => {
    setSelectedIds((prev) =>
      prev.includes(instrumentId)
        ? prev.filter((id) => id !== instrumentId)
        : [...prev, instrumentId]
    );
  };

  // Guardar selección
  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/artists/looking-for-band/instruments', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ instrumentIds: selectedIds }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar instrumentos');
      }

      setSuccessMessage('✅ Instrumentos guardados correctamente');
      onSave(selectedIds);

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Obtener nombre de instrumento por ID
  const getInstrumentName = (id: number) => {
    return instruments.find((i) => i.id === id)?.name || '';
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Búsqueda y filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Buscar instrumento..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'Todas las categorías' : cat}
            </option>
          ))}
        </select>
      </div>

      {/* Grid de instrumentos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto p-2">
        {filteredInstruments.map((instrument) => (
          <button
            key={instrument.id}
            onClick={() => toggleInstrument(instrument.id)}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-left
              ${
                selectedIds.includes(instrument.id)
                  ? 'bg-purple-600 text-white border border-purple-500'
                  : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
              }
            `}
          >
            <Music className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm truncate">{instrument.name}</span>
            {selectedIds.includes(instrument.id) && <span className="ml-auto text-xs">✓</span>}
          </button>
        ))}
      </div>

      {filteredInstruments.length === 0 && (
        <p className="text-center text-gray-500 py-4">No se encontraron instrumentos</p>
      )}

      {/* Badges de selección */}
      {selectedIds.length > 0 && (
        <div className="border-t border-gray-700 pt-4">
          <p className="text-sm text-gray-400 mb-2">
            Instrumentos seleccionados ({selectedIds.length}):
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedIds.map((id) => (
              <span
                key={id}
                className="flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm"
              >
                {getInstrumentName(id)}
                <button onClick={() => toggleInstrument(id)} className="hover:text-purple-100 ml-1">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Botones de acción */}
      <div className="flex gap-3 pt-4 border-t border-gray-700">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Guardar cambios'}
        </button>

        {onCancel && (
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Cancelar
          </button>
        )}
      </div>

      {/* Mensajes */}
      {error && <p className="text-red-400 text-sm text-center">{error}</p>}
      {successMessage && <p className="text-green-400 text-sm text-center">{successMessage}</p>}
    </div>
  );
};
