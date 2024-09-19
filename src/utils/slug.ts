import speakingurl from 'speakingurl';

export const isValidSlug = (slug: string): boolean => {
  return /^[a-z0-9](-?[a-z0-9])*$/.test(slug);
};

export const slugify = (value: string) => {
  const slugifyOpts = { truncate: 200, symbols: true };
  return value ? speakingurl(value, slugifyOpts) : '';
};
