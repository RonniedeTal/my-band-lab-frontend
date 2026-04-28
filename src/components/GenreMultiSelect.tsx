import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth'; // 👈 IMPORTAR useAuth

// Todos los géneros disponibles (deben coincidir con el enum MusicGenre del backend)
const AVAILABLE_GENRES = [
  'ROCK',
  'POP',
  'JAZZ',
  'CLASSICAL',
  'HIP_HOP',
  'ELECTRONIC',
  'REGGAE',
  'BLUES',
  'COUNTRY',
  'METAL',
  'PUNK',
  'SOUL',
  'FUNK',
  'LATIN',
  'INDIE',
  'ALTERNATIVE',
] as const;

type Genre = (typeof AVAILABLE_GENRES)[number];

interface GenreMultiSelectProps {
  selectedGenres: string[];
  onSave: (genres: string[]) => void;
  onCancel?: () => void;
}

export const GenreMultiSelect: React.FC<GenreMultiSelectProps> = ({
  selectedGenres,
  onSave,
  onCancel,
}) => {
  const { token } = useAuth(); // 👈 OBTENER TOKEN DEL HOOK
  const [selected, setSelected] = useState<string[]>(selectedGenres);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar géneros por búsqueda
  const filteredGenres = AVAILABLE_GENRES.filter((genre) =>
    genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Alternar selección de género
  const toggleGenre = (genre: string) => {
    setSelected((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  // Guardar selección
  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/artists/looking-for-band/genres', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // 👈 USAR TOKEN DEL HOOK
        },
        body: JSON.stringify({ genres: selected }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar géneros');
      }

      const data = await response.json();
      console.log('Géneros guardados:', data);

      setSuccessMessage(`✅ ${data.count} géneros guardados correctamente`);
      onSave(selected);

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setError(err.message);
      console.error('Error:', err);
    } finally {
      setSaving(false);
    }
  };

  // Obtener color de badge según género (opcional)
  const getGenreColor = (genre: string) => {
    const colors: Record<string, string> = {
      ROCK: 'bg-red-500/20 text-red-300 border-red-500/30',
      POP: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
      JAZZ: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      METAL: 'bg-gray-600/50 text-gray-300 border-gray-500/30',
      LATIN: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      ELECTRONIC: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      CLASSICAL: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      HIP_HOP: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    };
    return colors[genre] || 'bg-purple-500/20 text-purple-300 border-purple-500/30';
  };

  return (
    <div className="space-y-4">
      {/* Búsqueda */}
      <div>
        <input
          type="text"
          placeholder="Buscar género..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
        />
      </div>

      {/* Grid de géneros */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto p-1">
        {filteredGenres.map((genre) => (
          <button
            key={genre}
            onClick={() => toggleGenre(genre)}
            className={`
              px-3 py-2 rounded-lg text-sm font-medium transition-all text-left
              ${
                selected.includes(genre)
                  ? 'bg-purple-600 text-white border border-purple-500'
                  : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
              }
            `}
          >
            <div className="flex items-center justify-between">
              <span>{genre}</span>
              {selected.includes(genre) && <span className="text-xs">✓</span>}
            </div>
          </button>
        ))}
      </div>

      {filteredGenres.length === 0 && (
        <p className="text-center text-gray-500 py-4">No se encontraron géneros</p>
      )}

      {/* Badges de géneros seleccionados */}
      {selected.length > 0 && (
        <div className="border-t border-gray-700 pt-4">
          <p className="text-sm text-gray-400 mb-2">Géneros seleccionados ({selected.length}):</p>
          <div className="flex flex-wrap gap-2">
            {selected.map((genre) => (
              <span
                key={genre}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm border ${getGenreColor(genre)}`}
              >
                {genre}
                <button onClick={() => toggleGenre(genre)} className="hover:text-white ml-1">
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
