'use client';

import React, { createContext, useContext, useReducer } from 'react';

export type Filters = { marketSegment?: string };

type FiltersAction = {
  type: 'marketSegment';
  slug: string;
};

const filtersReducer = (state: Filters, action: FiltersAction): Filters => {
  switch (action.type) {
    case 'marketSegment': {
      return {
        ...state,
        marketSegment:
          state.marketSegment !== action.slug ? action.slug : undefined,
      };
    }

    default:
      return state;
  }
};

const defaultValues: Filters = {};

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
