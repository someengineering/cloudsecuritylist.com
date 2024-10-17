import { ORGANIZATION_TYPE } from '@/lib/sanity/schemas/objects/organizationType';
import { SearchIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'research',
  title: 'Research',
  type: 'document',
  icon: SearchIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required().min(1),
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
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'website',
      title: 'Website URL',
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
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'organization.name',
      media: 'organization.mark',
    },
  },
  __experimental_formPreviewTitle: false,
});
