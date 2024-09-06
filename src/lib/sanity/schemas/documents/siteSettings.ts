import { LinkIcon, SearchIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  icon: SearchIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Site title',
      type: 'string',
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'description',
      title: 'Site description',
      description: 'Maximum 160 characters.',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().min(50).max(160),
    }),
    defineField({
      name: 'copyright',
      title: 'Copyright text',
      type: 'text',
      rows: 1,
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      title: 'Navigation items',
      name: 'navigation',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'inline',
          icon: LinkIcon,
          fields: [
            {
              name: 'name',
              title: 'Name',
              type: 'string',
              validation: (rule) => rule.required().min(1),
            },
            {
              name: 'href',
              title: 'Target',
              description:
                'Should be a relative path for internal links (e.g., /some-path).',
              type: 'url',
              validation: (rule) =>
                rule.required().uri({ allowRelative: true }),
            },
          ],
        },
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
});
