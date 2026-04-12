import React from 'react';
import { Link } from 'react-router-dom';
import { GroupList } from '../components/GroupList';
import { Button } from '../components/ui/Button';
import { Plus } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const GroupsPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Grupos Musicales
            </h1>
            <p className="text-gray-400 mt-2">Encuentra bandas, únete o crea la tuya propia</p>
          </div>

          {user && (
            <Link to="/groups/create">
              <Button variant="primary" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Crear Grupo
              </Button>
            </Link>
          )}
        </div>

        {/* Lista de grupos */}
        <GroupList />
      </div>
    </div>
  );
};
export default GroupsPage;
