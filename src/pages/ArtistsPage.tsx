import React from 'react';
import { ArtistList } from '../components/ArtistList';

export const ArtistsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Header con gradiente */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Artistas Destacados
          </h1>
          <p className="text-gray-400 text-lg">Explora y descubre nuevos talentos musicales</p>
        </div>

        {/* Lista de artistas */}
        <ArtistList />
      </div>
    </div>
  );
};
export default ArtistsPage;
