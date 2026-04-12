import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_USER } from '../graphql/mutations/user.mutations';
import { Button } from './ui/Button';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../context/NotificationContext';
import { User, Mail, UserCircle } from 'lucide-react';

interface EditProfileFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const EditProfileForm: React.FC<EditProfileFormProps> = ({ onSuccess, onCancel }) => {
  const { user } = useAuth();
  const { success, error: showError } = useNotification();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    surname: user?.surname || '',
    email: user?.email || '',
    profileImageUrl: user?.profileImageUrl || '',
  });

  const [updateUser, { loading }] = useMutation(UPDATE_USER, {
    onCompleted: () => {
      success('Perfil actualizado', 'Tu información ha sido actualizada exitosamente');
      if (onSuccess) onSuccess();
    },
    onError: () => {
      showError('Error', 'No se pudo actualizar el perfil');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showError('Error', 'El nombre es requerido');
      return;
    }

    if (!formData.surname.trim()) {
      showError('Error', 'El apellido es requerido');
      return;
    }

    if (!formData.email.trim()) {
      showError('Error', 'El email es requerido');
      return;
    }

    try {
      await updateUser({
        variables: {
          id: user?.id,
          name: formData.name,
          surname: formData.surname,
          email: formData.email,
          profileImageUrl: formData.profileImageUrl || null,
        },
      });
    } catch {
      // Error ya manejado por onError
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ... resto del JSX igual ... */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
          <User className="w-4 h-4" />
          Nombre *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white"
          placeholder="Tu nombre"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
          <User className="w-4 h-4" />
          Apellido *
        </label>
        <input
          type="text"
          value={formData.surname}
          onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
          className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white"
          placeholder="Tu apellido"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
          <Mail className="w-4 h-4" />
          Email *
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white"
          placeholder="tu@email.com"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
          <UserCircle className="w-4 h-4" />
          URL de imagen de perfil
        </label>
        <input
          type="text"
          value={formData.profileImageUrl}
          onChange={(e) => setFormData({ ...formData, profileImageUrl: e.target.value })}
          className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white"
          placeholder="https://ejemplo.com/mi-foto.jpg"
        />
        <p className="text-xs text-gray-500 mt-1">
          Opcional. Ingresa una URL de imagen para tu perfil
        </p>
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" variant="primary" disabled={loading} className="flex-1">
          {loading ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};
