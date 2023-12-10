import Summary from '@site/src/components/Api/Comment/Summary';
import TypeParameterPreview from '@site/src/components/Api/Preview/TypeParameterPreview';
import {useApiFinder} from '@site/src/contexts/api';
import React, {useMemo} from 'react';
import type {JSONOutput} from 'typedoc';

export default function TypeParameters({parameters}: {parameters: number[]}) {
  const find = useApiFinder();
  const data = useMemo(
    () => parameters?.map(find<JSONOutput.TypeParameterReflection>),
    [parameters],
  );

  if (!data?.length) {
    return <></>;
  }

  return (
    <>
      <h4>Type Parameters</h4>
      <ul>
        {data.map(parameter => (
          <li key={parameter.id}>
            <code>
              <TypeParameterPreview reflection={parameter} />
            </code>
            <Summary id={parameter.comment?.summaryId} />
          </li>
        ))}
      </ul>
    </>
  );
}
