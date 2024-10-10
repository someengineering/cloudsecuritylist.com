import { getImageDimensions } from '@sanity/asset-utils';
import { DatabaseIcon, LinkIcon } from '@sanity/icons';
import { CustomValidatorResult, defineField, defineType } from 'sanity';

export default defineType({
  name: 'cloudProvider',
  title: 'Cloud provider',
  type: 'document',
  icon: DatabaseIcon,
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
      name: 'abbreviation',
      title: 'Abbreviation/acronym',
      type: 'string',
      validation: (rule) => rule.min(1),
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
      name: 'website',
      title: 'Website URL',
      type: 'url',
      fieldset: 'links',
      validation: (rule) => rule.required().uri({ scheme: 'https' }),
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
              new URL(value).host === 'linkedin.com' ||
              'URL host must be linkedin.com.',
          ),
    }),
    defineField({
      name: 'sharedResponsibilityModel',
      title: 'Shared responsibility model URL',
      type: 'url',
      fieldset: 'links',
      validation: (rule) => rule.uri({ scheme: 'https' }),
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'iconPicker',
      options: {
        providers: ['si'],
        outputFormat: 'react',
      },
      fieldset: 'images',
      validation: (rule) => rule.required(),
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
        rule
          .required()
          .assetRequired()
          .custom((value): CustomValidatorResult => {
            if (!value?.asset?._ref) {
              return 'Brand mark image is required.';
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
      description:
        'Horizontal (landscape) logo image in SVG format. Leave empty if same as the square icon image.',
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
      name: 'nativeProducts',
      title: 'Native security products',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'inline',
          icon: LinkIcon,
          fields: [
            {
              name: 'name',
              title: 'Name',
              type: 'string',
              validation: (rule) => rule.required().min(1),
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 4,
              validation: (rule) => rule.required().min(50),
            },
            {
              name: 'link',
              title: 'Link',
              type: 'url',
              validation: (rule) => rule.required().uri({ scheme: 'https' }),
            },
          ],
        },
      ],
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
