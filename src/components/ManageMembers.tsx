import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
  ADD_MEMBER_TO_GROUP,
  REMOVE_MEMBER_FROM_GROUP,
} from '../graphql/mutations/group.mutations';
import { GET_ALL_USERS } from '../graphql/queries/user.queries';
import { Button } from './ui/Button';
import { UserPlus, UserMinus, X, Search } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../context/NotificationContext';

interface ManageMembersProps {
  groupId: number;
  currentMembers: Array<{ id: number; name: string; surname: string; email: string }>;
  founderId: number;
  onMemberChange: () => void;
}

interface UserType {
  id: number;
  name: string;
  surname: string;
  email: string;
  role?: string;
}

export const ManageMembers: React.FC<ManageMembersProps> = ({
  groupId,
  currentMembers,
  founderId,
  onMemberChange,
}) => {
  const { user } = useAuth();
  const { success, error: showError } = useNotification();
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [addingMember, setAddingMember] = useState<number | null>(null);
  const [removingMember, setRemovingMember] = useState<number | null>(null);

  // Mover hooks fuera de condiciones (siempre se llaman)
  const { data: usersData, loading: loadingUsers } = useQuery(GET_ALL_USERS);
  const [addMember] = useMutation(ADD_MEMBER_TO_GROUP);
  const [removeMember] = useMutation(REMOVE_MEMBER_FROM_GROUP);

  const isFounder = user?.id === founderId;

  // Si no es fundador, no mostrar nada
  if (!isFounder) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-400 text-sm">Solo el fundador puede gestionar miembros</p>
      </div>
    );
  }

  // Filtrar usuarios que no son miembros y no son el fundador
  const availableUsers = ((usersData?.users as UserType[]) || []).filter((u: UserType) => {
    const isMember = currentMembers.some((m) => m.id === u.id);
    const isFounderUser = u.id === founderId;
    return !isMember && !isFounderUser;
  });

  const filteredUsers = availableUsers.filter(
    (u: UserType) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMember = async (userId: number) => {
    setAddingMember(userId);
    try {
      await addMember({
        variables: {
          groupId,
          userId,
        },
      });
      success('Miembro añadido', 'El usuario ha sido añadido al grupo');
      onMemberChange();
      setShowAddModal(false);
      setSearchTerm('');
    } catch (err) {
      console.error('Error adding member:', err);
      showError('Error', 'No se pudo añadir el miembro');
    } finally {
      setAddingMember(null);
    }
  };

  const handleRemoveMember = async (userId: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este miembro del grupo?')) return;

    setRemovingMember(userId);
    try {
      await removeMember({
        variables: {
          groupId,
          userId,
        },
      });
      success('Miembro removido', 'El usuario ha sido removido del grupo');
      onMemberChange();
    } catch (err) {
      console.error('Error removing member:', err);
      showError('Error', 'No se pudo eliminar el miembro');
    } finally {
      setRemovingMember(null);
    }
  };

  return (
    <>
      {/* Botón para añadir miembros */}
      <Button
        onClick={() => setShowAddModal(true)}
        variant="outline"
        className="w-full flex items-center justify-center gap-2"
      >
        <UserPlus className="w-4 h-4" />
        Añadir Miembro
      </Button>

      {/* Modal para añadir miembros */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h3 className="text-xl font-semibold text-white">Añadir Miembro</h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSearchTerm('');
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar usuarios..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                />
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {loadingUsers ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">
                    {searchTerm
                      ? 'No se encontraron usuarios'
                      : 'No hay usuarios disponibles para añadir'}
                  </p>
                ) : (
                  filteredUsers.map((member: UserType) => (
                    <div
                      key={member.id}
                      className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg"
                    >
                      <div>
                        <p className="text-white font-medium">
                          {member.name} {member.surname}
                        </p>
                        <p className="text-xs text-gray-400">{member.email}</p>
                      </div>
                      <Button
                        onClick={() => handleAddMember(member.id)}
                        disabled={addingMember === member.id}
                        size="sm"
                        variant="primary"
                      >
                        {addingMember === member.id ? 'Añadiendo...' : 'Añadir'}
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lista de miembros */}
      <div className="space-y-2 mt-4">
        {currentMembers.map((member) => (
          <div
            key={member.id}
            className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg"
          >
            <div>
              <p className="text-white font-medium">
                {member.name} {member.surname}
              </p>
              <p className="text-xs text-gray-400">{member.email}</p>
            </div>
            {member.id !== founderId && (
              <Button
                onClick={() => handleRemoveMember(member.id)}
                disabled={removingMember === member.id}
                size="sm"
                variant="outline"
                className="border-red-500 text-red-400 hover:bg-red-500/10"
              >
                {removingMember === member.id ? 'Eliminando...' : <UserMinus className="w-4 h-4" />}
              </Button>
            )}
            {member.id === founderId && (
              <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded-full">
                Fundador
              </span>
            )}
          </div>
        ))}
      </div>
    </>
  );
};
