import React from 'react';

import TokenList, {
  ListType,
  Separator,
} from '@site/src/components/Api/Code/TokenList';
import Type from '@site/src/components/Api/Type';
import type {JSONOutput} from 'typedoc';

export default function UnionType({type}: {type: JSONOutput.UnionType}) {
  return (
    <TokenList type={ListType.Parentheses} separator={Separator.Pipe}>
      {type.types.map((item, index) => (
        <Type key={index} type={item} />
      ))}
    </TokenList>
  );
}
