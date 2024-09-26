import Logo from '@/assets/logo-horizontal-inverted.svg';
import { ReactElement } from 'react';

export default function Layout({ children }: { children: ReactElement }) {
  return (
    <div
      tw="flex h-full w-full flex-col justify-between"
      style={{
        backgroundImage:
          'linear-gradient(165deg, #0891b2, #0891b2 75%, #46adc6 75%, #46adc6)',
      }}
    >
      <div
        tw="absolute inset-0 top-0 h-full w-full opacity-15"
        style={{
          backgroundImage:
            'linear-gradient(100deg, transparent, transparent 90%, #fff 90%, #fff)',
        }}
      />
      <div tw="flex p-8">
        <Logo tw="text-cyan-600" width={336} height={49} />
      </div>
      <div tw="w-7/8 flex grow px-8 py-12 text-white">{children}</div>
    </div>
  );
}
