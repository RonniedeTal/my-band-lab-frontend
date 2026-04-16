import { useMutation, useQuery } from '@apollo/client';
import {
  GET_MY_PLAYLISTS,
  GET_PUBLIC_PLAYLISTS,
  GET_PLAYLIST_BY_ID,
  GET_PLAYLIST_SONGS,
  SEARCH_PUBLIC_PLAYLISTS,
} from '../graphql/queries/playlist.queries';
import {
  CREATE_PLAYLIST,
  UPDATE_PLAYLIST,
  DELETE_PLAYLIST,
  ADD_SONG_TO_PLAYLIST,
  REMOVE_SONG_FROM_PLAYLIST,
  REORDER_PLAYLIST_SONGS,
} from '../graphql/mutations/playlist.mutations';

// ========== QUERIES HOOKS ==========

export const useMyPlaylists = (page: number = 0, size: number = 10) => {
  const { data, loading, error, refetch } = useQuery(GET_MY_PLAYLISTS, {
    variables: { page, size },
    fetchPolicy: 'cache-and-network',
  });

  return {
    playlists: data?.myPlaylists?.content || [],
    pagination: {
      totalElements: data?.myPlaylists?.totalElements || 0,
      totalPages: data?.myPlaylists?.totalPages || 0,
      currentPage: data?.myPlaylists?.currentPage || 0,
      hasNext: data?.myPlaylists?.hasNext || false,
      hasPrevious: data?.myPlaylists?.hasPrevious || false,
    },
    loading,
    error,
    refetch,
  };
};

export const usePublicPlaylists = (page: number = 0, size: number = 10) => {
  const { data, loading, error, refetch } = useQuery(GET_PUBLIC_PLAYLISTS, {
    variables: { page, size },
    fetchPolicy: 'cache-and-network',
  });

  return {
    playlists: data?.publicPlaylists?.content || [],
    pagination: {
      totalElements: data?.publicPlaylists?.totalElements || 0,
      totalPages: data?.publicPlaylists?.totalPages || 0,
      currentPage: data?.publicPlaylists?.currentPage || 0,
      hasNext: data?.publicPlaylists?.hasNext || false,
      hasPrevious: data?.publicPlaylists?.hasPrevious || false,
    },
    loading,
    error,
    refetch,
  };
};

export const usePlaylistById = (id: number) => {
  const { data, loading, error, refetch } = useQuery(GET_PLAYLIST_BY_ID, {
    variables: { id: id.toString() },
    skip: !id,
  });

  return {
    playlist: data?.playlistById,
    loading,
    error,
    refetch,
  };
};

export const usePlaylistSongs = (playlistId: number) => {
  const { data, loading, error, refetch } = useQuery(GET_PLAYLIST_SONGS, {
    variables: { playlistId: playlistId.toString() },
    skip: !playlistId,
  });

  return {
    songs: data?.playlistSongs || [],
    loading,
    error,
    refetch,
  };
};

export const useSearchPublicPlaylists = (query: string, page: number = 0, size: number = 10) => {
  const { data, loading, error, refetch } = useQuery(SEARCH_PUBLIC_PLAYLISTS, {
    variables: { query, page, size },
    skip: !query,
  });

  return {
    playlists: data?.searchPublicPlaylists?.content || [],
    pagination: {
      totalElements: data?.searchPublicPlaylists?.totalElements || 0,
      totalPages: data?.searchPublicPlaylists?.totalPages || 0,
      currentPage: data?.searchPublicPlaylists?.currentPage || 0,
    },
    loading,
    error,
    refetch,
  };
};

// ========== MUTATIONS HOOKS ==========

export const useCreatePlaylist = () => {
  const [createPlaylist, { loading }] = useMutation(CREATE_PLAYLIST);

  const create = async (title: string, description?: string, isPublic?: boolean) => {
    const result = await createPlaylist({
      variables: { title, description, isPublic: isPublic || false },
    });
    return result.data?.createPlaylist;
  };

  return { createPlaylist: create, loading };
};

export const useUpdatePlaylist = () => {
  const [updatePlaylist, { loading }] = useMutation(UPDATE_PLAYLIST);

  const update = async (id: number, title?: string, description?: string, isPublic?: boolean) => {
    const result = await updatePlaylist({
      variables: { id: id.toString(), title, description, isPublic },
    });
    return result.data?.updatePlaylist;
  };

  return { updatePlaylist: update, loading };
};

export const useDeletePlaylist = () => {
  const [deletePlaylist, { loading }] = useMutation(DELETE_PLAYLIST);

  const deletePlaylistById = async (id: number) => {
    const result = await deletePlaylist({
      variables: { id: id.toString() },
    });
    return result.data?.deletePlaylist;
  };

  return { deletePlaylist: deletePlaylistById, loading };
};

export const useAddSongToPlaylist = () => {
  const [addSong, { loading }] = useMutation(ADD_SONG_TO_PLAYLIST);

  const add = async (playlistId: number, songId: number) => {
    const result = await addSong({
      variables: { playlistId: playlistId.toString(), songId: songId.toString() },
    });
    return result.data?.addSongToPlaylist;
  };

  return { addSongToPlaylist: add, loading };
};

export const useRemoveSongFromPlaylist = () => {
  const [removeSong, { loading }] = useMutation(REMOVE_SONG_FROM_PLAYLIST);

  const remove = async (playlistId: number, songId: number) => {
    const result = await removeSong({
      variables: { playlistId: playlistId.toString(), songId: songId.toString() },
    });
    return result.data?.removeSongFromPlaylist;
  };

  return { removeSongFromPlaylist: remove, loading };
};

export const useReorderPlaylistSongs = () => {
  const [reorderSongs, { loading }] = useMutation(REORDER_PLAYLIST_SONGS);

  const reorder = async (playlistId: number, songIds: number[]) => {
    const result = await reorderSongs({
      variables: {
        playlistId: playlistId.toString(),
        songIds: songIds.map((id) => id.toString()),
      },
    });
    return result.data?.reorderPlaylistSongs;
  };

  return { reorderPlaylistSongs: reorder, loading };
};
