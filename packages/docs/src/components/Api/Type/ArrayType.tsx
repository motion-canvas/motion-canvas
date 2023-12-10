import React from 'react';

import Type from '@site/src/components/Api/Type';
import type {JSONOutput} from 'typedoc';

export default function ArrayType({type}: {type: JSONOutput.ArrayType}) {
  return (
    <>
      <Type type={type.elementType} />
      []
    </>
  );
}
