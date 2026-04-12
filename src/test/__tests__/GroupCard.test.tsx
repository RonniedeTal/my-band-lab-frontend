import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { GroupCard } from '../../components/GroupCard';
import { MusicGenre, UserRole } from '../../types/enums';
import type { MusicGroup } from '../../types/group.types';
import type { User } from '../../types/user.types';

const mockFounder: User = {
  id: 1,
  name: 'Juan',
  surname: 'Perez',
  email: 'juan@example.com',
  role: UserRole.USER,
  profileImageUrl: undefined,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockMembers: User[] = [
  {
    id: 1,
    name: 'Juan',
    surname: 'Perez',
    email: 'juan@example.com',
    role: UserRole.USER,
    profileImageUrl: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Maria',
    surname: 'Gomez',
    email: 'maria@example.com',
    role: UserRole.USER,
    profileImageUrl: undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockGroup: MusicGroup = {
  id: 1,
  name: 'Los Rockeros',
  description: 'Banda de rock alternativo',
  genre: MusicGenre.ROCK,
  verified: true,
  founder: mockFounder,
  members: mockMembers,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const unverifiedGroup: MusicGroup = {
  ...mockGroup,
  verified: false,
};

describe('GroupCard Component', () => {
  it('debe renderizar el nombre del grupo', () => {
    render(
      <BrowserRouter>
        <GroupCard group={mockGroup} />
      </BrowserRouter>
    );
    expect(screen.getByText('Los Rockeros')).toBeDefined();
  });

  it('debe mostrar el género musical', () => {
    render(
      <BrowserRouter>
        <GroupCard group={mockGroup} />
      </BrowserRouter>
    );
    expect(screen.getByText('ROCK')).toBeDefined();
  });

  it('debe mostrar el nombre del fundador', () => {
    render(
      <BrowserRouter>
        <GroupCard group={mockGroup} />
      </BrowserRouter>
    );
    expect(screen.getByText(/por Juan Perez/)).toBeDefined();
  });

  it('debe mostrar la cantidad de miembros', () => {
    render(
      <BrowserRouter>
        <GroupCard group={mockGroup} />
      </BrowserRouter>
    );
    expect(screen.getByText(/2 miembros/)).toBeDefined();
  });

  it('debe mostrar la descripción del grupo', () => {
    render(
      <BrowserRouter>
        <GroupCard group={mockGroup} />
      </BrowserRouter>
    );
    expect(screen.getByText('Banda de rock alternativo')).toBeDefined();
  });

  it('debe mostrar el badge de verificado cuando corresponde', () => {
    render(
      <BrowserRouter>
        <GroupCard group={mockGroup} />
      </BrowserRouter>
    );
    expect(screen.getByText(/Verificado/)).toBeDefined();
  });

  it('no debe mostrar el badge de verificado cuando no está verificado', () => {
    render(
      <BrowserRouter>
        <GroupCard group={unverifiedGroup} />
      </BrowserRouter>
    );
    expect(screen.queryByText(/Verificado/)).toBeNull();
  });

  it('debe tener un enlace al detalle del grupo', () => {
    render(
      <BrowserRouter>
        <GroupCard group={mockGroup} />
      </BrowserRouter>
    );
    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('/groups/1');
  });
});
