import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { UPDATE_MUSIC_GROUP_GENRE } from '../graphql/mutations/group.mutations';
import { GET_GROUP_BY_ID } from '../graphql/queries/group.queries';
import { Button } from './ui/Button';
import { MusicGenre } from '../types/enums';

interface EditGroupFormProps {
  groupId: number;
  currentData: {
    name: string;
    description: string;
    genre: MusicGenre;
  };
  onSuccess?: () => void;
}

export const EditGroupForm: React.FC<EditGroupFormProps> = ({
  groupId,
  currentData,
  onSuccess,
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: currentData.name,
    description: currentData.description,
    genre: currentData.genre,
  });
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  const [updateGenre, { loading: updatingGenre }] = useMutation(UPDATE_MUSIC_GROUP_GENRE, {
    refetchQueries: [{ query: GET_GROUP_BY_ID, variables: { id: groupId } }],
    onCompleted: () => {
      if (onSuccess) onSuccess();
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

  const handleGenreChange = async (newGenre: MusicGenre) => {
    try {
      await updateGenre({
        variables: {
          groupId: groupId,
          genre: newGenre,
        },
      });
      setFormData({ ...formData, genre: newGenre });
    } catch (err) {
      console.error('Error updating genre:', err);
      alert('No se pudo actualizar el género');
    }
  };

  const handleSaveName = () => {
    // Aquí iría la mutación para actualizar el nombre
    // Por ahora, solo cerramos el modo edición
    setIsEditingName(false);
    // TODO: Implementar updateGroupName mutation cuando esté disponible
    alert('Funcionalidad en desarrollo: Actualizar nombre');
  };

  const handleSaveDescription = () => {
    // Aquí iría la mutación para actualizar la descripción
    // Por ahora, solo cerramos el modo edición
    setIsEditingDescription(false);
    // TODO: Implementar updateGroupDescription mutation cuando esté disponible
    alert('Funcionalidad en desarrollo: Actualizar descripción');
  };

  return (
    <div className="space-y-6">
      {/* Editar Nombre */}
      <div className="bg-gray-800/30 rounded-xl p-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">Nombre del Grupo</label>
        {isEditingName ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 text-white"
            />
            <Button onClick={handleSaveName} size="sm" variant="primary">
              Guardar
            </Button>
            <Button onClick={() => setIsEditingName(false)} size="sm" variant="outline">
              Cancelar
            </Button>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <p className="text-white text-lg">{formData.name}</p>
            <Button onClick={() => setIsEditingName(true)} size="sm" variant="outline">
              Editar
            </Button>
          </div>
        )}
      </div>

      {/* Editar Descripción */}
      <div className="bg-gray-800/30 rounded-xl p-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">Descripción</label>
        {isEditingDescription ? (
          <div className="space-y-3">
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 text-white resize-none"
            />
            <div className="flex gap-2">
              <Button onClick={handleSaveDescription} size="sm" variant="primary">
                Guardar
              </Button>
              <Button onClick={() => setIsEditingDescription(false)} size="sm" variant="outline">
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-gray-300 leading-relaxed mb-3">
              {formData.description || 'Sin descripción'}
            </p>
            <Button onClick={() => setIsEditingDescription(true)} size="sm" variant="outline">
              Editar descripción
            </Button>
          </div>
        )}
      </div>

      {/* Editar Género */}
      <div className="bg-gray-800/30 rounded-xl p-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">Género Musical</label>
        <select
          value={formData.genre}
          onChange={(e) => handleGenreChange(e.target.value as MusicGenre)}
          disabled={updatingGenre}
          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 text-white disabled:opacity-50"
        >
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
        {updatingGenre && <p className="text-xs text-gray-400 mt-2">Actualizando género...</p>}
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(`/groups/${groupId}`)}
          className="flex-1"
        >
          Volver al grupo
        </Button>
      </div>
    </div>
  );
};
