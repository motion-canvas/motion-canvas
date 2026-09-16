import Fiddle from '@site/src/components/Fiddle/index';
import CodeBlock from '@theme/CodeBlock';
import {Props} from '@theme/MDXComponents/Pre';
import React, {isValidElement} from 'react';

interface CodeElementProps {
  className?: string;
  metastring?: string;
  children: string;
}

export default function FiddleCodeBlock(props: Props) {
  if (isValidElement(props.children)) {
    const childProps = props.children.props as CodeElementProps;
    const meta = childProps.metastring?.split(' ') ?? [];

    // A fenced code block created by a ``` markdown block is unwrapped and
    // the props of its code element are passed to CodeBlock or Fiddle,
    // depending on the contents of the metastring.
    if (meta.includes('editor')) {
      const fiddleProps: Record<string, string | true> = {};
      for (const part of meta) {
        const [key, value] = part.split('=');
        fiddleProps[key] = value ?? true;
      }

      return (
        <Fiddle
          className={childProps.className}
          mode={fiddleProps.mode as 'code' | 'editor' | 'preview' | undefined}
          ratio={fiddleProps.ratio as string | undefined}
        >
          {childProps.children}
        </Fiddle>
      );
    }

    return <CodeBlock {...childProps} />;
  }

  return <CodeBlock {...(props as React.ComponentProps<typeof CodeBlock>)} />;
}
