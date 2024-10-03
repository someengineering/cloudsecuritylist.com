import {
  noNewlines,
  noStartingOrTerminatingWhitespace,
  notEmpty,
} from '@/lib/sanity/schemas/validation/block';
import { LinkIcon, SearchIcon } from '@sanity/icons';
import { defineField, defineType, PortableTextTextBlock } from 'sanity';

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
      description: 'Displayed in the browser title bar after the site name.',
      type: 'string',
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'description',
      title: 'SEO description',
      description:
        'SEO description length must be between 50 and 160 characters. (Note: The homepage hero text is configured below.)',
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
      validation: (rule) => rule.required().min(10),
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
      name: 'heroTitle',
      title: 'Homepage hero title',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [],
          lists: [],
          marks: {
            decorators: [{ title: 'Strong', value: 'strong' }],
            annotations: [],
          },
          validation: (rule) =>
            rule
              .required()
              .custom((value: PortableTextTextBlock) => notEmpty(value))
              .custom((value: PortableTextTextBlock) =>
                noStartingOrTerminatingWhitespace(value),
              )
              .custom((value: PortableTextTextBlock) => noNewlines(value)),
        },
      ],
      fieldset: 'homepage',
      validation: (rule) => rule.required().min(1).max(1),
    }),
    defineField({
      name: 'heroDescription',
      title: 'Homepage hero description',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [],
          lists: [],
          validation: (rule) =>
            rule
              .required()
              .custom((value: PortableTextTextBlock) => notEmpty(value))
              .custom((value: PortableTextTextBlock) =>
                noStartingOrTerminatingWhitespace(value),
              )
              .custom((value: PortableTextTextBlock) => noNewlines(value)),
        },
      ],
      fieldset: 'homepage',
      validation: (rule) => rule.required().min(1),
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
