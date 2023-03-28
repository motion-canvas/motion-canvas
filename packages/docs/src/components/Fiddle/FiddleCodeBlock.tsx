import Fiddle from '@site/src/components/Fiddle/index';
import {Props} from '@theme/MDXComponents/Pre';
import React, {isValidElement} from 'react';
import CodeBlock from '@theme/CodeBlock';

export default function FiddleCodeBlock(props: Props) {
  if (
    isValidElement(props.children) &&
    (props.children.props as {editor: boolean} | null)?.editor
  ) {
    return <Fiddle>{props.children.props.children}</Fiddle>;
  }

  return (
    <CodeBlock
      // If this pre is created by a ``` fenced codeblock, unwrap the children
      {...(isValidElement(props.children) &&
      (props.children.props as {originalType: string} | null)?.originalType ===
        'code'
        ? props.children.props
        : {...props})}
    />
  );
}
