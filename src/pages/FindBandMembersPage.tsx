import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Music, MapPin, Users, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { LookingForBandBadge } from '../components/LookingForBandBadge';

// Actualiza la interfaz Artist para reflejar los tipos reales del backend
interface Artist {
  id: number;
  stageName: string;
  genre: string | { name: string; id?: number };
  city: string | null;
  country: string | null;
  instruments: Array<{ id: number; name: string }>;
  lookingForBand: boolean;
  profileImageUrl?: string | null;
  verified?: boolean;
}

export const FindBandMembersPage: React.FC = () => {
  const { token } = useAuth();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllArtists();
  }, []);

  const getGenreName = (genre: string | { name: string } | undefined): string => {
    if (!genre) return 'No especificado';
    if (typeof genre === 'string') return genre;
    if (typeof genre === 'object' && genre.name) return genre.name;
    return 'No especificado';
  };

  const getInstrumentName = (instrument: any): string => {
    if (!instrument) return 'Instrumento';
    if (typeof instrument === 'string') return instrument;
    if (typeof instrument === 'object' && instrument.name) return instrument.name;
    return 'Instrumento';
  };

  const fetchAllArtists = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/artists', {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Verificar el tipo de contenido
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Respuesta no JSON:', text.substring(0, 500));
        throw new Error('El servidor no devolvió JSON válido');
      }

      const allArtists = await response.json();
      console.log('Artistas recibidos:', allArtists);

      // Verificar que allArtists es un array
      if (!Array.isArray(allArtists)) {
        console.error('La respuesta no es un array:', allArtists);
        throw new Error('Formato de respuesta inválido');
      }

      // Filtrar los que buscan banda
      const lookingForBand = allArtists.filter((artist: any) => {
        const isLooking = artist.lookingForBand === true || artist.isLookingForBand === true;
        return isLooking;
      });

      console.log(`Artistas buscando banda: ${lookingForBand.length}`);
      setArtists(lookingForBand);
    } catch (err: any) {
      console.error('Error detallado:', err);
      setError(err.message || 'Error al cargar artistas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400">Error al cargar: {error}</p>
        <button
          onClick={fetchAllArtists}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Músicos que Buscan Banda
            </h1>
            <p className="text-gray-400 text-lg">
              Conecta con artistas que están buscando formar o unirse a una banda
            </p>
          </div>

          {artists.length === 0 ? (
            <div className="text-center py-20 bg-gray-800/30 rounded-xl">
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No hay músicos buscando banda en este momento</p>
              <p className="text-gray-500 text-sm mt-2">
                ¡Vuelve más tarde o activa tu propio estado!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artists.map((artist) => (
                <Link
                  key={artist.id}
                  to={`/artists/${artist.id}`}
                  className="bg-gray-800/50 rounded-xl p-6 hover:bg-gray-800/70 transition-all hover:transform hover:scale-105 duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    {artist.profileImageUrl ? (
                      <img
                        src={artist.profileImageUrl}
                        alt={artist.stageName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                        <Music className="w-6 h-6 text-white" />
                      </div>
                    )}
                    <LookingForBandBadge size="sm" />
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-2">{artist.stageName}</h3>

                  <p className="text-gray-400 text-sm mb-3">Género: {getGenreName(artist.genre)}</p>

                  {artist.city && (
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>
                        {artist.city}, {artist.country || ''}
                      </span>
                    </div>
                  )}

                  {artist.instruments && artist.instruments.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {artist.instruments.slice(0, 3).map((instrument, idx) => (
                        <span
                          key={idx}
                          className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-full"
                        >
                          {getInstrumentName(instrument)}
                        </span>
                      ))}
                      {artist.instruments.length > 3 && (
                        <span className="text-gray-500 text-xs">
                          +{artist.instruments.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindBandMembersPage;
