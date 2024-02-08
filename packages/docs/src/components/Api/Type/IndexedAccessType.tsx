import React from 'react';

import type {JSONOutput} from 'typedoc';
import Type from '@site/src/components/Api/Type';

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
