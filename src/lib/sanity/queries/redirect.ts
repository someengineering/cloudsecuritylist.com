import { groq } from 'next-sanity';

export const REDIRECT_QUERY = groq`*[_type == $type && $slug in alternateSlugs[].current][0].slug.current`;
