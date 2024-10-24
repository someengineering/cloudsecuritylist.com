import { iconComponents } from '@/components/common/Icon/mapping';
import type { IconBaseProps } from 'react-icons';

interface IconProps extends IconBaseProps {
  name: string;
}

export default function Icon({ name, ...props }: IconProps) {
  if (!iconComponents[name]) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return iconComponents[name](props);
}
