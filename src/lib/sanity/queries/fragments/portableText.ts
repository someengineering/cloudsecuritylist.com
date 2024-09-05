export const PORTABLE_TEXT = `
  ...,
  markDefs[]{
    ...,
    _type == "internalLink" => {
      "slug": @.reference -> slug
    },
  },
`;
