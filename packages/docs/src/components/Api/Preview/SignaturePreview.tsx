import React from 'react';

import type {JSONOutput} from 'typedoc';
import {ReflectionKind} from '@site/src/components/Api/ReflectionKind';
import ParameterPreview from '@site/src/components/Api/Preview/ParameterPreview';
import Type from '@site/src/components/Api/Type';
import Token from '@site/src/components/Api/Code/Token';
import TokenList, {ListType} from '@site/src/components/Api/Code/TokenList';
import TypeParameterPreview from '@site/src/components/Api/Preview/TypeParameterPreview';
import {getUrl, useApiLookup} from '@site/src/contexts/api';
import FlagsPreview from '@site/src/components/Api/Preview/FlagsPreview';

export default function SignaturePreview({
  reflection,
  flags,
}: {
  reflection: JSONOutput.SignatureReflection;
  flags?: JSONOutput.ReflectionFlags;
}) {
  const lookup = useApiLookup();
  const isArrow = reflection.name === '__type';

  return (
    <>
      <FlagsPreview
        flags={flags ?? reflection.flags}
        explicitAccessModifier={!isArrow}
      />
      {reflection.kind === ReflectionKind.GetSignature && (
        <Token type="keyword">get </Token>
      )}
      {reflection.kind === ReflectionKind.SetSignature && (
        <Token type="keyword">set </Token>
      )}
      {reflection.overwrites && (
        <>
          <Token to={getUrl(lookup[reflection.overwrites.id])} type="keyword">
            override
          </Token>{' '}
        </>
      )}
      {reflection.kind === ReflectionKind.ConstructorSignature ? (
        <>
          <Token to={'#'} type="keyword">
            new
          </Token>{' '}
          <Token type="plain">
            {(reflection.type as JSONOutput.ReferenceType).name}
          </Token>
        </>
      ) : isArrow ? (
        ''
      ) : (
        <Token type="plain">{reflection.name}</Token>
      )}
      {!!reflection.typeParameter?.length && (
        <TokenList type={ListType.Angle}>
          {reflection.typeParameter.map(type => (
            <TypeParameterPreview key={type.id} reflection={type} />
          ))}
        </TokenList>
      )}
      {reflection.parameters?.length ? (
        <TokenList type={ListType.Parentheses}>
          {reflection.parameters.map(parameter => (
            <ParameterPreview key={parameter.id} reflection={parameter} />
          ))}
        </TokenList>
      ) : (
        '()'
      )}
      {reflection.type && (
        <>
          {isArrow ? ' => ' : ': '}
          <Type type={reflection.type} />
        </>
      )}
    </>
  );
}
