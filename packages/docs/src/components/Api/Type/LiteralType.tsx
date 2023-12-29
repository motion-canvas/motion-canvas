import React, {useMemo} from 'react';

import Token from '@site/src/components/Api/Code/Token';
import type {JSONOutput} from 'typedoc';

export default function LiteralType({type}: {type: JSONOutput.LiteralType}) {
  const [value, token] = useMemo(() => {
    if (type.value === null) {
      return ['null', 'keyword'];
    }
    switch (typeof type.value) {
      case 'object':
        return [(type.value.negative ? '-' : '') + type.value.value, 'number'];
      case 'boolean':
        return [type.value, 'keyword'];
      case 'number':
        return [type.value, 'number'];
      case 'string':
        return [`'${type.value}'`, 'string'];
      default:
        return [type.value, 'constant'];
    }
  }, [type.value]);

  return <Token type={token}>{value}</Token>;
}
