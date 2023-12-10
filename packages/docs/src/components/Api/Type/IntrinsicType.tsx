import React from 'react';

import Token from '@site/src/components/Api/Code/Token';
import type {JSONOutput} from 'typedoc';

export default function IntrinsicType({
  type,
}: {
  type: JSONOutput.IntrinsicType;
}) {
  return <Token type="keyword">{type.name}</Token>;
}
