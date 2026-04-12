import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useArtists } from '../hooks/useArtists';
import { useGroups } from '../hooks/useGroups';
import { ArtistCard } from '../components/ArtistCard';
import { GroupCard } from '../components/GroupCard';
import { Button } from '../components/ui/Button';
import { Users, Music, TrendingUp, Sparkles } from 'lucide-react';

export const ExplorePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'artists' | 'groups'>('artists');

  const { artists, loading: loadingArtists } = useArtists({ page: 0, size: 6 });
  const { groups, loading: loadingGroups } = useGroups({ page: 0, size: 6 });

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Explorar
          </h1>
          <p className="text-gray-400 mt-2">Descubre nuevos artistas y grupos musicales</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab('artists')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all duration-200 ${
              activeTab === 'artists'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-gray-800/50 text-gray-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            Artistas
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all duration-200 ${
              activeTab === 'groups'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-gray-800/50 text-gray-400 hover:text-white'
            }`}
          >
            <Music className="w-4 h-4" />
            Grupos
          </button>
        </div>

        {/* Contenido */}
        {activeTab === 'artists' ? (
          <>
            {loadingArtists ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {artists.slice(0, 6).map((artist) => (
                    <ArtistCard key={artist.id} artist={artist} />
                  ))}
                </div>
                <div className="text-center mt-8">
                  <Link to="/artists">
                    <Button variant="outline">Ver todos los artistas →</Button>
                  </Link>
                </div>
              </>
            )}
          </>
        ) : (
          <>
            {loadingGroups ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groups.slice(0, 6).map((group) => (
                    <GroupCard key={group.id} group={group} />
                  ))}
                </div>
                <div className="text-center mt-8">
                  <Link to="/groups">
                    <Button variant="outline">Ver todos los grupos →</Button>
                  </Link>
                </div>
              </>
            )}
          </>
        )}

        {/* Sección de destacados */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-semibold text-white">Tendencias</h2>
          </div>
          <div className="bg-gradient-to-r from-purple-900/30 via-pink-900/30 to-blue-900/30 rounded-2xl p-8 text-center">
            <TrendingUp className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <p className="text-gray-300">Próximamente: Artistas y grupos más populares</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ExplorePage;
