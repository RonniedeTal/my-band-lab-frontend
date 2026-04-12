import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_USERS_ADMIN } from '../../graphql/queries/admin.queries';
import { CHANGE_USER_ROLE, DELETE_USER_BY_ADMIN } from '../../graphql/mutations/admin.mutations';
import { Button } from '../ui/Button';
import { useNotification } from '../../context/NotificationContext';
import { Search, Trash2, Shield, User, Star, Crown } from 'lucide-react'; // Eliminado Edit2

interface UserType {
  id: number;
  name: string;
  surname: string;
  email: string;
  role: string;
  profileImageUrl?: string;
  createdAt?: string;
  artist?: {
    id: number;
    stageName: string;
    verified: boolean;
  } | null;
}

export const UserManagement: React.FC = () => {
  const { success, error: showError } = useNotification();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newRole, setNewRole] = useState('');

  const { data, loading, error, refetch } = useQuery(GET_ALL_USERS_ADMIN);
  const [changeRole] = useMutation(CHANGE_USER_ROLE);
  const [deleteUser] = useMutation(DELETE_USER_BY_ADMIN);

  const users = data?.users || [];

  const filteredUsers = users.filter(
    (user: UserType) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Crown className="w-4 h-4 text-yellow-400" />;
      case 'ARTIST':
        return <Star className="w-4 h-4 text-purple-400" />;
      default:
        return <User className="w-4 h-4 text-blue-400" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'ARTIST':
        return 'bg-purple-500/20 text-purple-400';
      default:
        return 'bg-blue-500/20 text-blue-400';
    }
  };

  const handleChangeRole = async (userId: number, role: string) => {
    try {
      await changeRole({
        variables: {
          userId,
          newRole: role,
        },
      });
      success('Rol actualizado', 'El rol del usuario ha sido actualizado');
      refetch();
      setShowRoleModal(false);
      setSelectedUser(null);
    } catch {
      showError('Error', 'No se pudo actualizar el rol');
    }
  };

  const handleDeleteUser = async (userId: number, userName: string) => {
    if (
      confirm(
        `¿Estás seguro de que quieres eliminar al usuario ${userName}? Esta acción no se puede deshacer.`
      )
    ) {
      try {
        await deleteUser({
          variables: { userId },
        });
        success('Usuario eliminado', `El usuario ${userName} ha sido eliminado`);
        refetch();
      } catch {
        showError('Error', 'No se pudo eliminar el usuario');
      }
    }
  };

  const openRoleModal = (user: UserType) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setShowRoleModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
          <p className="text-red-400">Error al cargar los usuarios</p>
          <p className="text-gray-400 text-sm mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Barra de búsqueda */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, apellido o email..."
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 text-white"
          />
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-800/50">
            <tr>
              <th className="text-left p-3 text-gray-400 font-medium">Usuario</th>
              <th className="text-left p-3 text-gray-400 font-medium">Email</th>
              <th className="text-left p-3 text-gray-400 font-medium">Rol</th>
              <th className="text-left p-3 text-gray-400 font-medium">Artista</th>
              <th className="text-left p-3 text-gray-400 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user: UserType) => (
              <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-800/30">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    {user.profileImageUrl ? (
                      <img
                        src={user.profileImageUrl}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user.name.charAt(0)}
                          {user.surname.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="text-white font-medium">
                        {user.name} {user.surname}
                      </p>
                      <p className="text-xs text-gray-500">ID: {user.id}</p>
                    </div>
                  </div>
                </td>
                <td className="p-3 text-gray-300">{user.email}</td>
                <td className="p-3">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}
                  >
                    {getRoleIcon(user.role)}
                    {user.role}
                  </span>
                </td>
                <td className="p-3">
                  {user.artist ? (
                    <span className="text-green-400 text-sm">
                      {user.artist.stageName}
                      {user.artist.verified && <span className="ml-1 text-xs">✓</span>}
                    </span>
                  ) : (
                    <span className="text-gray-500 text-sm">-</span>
                  )}
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openRoleModal(user)}
                      className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                      title="Cambiar rol"
                    >
                      <Shield className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id, `${user.name} ${user.surname}`)}
                      className="p-1 text-red-400 hover:text-red-300 transition-colors"
                      title="Eliminar usuario"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-gray-400">No se encontraron usuarios</div>
        )}
      </div>

      {/* Modal para cambiar rol */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Cambiar rol de usuario</h3>
              <p className="text-gray-400 mb-4">
                Usuario: {selectedUser.name} {selectedUser.surname}
              </p>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Nuevo rol</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                >
                  <option value="USER">USER</option>
                  <option value="ARTIST">ARTIST</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => handleChangeRole(selectedUser.id, newRole)}
                  variant="primary"
                  className="flex-1"
                >
                  Guardar
                </Button>
                <Button
                  onClick={() => {
                    setShowRoleModal(false);
                    setSelectedUser(null);
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
