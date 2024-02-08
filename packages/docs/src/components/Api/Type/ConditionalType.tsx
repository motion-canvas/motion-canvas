import React from 'react';

import type {JSONOutput} from 'typedoc';
import Type from '@site/src/components/Api/Type';
import Token from '@site/src/components/Api/Code/Token';

export default function ConditionalType({
  type,
}: {
  type: JSONOutput.ConditionalType;
}) {
  return (
    <>
      <Type type={type.checkType} />
      <Token type="keyword"> extends </Token>
      <Type type={type.extendsType} />
      {' ? '}
      <Type type={type.trueType} />
      {' : '}
      <Type type={type.falseType} />
    </>
  );
}
