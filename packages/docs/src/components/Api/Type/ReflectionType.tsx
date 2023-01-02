import React from 'react';

import type {JSONOutput} from 'typedoc';
import Preview from '@site/src/components/Api/Preview';

export default function ReflectionType({
  type,
}: {
  type: JSONOutput.ReflectionType;
}) {
  return <Preview reflection={type.declaration} />;
}
