import React from 'react';

import Token from '@site/src/components/Api/Code/Token';
import TokenList, {ListType} from '@site/src/components/Api/Code/TokenList';
import FlagsPreview from '@site/src/components/Api/Preview/FlagsPreview';
import TypeParameterPreview from '@site/src/components/Api/Preview/TypeParameterPreview';
import Type from '@site/src/components/Api/Type';
import {useApiFinder} from '@site/src/contexts/api';
import type {JSONOutput} from 'typedoc';

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
