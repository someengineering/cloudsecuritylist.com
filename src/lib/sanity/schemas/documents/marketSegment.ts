import { SquareIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'marketSegment',
  title: 'Market segment',
  type: 'document',
  icon: SquareIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      description: 'Should be lowercase except for proper nouns an acronyms.',
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
      name: 'description',
      title: 'Description',
      description: 'Description length must be between 50 and 160 characters.',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().min(50).max(160),
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'iconPicker',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'name',
    },
  },
  __experimental_formPreviewTitle: false,
});
