import React from 'react';
import type {JSONOutput} from 'typedoc';
import Summary from '@site/src/components/Api/Comment/Summary';
import ParameterPreview from '@site/src/components/Api/Preview/ParameterPreview';

export default function Parameters({
  parameters,
}: {
  parameters: JSONOutput.ParameterReflection[];
}) {
  if (!parameters?.length) {
    return <></>;
  }

  return (
    <>
      <h4>Parameters</h4>
      <ul>
        {parameters.map(parameter => (
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
