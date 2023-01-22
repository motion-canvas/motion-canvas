import React from 'react';

import type {JSONOutput} from 'typedoc';
import Token from '@site/src/components/Api/Code/Token';
import TokenList, {ListType} from '@site/src/components/Api/Code/TokenList';
import Type from '@site/src/components/Api/Type';
import TypeParameterPreview from '@site/src/components/Api/Preview/TypeParameterPreview';
import FlagsPreview from '@site/src/components/Api/Preview/FlagsPreview';
import {useApiFinder} from '@site/src/contexts/api';

export default function TypeAliasPreview({
  reflection,
}: {
  reflection: JSONOutput.DeclarationReflection;
}) {
  const find = useApiFinder();
  return (
    <>
      <FlagsPreview flags={reflection.flags} />
      <Token type="keyword">type </Token>
      <Token type="class-name">{reflection.name}</Token>
      {reflection.typeParameters && (
        <TokenList type={ListType.Angle}>
          {reflection.typeParameters.map(type => (
            <TypeParameterPreview key={type.id} reflection={find(type)} />
          ))}
        </TokenList>
      )}
      {' = '}
      <Type type={reflection.type} />
    </>
  );
}
