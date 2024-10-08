import { ORGANIZATION_TYPE } from '@/lib/sanity/schemas/objects/organizationType';
import { getExtension, getImageDimensions } from '@sanity/asset-utils';
import { ComponentIcon } from '@sanity/icons';
import { CustomValidatorResult, defineField, defineType } from 'sanity';

export default defineType({
  name: 'organization',
  title: 'Organization',
  type: 'document',
  icon: ComponentIcon,
  fieldsets: [
    {
      name: 'images',
      title: 'Images',
      options: {
        collapsible: true,
      },
    },
    {
      name: 'links',
      title: 'Links',
      options: {
        collapsible: true,
      },
    },
    {
      name: 'acquisition',
      title: 'Acquisition details',
      options: {
        collapsible: true,
      },
    },
    {
      name: 'product',
      title: 'Product offering(s)',
      options: {
        collapsible: true,
      },
    },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'alternateSlugs',
      title: 'Alternate slugs',
      type: 'alternateSlugs',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      description: 'Description length must be between 50 and 160 characters.',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().min(50).max(160),
    }),
    defineField({
      name: 'organizationType',
      title: 'Organization type',
      type: 'organizationType',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'stockSymbol',
      title: 'Stock symbol',
      type: 'string',
      hidden: ({ parent, value }) =>
        !value && parent.organizationType !== ORGANIZATION_TYPE.PUBLIC,
      validation: (rule) =>
        rule
          .uppercase()
          .min(1)
          .max(5)
          .error('Stock symbols must consist of 1 to 5 uppercase characters.')
          .custom((value, context) =>
            !value ||
            context.document?.organizationType === ORGANIZATION_TYPE.PUBLIC
              ? true
              : 'Stock symbol can only be specified for public companies.',
          ),
    }),
    defineField({
      name: 'parentOrganization',
      title: 'Parent organization',
      type: 'reference',
      to: [{ type: 'organization' }],
      options: {
        filter: 'organizationType != $acquiredType',
        filterParams: { acquiredType: ORGANIZATION_TYPE.ACQUIRED },
      },
      fieldset: 'acquisition',
      hidden: ({ parent, value }) =>
        !value && parent.organizationType !== ORGANIZATION_TYPE.ACQUIRED,
      validation: (rule) =>
        rule.custom((value, context) =>
          value
            ? context.document?.organizationType === ORGANIZATION_TYPE.ACQUIRED
              ? true
              : 'Parent organization can only be specified for acquired entities.'
            : context.document?.organizationType === ORGANIZATION_TYPE.ACQUIRED
              ? 'Parent organization is required.'
              : true,
        ),
    }),
    defineField({
      name: 'acquisitionDate',
      title: 'Acquisition date',
      description:
        'Date when the acquisition was announced (formatted as YYYY-MM-DD).',
      type: 'date',
      fieldset: 'acquisition',
      hidden: ({ parent, value }) =>
        !value && parent.organizationType !== ORGANIZATION_TYPE.ACQUIRED,
      validation: (rule) =>
        rule.custom((value, context) =>
          value
            ? context.document?.organizationType === ORGANIZATION_TYPE.ACQUIRED
              ? true
              : 'Acquisition date can only be specified for acquired entities.'
            : context.document?.organizationType === ORGANIZATION_TYPE.ACQUIRED
              ? 'Acquisition date is required.'
              : true,
        ),
    }),
    defineField({
      name: 'acquisitionPrice',
      title: 'Acquisition price',
      description: 'Acquisition price in US Dollars ($).',
      type: 'number',
      fieldset: 'acquisition',
      hidden: ({ parent, value }) =>
        !value && parent.organizationType !== ORGANIZATION_TYPE.ACQUIRED,
      validation: (rule) =>
        rule
          .custom((value, context) =>
            value &&
            context.document?.organizationType !== ORGANIZATION_TYPE.ACQUIRED
              ? 'Acquisition price can only be specified for acquired entities.'
              : true,
          )
          .positive()
          .integer(),
    }),
    defineField({
      name: 'pressRelease',
      title: 'Press release URL',
      type: 'url',
      fieldset: 'acquisition',
      hidden: ({ parent, value }) =>
        !value && parent.organizationType !== ORGANIZATION_TYPE.ACQUIRED,
      validation: (rule) =>
        rule
          .custom((value, context) =>
            value &&
            context.document?.organizationType !== ORGANIZATION_TYPE.ACQUIRED
              ? 'Press release URL can only be specified for acquired entities.'
              : true,
          )
          .uri({ scheme: 'https' }),
    }),
    defineField({
      name: 'website',
      title: 'Website URL',
      type: 'url',
      fieldset: 'links',
      validation: (rule) =>
        rule
          .custom((value, context) =>
            !!value ||
            context.document?.organizationType === ORGANIZATION_TYPE.ACQUIRED
              ? true
              : 'Website URL is required.',
          )
          .uri({ scheme: 'https' }),
    }),
    defineField({
      name: 'linkedin',
      title: 'LinkedIn URL',
      type: 'url',
      fieldset: 'links',
      validation: (rule) =>
        rule
          .uri({ scheme: 'https' })
          .custom(
            (value) =>
              !value ||
              !!new URL(value).host.match(/^(www\.)?linkedin.com$/) ||
              'URL host must be linkedin.com.',
          ),
    }),
    defineField({
      name: 'crunchbase',
      title: 'Crunchbase URL',
      type: 'url',
      fieldset: 'links',
      validation: (rule) =>
        rule
          .uri({ scheme: 'https' })
          .custom(
            (value) =>
              !value ||
              !!new URL(value).host.match(/^(www\.)?crunchbase.com$/) ||
              'URL host must be crunchbase.com.',
          ),
    }),
    defineField({
      name: 'mark',
      title: 'Brand mark',
      description: 'Square brand mark image in SVG format.',
      type: 'image',
      options: {
        accept: 'image/svg+xml',
        sources: [],
        storeOriginalFilename: false,
      },
      fieldset: 'images',
      validation: (rule) =>
        rule.custom((value, context): CustomValidatorResult => {
          if (!value?.asset?._ref) {
            return context.document?.organizationType ===
              ORGANIZATION_TYPE.ACQUIRED
              ? true
              : 'Brand mark image is required.';
          }

          const filetype = getExtension(value.asset._ref);

          if (filetype !== 'svg') {
            return 'Brand mark must be an SVG image.';
          }

          const { width, height } = getImageDimensions(value.asset._ref);

          if (width !== height) {
            return 'Brand mark image must be square.';
          }

          return true;
        }),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      description: 'Horizontal (landscape) logo image in SVG format.',
      type: 'image',
      options: {
        accept: 'image/svg+xml',
        sources: [],
        storeOriginalFilename: false,
      },
      fieldset: 'images',
      validation: (rule) =>
        rule.custom((value): CustomValidatorResult => {
          if (!value?.asset?._ref) {
            return true;
          }

          const { width, height } = getImageDimensions(value.asset._ref);

          if (width <= height) {
            return 'Logo image must be horizontal (landscape).';
          }

          return true;
        }),
    }),
    defineField({
      name: 'productCategories',
      title: 'Product categories',
      type: 'array',
      of: [
        { type: 'reference', weak: true, to: [{ type: 'productCategory' }] },
      ],
      fieldset: 'product',
      hidden: ({ parent }) =>
        parent.organizationType === ORGANIZATION_TYPE.ACQUIRED,
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'supportedCloudProviders',
      title: 'Supported cloud providers',
      type: 'array',
      of: [{ type: 'reference', weak: true, to: [{ type: 'cloudProvider' }] }],
      fieldset: 'product',
      hidden: ({ parent, value }) =>
        (!value && !parent.productCategories?.length) ||
        parent.organizationType === ORGANIZATION_TYPE.ACQUIRED,
      validation: (rule) => rule.unique(),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'website',
      media: 'mark',
    },
  },
  __experimental_formPreviewTitle: false,
});
