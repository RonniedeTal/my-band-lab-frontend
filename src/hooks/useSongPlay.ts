import { useMutation, useQuery, gql } from '@apollo/client';

const REGISTER_SONG_PLAY = gql`
  mutation RegisterSongPlay($songId: ID!) {
    registerPlay(songId: $songId)
  }
`;

const GET_SONG_STATS = gql`
  query GetSongStats($songId: ID!) {
    songStats(songId: $songId) {
      songId
      title
      playCount
      uniqueListeners
    }
  }
`;

const GET_TOP_SONGS_BY_ARTIST = gql`
  query GetTopSongsByArtist($artistId: ID!, $limit: Int) {
    topSongsByArtist(artistId: $artistId, limit: $limit) {
      songId
      title
      playCount
      uniqueListeners
    }
  }
`;

const GET_TOP_SONGS_BY_GROUP = gql`
  query GetTopSongsByGroup($groupId: ID!, $limit: Int) {
    topSongsByGroup(groupId: $groupId, limit: $limit) {
      songId
      title
      playCount
      uniqueListeners
    }
  }
`;

export const useRegisterPlay = () => {
  const [registerPlay, { loading }] = useMutation(REGISTER_SONG_PLAY);

  const register = async (songId: number) => {
    try {
      await registerPlay({ variables: { songId: songId.toString() } });
    } catch (error) {
      console.error('Error registering play:', error);
    }
  };

  return { registerPlay: register, loading };
};

export const useSongStats = (songId: number) => {
  const { data, loading, error } = useQuery(GET_SONG_STATS, {
    variables: { songId: songId?.toString() },
    skip: !songId,
  });

  return {
    stats: data?.songStats,
    loading,
    error,
  };
};

export const useTopSongsByArtist = (artistId: number | undefined, limit: number = 5) => {
  const { data, loading, error } = useQuery(GET_TOP_SONGS_BY_ARTIST, {
    variables: { artistId: artistId?.toString(), limit },
    skip: !artistId, // Solo ejecutar si artistId existe
  });

  return {
    topSongs: data?.topSongsByArtist || [],
    loading,
    error,
  };
};

export const useTopSongsByGroup = (groupId: number | undefined, limit: number = 5) => {
  const { data, loading, error } = useQuery(GET_TOP_SONGS_BY_GROUP, {
    variables: { groupId: groupId?.toString(), limit },
    skip: !groupId, // Solo ejecutar si groupId existe
  });

  return {
    topSongs: data?.topSongsByGroup || [],
    loading,
    error,
  };
};
