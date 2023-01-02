import React from 'react';

import type {JSONOutput} from 'typedoc';
import Token from '@site/src/components/Api/Code/Token';
import Type from '@site/src/components/Api/Type';
import TokenList, {ListType} from '@site/src/components/Api/Code/TokenList';
import FlagsPreview from '@site/src/components/Api/Preview/FlagsPreview';
import {ReflectionKind} from '@site/src/components/Api/ReflectionKind';
import TypeParameterPreview from '@site/src/components/Api/Preview/TypeParameterPreview';

const mainKeyword = {
  [ReflectionKind.Namespace]: 'namespace',
  [ReflectionKind.Enum]: 'enum',
  [ReflectionKind.Class]: 'class',
  [ReflectionKind.Interface]: 'interface',
};

export default function ClassPreview({
  reflection,
}: {
  reflection: JSONOutput.DeclarationReflection;
}) {
  return (
    <>
      <FlagsPreview flags={reflection.flags} />
      <Token type="keyword">{mainKeyword[reflection.kind]} </Token>
      <Token type="class-name">{reflection.name}</Token>
      {!!reflection.typeParameters?.length && (
        <TokenList type={ListType.Angle}>
          {reflection.typeParameters.map((type, index) => (
            <TypeParameterPreview key={index} reflection={type} />
          ))}
        </TokenList>
      )}{' '}
      {!!reflection.extendedTypes?.length && (
        <>
          <Token type="keyword">extends </Token>
          <TokenList>
            {reflection.extendedTypes.map((type, index) => (
              <Type key={index} type={type} />
            ))}
          </TokenList>
        </>
      )}
      {!!reflection.implementedTypes?.length && (
        <>
          <Token type="keyword">implements </Token>
          <TokenList>
            {reflection.implementedTypes.map((type, index) => (
              <Type key={index} type={type} />
            ))}
          </TokenList>
        </>
      )}
    </>
  );
}
