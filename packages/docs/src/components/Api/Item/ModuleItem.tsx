import Comment from '@site/src/components/Api/Comment';
import Filters from '@site/src/components/Api/Filters';
import Group from '@site/src/components/Api/Group';
import CodeBlock from '@theme/CodeBlock';
import React from 'react';
import type {JSONOutput} from 'typedoc';

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
        <Group group={group} key={group.title} project={reflection.project} />
      ))}
    </>
  );
}
