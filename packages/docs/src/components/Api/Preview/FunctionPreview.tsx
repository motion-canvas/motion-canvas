import React from 'react';

import SignaturePreview from '@site/src/components/Api/Preview/SignaturePreview';
import type {JSONOutput} from 'typedoc';

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
