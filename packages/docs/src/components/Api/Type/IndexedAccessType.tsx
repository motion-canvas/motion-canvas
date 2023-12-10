import React from 'react';

import Type from '@site/src/components/Api/Type';
import type {JSONOutput} from 'typedoc';

export default function IndexedAccessType({
  type,
}: {
  type: JSONOutput.IndexedAccessType;
}) {
  return (
    <>
      <Type type={type.objectType} />
      [<Type type={type.indexType} />]
    </>
  );
}
