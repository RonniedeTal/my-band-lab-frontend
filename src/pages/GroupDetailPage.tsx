import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_GROUP_BY_ID } from '../graphql/queries/group.queries';
import { ADD_MEMBER_TO_GROUP, DELETE_MUSIC_GROUP } from '../graphql/mutations/group.mutations';
import { Button } from '../components/ui/Button';
import { ManageMembers } from '../components/ManageMembers';
import {
  ArrowLeft,
  Users,
  Calendar,
  Music,
  CheckCircle,
  UserPlus,
  Trash2,
  Edit,
  Heart,
  UserCheck,
  Play,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../context/NotificationContext';
import { useFollowGroup } from '../hooks/useFollowGroup';
import { useFavoriteGroup } from '../hooks/useFavoriteGroup';
import { LogoUploader } from '../components/LogoUploader';
import { SongUploader } from '../components/SongUploader';
import { AlbumList } from '@/components/AlbumList';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { Song } from '@/types/song.types';
import { TopSongs } from '../components/TopSongs';
import { useTopSongsByGroup } from '../hooks/useSongPlay';
import { AddToPlaylistButton } from '../components/AddToPlaylistButton';

export const GroupDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { success, error: showError, info } = useNotification();

  const { playSong } = useAudioPlayer();

  const { data, loading, error, refetch } = useQuery(GET_GROUP_BY_ID, {
    variables: { id: parseInt(id || '0') },
    skip: !id,
  });

  const [addMember, { loading: addingMember }] = useMutation(ADD_MEMBER_TO_GROUP);
  const [deleteGroup, { loading: deletingGroup }] = useMutation(DELETE_MUSIC_GROUP);

  // Obtener el grupo antes de los hooks condicionales
  const group = data?.musicGroupById;

  // Mover hooks AQUÍ, antes de cualquier return condicional
  const { isFollowing, toggleFollow } = useFollowGroup(group?.id as number);
  const { isFavorite, toggleFavorite } = useFavoriteGroup(group?.id as number);

  const { topSongs, loading: topSongsLoading } = useTopSongsByGroup(group?.id as number, 5);

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
          <p className="text-gray-400 text-sm">{error?.message || 'Grupo no encontrado'}</p>
          <Button onClick={() => navigate('/groups')} variant="outline" className="mt-4">
            Volver a grupos
          </Button>
        </div>
      </div>
    );
  }

  const isFounder = user?.id === group.founder?.id;
  const isMember = group.members?.some(
    (member: { id: number; name: string; surname: string; email: string }) => member.id === user?.id
  );

  const songsWithGroupInfo =
    group.songs?.map((song: Song) => ({
      ...song,
      groupName: group.name,
      groupId: group.id,
      coverImage: group.logoUrl,
    })) || [];

  const handleJoinGroup = async () => {
    if (!user) {
      info('Inicia sesión', 'Debes iniciar sesión para unirte al grupo');
      navigate('/login');
      return;
    }

    try {
      await addMember({
        variables: {
          groupId: parseInt(id!),
          userId: user.id,
        },
      });
      refetch();
      success('¡Te has unido!', `Ahora eres miembro de ${group.name}`);
    } catch (err) {
      console.error('Error joining group:', err);
      showError('Error', 'No se pudo unir al grupo. Intenta nuevamente.');
    }
  };

  const handleDeleteGroup = async () => {
    if (
      !confirm(
        '¿Estás seguro de que quieres eliminar este grupo? Esta acción no se puede deshacer.'
      )
    )
      return;

    try {
      await deleteGroup({
        variables: { id: parseInt(id!) },
      });
      success('Grupo eliminado', `El grupo "${group.name}" ha sido eliminado exitosamente`);
      navigate('/groups');
    } catch (err) {
      console.error('Error deleting group:', err);
      showError('Error', 'No se pudo eliminar el grupo');
    }
  };

  const handleEditGroup = () => {
    navigate(`/groups/${id}/edit`);
  };

  const memberCount = group.members?.length || 0;

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="container mx-auto px-4 py-8">
        <Button onClick={() => navigate('/groups')} variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a grupos
        </Button>

        {/* Hero Section */}

        <div className="bg-gradient-to-r from-purple-900/50 via-pink-900/50 to-blue-900/50 rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              {/* Logo del grupo - solo visible para el fundador */}
              {isFounder && (
                <LogoUploader
                  currentLogoUrl={group.logoUrl}
                  entityId={group.id}
                  entityType="group"
                  onLogoUploaded={() => {
                    refetch();
                  }}
                  onError={(errorMsg) => {
                    console.error('Error al subir logo:', errorMsg);
                  }}
                />
              )}

              {/* Si no es fundador pero hay logo, mostrarlo */}
              {!isFounder && group.logoUrl && (
                <img
                  src={group.logoUrl}
                  alt={`${group.name} logo`}
                  className="w-20 h-20 rounded-lg object-cover border-2 border-purple-500"
                />
              )}

              {/* Si no es fundador y no hay logo, mostrar icono por defecto */}
              {!isFounder && !group.logoUrl && (
                <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <Music className="w-10 h-10 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-3xl md:text-4xl font-bold text-white">{group.name}</h1>
                {group.verified && (
                  <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white text-sm font-medium flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Verificado
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-3 mb-4">
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm flex items-center gap-1">
                  <Music className="w-3 h-3" />
                  {group.genre}
                </span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {memberCount} {memberCount === 1 ? 'miembro' : 'miembros'}
                </span>
                {group.formedDate && (
                  <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Formado en {new Date(group.formedDate).getFullYear()}
                  </span>
                )}
              </div>

              <p className="text-gray-300">
                Fundado por {group.founder?.name} {group.founder?.surname}
              </p>
            </div>

            <div className="flex gap-3 flex-wrap">
              {/* Botones de seguir y favorito - para usuarios autenticados */}
              {user && !isFounder && (
                <>
                  <button
                    onClick={toggleFollow}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      isFollowing
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90'
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck className="w-4 h-4" />
                        Siguiendo
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        Seguir
                      </>
                    )}
                  </button>

                  <button
                    onClick={toggleFavorite}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      isFavorite
                        ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                        : 'bg-gray-700/50 text-gray-300 hover:text-pink-400 hover:bg-pink-500/10'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-pink-400' : ''}`} />
                    {isFavorite ? 'Favorito' : 'Añadir'}
                  </button>
                </>
              )}

              {/* Unirse al grupo - solo si no es miembro ni fundador */}
              {!isMember && !isFounder && (
                <Button
                  onClick={handleJoinGroup}
                  variant="primary"
                  disabled={addingMember}
                  className="flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  {addingMember ? 'Uniendo...' : 'Unirse al Grupo'}
                </Button>
              )}

              {/* Botones solo para fundador */}
              {isFounder && (
                <>
                  <Button
                    onClick={handleEditGroup}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </Button>
                  <Button
                    onClick={handleDeleteGroup}
                    variant="outline"
                    disabled={deletingGroup}
                    className="flex items-center gap-2 border-red-500 text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                    {deletingGroup ? 'Eliminando...' : 'Eliminar'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Descripción y Miembros */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-gray-800/30 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Descripción</h2>
              <p className="text-gray-300 leading-relaxed">
                {group.description || 'No hay descripción disponible para este grupo.'}
              </p>
            </div>
            {/* Subir canciones - solo para fundadores verificados */}
            {isFounder && group.verified && (
              <SongUploader
                entityId={group.id}
                entityType="group"
                onSongUploaded={() => {
                  refetch();
                }}
              />
            )}

            {/* Lista de canciones */}
            {group.songs && group.songs.length > 0 && (
              <div className="bg-gray-800/30 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <Music className="w-5 h-5" />
                  Canciones ({group.songs.length})
                </h2>
                <div className="space-y-3">
                  {group.songs.map((song: Song) => (
                    <div
                      key={song.id}
                      onClick={() =>
                        playSong(
                          {
                            ...song,
                            groupName: group.name,
                            groupId: group.id,
                            coverImage: group.logoUrl,
                          },
                          songsWithGroupInfo
                        )
                      }
                      className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors group"
                    >
                      <div className="flex-1">
                        <p className="text-white font-medium">{song.title}</p>
                        <p className="text-xs text-gray-400">
                          {Math.floor(song.duration / 60)}:
                          {(song.duration % 60).toString().padStart(2, '0')} • {song.playCount}{' '}
                          reproducciones
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <AddToPlaylistButton songId={song.id} songTitle={song.title} />

                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="w-5 h-5 text-purple-400" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Top Canciones */}
            <TopSongs
              songs={topSongs}
              entityType="group"
              entityName={group?.name}
              loading={topSongsLoading}
            />

            {/* ÁLBUMES - DENTRO de la columna izquierda */}
            {group.albums && group.albums.length > 0 && (
              <div className="bg-gray-800/30 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Álbumes</h2>
                <AlbumList
                  albums={group.albums}
                  songs={group.songs}
                  entityId={group.id}
                  entityType="group"
                  onAlbumCreated={() => refetch()}
                  onSongAddedToAlbum={() => refetch()}
                  isOwner={isFounder}
                  entityName={group.name}
                  entityImage={group.logoUrl}
                />
              </div>
            )}
          </div>

          {/* Miembros - solo el fundador puede gestionar */}
          <div className="bg-gray-800/30 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Miembros ({memberCount})
            </h2>

            {isFounder ? (
              <ManageMembers
                groupId={parseInt(id!)}
                currentMembers={group.members}
                founderId={group.founder.id}
                onMemberChange={() => {
                  refetch();
                  success('Miembros actualizados', 'La lista de miembros ha sido actualizada');
                }}
              />
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {group.members?.map(
                  (member: { id: number; name: string; surname: string; email: string }) => (
                    <div
                      key={member.id}
                      className="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg"
                    >
                      <div>
                        <p className="text-white font-medium">
                          {member.name} {member.surname}
                        </p>
                        <p className="text-xs text-gray-400">{member.email}</p>
                      </div>
                      {member.id === group.founder?.id && (
                        <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded-full">
                          Fundador
                        </span>
                      )}
                    </div>
                  )
                )}

                {memberCount === 0 && (
                  <p className="text-gray-400 text-center py-4">No hay miembros aún</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetailPage;
