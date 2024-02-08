import React from 'react';

import type {JSONOutput} from 'typedoc';
import Type from '@site/src/components/Api/Type';

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
