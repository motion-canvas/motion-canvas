/* eslint-disable @typescript-eslint/naming-convention */
import {makeScene2D} from '@motion-canvas/2d';
import {jsx, Fragment} from '@motion-canvas/2d/lib/jsx-runtime';
import * as components from '@motion-canvas/2d/lib/components';
import * as flow from '@motion-canvas/core/lib/flow';
import * as utils from '@motion-canvas/core/lib/utils';
import * as signals from '@motion-canvas/core/lib/signals';
import * as types from '@motion-canvas/core/lib/types';
import * as tweening from '@motion-canvas/core/lib/tweening';
import * as threading from '@motion-canvas/core/lib/threading';

export default {
  ...components,
  ...flow,
  ...utils,
  ...signals,
  ...types,
  ...tweening,
  ...threading,
  _Fragment: Fragment,
  _jsx: jsx,
  _jsxs: jsx,
  makeScene2D,
};
