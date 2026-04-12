import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ArtistCard } from '../../components/ArtistCard';
import { MusicGenre, UserRole, InstrumentCategory } from '../../types/enums';
import type { Artist } from '../../types/artist.types';
import type { User } from '../../types/user.types';

const mockUser: User = {
  id: 1,
  name: 'Juan',
  surname: 'Perez',
  email: 'juan@example.com',
  role: UserRole.USER,
  profileImageUrl: undefined,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockArtist: Artist = {
  id: 1,
  stageName: 'Juan Rockero',
  genre: MusicGenre.ROCK,
  verified: true,
  biography: 'Guitarrista profesional',
  user: mockUser,
  instruments: [{ id: 1, name: 'Guitarra', category: InstrumentCategory.STRING }],
};

const unverifiedArtist: Artist = {
  ...mockArtist,
  verified: false,
};

describe('ArtistCard Component', () => {
  it('debe renderizar el nombre del artista', () => {
    render(
      <BrowserRouter>
        <ArtistCard artist={mockArtist} />
      </BrowserRouter>
    );
    expect(screen.getByText('Juan Rockero')).toBeDefined();
  });

  it('debe mostrar el género musical', () => {
    render(
      <BrowserRouter>
        <ArtistCard artist={mockArtist} />
      </BrowserRouter>
    );
    expect(screen.getByText('ROCK')).toBeDefined();
  });

  it('debe mostrar el badge de verificado cuando corresponde', () => {
    render(
      <BrowserRouter>
        <ArtistCard artist={mockArtist} />
      </BrowserRouter>
    );
    expect(screen.getByText(/Verificado/)).toBeDefined();
  });

  it('no debe mostrar el badge de verificado cuando no está verificado', () => {
    render(
      <BrowserRouter>
        <ArtistCard artist={unverifiedArtist} />
      </BrowserRouter>
    );
    expect(screen.queryByText(/Verificado/)).toBeNull();
  });
});
