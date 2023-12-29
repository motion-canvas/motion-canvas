import React, {ReactNode} from 'react';

import clsx from 'clsx';
import styles from './styles.module.css';

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

const Classes: Record<ListType, string> = {
  [ListType.None]: styles.none,
  [ListType.Angle]: styles.angle,
  [ListType.Curly]: styles.curly,
  [ListType.Square]: styles.square,
  [ListType.Parentheses]: styles.parentheses,
};

export default function TokenList({
  children,
  type,
  separator = Separator.Comma,
}: {
  children: ReactNode | ReactNode[];
  type?: ListType;
  separator?: Separator;
}) {
  return (
    <span className={clsx(styles.list, Classes[type ?? ListType.None])}>
      <span
        className={clsx(
          styles.elements,
          separator !== Separator.Comma && styles.left,
        )}
      >
        {(Array.isArray(children) ? children : [children]).flatMap(
          (child, index) => (
            <span
              data-separator={separator}
              key={index}
              className={styles.element}
            >
              {child}
            </span>
          ),
        )}
      </span>
    </span>
  );
}
