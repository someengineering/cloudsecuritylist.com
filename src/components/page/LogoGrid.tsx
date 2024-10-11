import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

export default function LogoGrid({
  items,
}: {
  items: {
    title: string;
    href: string;
    imageSrc: string;
    imageAspectRatio: number;
  }[];
}) {
  if (!items.length) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-1 overflow-hidden rounded-2xl lg:grid-cols-3">
      {items.map((item) => (
        <Link
          href={item.href}
          title={item.title}
          key={item.title}
          className="h-36 bg-gray-50 p-6 hover:bg-cyan-50"
        >
          <div className="relative h-full w-full">
            <Image
              src={item.imageSrc}
              alt={item.title}
              fill={true}
              className={clsx(
                'my-auto w-full object-contain object-center',
                item.imageAspectRatio > 1.625
                  ? 'max-h-14'
                  : item.imageAspectRatio > 1
                    ? 'max-h-16'
                    : 'max-h-20',
              )}
            />
          </div>
        </Link>
      ))}
    </div>
  );
}
