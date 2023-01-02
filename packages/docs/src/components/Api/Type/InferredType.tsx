import React from 'react';

import type {JSONOutput} from 'typedoc';
import Token from '@site/src/components/Api/Code/Token';

export default function InferredType({type}: {type: JSONOutput.InferredType}) {
  return (
    <>
      <Token type="keyword">infer </Token>
      <Token type="constant">{type.name}</Token>
    </>
  );
}
