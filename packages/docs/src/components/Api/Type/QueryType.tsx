import React from 'react';

import type {JSONOutput} from 'typedoc';
import Token from '@site/src/components/Api/Code/Token';
import Type from '@site/src/components/Api/Type';

export default function QueryType({type}: {type: JSONOutput.QueryType}) {
  return (
    <>
      <Token type="keyword">typeof </Token>
      <Type type={type.queryType} />
    </>
  );
}
