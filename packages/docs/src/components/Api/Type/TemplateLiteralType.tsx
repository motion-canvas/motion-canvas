import React from 'react';

import type {JSONOutput} from 'typedoc';
import Type from '@site/src/components/Api/Type';
import Token from '@site/src/components/Api/Code/Token';

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
