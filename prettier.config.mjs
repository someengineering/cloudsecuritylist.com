/** @type {import("prettier").Config} */
const config = {
  plugins: ['prettier-plugin-organize-imports', 'prettier-plugin-tailwindcss'],
  singleQuote: true,
  tailwindConfig: './tailwind.config.ts',
  tailwindAttributes: ['tw'],
  tailwindFunctions: ['clsx'],
};

export default config;
