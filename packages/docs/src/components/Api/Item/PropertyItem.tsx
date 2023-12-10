import React from 'react';

import CodeBlock from '@site/src/components/Api/Code/CodeBlock';
import Container from '@site/src/components/Api/Code/Container';
import Line from '@site/src/components/Api/Code/Line';
import Comment from '@site/src/components/Api/Comment';
import PropertyPreview from '@site/src/components/Api/Preview/PropertyPreview';
import ReferenceType from '@site/src/components/Api/Type/ReferenceType';
import Heading from '@theme/Heading';
import type {JSONOutput} from 'typedoc';

export default function PropertyItem({
  reflection,
  headless,
}: {
  reflection: JSONOutput.DeclarationReflection;
  headless?: boolean;
}) {
  return (
    <>
      {!headless &&
        (reflection.hasOwnPage ? (
          <h1>{reflection.name}</h1>
        ) : (
          <Heading as="h3" id={reflection.anchor}>
            <code>{reflection.name}</code>
          </Heading>
        ))}
      <Container>
        <CodeBlock link={reflection.sources?.[0]?.url}>
          <Line>
            <PropertyPreview reflection={reflection} />
          </Line>
        </CodeBlock>
      </Container>
      <Comment comment={reflection.comment} />
      {reflection.inheritedFrom && (
        <small>
          Inherited from{' '}
          <code>
            <ReferenceType type={reflection.inheritedFrom} />
          </code>
        </small>
      )}
    </>
  );
}
