import Token from '@site/src/components/Api/Code/Token';
import React from 'react';
import type {JSONOutput} from 'typedoc';

export default function FlagsPreview({
  flags,
  explicitAccessModifier,
}: {
  flags: JSONOutput.ReflectionFlags;
  explicitAccessModifier?: boolean;
}) {
  const tokens = [];

  if (flags?.isAbstract) {
    tokens.push('abstract');
  }
  if (flags?.isStatic) {
    tokens.push('static');
  }
  if (flags?.isConst) {
    tokens.push('const');
  }
  if (flags?.isReadonly) {
    tokens.push('readonly');
  }
  if (flags?.isPrivate) {
    tokens.push('private');
  }
  if (flags?.isProtected) {
    tokens.push('protected');
  }
  if (
    flags?.isPublic ||
    (explicitAccessModifier && !flags?.isProtected && !flags?.isPrivate)
  ) {
    tokens.push('public');
  }

  return (
    <>
      {tokens.map(token => (
        <Token key={token} type="keyword">
          {token}{' '}
        </Token>
      ))}
    </>
  );
}
