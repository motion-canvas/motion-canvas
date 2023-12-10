import * as summaries from '@site/src/generated/markdown';
import React from 'react';

export default function Summary({id}: {id: string}) {
  const Content = summaries[id] ?? React.Fragment;
  return <Content />;
}
