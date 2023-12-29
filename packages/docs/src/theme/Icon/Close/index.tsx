/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type {Props} from '@theme/Icon/Close';
import React from 'react';

export default function IconClose({
  width = 24,
  height = 24,
  color = 'currentColor',
  ...restProps
}: Props): JSX.Element {
  return (
    <svg viewBox="0 0 24 24" width={width} height={height} {...restProps}>
      <path
        d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
        fill={color}
      />
    </svg>
  );
}
