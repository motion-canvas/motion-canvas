/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {Props} from '@theme/Icon/Edit';
import clsx from 'clsx';
import React from 'react';

import styles from './styles.module.css';

export default function IconEdit({
  className,
  ...restProps
}: Props): JSX.Element {
  return (
    <svg
      fill="currentColor"
      width="24px"
      height="24px"
      viewBox="0 0 24 24"
      className={clsx(styles.iconEdit, className)}
      aria-hidden="true"
      {...restProps}
    >
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
    </svg>
  );
}
