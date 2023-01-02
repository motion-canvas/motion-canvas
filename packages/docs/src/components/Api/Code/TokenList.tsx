import React, {ReactNode} from 'react';

import styles from './styles.module.css';
import clsx from 'clsx';

export enum ListType {
  None,
  Angle,
  Curly,
  Square,
  Parentheses,
}

export enum Separator {
  Comma = ', ',
  Pipe = ' | ',
  Ampersand = ' & ',
}

const classes: Record<ListType, string> = {
  [ListType.None]: styles.none,
  [ListType.Angle]: styles.angle,
  [ListType.Curly]: styles.curly,
  [ListType.Square]: styles.square,
  [ListType.Parentheses]: styles.parentheses,
};

export default function TokenList({
  children,
  type,
  separator,
}: {
  children: ReactNode[];
  type?: ListType;
  separator?: Separator;
}) {
  return (
    <span className={clsx(styles.list, classes[type ?? ListType.None])}>
      <span className={styles.elements}>
        {children.flatMap((child, index) => (
          <span
            data-separator={separator ?? Separator.Comma}
            key={index}
            className={styles.element}
          >
            {child}
          </span>
        ))}
      </span>
    </span>
  );
}
