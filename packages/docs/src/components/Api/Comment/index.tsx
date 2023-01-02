import React, {useMemo} from 'react';
import type {JSONOutput} from 'typedoc';
import Summary from '@site/src/components/Api/Comment/Summary';

export default function Comment({
  comment,
  withExamples = true,
}: {
  comment: JSONOutput.Comment;
  withExamples?: boolean;
}) {
  const remarks = useMemo(() => {
    return comment?.blockTags?.find(({tag}) => tag === '@remarks');
  }, [comment]);
  const examples = useMemo(() => {
    return comment?.blockTags?.filter(({tag}) => tag === '@example') ?? [];
  }, [comment]);

  return (
    <>
      <Summary id={comment?.summaryId} />
      <Summary id={remarks?.contentId} />
      {withExamples && examples.length > 0 && (
        <>
          <h4>Examples</h4>
          {examples.map(example => (
            <Summary id={example.contentId} />
          ))}
        </>
      )}
    </>
  );
}
