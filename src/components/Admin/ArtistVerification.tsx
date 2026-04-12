import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_UNVERIFIED_ARTISTS } from '../../graphql/queries/admin.queries';
import { VERIFY_ARTIST } from '../../graphql/mutations/admin.mutations';
import { Button } from '../ui/Button';
import { useNotification } from '../../context/NotificationContext';
import { CheckCircle, XCircle, Music, Search } from 'lucide-react'; // Eliminado User y Calendar

interface ArtistType {
  id: number;
  stageName: string;
  biography: string;
  genre: string;
  verified: boolean;
  user: {
    id: number;
    name: string;
    surname: string;
    email: string;
  };
  instruments: Array<{ id: number; name: string }>;
  createdAt: string;
}

export const ArtistVerification: React.FC = () => {
  const { success, error: showError } = useNotification();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [selectedArtist, setSelectedArtist] = useState<ArtistType | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const { data, loading, error, refetch } = useQuery(GET_UNVERIFIED_ARTISTS, {
    variables: { page, size: 10 },
  });

  const [verifyArtist] = useMutation(VERIFY_ARTIST);

  const artists = data?.unverifiedArtists?.content || [];
  const totalPages = data?.unverifiedArtists?.totalPages || 0;

  const filteredArtists = artists.filter(
    (artist: ArtistType) =>
      artist.stageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artist.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artist.user.surname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVerify = async (id: number, stageName: string) => {
    try {
      await verifyArtist({
        variables: { id },
      });
      success('Artista verificado', `${stageName} ha sido verificado exitosamente`);
      refetch();
    } catch {
      // Error manejado silenciosamente
      showError('Error', 'No se pudo verificar el artista');
    }
  };

  const handleViewDetails = (artist: ArtistType) => {
    setSelectedArtist(artist);
    setShowDetailModal(true);
  };

  if (loading && artists.length === 0) {
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
          <p className="text-red-400">Error al cargar artistas pendientes</p>
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
            placeholder="Buscar por nombre artístico o artista..."
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 text-white"
          />
        </div>
      </div>

      {/* Lista de artistas */}
      {filteredArtists.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <p className="text-green-400 text-lg">No hay artistas pendientes de verificación</p>
            <p className="text-gray-400 text-sm mt-2">Todos los artistas han sido verificados</p>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {filteredArtists.map((artist: ArtistType) => (
              <div
                key={artist.id}
                className="bg-gray-800/30 border border-gray-700 rounded-lg p-4 hover:border-purple-500/50 transition-all"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                        <Music className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{artist.stageName}</h3>
                        <p className="text-sm text-gray-400">
                          {artist.user.name} {artist.user.surname} • {artist.genre}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm line-clamp-2 mb-2">
                      {artist.biography || 'Sin biografía'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {artist.instruments.slice(0, 3).map((inst) => (
                        <span
                          key={inst.id}
                          className="text-xs px-2 py-1 bg-gray-700 rounded-full text-gray-300"
                        >
                          {inst.name}
                        </span>
                      ))}
                      {artist.instruments.length > 3 && (
                        <span className="text-xs px-2 py-1 bg-gray-700 rounded-full text-gray-300">
                          +{artist.instruments.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={() => handleViewDetails(artist)} variant="outline" size="sm">
                      Ver detalles
                    </Button>
                    <Button
                      onClick={() => handleVerify(artist.id, artist.stageName)}
                      variant="primary"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Verificar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <Button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                variant="outline"
                size="sm"
              >
                ← Anterior
              </Button>
              <span className="text-gray-300">
                Página {page + 1} de {totalPages}
              </span>
              <Button
                onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                disabled={page + 1 >= totalPages}
                variant="outline"
                size="sm"
              >
                Siguiente →
              </Button>
            </div>
          )}
        </>
      )}

      {/* Modal de detalles */}
      {showDetailModal && selectedArtist && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-semibold text-white">Detalles del Artista</h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-400">Nombre Artístico</h4>
                <p className="text-white text-lg">{selectedArtist.stageName}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-400">Información del Usuario</h4>
                <p className="text-white">
                  {selectedArtist.user.name} {selectedArtist.user.surname}
                </p>
                <p className="text-gray-400 text-sm">{selectedArtist.user.email}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-400">Género</h4>
                <p className="text-white">{selectedArtist.genre}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-400">Biografía</h4>
                <p className="text-gray-300">{selectedArtist.biography || 'No hay biografía'}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-400">Instrumentos</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedArtist.instruments.map((inst) => (
                    <span
                      key={inst.id}
                      className="px-2 py-1 bg-gray-700 rounded-full text-gray-300 text-sm"
                    >
                      {inst.name}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-400">Fecha de registro</h4>
                <p className="text-white">
                  {new Date(selectedArtist.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => {
                    handleVerify(selectedArtist.id, selectedArtist.stageName);
                    setShowDetailModal(false);
                  }}
                  variant="primary"
                  className="flex-1"
                >
                  Verificar Artista
                </Button>
                <Button
                  onClick={() => setShowDetailModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cerrar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
