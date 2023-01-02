import React from 'react';

import type {JSONOutput} from 'typedoc';
import Type from '@site/src/components/Api/Type';
import TokenList, {ListType} from '@site/src/components/Api/Code/TokenList';

export default function TupleType({type}: {type: JSONOutput.TupleType}) {
  return (
    <TokenList type={ListType.Square}>
      {type.elements.map((type, index) => (
        <Type key={index} type={type} />
      ))}
    </TokenList>
  );
}
