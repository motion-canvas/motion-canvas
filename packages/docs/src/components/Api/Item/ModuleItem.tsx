import React from 'react';
import type {JSONOutput} from 'typedoc';
import Comment from '@site/src/components/Api/Comment';
import Group from '@site/src/components/Api/Group';
import Filters from '@site/src/components/Api/Filters';
import CodeBlock from '@theme/CodeBlock';

export default function ModuleItem({
  reflection,
}: {
  reflection: JSONOutput.DeclarationReflection;
}) {
  return (
    <>
      <CodeBlock language="ts">
        import {'{...}'} from "{reflection.importPath}";
      </CodeBlock>
      <Filters kind={reflection.kind}>
        <Comment comment={reflection.comment} />
      </Filters>
      {reflection.groups?.map(group => (
        <Group group={group} key={group.title} />
      ))}
    </>
  );
}
