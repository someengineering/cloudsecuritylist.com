import { LinkIcon, SearchIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  icon: SearchIcon,
  fieldsets: [
    {
      name: 'homepage',
      title: 'Homepage',
      options: {
        collapsible: true,
      },
    },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Site name',
      type: 'string',
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'shortName',
      title: 'Short site name',
      description:
        "Used when there isn't enough space to display the full sitename. Maximum of 15 characters (ideally 12 characters or less).",
      type: 'string',
      validation: (rule) => rule.required().min(1).max(15),
    }),
    defineField({
      name: 'tagline',
      title: 'Site tagline',
      type: 'string',
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'description',
      title: 'SEO description',
      description:
        'SEO description length must be between 50 and 160 characters. (Note: The homepage headline text is configured below.)',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().min(50).max(160),
    }),
    defineField({
      name: 'url',
      title: 'Site URL',
      type: 'url',
      validation: (rule) => rule.required().uri({ scheme: 'https' }),
    }),
    defineField({
      name: 'copyright',
      title: 'Copyright text',
      type: 'text',
      rows: 1,
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'navigation',
      title: 'Navigation items',
      description: 'Links to display in the header navigation bar.',
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
    defineField({
      name: 'headline',
      title: 'Homepage headline',
      description: 'Headline length must be between 25 and 75 characters.',
      type: 'text',
      rows: 2,
      fieldset: 'homepage',
      validation: (rule) => rule.required().min(25).max(75),
    }),
    defineField({
      name: 'subheadline',
      title: 'Homepage subheadline',
      type: 'text',
      rows: 3,
      fieldset: 'homepage',
      description: 'Subheadline length must be at least 50 characters.',
      validation: (rule) => rule.required().min(50),
    }),
    defineField({
      name: 'featuredPages',
      title: 'Featured pages',
      description: 'Pages to feature on the homepage.',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'page' }] }],
      fieldset: 'homepage',
      validation: (rule) => rule.required().min(1),
    }),
  ],
  __experimental_formPreviewTitle: false,
});
