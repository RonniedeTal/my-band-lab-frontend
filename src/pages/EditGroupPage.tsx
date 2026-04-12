import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_GROUP_BY_ID } from '../graphql/queries/group.queries';
import { EditGroupForm } from '../components/EditGroupForm';
import { Button } from '../components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const EditGroupPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data, loading, error } = useQuery(GET_GROUP_BY_ID, {
    variables: { id: parseInt(id || '0') },
    skip: !id,
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error || !data?.musicGroupById) {
    return (
      <div className="text-center py-20">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-red-400 mb-4">Error al cargar el grupo</p>
          <Button onClick={() => navigate('/groups')} variant="outline">
            Volver a grupos
          </Button>
        </div>
      </div>
    );
  }

  const group = data.musicGroupById;
  const isFounder = user?.id === group.founder?.id;

  if (!isFounder) {
    return (
      <div className="text-center py-20">
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-yellow-400 mb-4">Acceso denegado</p>
          <p className="text-gray-400 text-sm">Solo el fundador del grupo puede editarlo.</p>
          <Button onClick={() => navigate(`/groups/${id}`)} variant="outline" className="mt-4">
            Volver al grupo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="container mx-auto px-4 py-8">
        <Button onClick={() => navigate(`/groups/${id}`)} variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al grupo
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Editar Grupo
          </h1>
          <p className="text-gray-400 mt-2">Modifica la información de {group.name}</p>
        </div>

        <EditGroupForm
          groupId={parseInt(id!)}
          currentData={{
            name: group.name,
            description: group.description || '',
            genre: group.genre,
          }}
          onSuccess={() => navigate(`/groups/${id}`)}
        />
      </div>
    </div>
  );
};
export default EditGroupPage;
