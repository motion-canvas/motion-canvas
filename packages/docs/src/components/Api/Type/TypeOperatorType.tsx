import React from 'react';

import Token from '@site/src/components/Api/Code/Token';
import Type from '@site/src/components/Api/Type';
import type {JSONOutput} from 'typedoc';

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
