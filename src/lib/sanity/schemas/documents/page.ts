import { DocumentIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';
import { preview } from 'sanity-plugin-icon-picker';

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
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
      name: 'listType',
      title: 'List type',
      description:
        'If this page is primarily a list of items, select the schema type of the items in the list.',
      type: 'string',
      options: {
        list: [
          { title: 'Cloud provider', value: 'cloudProvider' },
          { title: 'Framework', value: 'framework' },
          { title: 'Market segment', value: 'marketSegment' },
          { title: 'Organization', value: 'organization' },
          { title: 'Product category', value: 'productCategory' },
          { title: 'Research', value: 'research' },
        ],
      },
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'iconPicker',
      options: {
        providers: ['hi'],
        filter: [/^HiOutline/],
        outputFormat: 'react',
      },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      iconName: 'icon.name',
      iconProvider: 'icon.provider',
    },
    prepare({ title, iconName, iconProvider }) {
      return {
        title,
        media: preview({ name: iconName, provider: iconProvider }),
      };
    },
  },
  __experimental_formPreviewTitle: false,
});
