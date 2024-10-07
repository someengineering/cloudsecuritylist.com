import { ORGANIZATION_TYPE } from '@/lib/sanity/schemas/objects/organizationType';
import { getExtension, getImageDimensions } from '@sanity/asset-utils';
import { CodeIcon } from '@sanity/icons';
import { CustomValidatorResult, defineField, defineType } from 'sanity';

export default defineType({
  name: 'openSourceProject',
  title: 'Open-source project',
  type: 'document',
  icon: CodeIcon,
  fieldsets: [
    {
      name: 'images',
      title: 'Images',
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
      name: 'organization',
      title: 'Organization',
      type: 'reference',
      to: [{ type: 'organization' }],
      options: {
        filter: 'organizationType != $acquiredType',
        filterParams: { acquiredType: ORGANIZATION_TYPE.ACQUIRED },
      },
    }),
    defineField({
      name: 'repository',
      title: 'Repository URL',
      type: 'url',
      validation: (rule) => rule.required().uri({ scheme: 'https' }),
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
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'organization.name',
      media: 'mark',
    },
  },
  __experimental_formPreviewTitle: false,
});
