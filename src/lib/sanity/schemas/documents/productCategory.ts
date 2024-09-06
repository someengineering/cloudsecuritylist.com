import { TagIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'productCategory',
  title: 'Product category',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name (acronym/abbreviation)',
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
      name: 'expansion',
      title: 'Acronym expansion',
      type: 'string',
    }),
    defineField({
      name: 'marketSegment',
      title: 'Market segment',
      type: 'reference',
      to: { type: 'marketSegment' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 5,
      validation: (rule) => rule.required().min(50),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'expansion',
    },
  },
});
