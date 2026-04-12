import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useQuery } from '@apollo/client';
import { GET_FAVORITE_ARTISTS, GET_FAVORITE_GROUPS } from '../graphql/queries/follow.queries';
import { ArtistCard } from '../components/ArtistCard';
import { GroupCard } from '../components/GroupCard';
import { Button } from '../components/ui/Button';
import { Heart, LogIn, Users, Music } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Artist } from '../types/artist.types';
import type { MusicGroup } from '../types/group.types';

type TabType = 'artists' | 'groups';

export const FavoritesPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('artists');

  // Query para artistas favoritos
  const {
    data: artistsData,
    loading: loadingArtists,
    error: artistsError,
    refetch: refetchArtists,
  } = useQuery(GET_FAVORITE_ARTISTS, {
    variables: { userId: user?.id, page: 0, size: 20 },
    skip: !user?.id,
    fetchPolicy: 'network-only',
  });

  // Query para grupos favoritos
  const {
    data: groupsData,
    loading: loadingGroups,
    error: groupsError,
    refetch: refetchGroups,
  } = useQuery(GET_FAVORITE_GROUPS, {
    variables: { userId: user?.id, page: 0, size: 20 },
    skip: !user?.id,
    fetchPolicy: 'network-only',
  });

  const favoriteArtists = artistsData?.favoriteArtists?.content || [];
  const totalArtists = artistsData?.favoriteArtists?.totalElements || 0;

  const favoriteGroups = groupsData?.favoriteGroups?.content || [];
  const totalGroups = groupsData?.favoriteGroups?.totalElements || 0;

  // Logs para depuración (en la consola, no en el JSX)
  useEffect(() => {
    console.log('=== FAVORITES DEBUG ===');
    console.log('Active Tab:', activeTab);
    console.log('favoriteArtists:', favoriteArtists.length);
    console.log('favoriteGroups:', favoriteGroups.length);
    console.log('favoriteGroups data:', favoriteGroups);
  }, [activeTab, favoriteArtists, favoriteGroups]);

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Tus Favoritos</h1>
          <p className="text-gray-400 mb-6">Inicia sesión para ver tus favoritos</p>
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

  const isLoading =
    (activeTab === 'artists' && loadingArtists) || (activeTab === 'groups' && loadingGroups);

  if (
    isLoading &&
    (activeTab === 'artists' ? favoriteArtists.length === 0 : favoriteGroups.length === 0)
  ) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
            <Heart className="w-8 h-8 text-pink-400" />
            Mis Favoritos
          </h1>
          <p className="text-gray-400 mt-2">{totalArtists + totalGroups} favoritos en total</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-700 mb-6">
          <button
            onClick={() => {
              console.log('🖱️ Click en pestaña ARTISTAS');
              setActiveTab('artists');
            }}
            className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
              activeTab === 'artists'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            Artistas
            {totalArtists > 0 && (
              <span className="text-xs bg-gray-700 px-1.5 py-0.5 rounded-full">{totalArtists}</span>
            )}
          </button>
          <button
            onClick={() => {
              console.log('🖱️ Click en pestaña GRUPOS');
              setActiveTab('groups');
            }}
            className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
              activeTab === 'groups'
                ? 'text-purple-400 border-b-2 border-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Music className="w-4 h-4" />
            Grupos
            {totalGroups > 0 && (
              <span className="text-xs bg-gray-700 px-1.5 py-0.5 rounded-full">{totalGroups}</span>
            )}
          </button>
        </div>

        {/* Contenido - Artistas */}
        {activeTab === 'artists' && (
          <div className="min-h-[400px]">
            {artistsError ? (
              <div className="text-center py-20">
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md mx-auto">
                  <p className="text-red-400 mb-4">Error al cargar artistas favoritos</p>
                  <p className="text-gray-400 text-sm">{artistsError.message}</p>
                  <Button onClick={() => refetchArtists()} variant="outline" className="mt-4">
                    Intentar nuevamente
                  </Button>
                </div>
              </div>
            ) : favoriteArtists.length === 0 ? (
              <div className="text-center py-20">
                <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg mb-2">No tienes artistas favoritos</p>
                <p className="text-gray-500 text-sm">
                  Explora artistas y haz clic en el corazón para añadirlos a tus favoritos
                </p>
                <Link to="/artists">
                  <Button variant="outline" className="mt-4">
                    Explorar Artistas
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteArtists.map((artist: Artist) => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Contenido - Grupos */}
        {activeTab === 'groups' && (
          <div className="min-h-[400px]">
            {groupsError ? (
              <div className="text-center py-20">
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md mx-auto">
                  <p className="text-red-400 mb-4">Error al cargar grupos favoritos</p>
                  <p className="text-gray-400 text-sm">{groupsError.message}</p>
                  <Button onClick={() => refetchGroups()} variant="outline" className="mt-4">
                    Intentar nuevamente
                  </Button>
                </div>
              </div>
            ) : favoriteGroups.length === 0 ? (
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
                {favoriteGroups.map((group: MusicGroup) => (
                  <GroupCard key={group.id} group={group} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default FavoritesPage;
