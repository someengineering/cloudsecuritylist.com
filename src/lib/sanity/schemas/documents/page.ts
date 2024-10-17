import {
  noHeadingMarks,
  noNewlines,
  noStartingOrTerminatingWhitespace,
  notEmpty,
} from '@/lib/sanity/schemas/validation/block';
import { DocumentIcon } from '@sanity/icons';
import { defineField, defineType, PortableTextTextBlock } from 'sanity';
import { preview } from 'sanity-plugin-icon-picker';

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
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
      name: 'title',
      title: 'Page title',
      type: 'string',
      validation: (rule) => rule.required().min(1).max(50),
    }),
    defineField({
      name: 'longTitle',
      title: 'Long page title',
      description:
        'Optional longer, more descriptive variant of the page title.',
      type: 'string',
      hidden: ({ parent }) => !!parent.listType,
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'alternateSlugs',
      title: 'Alternate slugs',
      type: 'alternateSlugs',
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
          { title: 'Open-source project', value: 'openSourceProject' },
          { title: 'Organization', value: 'organization' },
          { title: 'Product category', value: 'productCategory' },
          { title: 'Publication', value: 'publication' },
          { title: 'Research', value: 'research' },
        ],
      },
      fieldset: 'content',
      hidden: ({ parent }) => !!parent.textContent?.length,
    }),
    defineField({
      name: 'textContent',
      title: 'Text content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'H5', value: 'h5' },
            { title: 'H6', value: 'h6' },
            { title: 'Quote', value: 'blockquote' },
          ],
          validation: (rule) =>
            rule
              .custom((value: PortableTextTextBlock) => notEmpty(value))
              .custom((value: PortableTextTextBlock) =>
                noStartingOrTerminatingWhitespace(value),
              )
              .custom((value: PortableTextTextBlock) => noNewlines(value))
              .custom((value: PortableTextTextBlock) => noHeadingMarks(value)),
        },
      ],
      fieldset: 'content',
      hidden: ({ parent }) => !!parent.listType,
      validation: (rule) =>
        rule
          .min(3)
          .custom((value: PortableTextTextBlock[] | undefined) =>
            value?.length
              ? !(value[value.length - 1].style ?? '').match(/^h[1-6]$/) || {
                  message: 'Last block may not be a heading.',
                  path: [{ _key: value[value.length - 1]._key }],
                }
              : true,
          )
          .custom((value: PortableTextTextBlock[] | undefined) => {
            if (!value?.length || value[0].style !== 'h2') {
              return true;
            }

            const offendingPaths = value
              .filter((block, index) => block.style === 'h2' && index > 0)
              .map((block) => ({ _key: block._key }));

            return (
              !offendingPaths.length || {
                message:
                  'If the first block is a level 2 heading, other blocks must be subheadings.',
                path: [offendingPaths[0]],
              }
            );
          }),
    }),
    defineField({
      name: 'displayUpdatedAt',
      title: 'Display "Updated at" date below text content',
      type: 'boolean',
      initialValue: false,
      fieldset: 'content',
      hidden: ({ parent }) => !!parent.listType,
    }),
    defineField({
      name: 'nofollow',
      title: 'Nofollow',
      description: 'Instruct search engines not to follow links on this page.',
      type: 'boolean',
      initialValue: false,
      hidden: ({ parent }) => !!parent.listType,
    }),
    defineField({
      name: 'unlisted',
      title: 'Unlisted',
      description: 'Instruct search engines not to crawl or index this page.',
      type: 'boolean',
      initialValue: false,
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
