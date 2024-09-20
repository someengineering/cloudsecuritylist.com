import cloudProvider from '@/lib/sanity/schemas/documents/cloudProvider';
import framework from '@/lib/sanity/schemas/documents/framework';
import marketSegment from '@/lib/sanity/schemas/documents/marketSegment';
import organization from '@/lib/sanity/schemas/documents/organization';
import page from '@/lib/sanity/schemas/documents/page';
import productCategory from '@/lib/sanity/schemas/documents/productCategory';
import research from '@/lib/sanity/schemas/documents/research';
import siteSettings from '@/lib/sanity/schemas/documents/siteSettings';
import organizationType, {
  ORGANIZATION_TYPE,
} from '@/lib/sanity/schemas/objects/organizationType';
import { Template, type SchemaTypeDefinition } from 'sanity';

export const schema: { types: SchemaTypeDefinition[]; templates: Template[] } =
  {
    types: [
      // Documents
      cloudProvider,
      framework,
      marketSegment,
      organization,
      page,
      productCategory,
      research,
      siteSettings,

      // Objects
      organizationType,
    ],
    templates: [
      {
        id: 'product-category-by-market-segment',
        title: 'Product category by market segment',
        schemaType: 'productCategory',
        parameters: [{ name: 'marketSegmentId', type: 'sting' }],
        value: ({ marketSegmentId }: { marketSegmentId: string }) => ({
          marketSegment: { _type: 'reference', _ref: marketSegmentId },
        }),
      },
      {
        id: 'organization-by-cloud-provider',
        title: 'Organization by cloud provider',
        schemaType: 'organization',
        parameters: [{ name: 'cloudProviderId', type: 'string' }],
        value: ({ cloudProviderId }: { cloudProviderId: string }) => ({
          supportedCloudProviders: [
            { _type: 'reference', _ref: cloudProviderId, _weak: true },
          ],
        }),
      },
      {
        id: 'organization-by-parent',
        title: 'Organization by parent',
        schemaType: 'organization',
        parameters: [{ name: 'parentOrganizationId', type: 'string' }],
        value: ({
          parentOrganizationId,
        }: {
          parentOrganizationId: string;
        }) => ({
          organizationType: ORGANIZATION_TYPE.ACQUIRED,
          parentOrganization: {
            _type: 'reference',
            _ref: parentOrganizationId,
          },
        }),
      },
      {
        id: 'organization-by-product-category',
        title: 'Organization by product category',
        schemaType: 'organization',
        parameters: [{ name: 'productCategoryId', type: 'string' }],
        value: ({ productCategoryId }: { productCategoryId: string }) => ({
          productCategories: [
            { _type: 'reference', _ref: productCategoryId, _weak: true },
          ],
        }),
      },
      {
        id: 'organization-by-type',
        title: 'Organization by type',
        schemaType: 'organization',
        parameters: [{ name: 'organizationType', type: 'organizationType' }],
        value: ({
          organizationType,
        }: {
          organizationType: ORGANIZATION_TYPE;
        }) => ({ organizationType }),
      },
    ],
  };
