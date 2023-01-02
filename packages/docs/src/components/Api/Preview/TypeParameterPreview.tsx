import React from 'react';
import type {JSONOutput} from 'typedoc';
import FlagsSummary from '@site/src/components/Api/Preview/FlagsPreview';
import Token from '@site/src/components/Api/Code/Token';
import Type from '@site/src/components/Api/Type';

export default function TypeParameterPreview({
  reflection,
}: {
  reflection: JSONOutput.TypeParameterReflection;
}) {
  return (
    <>
      <FlagsSummary flags={reflection.flags} />
      {reflection.varianceModifier && (
        <Token type="keyword">{reflection.varianceModifier} </Token>
      )}
      <Token
        id={reflection.anchor}
        to={reflection.anchor ? `#${reflection.anchor}` : undefined}
        type="class-name"
      >
        {reflection.name}
      </Token>
      {reflection.type && (
        <>
          {' extends '}
          <Type type={reflection.type} />
        </>
      )}
      {reflection.default && (
        <>
          {' = '}
          <Type type={reflection.default} />
        </>
      )}
    </>
  );
}
