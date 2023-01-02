import React from 'react';

import type {JSONOutput} from 'typedoc';
import Token from '@site/src/components/Api/Code/Token';

export default function IntrinsicType({
  type,
}: {
  type: JSONOutput.IntrinsicType;
}) {
  return <Token type="keyword">{type.name}</Token>;
}
