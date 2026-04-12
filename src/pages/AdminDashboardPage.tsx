import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { Users, Music, UserCheck, Shield, Activity, CheckCircle, Clock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { UserManagement } from '../components/Admin/UserManagement';
import { ArtistVerification } from '../components/Admin/ArtistVerification';
import { GroupVerification } from '../components/Admin/GroupVerification';

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'artists' | 'groups'>(
    'overview'
  );

  // Verificar si es admin
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/admin/login" replace />;
  }

  const stats = [
    { title: 'Usuarios Totales', value: '0', icon: Users, color: 'bg-blue-500' },
    { title: 'Artistas', value: '0', icon: Music, color: 'bg-purple-500' },
    { title: 'Grupos', value: '0', icon: Users, color: 'bg-pink-500' },
    { title: 'Verificaciones Pendientes', value: '0', icon: Clock, color: 'bg-yellow-500' },
  ];

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Panel de Administración
          </h1>
          <p className="text-gray-400 mt-2">
            Bienvenido, {user.name} {user.surname}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.title} className="bg-gray-800/30 rounded-xl p-6 border border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">{stat.value}</span>
              </div>
              <h3 className="text-gray-400">{stat.title}</h3>
            </div>
          ))}
        </div>

        {/* Tabs de navegación */}
        <div className="flex gap-2 border-b border-gray-700 mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'overview'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4 inline mr-2" />
            Resumen
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'users'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Usuarios
          </button>
          <button
            onClick={() => setActiveTab('artists')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'artists'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Music className="w-4 h-4 inline mr-2" />
            Artistas
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'groups'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Grupos
          </button>
        </div>

        {/* Contenido según tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-gray-800/30 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Actividad Reciente</h2>
              <div className="text-center py-8 text-gray-400">
                <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Cargando actividad reciente...</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-800/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-green-400" />
                  Verificaciones Pendientes
                </h3>
                <div className="text-center py-8 text-gray-400">
                  <p>No hay verificaciones pendientes</p>
                </div>
              </div>

              <div className="bg-gray-800/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-400" />
                  Acciones Rápidas
                </h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Verificar Artistas Pendientes
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Verificar Grupos Pendientes
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="w-4 h-4 mr-2" />
                    Gestionar Usuarios
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-gray-800/30 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Gestión de Usuarios</h2>
            <UserManagement />
          </div>
        )}

        {activeTab === 'artists' && (
          <div className="bg-gray-800/30 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Music className="w-5 h-5" />
              Verificar Artistas Pendientes
            </h2>
            <ArtistVerification />
          </div>
        )}

        {activeTab === 'groups' && (
          <div className="bg-gray-800/30 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Gestión de Grupos</h2>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Verificar Grupos Pendientes
            </h2>
            <GroupVerification />
          </div>
        )}
      </div>
    </div>
  );
};
export default AdminDashboardPage;
