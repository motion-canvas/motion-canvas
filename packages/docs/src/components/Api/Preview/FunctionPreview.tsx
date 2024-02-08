import React from 'react';

import type {JSONOutput} from 'typedoc';
import SignaturePreview from '@site/src/components/Api/Preview/SignaturePreview';

export default function FunctionPreview({
  reflection,
}: {
  reflection: JSONOutput.DeclarationReflection;
}) {
  const signature =
    reflection.signatures?.[0] ??
    reflection.getSignature ??
    reflection.setSignature ??
    reflection.indexSignature;

  return <SignaturePreview reflection={signature} />;
}
