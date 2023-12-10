import React from 'react';

import Token from '@site/src/components/Api/Code/Token';
import TokenList, {ListType} from '@site/src/components/Api/Code/TokenList';
import FlagsPreview from '@site/src/components/Api/Preview/FlagsPreview';
import ParameterPreview from '@site/src/components/Api/Preview/ParameterPreview';
import TypeParameterPreview from '@site/src/components/Api/Preview/TypeParameterPreview';
import {ReflectionKind} from '@site/src/components/Api/ReflectionKind';
import Type from '@site/src/components/Api/Type';
import {getUrl, useApiFinder} from '@site/src/contexts/api';
import type {JSONOutput} from 'typedoc';

export default function SignaturePreview({
  reflection,
  flags,
}: {
  reflection: JSONOutput.SignatureReflection;
  flags?: JSONOutput.ReflectionFlags;
}) {
  const find = useApiFinder();
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
          <Token
            to={
              reflection.overwrites.externalUrl ??
              getUrl(find(reflection.overwrites.id))
            }
            type="keyword"
          >
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
        <Token type="function">{reflection.name}</Token>
      )}
      {!!reflection.typeParameter?.length && (
        <TokenList type={ListType.Angle}>
          {reflection.typeParameter.map(type => (
            <TypeParameterPreview key={type.id} reflection={find(type)} />
          ))}
        </TokenList>
      )}
      {reflection.parameters?.length ? (
        <TokenList type={ListType.Parentheses}>
          {reflection.parameters.map(id => (
            <ParameterPreview key={id} reflection={find(id)} />
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
