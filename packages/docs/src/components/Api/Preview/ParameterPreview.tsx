import Token from '@site/src/components/Api/Code/Token';
import FlagsPreview from '@site/src/components/Api/Preview/FlagsPreview';
import Type from '@site/src/components/Api/Type';
import React from 'react';
import type {JSONOutput} from 'typedoc';

export default function ParameterPreview({
  reflection,
}: {
  reflection: JSONOutput.ParameterReflection;
}) {
  const name =
    reflection.name === '__namedParameters' ? '{...}' : reflection.name;

  return (
    <>
      <FlagsPreview flags={reflection.flags} />
      {reflection.flags.isRest && '...'}
      <Token
        id={reflection.anchor}
        to={reflection.anchor ? `#${reflection.anchor}` : undefined}
        type="plain"
      >
        {name}
      </Token>
      {reflection.flags.isOptional && '?'}
      {': '}
      {reflection.type && <Type type={reflection.type} />}
      {reflection.defaultValue && (
        <>
          {' = '}
          <Token type="plain">{reflection.defaultValue}</Token>
        </>
      )}
    </>
  );
}
