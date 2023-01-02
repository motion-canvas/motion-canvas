import React from 'react';

import type {JSONOutput} from 'typedoc';
import Type from '@site/src/components/Api/Type';
import TokenList, {
  ListType,
  Separator,
} from '@site/src/components/Api/Code/TokenList';

export default function UnionType({type}: {type: JSONOutput.UnionType}) {
  return (
    <TokenList type={ListType.Parentheses} separator={Separator.Pipe}>
      {type.types.map((item, index) => (
        <Type key={index} type={item} />
      ))}
    </TokenList>
  );
}
