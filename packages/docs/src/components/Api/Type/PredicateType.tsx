import React from 'react';

import type {JSONOutput} from 'typedoc';
import Type from '@site/src/components/Api/Type';
import Token from '@site/src/components/Api/Code/Token';

export default function PredicateType({
  type,
}: {
  type: JSONOutput.PredicateType;
}) {
  return type.asserts ? (
    <>
      <Token type="keyword">asserts </Token>
      <Token>{type.name} </Token>
    </>
  ) : (
    <>
      <Token>{type.name} </Token>
      <Token type="keyword">is </Token>
      <Type type={type.targetType} />
    </>
  );
}
