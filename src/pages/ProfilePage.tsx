import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useQuery } from '@apollo/client';
import { GET_USER_ARTIST } from '../graphql/queries/user.queries';
import { CreateArtistForm } from '../components/CreateArtistForm';
import { EditProfileForm } from '../components/EditProfileForm';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { User, Edit, Music, Mail, Calendar, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { ImageUploader } from '@/components/ImageUploader';
import { UserPlaylists } from '../components/UserPlaylists';
import { LookingForBandToggle } from '../components/LookingForBandToggle';
import { LookingForBandBadge } from '@/components/LookingForBandBadge';
import { InstrumentMultiSelect } from '../components/InstrumentMultiSelect';
import { Instrument } from '@/types';
import { useInstruments } from '../hooks/useInstruments';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { instruments, loading: instrumentsLoading } = useInstruments();
  const [isEditing, setIsEditing] = useState(false);
  const [showInstrumentSelector, setShowInstrumentSelector] = useState(false);
  const [selectedInstruments, setSelectedInstruments] = useState<number[]>([]);
  // const [instruments, setInstruments] = useState<Instrument[]>([]);

  const { data, loading, refetch } = useQuery(GET_USER_ARTIST, {
    variables: { userId: user?.id },
    skip: !user?.id,
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      console.log('Datos recibidos:', data);
      console.log('Artist:', data?.artistByUserId);
    },
    onError: (error) => {
      console.error('Error en query:', error);
    },
  });

  // useEffect(() => {
  //   fetch('/api/instruments')
  //     .then((res) => res.json())
  //     .then(setInstruments)
  //     .catch(console.error);
  // }, []);

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400">Debes iniciar sesión para ver tu perfil</p>
        <Link to="/login">
          <Button variant="primary" className="mt-4">
            Iniciar Sesión
          </Button>
        </Link>
      </div>
    );
  }

  const hasArtist = data?.artistByUserId;

  // Función para actualizar después del toggle
  const handleToggleChange = () => {
    console.log('Toggle cambió, refrescando datos del artista...');
    // Refrescar los datos del artista para obtener el nuevo estado
    refetch();
  };
  useEffect(() => {
    console.log('hasArtist:', hasArtist);
    console.log('lookingForInstruments:', hasArtist?.lookingForInstruments);

    if (hasArtist?.lookingForInstruments && hasArtist.lookingForInstruments.length > 0) {
      const ids = hasArtist.lookingForInstruments.map((inst: { id: number }) => inst.id);
      setSelectedInstruments(ids);
      console.log('IDs cargados:', ids);
    } else {
      setSelectedInstruments([]);
    }
  }, [hasArtist]);

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-8">
            Mi Perfil
          </h1>

          {isEditing ? (
            <div className="bg-gray-800/30 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Editar Perfil</h2>
              <EditProfileForm
                onSuccess={() => {
                  setIsEditing(false);
                  window.location.reload();
                }}
                onCancel={() => setIsEditing(false)}
              />
            </div>
          ) : (
            <>
              {/* Información del usuario */}
              <div className="bg-gray-800/30 rounded-xl p-6 mb-8">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Información Personal
                  </h2>
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Editar Perfil
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-center mb-4">
                    <ImageUploader
                      currentImageUrl={user.profileImageUrl}
                      onImageUploaded={(newImageUrl) => {
                        const updatedUser = { ...user, profileImageUrl: newImageUrl };
                        localStorage.setItem('user', JSON.stringify(updatedUser));
                        window.location.reload();
                      }}
                      onError={(errorMsg) => {
                        console.error('Error al subir imagen:', errorMsg);
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    {user.profileImageUrl ? (
                      <img
                        src={user.profileImageUrl}
                        alt="Profile"
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">
                          {user.name.charAt(0)}
                          {user.surname.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="text-white text-lg font-semibold">
                        {user.name} {user.surname}
                      </p>
                      <p className="text-gray-400 text-sm">{user.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-gray-300">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-300">
                    <Calendar className="w-4 h-4" />
                    <span>Miembro desde {new Date().getFullYear()}</span>
                  </div>
                </div>
              </div>

              {/* Sección de Artista */}
              <div className="bg-gray-800/30 rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Music className="w-5 h-5" />
                  Perfil de Artista
                </h2>

                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                  </div>
                ) : hasArtist ? (
                  <div>
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-4">
                      <p className="text-green-400 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />✓ Ya tienes un perfil de artista
                      </p>
                      {hasArtist.isLookingForBand && <LookingForBandBadge size="sm" />}
                    </div>
                    <div className="space-y-2">
                      <p>
                        <span className="text-gray-400">Nombre artístico:</span>{' '}
                        {hasArtist.stageName}
                      </p>
                      <p>
                        <span className="text-gray-400">Género:</span> {hasArtist.genre}
                      </p>
                      <p>
                        <span className="text-gray-400">Verificado:</span>{' '}
                        {hasArtist.verified ? 'Sí' : 'Pendiente'}
                      </p>
                      <Link to={`/artists/${hasArtist.id}`}>
                        <Button variant="outline" className="mt-4">
                          Ver mi perfil público
                        </Button>
                      </Link>
                    </div>

                    <LookingForBandToggle
                      value={hasArtist.isLookingForBand === true}
                      onChange={handleToggleChange}
                    />

                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-white font-medium flex items-center gap-2">
                          <Music className="w-4 h-4" />
                          Instrumentos que puedo tocar
                        </h4>
                        <button
                          onClick={() => setShowInstrumentSelector(!showInstrumentSelector)}
                          className="text-sm text-purple-400 hover:text-purple-300"
                        >
                          {showInstrumentSelector
                            ? 'Cancelar'
                            : selectedInstruments.length > 0
                              ? 'Editar'
                              : 'Agregar'}
                        </button>
                      </div>

                      {showInstrumentSelector ? (
                        <InstrumentMultiSelect
                          selectedInstrumentIds={selectedInstruments}
                          onSave={(ids) => {
                            setSelectedInstruments(ids);
                            setShowInstrumentSelector(false);
                            refetch();
                          }}
                          onCancel={() => setShowInstrumentSelector(false)}
                        />
                      ) : instrumentsLoading ? (
                        <div className="flex justify-center py-4">
                          <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {selectedInstruments.length > 0 ? (
                            selectedInstruments.map((id) => {
                              const instrument = instruments.find((i: Instrument) => i.id === id);
                              return instrument ? (
                                <span
                                  key={id}
                                  className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm"
                                >
                                  {instrument.name}
                                </span>
                              ) : null;
                            })
                          ) : (
                            <p className="text-gray-500 text-sm">
                              No has seleccionado ningún instrumento. Haz clic en "Agregar" para
                              indicar qué instrumentos puedes tocar.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-4">
                      <p className="text-yellow-400 flex items-center gap-2">
                        <XCircle className="w-4 h-4" />
                        ⚠️ Aún no tienes un perfil de artista
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        Crea tu perfil para compartir tu música
                      </p>
                    </div>
                    <CreateArtistForm onSuccess={() => refetch()} />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <div className="bg-gray-800/30 rounded-xl p-6 mt-8">
        <UserPlaylists limit={4} />
      </div>
    </div>
  );
};
export default ProfilePage;
