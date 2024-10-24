'use client';

import { isValidSlug } from '@/utils/slug';
import { createContext, useContext, useReducer } from 'react';

export type Filters = { marketSegment?: string; searchQuery: string };

type FiltersAction =
  | {
      type: 'marketSegment';
      slug: string;
    }
  | {
      type: 'searchQuery';
      value: string;
    };

const filtersReducer = (state: Filters, action: FiltersAction): Filters => {
  switch (action.type) {
    case 'marketSegment': {
      return {
        ...state,
        marketSegment:
          state.marketSegment !== action.slug && isValidSlug(action.slug)
            ? action.slug
            : undefined,
      };
    }

    case 'searchQuery': {
      return { ...state, searchQuery: action.value };
    }

    default:
      return state;
  }
};

const defaultValues: Filters = { searchQuery: '' };

const FiltersContext = createContext<{
  filters: Filters;
  setFilters: React.Dispatch<FiltersAction>;
}>({ filters: defaultValues, setFilters: (): void => {} });

export const FiltersProvider = ({
  initialValues,
  children,
}: {
  initialValues: Partial<Filters>;
  children: React.ReactNode;
}) => {
  const [filters, setFilters] = useReducer(filtersReducer, {
    ...defaultValues,
    ...initialValues,
  });

  return (
    <FiltersContext.Provider value={{ filters, setFilters }}>
      {children}
    </FiltersContext.Provider>
  );
};

export const useFilters = () => useContext(FiltersContext);
