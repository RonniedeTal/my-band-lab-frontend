import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import type { Playlist } from '../types/playlist.types';
import { UserRole } from '../types/enums';

export const usePlaylistsByArtist = (artistId: number | undefined, _artistSongs?: { id: string | number }[]) => {
  const { user, token } = useAuth();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!artistId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const fetchData = async () => {
      try {
        setLoading(true);

        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const res = await fetch(
          `http://localhost:9000/api/playlists/by-artist/${artistId}`,
          { headers }
        );

        if (!res.ok) {
          throw new Error('Error fetching playlists');
        }

        const data = await res.json();

        if (cancelled) return;

        const mappedPlaylists: Playlist[] = data.map((p: any) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          coverImageUrl: p.coverImageUrl,
          isPublic: p.isPublic,
          user: {
            id: p.user?.id,
            name: p.user?.name || '',
            surname: p.user?.surname || '',
            email: '',
            role: UserRole.USER,
            createdAt: '',
            updatedAt: '',
          },
          songs: [],
          songCount: 0,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
        }));

        setPlaylists(mappedPlaylists);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Error');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [artistId, user, token]);

  return { playlists, loading, error };
};