import React from 'react';
import type {JSONOutput} from 'typedoc';
import TypeParameterPreview from '@site/src/components/Api/Preview/TypeParameterPreview';
import Summary from '@site/src/components/Api/Comment/Summary';

export default function TypeParameters({
  parameters,
}: {
  parameters: JSONOutput.TypeParameterReflection[];
}) {
  if (!parameters?.length) {
    return <></>;
  }

  return (
    <>
      <h4>Type Parameters</h4>
      <ul>
        {parameters.map(parameter => (
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
