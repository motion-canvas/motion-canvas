import Summary from '@site/src/components/Api/Comment/Summary';
import ParameterPreview from '@site/src/components/Api/Preview/ParameterPreview';
import {useApiFinder} from '@site/src/contexts/api';
import React, {useMemo} from 'react';
import type {JSONOutput} from 'typedoc';

export default function Parameters({parameters}: {parameters: number[]}) {
  const find = useApiFinder();
  const data = useMemo(
    () => parameters?.map(find<JSONOutput.ParameterReflection>),
    [parameters],
  );

  if (!data?.length) {
    return <></>;
  }

  return (
    <>
      <h4>Parameters</h4>
      <ul>
        {data.map(parameter => (
          <li key={parameter.id}>
            <code>
              <ParameterPreview
                reflection={parameter as JSONOutput.ParameterReflection}
              />
            </code>
            <Summary id={parameter.comment?.summaryId} />
          </li>
        ))}
      </ul>
    </>
  );
}
