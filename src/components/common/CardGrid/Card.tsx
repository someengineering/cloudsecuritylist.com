import { CardProps } from '@/components/common/CardGrid';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

export default function Card({
  href,
  imageSrc,
  title,
  description,
  label,
  links,
  tags,
}: CardProps) {
  return (
    <li className="relative flex flex-col space-y-4 rounded-lg border border-gray-300 bg-white p-4 shadow-sm focus-within:ring-2 focus-within:ring-cyan-500 focus-within:ring-offset-2 hover:border-gray-400 lg:px-5">
      <div className="flex items-center space-x-3">
        {imageSrc ? (
          <div className="flex-shrink-0">
            <Image
              src={imageSrc}
              width={56}
              height={56}
              alt=""
              aria-hidden="true"
              className={clsx(
                'h-12 w-12 xs:h-14 xs:w-14',
                new URL(imageSrc).hostname.endsWith(
                  'avatars.githubusercontent.com',
                ) && 'rounded',
              )}
            />
          </div>
        ) : (
          <div className="h-12 w-12 flex-shrink-0 rounded bg-slate-100 xs:h-14 xs:w-14" />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-start">
              <Link
                href={href}
                {...(!href.startsWith('/')
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : null)}
                className="line-clamp-1 font-semibold text-gray-900 focus:outline-none"
              >
                <span aria-hidden="true" className="absolute inset-0" />
                {title}
              </Link>
              {label ? (
                <span className="mt-0.5 inline-flex items-center gap-x-1 rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10">
                  {label.icon ? (
                    <label.icon className="h-4 w-4" title={label.title} />
                  ) : null}
                  {label.title}
                </span>
              ) : null}
            </div>
            {links?.length ? (
              <ul
                role="list"
                className="z-10 hidden items-end gap-x-2.5 xs:flex"
              >
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      {...(!link.href.startsWith('/')
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : null)}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                      <span className="sr-only">{link.title}</span>
                      <link.icon className="h-5 w-5" title={link.title} />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
      <div className="text-sm text-gray-500">{description}</div>
      {tags?.length ? (
        <div className="flex grow flex-wrap content-end items-end gap-x-2 gap-y-1.5">
          {tags.map((tag) => (
            <Link
              href={tag.href}
              {...(!tag.href.startsWith('/')
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : null)}
              className="z-10 inline-flex items-center rounded-md bg-cyan-50 px-2 py-1 text-xs font-medium text-cyan-600 ring-1 ring-inset ring-cyan-500/10 hover:text-cyan-700 hover:ring-cyan-500/20"
              key={tag.href}
            >
              {tag.text}
            </Link>
          ))}
        </div>
      ) : null}
    </li>
  );
}
