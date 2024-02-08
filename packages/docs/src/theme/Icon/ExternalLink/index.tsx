/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';

import styles from './styles.module.css';

export default function IconExternalLink(): JSX.Element {
  return (
    <svg
      width={16}
      height={16}
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={styles.iconExternalLink}
    >
      <path
        d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"
        fill="currentColor"
      />
    </svg>
  );
}
