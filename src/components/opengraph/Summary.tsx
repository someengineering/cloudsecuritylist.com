import { clsx } from 'clsx';

export default function Summary({
  title,
  description,
  logo,
}: {
  title: string;
  description: string;
  logo?: string;
}) {
  return (
    <div tw="flex">
      {logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logo}
          alt=""
          tw="-mt-5 mr-6 h-28 w-28 rounded-full bg-white p-1"
        />
      ) : null}
      <div tw="flex flex-col">
        <div tw="text-7xl font-bold leading-none tracking-tight">{title}</div>
        <div tw={clsx('mt-7 text-4xl font-medium', logo ? 'w-7/8' : 'w-4/5')}>
          {description}
        </div>
      </div>
    </div>
  );
}
