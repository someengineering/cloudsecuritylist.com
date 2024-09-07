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
      options: {
        source: 'name',
      },
      validation: (rule) => rule.required(),
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
        !value && parent.organizationType !== 'public',
      validation: (rule) =>
        rule
          .uppercase()
          .min(1)
          .max(5)
          .error('Stock symbols must consist of 1 to 5 uppercase characters.'),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      description: 'Description length must be between 100 and 250 characters.',
      type: 'text',
      rows: 5,
      validation: (rule) => rule.required().min(100).max(250),
    }),
    defineField({
      name: 'productCategories',
      title: 'Product categories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'productCategory' }] }],
      validation: (rule) => rule.unique(),
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      description: 'Square icon image in SVG format.',
      type: 'image',
      options: {
        storeOriginalFilename: false,
      },
      validation: (rule) =>
        rule
          .required()
          .assetRequired()
          .custom((value): CustomValidatorResult => {
            if (!value?.asset?._ref) {
              return 'Icon is required.';
            }

            const filetype = getExtension(value.asset._ref);

            if (filetype !== 'svg') {
              return 'Icon must be an SVG image.';
            }

            const { width, height } = getImageDimensions(value.asset._ref);

            if (width !== height) {
              return 'Icon must be square.';
            }

            return true;
          }),
      fieldset: 'images',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      description:
        'Horizontal (landscape) logo image in SVG format. Leave empty if same as the square icon image.',
      type: 'image',
      options: {
        storeOriginalFilename: false,
      },
      validation: (rule) =>
        rule.custom((value): CustomValidatorResult => {
          if (!value?.asset?._ref) {
            return true;
          }

          const filetype = getExtension(value.asset._ref);

          if (filetype !== 'svg') {
            return 'Logo must be an SVG image.';
          }

          const { width, height } = getImageDimensions(value.asset._ref);

          if (width <= height) {
            return 'Logo must be horizontal (landscape).';
          }

          return true;
        }),
      fieldset: 'images',
    }),
    defineField({
      name: 'website',
      title: 'Website URL',
      type: 'url',
      validation: (rule) => rule.required().uri({ scheme: 'https' }),
      fieldset: 'links',
    }),
    defineField({
      name: 'linkedin',
      title: 'LinkedIn URL',
      type: 'url',
      validation: (rule) => rule.uri({ scheme: 'https' }),
      fieldset: 'links',
    }),
    defineField({
      name: 'crunchbase',
      title: 'Crunchbase URL',
      type: 'url',
      validation: (rule) => rule.uri({ scheme: 'https' }),
      fieldset: 'links',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'website',
      media: 'icon',
    },
  },
});
