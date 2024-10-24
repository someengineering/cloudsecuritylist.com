const fs = require('fs/promises');
const path = require('path');
const { createClient, groq } = require('next-sanity');
const hi2Icons = require('react-icons/hi2');
const siIcons = require('react-icons/si');

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion:
    process.env.NEXT_PUBLIC_SANITY_API_VERSION ||
    new Date().toISOString().split('T')[0],
  perspective: 'raw',
  useCdn: false,
});

async function generateMapping() {
  try {
    const icons = await sanityClient.fetch(
      groq`array::unique(*[defined(icon)].icon.name) | order(@ asc)`,
    );

    const invalidIcons = [];
    const validIcons = new Set(['HiOutlineXCircle']);

    icons.forEach((iconName) => {
      if (!iconName) {
        return;
      } else if (!iconName.startsWith('Hi') && !iconName.startsWith('Si')) {
        invalidIcons.push(iconName);
        return;
      }

      const iconSet = iconName.startsWith('Hi')
        ? hi2Icons
        : iconName.startsWith('Si')
          ? siIcons
          : undefined;

      if (iconSet && iconSet[iconName]) {
        validIcons.add(iconName);
      } else {
        invalidIcons.push(iconName);
      }
    });

    const imports = Array.from(validIcons).map(
      (name) =>
        `import { ${name} } from 'react-icons/${name.startsWith('Hi') ? 'hi2' : name.startsWith('Si') ? 'si' : ''}';`,
    );

    const mappings = Array.from(validIcons).map((name) => `  ${name}`);

    const fileContent = `// This file is auto-generated. Do not edit directly.
import type { IconType } from 'react-icons';

${imports.join('\n')}

export const iconComponents: Record<string, IconType> = {
${mappings.join(',\n')}
};

export const fallbackIcon = HiOutlineXCircle;
`;

    const dir = path.join(process.cwd(), 'src', 'components', 'common', 'Icon');
    await fs.mkdir(dir, { recursive: true });

    await fs.writeFile(path.join(dir, 'mapping.ts'), fileContent, 'utf-8');

    // Log summary
    console.log(`Icon mapping generated:`);
    console.log(`- ${validIcons.size} valid icons included`);

    if (invalidIcons.length > 0) {
      console.warn('\nWarning: Found invalid icons that will use fallback:');
      invalidIcons.forEach((icon) => console.warn(`- ${icon}`));
    }
  } catch (error) {
    console.error('Error generating icon mapping:', error);
    console.warn('Using previous icon mapping if it exists');
  }
}

generateMapping();
