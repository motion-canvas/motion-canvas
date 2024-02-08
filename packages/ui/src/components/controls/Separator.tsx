import type {JSX} from 'preact';

export interface SeparatorProps extends JSX.HTMLAttributes<HTMLDivElement> {
  size?: number;
}

export function Separator({size = 2, ...props}: SeparatorProps) {
  return (
    <div
      {...props}
      style={{
        height: size * 8,
      }}
    />
  );
}
