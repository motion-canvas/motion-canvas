import React from 'react';

import Token from '@site/src/components/Api/Code/Token';
import type {JSONOutput} from 'typedoc';

export default function InferredType({type}: {type: JSONOutput.InferredType}) {
  return (
    <>
      <Token type="keyword">infer </Token>
      <Token type="constant">{type.name}</Token>
    </>
  );
}
