import React from 'react';

import Token from '@site/src/components/Api/Code/Token';
import Type from '@site/src/components/Api/Type';
import type {JSONOutput} from 'typedoc';

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
