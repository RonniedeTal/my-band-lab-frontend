import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { CREATE_ARTIST_FOR_CURRENT_USER } from '../graphql/mutations/artist.mutations';
import { GET_ARTISTS_PAGINATED } from '../graphql/queries/artist.queries';
import { GET_INSTRUMENTS } from '../graphql/queries/instrument.queries';
import { Button } from './ui/Button';
import { MusicGenre } from '../types/enums';
import { useNotification } from '../context/NotificationContext';
import { useCountries } from '../hooks/useCountries';
import { useCities } from '../hooks/useCities';

interface CreateArtistFormProps {
  onSuccess?: () => void;
}

interface Instrument {
  id: number;
  name: string;
  category: string;
  icon?: string;
}

// Función para capitalizar cada palabra
const capitalizeWords = (text: string): string => {
  return text
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const CreateArtistForm: React.FC<CreateArtistFormProps> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const { success, error: showError } = useNotification();

  const [formData, setFormData] = useState({
    stageName: '',
    biography: '',
    genre: 'ROCK' as MusicGenre,
    instrumentIds: [] as number[],
    mainInstrumentId: null as number | null,
    country: '',
    city: '',
  });

  const { data: instrumentsData, loading: loadingInstruments } = useQuery(GET_INSTRUMENTS);
  const { countries, loading: loadingCountries } = useCountries();
  const { cities, loading: loadingCities } = useCities(formData.country);

  const [createArtist, { loading }] = useMutation(CREATE_ARTIST_FOR_CURRENT_USER, {
    refetchQueries: [{ query: GET_ARTISTS_PAGINATED }],
    onCompleted: (data) => {
      const artistData = data.createArtistForCurrentUser;

      success(
        '¡Artista creado!',
        `El perfil de "${artistData.stageName}" ha sido creado exitosamente`
      );

      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      currentUser.role = 'ARTIST';
      localStorage.setItem('user', JSON.stringify(currentUser));

      if (onSuccess) {
        onSuccess();
      } else {
        navigate(`/artists/${artistData.id}`);
      }
    },
    onError: (error) => {
      console.error('Error creating artist:', error);
      showError('Error', error.message || 'No se pudo crear el perfil de artista');
    },
  });

  const availableInstruments: Instrument[] = instrumentsData?.instruments || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.stageName.trim()) {
      showError('Error', 'El nombre artístico es requerido');
      return;
    }

    if (formData.instrumentIds.length === 0) {
      showError('Error', 'Debes seleccionar al menos un instrumento');
      return;
    }

    // Formatear el nombre artístico (primera letra de cada palabra en mayúscula)
    const formattedStageName = capitalizeWords(formData.stageName.trim());

    try {
      await createArtist({
        variables: {
          stageName: formattedStageName,
          biography: formData.biography || null,
          genre: formData.genre,
          instrumentIds: formData.instrumentIds,
          mainInstrumentId: formData.mainInstrumentId,
          country: formData.country,
          city: formData.city,
        },
      });
    } catch {
      // Error ya manejado por onError
    }
  };

  // Formatear en tiempo real mientras el usuario escribe
  const handleStageNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    // Mostrar el valor sin formatear mientras escribe
    setFormData({ ...formData, stageName: rawValue });
  };

  const handleInstrumentToggle = (instrumentId: number) => {
    setFormData((prev) => {
      const isSelected = prev.instrumentIds.includes(instrumentId);
      const newInstrumentIds = isSelected
        ? prev.instrumentIds.filter((id) => id !== instrumentId)
        : [...prev.instrumentIds, instrumentId];

      const newMainInstrument =
        isSelected && prev.mainInstrumentId === instrumentId ? null : prev.mainInstrumentId;

      return {
        ...prev,
        instrumentIds: newInstrumentIds,
        mainInstrumentId: newMainInstrument,
      };
    });
  };
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, country: e.target.value, city: '' });
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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Nombre Artístico *</label>
        <input
          type="text"
          value={formData.stageName}
          onChange={handleStageNameChange}
          className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white"
          placeholder="Ej: Juan El Rockero"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Se guardará como:{' '}
          <span className="text-purple-400">
            {capitalizeWords(formData.stageName || 'Nombre Artístico')}
          </span>
        </p>
      </div>

      {/* Resto del formulario igual... */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Género Musical *</label>
        <select
          value={formData.genre}
          onChange={(e) => setFormData({ ...formData, genre: e.target.value as MusicGenre })}
          className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white"
        >
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre.replace('_', ' ')}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">País de origen</label>
          <select
            value={formData.country}
            onChange={handleCountryChange}
            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white"
          >
            <option value="">Selecciona un país</option>
            {loadingCountries ? (
              <option disabled>Cargando países...</option>
            ) : (
              countries.map((country) => (
                <option key={country.code} value={country.name}>
                  {country.name}
                </option>
              ))
            )}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Ciudad</label>
          <select
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            disabled={!formData.country}
            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white disabled:opacity-50"
          >
            <option value="">Selecciona una ciudad</option>
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
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Biografía</label>
        <textarea
          value={formData.biography}
          onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
          rows={4}
          className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white resize-none"
          placeholder="Cuéntanos sobre tu trayectoria musical..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Instrumentos *</label>
        {loadingInstruments ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500 mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {availableInstruments.map((instrument) => (
              <label
                key={instrument.id}
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                  formData.instrumentIds.includes(instrument.id)
                    ? 'bg-purple-500/20 border border-purple-500'
                    : 'bg-gray-800/30 border border-gray-700 hover:bg-gray-700/50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.instrumentIds.includes(instrument.id)}
                  onChange={() => handleInstrumentToggle(instrument.id)}
                  className="w-4 h-4 rounded border-gray-600 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-300">{instrument.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {formData.instrumentIds.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Instrumento Principal
          </label>
          <select
            value={formData.mainInstrumentId || ''}
            onChange={(e) =>
              setFormData({ ...formData, mainInstrumentId: parseInt(e.target.value) })
            }
            className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white"
          >
            <option value="">Selecciona un instrumento principal</option>
            {availableInstruments
              .filter((inst) => formData.instrumentIds.includes(inst.id))
              .map((instrument) => (
                <option key={instrument.id} value={instrument.id}>
                  {instrument.name}
                </option>
              ))}
          </select>
        </div>
      )}

      <div className="flex gap-4 pt-4">
        <Button type="submit" variant="primary" disabled={loading} className="flex-1">
          {loading ? 'Creando...' : 'Crear Perfil de Artista'}
        </Button>
        <Button type="button" variant="outline" onClick={() => navigate('/profile')}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};
