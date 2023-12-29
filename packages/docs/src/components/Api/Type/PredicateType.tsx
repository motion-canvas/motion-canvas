import React from 'react';

import Token from '@site/src/components/Api/Code/Token';
import Type from '@site/src/components/Api/Type';
import type {JSONOutput} from 'typedoc';

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
