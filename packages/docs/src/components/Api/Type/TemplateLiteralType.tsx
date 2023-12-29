import React from 'react';

import Token from '@site/src/components/Api/Code/Token';
import Type from '@site/src/components/Api/Type';
import type {JSONOutput} from 'typedoc';

export default function TemplateLiteralType({
  type,
}: {
  type: JSONOutput.TemplateLiteralType;
}) {
  return (
    <>
      <Token type="string">`{type.head}</Token>
      {type.tail.map(([type, text], index) => (
        <>
          {'${'}
          <Type key={index} type={type} />
          {'}'}
          <Token type="string">{text}</Token>
        </>
      ))}
      <Token type="string">`</Token>
    </>
  );
}
