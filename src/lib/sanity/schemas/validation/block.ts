import { PortableTextChild, PortableTextTextBlock } from 'sanity';

export const notEmpty = (block: PortableTextTextBlock) =>
  block.children.some(
    (span: PortableTextChild) =>
      span._type === 'span' &&
      typeof span.text === 'string' &&
      !!span.text.trim(),
  ) || 'Block must not be empty.';

export const noStartingOrTerminatingWhitespace = (
  block: PortableTextTextBlock,
) => {
  const { 0: first, length, [length - 1]: last } = block.children ?? [];

  return (
    ((typeof first?.text !== 'string' || !/^\s/.test(first.text)) &&
      (typeof last?.text !== 'string' || !/\s$/.test(last.text))) ||
    'Block must not start or end with whitespace.'
  );
};

export const noNewlines = (block: PortableTextTextBlock) => {
  return (
    !block.children.some(
      (span: PortableTextChild) =>
        span._type === 'span' &&
        typeof span.text === 'string' &&
        span.text.includes('\n'),
    ) || 'Block may not contain newlines.'
  );
};

export const noHeadingMarks = (block: PortableTextTextBlock) => {
  return (
    !block.style?.startsWith('h') ||
    !block.children?.some(
      (span) =>
        span._type === 'span' && Array.isArray(span.marks) && span.marks.length,
    ) ||
    'Heading may not contain marks (e.g., bold, italics, links, etc.).'
  );
};
