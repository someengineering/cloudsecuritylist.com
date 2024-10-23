import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'iconPicker',
  title: 'Icon',
  type: 'object',
  fields: [
    defineField({
      name: 'provider',
      title: 'Provider',
      type: 'string',
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required().min(1),
    }),
  ],
  options: {
    columns: 2,
  },
});
