import React, {useState} from 'react';

import Container from '@site/src/components/Api/Code/Container';
import CodeBlock from '@site/src/components/Api/Code/CodeBlock';
import SignaturePreview from '@site/src/components/Api/Preview/SignaturePreview';
import Line from '@site/src/components/Api/Code/Line';
import Comment from '@site/src/components/Api/Comment';
import TypeParameters from '@site/src/components/Api/TypeParameters';
import type {JSONOutput} from 'typedoc';
import Parameters from '@site/src/components/Api/Parameters';

export default function Signatures({
  signatures,
  flags,
  source,
}: {
  signatures: JSONOutput.SignatureReflection[];
  flags?: JSONOutput.ReflectionFlags;
  source?: JSONOutput.SourceReference;
}) {
  const [signature, setSignature] = useState(signatures[0]);

  return (
    <>
      <Container>
        {signatures.map(child => (
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
