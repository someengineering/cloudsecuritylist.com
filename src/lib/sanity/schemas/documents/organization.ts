import { ComponentIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

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
    }),
    defineField({
      name: 'stockSymbol',
      title: 'Stock symbol',
      type: 'string',
      hidden: ({ parent, value }) =>
        !value && parent.organizationType !== 'public',
      validation: (rule) => rule.uppercase().min(1).max(5),
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
      title: 'Icon image (square)',
      type: 'image',
      options: {
        storeOriginalFilename: false,
      },
      validation: (rule) => rule.required().assetRequired(),
      fieldset: 'images',
    }),
    defineField({
      name: 'logo',
      title: 'Logo image (landscape)',
      type: 'image',
      options: {
        storeOriginalFilename: false,
      },
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
    defineField({
      name: 'description',
      title: 'Description',
      type: 'string',
      validation: (rule) => rule.required().min(1),
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
