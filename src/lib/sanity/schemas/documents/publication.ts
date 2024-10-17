import { ORGANIZATION_TYPE } from '@/lib/sanity/schemas/objects/organizationType';
import { getImageDimensions } from '@sanity/asset-utils';
import { BinaryDocumentIcon } from '@sanity/icons';
import { CustomValidatorResult, defineField, defineType } from 'sanity';

export default defineType({
  name: 'publication',
  title: 'Publication',
  type: 'document',
  icon: BinaryDocumentIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'publicationType',
      title: 'Publication type',
      type: 'publicationType',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'person',
    }),
    defineField({
      name: 'publisher',
      title: 'Publisher',
      type: 'reference',
      to: [{ type: 'organization' }],
      options: {
        filter: 'organizationType != $acquiredType',
        filterParams: { acquiredType: ORGANIZATION_TYPE.ACQUIRED },
      },
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
      validation: (rule) => rule.required().uri({ scheme: 'https' }),
    }),
    defineField({
      name: 'mark',
      title: 'Brand mark',
      description: 'Square brand mark image.',
      type: 'image',
      options: {
        sources: [],
        storeOriginalFilename: false,
      },
      validation: (rule) =>
        rule.custom((value): CustomValidatorResult => {
          if (!value?.asset?._ref) {
            return true;
          }

          const { width, height } = getImageDimensions(value.asset._ref);

          if (width !== height) {
            return 'Brand mark image must be square.';
          }

          return true;
        }),
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
