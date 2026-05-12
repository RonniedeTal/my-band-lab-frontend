import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export interface FiltersState {
  genre: string | null;
  instrumentIds: number[];
  country: string | null;
  city: string | null;
}

export const useFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Estado inicial desde URL
  const [filters, setFilters] = useState<FiltersState>(() => ({
    genre: searchParams.get('genre') || null,
    instrumentIds: searchParams.get('instrumentIds')
      ? searchParams.get('instrumentIds')!.split(',').map(Number)
      : [],
    country: searchParams.get('country') || null,
    city: searchParams.get('city') || null,
  }));

  // Sincronizar filtros con URL
  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.genre) params.set('genre', filters.genre);
    if (filters.instrumentIds.length > 0) {
      params.set('instrumentIds', filters.instrumentIds.join(','));
    }
    if (filters.country) params.set('country', filters.country);
    if (filters.city) params.set('city', filters.city);

    setSearchParams(params, { replace: true });
  }, [filters]);

  // Funciones para manipular filtros
  const setFilter = useCallback(<K extends keyof FiltersState>(key: K, value: FiltersState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const removeFilter = useCallback((key: keyof FiltersState) => {
    setFilters((prev) => {
      if (key === 'instrumentIds') {
        return { ...prev, [key]: [] };
      }
      return { ...prev, [key]: null };
    });
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters({
      genre: null,
      instrumentIds: [],
      country: null,
      city: null,
    });
  }, []);

  // Lista de filtros activos para mostrar badges
  const activeFilters = useCallback(() => {
    const active: { key: keyof FiltersState; label: string; value: string }[] = [];

    if (filters.genre) {
      active.push({ key: 'genre', label: 'Género', value: filters.genre });
    }

    if (filters.instrumentIds.length > 0) {
      active.push({
        key: 'instrumentIds',
        label: 'Instrumentos',
        value: `${filters.instrumentIds.length} instrumento${filters.instrumentIds.length > 1 ? 's' : ''}`,
      });
    }

    if (filters.country) {
      let locationValue = filters.country;
      if (filters.city) {
        locationValue = `${filters.city}, ${filters.country}`;
      }
      active.push({ key: 'country', label: 'Ubicación', value: locationValue });
    }

    return active;
  }, [filters]);

  const hasActiveFilters =
    filters.genre !== null || filters.instrumentIds.length > 0 || filters.country !== null;

  return {
    filters,
    setFilter,
    removeFilter,
    clearAllFilters,
    activeFilters: activeFilters(),
    hasActiveFilters,
  };
};
