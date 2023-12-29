import {Collapsible} from '@docusaurus/theme-common';
import Summary from '@site/src/components/Api/Comment/Summary';
import ExperimentalWarning from '@site/src/components/ExperimentalWarning';
import clsx from 'clsx';
import React, {useMemo, useState} from 'react';
import type {JSONOutput} from 'typedoc';
import styles from './styles.module.css';

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
      {full && <Experimental comment={comment} />}
      <Summary id={comment?.summaryId} />
      <Summary id={remarks?.contentId} />
      {full && <FullComment comment={comment} />}
    </>
  );
}

function Experimental({comment}: {comment: JSONOutput.Comment}) {
  const experimental = useMemo(
    () => comment?.modifierTags?.includes('@experimental'),
    [comment],
  );

  return experimental ? <ExperimentalWarning /> : null;
}

function FullComment({comment}: {comment: JSONOutput.Comment}) {
  const [collapsed, setCollapsed] = useState(true);
  const preview = useMemo(
    () => comment?.blockTags?.find(({tag}) => tag === '@preview'),
    [comment],
  );
  const examples = useMemo(
    () => comment?.blockTags?.filter(({tag}) => tag === '@example') ?? [],
    [comment],
  );
  const defaultValue = useMemo(
    () => comment?.blockTags?.find(({tag}) => tag === '@defaultValue'),
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
      <Summary id={preview?.contentId} />
      {examples.length > 0 && (
        <>
          <h4>
            <a
              className={clsx(styles.toggle, collapsed && styles.collapsed)}
              onClick={e => {
                e.preventDefault();
                setCollapsed(!collapsed);
              }}
              href="#"
            >
              Examples
            </a>
          </h4>
          <Collapsible lazy as={'div'} collapsed={collapsed}>
            <div className={styles.collapse}>
              {examples.map(example => (
                <Summary key={example.contentId} id={example.contentId} />
              ))}
            </div>
            <div className={styles.clearFix}></div>
          </Collapsible>
          <div className={clsx(styles.clearFix, styles.inverse)}></div>
        </>
      )}
      {defaultValue && (
        <>
          Default Value:{' '}
          <code>{defaultValue.content.map(part => part.text).join('')}</code>
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
