import React, {ComponentProps} from 'react';

export default function IconCode({
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
        d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"
        fill="currentColor"
      />
    </svg>
  );
}
