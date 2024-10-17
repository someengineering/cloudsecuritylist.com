import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'person',
  title: 'Person',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'linkedin',
      title: 'LinkedIn URL',
      type: 'url',
      validation: (rule) =>
        rule
          .uri({ scheme: 'https' })
          .custom(
            (value) =>
              !value ||
              !!new URL(value).host.match(/^(www\.)?linkedin.com$/) ||
              'URL host must be linkedin.com.',
          ),
    }),
  ],
});
