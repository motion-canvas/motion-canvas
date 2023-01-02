import React from 'react';

import type {JSONOutput} from 'typedoc';
import ParameterPreview from '@site/src/components/Api/Preview/ParameterPreview';

export default function PropertyPreview({
  reflection,
}: {
  reflection: JSONOutput.SignatureReflection;
}) {
  return <ParameterPreview reflection={reflection} />;
}
