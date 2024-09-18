import { TagIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';
import { preview } from 'sanity-plugin-icon-picker';

export default defineType({
  name: 'productCategory',
  title: 'Product category',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      description:
        'Should be lowercase except for proper nouns an acronyms. For categories with a common acronym or abbreviation, enter it here and fill in the expansion field below.',
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
      description:
        'Leave empty if category name is not an acronym or abbreviation.',
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
      rows: 4,
      validation: (rule) => rule.required().min(50),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'expansion',
      iconName: 'marketSegment.icon.name',
      iconProvider: 'marketSegment.icon.provider',
    },
    prepare({ title, subtitle, iconName, iconProvider }) {
      return {
        title,
        subtitle,
        media: preview({ name: iconName, provider: iconProvider }),
      };
    },
  },
  __experimental_formPreviewTitle: false,
});
