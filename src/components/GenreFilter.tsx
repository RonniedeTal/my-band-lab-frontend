import React from 'react';
import { Music } from 'lucide-react';

interface GenreFilterProps {
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
}

const genres = [
  { value: '', label: 'Todos los géneros' },
  { value: 'ROCK', label: 'Rock' },
  { value: 'POP', label: 'Pop' },
  { value: 'JAZZ', label: 'Jazz' },
  { value: 'CLASSICAL', label: 'Clásica' },
  { value: 'HIP_HOP', label: 'Hip Hop' },
  { value: 'ELECTRONIC', label: 'Electrónica' },
  { value: 'REGGAE', label: 'Reggae' },
  { value: 'BLUES', label: 'Blues' },
  { value: 'COUNTRY', label: 'Country' },
  { value: 'METAL', label: 'Metal' },
  { value: 'PUNK', label: 'Punk' },
  { value: 'SOUL', label: 'Soul' },
  { value: 'FUNK', label: 'Funk' },
  { value: 'LATIN', label: 'Latina' },
  { value: 'INDIE', label: 'Indie' },
  { value: 'ALTERNATIVE', label: 'Alternativa' },
];

export const GenreFilter: React.FC<GenreFilterProps> = ({ selectedGenre, onGenreChange }) => {
  return (
    <div className="relative">
      <div className="flex items-center gap-2 mb-2">
        <Music className="w-4 h-4 text-purple-400" />
        <label className="text-sm font-medium text-gray-300">Filtrar por género</label>
      </div>
      <select
        value={selectedGenre}
        onChange={(e) => onGenreChange(e.target.value)}
        className="w-full md:w-64 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white cursor-pointer"
      >
        {genres.map((genre) => (
          <option key={genre.value} value={genre.value}>
            {genre.label}
          </option>
        ))}
      </select>
    </div>
  );
};
