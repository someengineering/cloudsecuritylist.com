export const PAGE = `
  "slug": slug.current,
  title,
  description,
  "icon": icon.name,
  ...select(!defined(listType) => { longTitle, textContent[] }),
`;
