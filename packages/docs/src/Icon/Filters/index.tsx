import React, {ComponentProps} from 'react';

export default function IconFilters({
  width = 24,
  height = 24,
  ...props
}: ComponentProps<'svg'>): JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      width={width}
      height={height}
      aria-hidden
      {...props}
    >
      <path
        d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"
        fill="currentColor"
      />
    </svg>
  );
}
