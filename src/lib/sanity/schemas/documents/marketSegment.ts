import { SquareIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';
import { preview } from 'sanity-plugin-icon-picker';

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
      options: {
        source: 'name',
      },
      validation: (rule) => rule.required(),
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
      title: 'name',
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
