import CodeBlock from '@site/src/components/Api/Code/CodeBlock';
import Container from '@site/src/components/Api/Code/Container';
import Line from '@site/src/components/Api/Code/Line';
import Comment from '@site/src/components/Api/Comment';
import Filters from '@site/src/components/Api/Filters';
import Group from '@site/src/components/Api/Group';
import Preview from '@site/src/components/Api/Preview';
import Signatures from '@site/src/components/Api/Signatures';
import ReferenceType from '@site/src/components/Api/Type/ReferenceType';
import TypeParameters from '@site/src/components/Api/TypeParameters';
import React from 'react';
import type {JSONOutput} from 'typedoc';

export default function ClassItem({
  reflection,
}: {
  reflection: JSONOutput.DeclarationReflection;
}) {
  return (
    <>
      <Container>
        <CodeBlock link={reflection.sources?.[0]?.url}>
          <Line>
            <Preview reflection={reflection} />
          </Line>
        </CodeBlock>
      </Container>
      <Filters kind={reflection.kind}>
        <Comment comment={reflection.comment} />
      </Filters>
      <TypeParameters parameters={reflection.typeParameters}></TypeParameters>
      {reflection.implementedBy?.length && (
        <>
          <h4>Implemented by</h4>
          <ul>
            {reflection.implementedBy.map(type => (
              <li key={type.id}>
                <code>
                  <ReferenceType type={type} />
                </code>
              </li>
            ))}
          </ul>
        </>
      )}
      {reflection.extendedBy?.length && (
        <>
          <h4>Extended by</h4>
          <ul>
            {reflection.extendedBy.map(type => (
              <li key={type.id}>
                <code>
                  <ReferenceType type={type} />
                </code>
              </li>
            ))}
          </ul>
        </>
      )}
      {reflection.signatures && (
        <>
          <h2>Callable</h2>
          <Signatures signatures={reflection.signatures} />
        </>
      )}
      {reflection.groups?.map(group => (
        <Group group={group} key={group.title} project={reflection.project} />
      ))}
    </>
  );
}
