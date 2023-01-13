import React, {useMemo} from 'react';
import type {JSONOutput} from 'typedoc';
import Summary from '@site/src/components/Api/Comment/Summary';

export default function Comment({
  comment,
  full = true,
}: {
  comment: JSONOutput.Comment;
  full?: boolean;
}) {
  const remarks = useMemo(() => {
    return comment?.blockTags?.find(({tag}) => tag === '@remarks');
  }, [comment]);

  return (
    <>
      <Summary id={comment?.summaryId} />
      <Summary id={remarks?.contentId} />
      {full && <FullComment comment={comment} />}
    </>
  );
}

function FullComment({comment}: {comment: JSONOutput.Comment}) {
  const examples = useMemo(
    () => comment?.blockTags?.filter(({tag}) => tag === '@example') ?? [],
    [comment],
  );
  const deprecated = useMemo(
    () => comment?.blockTags?.find(({tag}) => tag === '@deprecated'),
    [comment],
  );
  const seeAlso = useMemo(
    () => comment?.blockTags?.find(({tag}) => tag === '@see'),
    [comment],
  );

  return (
    <>
      {examples.length > 0 && (
        <>
          <h4>Examples</h4>
          {examples.map(example => (
            <Summary id={example.contentId} />
          ))}
        </>
      )}
      {deprecated && (
        <>
          <h4>Deprecated</h4>
          <Summary id={deprecated.contentId} />
        </>
      )}
      {seeAlso && (
        <>
          <h4>See also</h4>
          <Summary id={seeAlso.contentId} />
        </>
      )}
    </>
  );
}
