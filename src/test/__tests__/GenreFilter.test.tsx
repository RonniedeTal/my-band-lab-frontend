import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GenreFilter } from '../../components/GenreFilter';

describe('GenreFilter Component', () => {
  it('debe renderizar el select con la opción "Todos los géneros"', () => {
    render(<GenreFilter selectedGenre="" onGenreChange={() => {}} />);
    const select = screen.getByRole('combobox');
    expect(select).toBeDefined();
    expect(screen.getByText('Todos los géneros')).toBeDefined();
  });

  it('debe mostrar el género seleccionado correctamente', () => {
    render(<GenreFilter selectedGenre="ROCK" onGenreChange={() => {}} />);
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('ROCK');
  });

  it('debe llamar onGenreChange cuando se selecciona un género', () => {
    const handleGenreChange = vi.fn();
    render(<GenreFilter selectedGenre="" onGenreChange={handleGenreChange} />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'POP' } });

    expect(handleGenreChange).toHaveBeenCalledWith('POP');
  });

  it('debe mostrar todos los géneros disponibles', () => {
    render(<GenreFilter selectedGenre="" onGenreChange={() => {}} />);

    const genres = [
      'Todos los géneros',
      'Rock',
      'Pop',
      'Jazz',
      'Clásica',
      'Hip Hop',
      'Electrónica',
      'Reggae',
      'Blues',
      'Country',
      'Metal',
      'Punk',
      'Soul',
      'Funk',
      'Latina',
      'Indie',
      'Alternativa',
    ];

    genres.forEach((genre) => {
      expect(screen.getByText(genre)).toBeDefined();
    });
  });

  it('debe tener el icono de música', () => {
    render(<GenreFilter selectedGenre="" onGenreChange={() => {}} />);
    const icon = document.querySelector('.lucide-music');
    expect(icon).toBeDefined();
  });
});
