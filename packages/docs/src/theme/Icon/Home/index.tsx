/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {Props} from '@theme/Icon/Home';
import React from 'react';

export default function IconHome(props: Props): JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      style={{width: 16, height: 16, marginTop: '0.1rem'}}
      {...props}
    >
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="currentColor" />
    </svg>
  );
}
