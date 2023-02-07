import React from 'react';
import Admonition from '@site/src/theme/Admonition';
import Link from '@docusaurus/Link';

export default function FirefoxTextWarning() {
  return (
    <Admonition type="caution">
      If you are using Firefox make sure to check if{' '}
      <code>dom.textMetrics.fontBoundingBox</code> is enabled else you might not
      see the{' '}
      <Link to="/api/2d/components/Text">
        <code>Text</code>
      </Link>
      . You can enable this by navigating to <code>about:config</code>.
    </Admonition>
  );
}
