import React from 'react';

import type {JSONOutput} from 'typedoc';
import Type from '@site/src/components/Api/Type';
import TokenList, {
  ListType,
  Separator,
} from '@site/src/components/Api/Code/TokenList';

export default function IntersectionType({
  type,
}: {
  type: JSONOutput.IntersectionType;
}) {
  return (
    <TokenList type={ListType.Parentheses} separator={Separator.Ampersand}>
      {type.types.map((item, index) => (
        <Type key={index} type={item} />
      ))}
    </TokenList>
  );
}
