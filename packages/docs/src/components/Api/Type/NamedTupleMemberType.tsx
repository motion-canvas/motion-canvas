import React from 'react';

import Type from '@site/src/components/Api/Type';
import type {JSONOutput} from 'typedoc';

export default function NamedTupleMemberType({
  type,
}: {
  type: JSONOutput.NamedTupleMemberType;
}) {
  return (
    <>
      {type.name}: <Type type={type.element} />
    </>
  );
}
