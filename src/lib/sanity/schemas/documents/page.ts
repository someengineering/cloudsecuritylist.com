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
              ? value[0].style === 'h1' || {
                  message: 'First block must be a level 1 heading.',
                  path: [{ _key: value[0]._key }],
                }
              : true,
          )
          .custom((value: PortableTextTextBlock[] | undefined) => {
            if (!value?.length) {
              return true;
            }

            const offendingPaths = value
              .filter((block, index) => block.style === 'h1' && index > 0)
              .map((block) => ({ _key: block._key }));

            return (
              !offendingPaths.length || {
                message: 'Only the first block may be a level 1 heading.',
                path: [offendingPaths[0]],
              }
            );
          }),
    }),
    defineField({
      name: 'unlisted',
      title: 'Unlisted',
      type: 'boolean',
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
