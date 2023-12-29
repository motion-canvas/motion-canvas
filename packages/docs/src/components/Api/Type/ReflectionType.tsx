import React from 'react';

import Preview from '@site/src/components/Api/Preview';
import {useApiFinder} from '@site/src/contexts/api';
import type {JSONOutput} from 'typedoc';

export default function ReflectionType({
  type,
}: {
  type: JSONOutput.ReflectionType;
}) {
  const find = useApiFinder();
  return <Preview reflection={find(type.declaration)} />;
}
