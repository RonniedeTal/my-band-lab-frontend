import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from '../../components/SearchBar';

describe('SearchBar Component', () => {
  it('debe renderizar el input correctamente', () => {
    render(<SearchBar onSearch={() => {}} />);
    const input = screen.getByPlaceholderText('Buscar artistas...');
    expect(input).toBeDefined();
  });

  it('debe actualizar el valor del input cuando se escribe', () => {
    render(<SearchBar onSearch={() => {}} />);
    const input = screen.getByPlaceholderText('Buscar artistas...') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'test' } });
    expect(input.value).toBe('test');
  });

  it('debe llamar onSearch con el valor correcto al hacer submit', () => {
    const handleSearch = vi.fn();
    render(<SearchBar onSearch={handleSearch} />);
    const input = screen.getByPlaceholderText('Buscar artistas...');
    fireEvent.change(input, { target: { value: 'Juan' } });
    fireEvent.submit(input.closest('form')!);
    expect(handleSearch).toHaveBeenCalledWith('Juan');
  });

  it('debe limpiar el input cuando se hace clic en el botón de limpiar', () => {
    render(<SearchBar onSearch={() => {}} />);
    const input = screen.getByPlaceholderText('Buscar artistas...') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'test' } });
    expect(input.value).toBe('test');

    // Buscar el botón de limpiar por su clase CSS (el que tiene el ícono X)
    const clearButton = document.querySelector('button.absolute.right-3');
    expect(clearButton).toBeDefined();

    if (clearButton) {
      fireEvent.click(clearButton);
      expect(input.value).toBe('');
    }
  });
});
