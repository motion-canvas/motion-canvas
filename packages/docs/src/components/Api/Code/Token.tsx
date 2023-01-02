import React, {ReactNode} from 'react';
import {useTokenProps} from '@site/src/contexts/codeTheme';
import Link from '@docusaurus/Link';

export default function Token({
  children,
  type,
  to,
  id,
  tooltip,
}: {
  children: ReactNode | ReactNode[];
  type?: string;
  to?: string;
  id?: string;
  tooltip?: boolean;
}) {
  const props = useTokenProps(type);
  return to ? (
    <Link id={id} to={to} data-tooltip={tooltip} {...props}>
      {children}
    </Link>
  ) : (
    <span id={id} {...props}>
      {children}
    </span>
  );
}
