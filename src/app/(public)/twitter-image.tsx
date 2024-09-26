import OpenGraphImage from './opengraph-image';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function TwitterImage() {
  return OpenGraphImage();
}
