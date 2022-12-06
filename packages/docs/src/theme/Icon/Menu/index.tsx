import React from 'react';
export default function IconMenu({
  width = 30,
  height = 30,
  className,
  ...restProps
}) {
  return (
    <svg
      className={className}
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...restProps}
    >
      {/*<path d="M0 0h24v24H0V0z" fill="currentColor" />*/}
      <path
        d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"
        fill="currentColor"
      />
    </svg>
  );
}
