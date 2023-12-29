import {ReflectionKind} from '@site/src/components/Api/ReflectionKind';
import clsx from 'clsx';
import React, {ReactNode} from 'react';
import Controls from './Controls';
import styles from './index.module.css';

export default function Filters({
  children,
  kind,
}: {
  children: ReactNode;
  kind: ReflectionKind;
}) {
  if (kind === ReflectionKind.Class || kind === ReflectionKind.Interface) {
    return (
      <div className={clsx('row', styles.header)}>
        <div className={clsx('col', styles.filters)}>
          <Controls />
        </div>
        <div className="col">{children}</div>
      </div>
    );
  }

  return <>{children}</>;
}
