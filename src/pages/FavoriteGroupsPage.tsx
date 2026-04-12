import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useQuery } from '@apollo/client';
import { GET_FAVORITE_GROUPS } from '../graphql/queries/follow.queries';
import { GroupCard } from '../components/GroupCard';
import { Button } from '../components/ui/Button';
import { Heart, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { MusicGroup } from '../types/group.types';

export const FavoriteGroupsPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  const { data, loading, error, refetch } = useQuery(GET_FAVORITE_GROUPS, {
    variables: { userId: user?.id, page: 0, size: 20 },
    skip: !user?.id,
    fetchPolicy: 'network-only',
  });

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Grupos Favoritos</h1>
          <p className="text-gray-400 mb-6">Inicia sesión para ver tus grupos favoritos</p>
          <Link to="/login">
            <Button variant="primary" className="flex items-center gap-2">
              <LogIn className="w-4 h-4" />
              Iniciar Sesión
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const favorites = data?.favoriteGroups?.content || [];
  const total = data?.favoriteGroups?.totalElements || 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-red-400 mb-4">Error al cargar grupos favoritos</p>
          <p className="text-gray-400 text-sm mt-2">{error.message}</p>
          <Button onClick={() => refetch()} variant="outline" className="mt-4">
            Intentar nuevamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
            <Heart className="w-8 h-8 text-pink-400" />
            Grupos Favoritos
          </h1>
          <p className="text-gray-400 mt-2">
            {total} grupo{total !== 1 ? 's' : ''} en tu lista de favoritos
          </p>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">No tienes grupos favoritos</p>
            <p className="text-gray-500 text-sm">
              Explora grupos y haz clic en el corazón para añadirlos a tus favoritos
            </p>
            <Link to="/groups">
              <Button variant="outline" className="mt-4">
                Explorar Grupos
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((group: MusicGroup) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default FavoriteGroupsPage;
