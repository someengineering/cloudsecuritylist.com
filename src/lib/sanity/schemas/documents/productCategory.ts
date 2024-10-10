import {
  noNewlines,
  noStartingOrTerminatingWhitespace,
  notEmpty,
} from '@/lib/sanity/schemas/validation/block';
import { TagIcon } from '@sanity/icons';
import { defineField, defineType, PortableTextTextBlock } from 'sanity';
import { preview } from 'sanity-plugin-icon-picker';

export default defineType({
  name: 'productCategory',
  title: 'Product category',
  type: 'document',
  icon: TagIcon,
  fieldsets: [
    {
      name: 'content',
      title: 'Page content',
      options: {
        collapsible: true,
      },
    },
  ],
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
      options: { source: 'name' },
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
      description: 'Description length must be between 50 and 160 characters.',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().min(50).max(160),
    }),
    defineField({
      name: 'explanationHeading',
      title: 'Explanation heading',
      description: 'Short, single-line heading for the explanation section.',
      type: 'string',
      fieldset: 'content',
      validation: (rule) => rule.required().min(1).max(75),
    }),
    defineField({
      name: 'explanation',
      title: 'Explanation',
      description:
        'Longer, multi-paragraph explanation of the product category.',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [],
          lists: [],
          validation: (rule) =>
            rule
              .custom((value: PortableTextTextBlock) => notEmpty(value))
              .custom((value: PortableTextTextBlock) =>
                noStartingOrTerminatingWhitespace(value),
              )
              .custom((value: PortableTextTextBlock) => noNewlines(value)),
        },
      ],
      fieldset: 'content',
      validation: (rule) => rule.required().min(2),
    }),
    defineField({
      name: 'similarCategories',
      title: 'Similar categories',
      type: 'array',
      of: [
        { type: 'reference', weak: true, to: [{ type: 'productCategory' }] },
      ],
      validation: (rule) => rule.unique(),
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
