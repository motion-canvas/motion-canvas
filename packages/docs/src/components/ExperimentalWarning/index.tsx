import Link from '@docusaurus/Link';
import Admonition from '@theme/Admonition';
import React from 'react';

export default function ExperimentalWarning() {
  return (
    <Admonition type="experimental">
      This is an <Link to="/docs/experimental">experimental feature</Link>. The
      behavior and API may change drastically between minor releases.
    </Admonition>
  );
}
