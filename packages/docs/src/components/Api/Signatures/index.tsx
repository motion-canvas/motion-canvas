import React, {useMemo, useState} from 'react';

import Container from '@site/src/components/Api/Code/Container';
import CodeBlock from '@site/src/components/Api/Code/CodeBlock';
import SignaturePreview from '@site/src/components/Api/Preview/SignaturePreview';
import Line from '@site/src/components/Api/Code/Line';
import Comment from '@site/src/components/Api/Comment';
import TypeParameters from '@site/src/components/Api/TypeParameters';
import type {JSONOutput} from 'typedoc';
import Parameters from '@site/src/components/Api/Parameters';
import {useApiFinder} from '@site/src/contexts/api';

export default function Signatures({
  signatures,
  flags,
  source,
}: {
  signatures: number[];
  flags: JSONOutput.ReflectionFlags;
  source?: JSONOutput.SourceReference;
}) {
  const find = useApiFinder();
  const data = useMemo(
    () => signatures.map(find<JSONOutput.SignatureReflection>),
    [signatures],
  );
  const [signature, setSignature] = useState(data[0]);

  return (
    <>
      <Container>
        {data.map(child => (
          <CodeBlock
            link={source?.url}
            key={child.id}
            highlight={signatures.length > 1 && child.id === signature.id}
            onClick={
              signatures.length > 1 ? () => setSignature(child) : undefined
            }
          >
            <Line>
              <SignaturePreview reflection={child} flags={flags} />
            </Line>
          </CodeBlock>
        ))}
      </Container>
      <Comment comment={signature.comment} />
      <TypeParameters parameters={signature.typeParameter}></TypeParameters>
      <Parameters parameters={signature.parameters}></Parameters>
    </>
  );
}
