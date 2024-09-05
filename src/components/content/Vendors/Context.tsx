'use client';

import { ORGANIZATION_TYPE } from '@/lib/sanity/schemas/objects/organizationType';
import { createContext, useContext, useReducer } from 'react';

export type Filters = {
  productCategories: string[];
  organizationTypes: ORGANIZATION_TYPE[];
};

type FiltersAction =
  | {
      type: 'productCategory';
      slug: string;
    }
  | {
      type: 'organizationType';
      value: ORGANIZATION_TYPE;
    };

const filtersReducer = (state: Filters, action: FiltersAction): Filters => {
  switch (action.type) {
    case 'productCategory': {
      let productCategories = state.productCategories;

      if (state.productCategories.includes(action.slug)) {
        productCategories = productCategories.filter(
          (category) => category !== action.slug,
        );
      } else {
        productCategories = [...state.productCategories, action.slug];
      }

      return { ...state, productCategories };
    }

    case 'organizationType': {
      let organizationTypes = state.organizationTypes;

      if (state.organizationTypes.includes(action.value)) {
        organizationTypes = organizationTypes.filter(
          (category) => category !== action.value,
        );
      } else {
        organizationTypes = [...state.organizationTypes, action.value];
      }

      return { ...state, organizationTypes };
    }

    default:
      return state;
  }
};

const defaultValues: Filters = {
  productCategories: [],
  organizationTypes: [],
};

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
