import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { BottomNavigation } from '../../components/BottomNavigation';
import { useAuth } from '../../hooks/useAuth';

vi.mock('../../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('BottomNavigation Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe mostrar los elementos de navegación para usuarios no autenticados', () => {
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      isAuthenticated: () => false,
    });

    render(
      <MemoryRouter>
        <BottomNavigation />
      </MemoryRouter>
    );

    expect(screen.getByText('Inicio')).toBeDefined();
    expect(screen.getByText('Explorar')).toBeDefined();
    expect(screen.getByText('Artistas')).toBeDefined();
    expect(screen.getByText('Grupos')).toBeDefined();
    expect(screen.queryByText('Perfil')).toBeNull();
  });

  it('debe mostrar el perfil para usuarios autenticados', () => {
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      isAuthenticated: () => true,
    });

    render(
      <MemoryRouter>
        <BottomNavigation />
      </MemoryRouter>
    );

    expect(screen.getByText('Inicio')).toBeDefined();
    expect(screen.getByText('Explorar')).toBeDefined();
    expect(screen.getByText('Artistas')).toBeDefined();
    expect(screen.getByText('Grupos')).toBeDefined();
    expect(screen.getByText('Perfil')).toBeDefined();
  });

  it('debe tener enlaces a las rutas correctas', () => {
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      isAuthenticated: () => true,
    });

    render(
      <MemoryRouter>
        <BottomNavigation />
      </MemoryRouter>
    );

    const links = screen.getAllByRole('link');
    const hrefs = links.map((link) => link.getAttribute('href'));

    expect(hrefs).toContain('/');
    expect(hrefs).toContain('/explore');
    expect(hrefs).toContain('/artists');
    expect(hrefs).toContain('/groups');
    expect(hrefs).toContain('/profile');
  });
});
