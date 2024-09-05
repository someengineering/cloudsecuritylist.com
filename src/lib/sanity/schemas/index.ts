import framework from '@/lib/sanity/schemas/documents/framework';
import marketSegment from '@/lib/sanity/schemas/documents/marketSegment';
import organization from '@/lib/sanity/schemas/documents/organization';
import productCategory from '@/lib/sanity/schemas/documents/productCategory';
import research from '@/lib/sanity/schemas/documents/research';
import organizationType from '@/lib/sanity/schemas/objects/organizationType';
import { type SchemaTypeDefinition } from 'sanity';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Documents
    framework,
    marketSegment,
    organization,
    productCategory,
    research,

    // Objects
    organizationType,
  ],
};
