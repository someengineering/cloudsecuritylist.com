import { getExtension, getImageDimensions } from '@sanity/asset-utils';
import { DatabaseIcon } from '@sanity/icons';
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
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 5,
      validation: (rule) => rule.required().min(50),
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'iconPicker',
      options: {
        providers: ['si'],
        outputFormat: 'react',
      },
      validation: (rule) => rule.required(),
      fieldset: 'images',
    }),
    defineField({
      name: 'mark',
      title: 'Brand mark',
      description: 'Square brand mark image in SVG format.',
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
              return 'Brand mark image is required.';
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
            return 'Logo image must be horizontal (landscape).';
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
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'website',
      media: 'mark',
    },
  },
});
