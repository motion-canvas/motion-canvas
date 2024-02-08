import React from 'react';

import type {JSONOutput} from 'typedoc';
import Type from '@site/src/components/Api/Type';

export default function ArrayType({type}: {type: JSONOutput.ArrayType}) {
  return (
    <>
      <Type type={type.elementType} />
      []
    </>
  );
}
