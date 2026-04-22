import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { CREATE_MUSIC_GROUP } from '../graphql/mutations/group.mutations';
import { GET_GROUPS_PAGINATED } from '../graphql/queries/group.queries';
import { Button } from './ui/Button';
import { MusicGenre } from '../types/enums';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../context/NotificationContext';
import { useCountries } from '../hooks/useCountries';
import { useCities } from '../hooks/useCities';

export const CreateGroupForm: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, error: showError } = useNotification();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    genre: 'ROCK' as MusicGenre,
    country: '',
    city: '',
  });

  const { countries, loading: loadingCountries } = useCountries();
  const { cities, loading: loadingCities } = useCities(formData.country);

  const [createGroup, { loading }] = useMutation(CREATE_MUSIC_GROUP, {
    refetchQueries: [{ query: GET_GROUPS_PAGINATED }],
    onCompleted: (data) => {
      success(
        '¡Grupo creado!',
        `El grupo "${data.createMusicGroup.name}" ha sido creado exitosamente`
      );
      navigate(`/groups/${data.createMusicGroup.id}`);
    },
    onError: () => {
      showError('Error', 'No se pudo crear el grupo. Intenta nuevamente.');
    },
  });

  const genres = [
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
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showError('Error', 'El nombre del grupo es requerido');
      return;
    }

    if (!user?.id) {
      showError('Error', 'Debes iniciar sesión para crear un grupo');
      navigate('/login');
      return;
    }

    try {
      await createGroup({
        variables: {
          name: formData.name,
          description: formData.description || null,
          genre: formData.genre,
          founderId: user.id,
          country: formData.country,
          city: formData.city,
        },
      });
    } catch {
      // Error ya manejado por onError
    }
  };
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, country: e.target.value, city: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      {/* ... resto del JSX igual ... */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Nombre del Grupo *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white"
          placeholder="Ej: The Rolling Beats"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Género Musical *</label>
        <select
          value={formData.genre}
          onChange={(e) => setFormData({ ...formData, genre: e.target.value as MusicGenre })}
          className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white"
        >
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
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
        <label className="block text-sm font-medium text-gray-300 mb-2">Descripción</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white resize-none"
          placeholder="Describe tu grupo, estilo musical, influencias..."
        />
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" variant="primary" disabled={loading} className="flex-1">
          {loading ? 'Creando...' : 'Crear Grupo'}
        </Button>
        <Button type="button" variant="outline" onClick={() => navigate('/groups')}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};
