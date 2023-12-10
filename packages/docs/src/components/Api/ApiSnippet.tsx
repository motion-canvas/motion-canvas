import Item from '@site/src/components/Api/Item';
import {useUrlLookup} from '@site/src/contexts/api';
import React from 'react';

export default function ApiSnippet({url}: {url: string}) {
  const reflection = useUrlLookup()(url);
  return <Item reflection={reflection} headless />;
}
