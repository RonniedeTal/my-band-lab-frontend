import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

describe('LoadingSpinner Component', () => {
  it('debe renderizar el componente', () => {
    render(<LoadingSpinner />);
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeDefined();
  });

  it('debe tener la clase animate-spin', () => {
    render(<LoadingSpinner />);
    const spinner = document.querySelector('.animate-spin');
    expect(spinner?.className).toContain('animate-spin');
  });

  it('debe tener el borde de color púrpura', () => {
    render(<LoadingSpinner />);
    const spinner = document.querySelector('.border-b-2');
    expect(spinner?.className).toContain('border-purple-500');
  });

  it('debe mostrar el pulso en el centro', () => {
    render(<LoadingSpinner />);
    const pulse = document.querySelector('.animate-pulse');
    expect(pulse).toBeDefined();
    expect(pulse?.className).toContain('bg-gradient-to-r');
  });

  it('debe tener el contenedor con flex centrado', () => {
    render(<LoadingSpinner />);
    const container = document.querySelector('.flex');
    expect(container?.className).toContain('justify-center');
    expect(container?.className).toContain('items-center');
  });
});
