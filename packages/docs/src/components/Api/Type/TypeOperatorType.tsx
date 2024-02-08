import React from 'react';

import type {JSONOutput} from 'typedoc';
import Type from '@site/src/components/Api/Type';
import Token from '@site/src/components/Api/Code/Token';

export default function TypeOperatorType({
  type,
}: {
  type: JSONOutput.TypeOperatorType;
}) {
  return (
    <>
      <Token type="keyword">{type.operator} </Token>
      <Type type={type.target} />
    </>
  );
}
