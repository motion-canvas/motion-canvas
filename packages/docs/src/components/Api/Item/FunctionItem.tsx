import React from 'react';

import Signatures from '@site/src/components/Api/Signatures';
import ReferenceType from '@site/src/components/Api/Type/ReferenceType';
import Heading from '@theme/Heading';
import type {JSONOutput} from 'typedoc';

export default function FunctionItem({
  reflection,
  headless,
}: {
  reflection: JSONOutput.DeclarationReflection;
  headless?: boolean;
}) {
  const signatures = [
    ...(reflection.signatures ?? []),
    reflection.setSignature,
    reflection.getSignature,
    reflection.indexSignature,
  ].filter(item => !!item);

  return (
    <>
      {!headless &&
        (reflection.hasOwnPage ? (
          <h1>{reflection.name}</h1>
        ) : (
          <Heading as="h3" id={reflection.anchor}>
            <code>{reflection.name}</code>
          </Heading>
        ))}
      <Signatures
        signatures={signatures}
        flags={reflection.flags}
        source={reflection.sources?.[0]}
      />
      {reflection.inheritedFrom && (
        <small>
          Inherited from{' '}
          <code>
            <ReferenceType type={reflection.inheritedFrom} />
          </code>
        </small>
      )}
      {reflection.overwrites && (
        <small>
          Overwrites{' '}
          <code>
            <ReferenceType type={reflection.overwrites} />
          </code>
        </small>
      )}
    </>
  );
}
