import React from 'react';

import Signatures from '@site/src/components/Api/Signatures';
import type {JSONOutput} from 'typedoc';
import Heading from '@theme/Heading';
import ReferenceType from '@site/src/components/Api/Type/ReferenceType';

export default function FunctionItem({
  reflection,
}: {
  reflection: JSONOutput.DeclarationReflection;
}) {
  const signatures = [
    ...(reflection.signatures ?? []),
    reflection.setSignature,
    reflection.getSignature,
    reflection.indexSignature,
  ].filter(item => !!item);

  return (
    <>
      {reflection.hasOwnPage ? (
        <h1>{reflection.name}</h1>
      ) : (
        <Heading as="h3" id={reflection.anchor}>
          <code>{reflection.name}</code>
        </Heading>
      )}
      <Signatures
        signatures={signatures}
        flags={reflection.flags}
        source={reflection.sources?.[0]}
      />
      {reflection.inheritedFrom && (
        <>
          Inherited from{' '}
          <code>
            <ReferenceType type={reflection.inheritedFrom} />
          </code>
        </>
      )}
      {reflection.overwrites && (
        <>
          Overwrites{' '}
          <code>
            <ReferenceType type={reflection.overwrites} />
          </code>
        </>
      )}
    </>
  );
}
