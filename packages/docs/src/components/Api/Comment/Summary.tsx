import React from 'react';
import {useApiContent} from '@site/src/contexts/api';

export default function Summary({id}: {id: string}) {
  const Content = useApiContent(id);
  return <Content />;
}
