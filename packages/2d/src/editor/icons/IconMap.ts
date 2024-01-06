/* eslint-disable @typescript-eslint/naming-convention */

import {FunctionComponent} from 'preact';
import {CircleIcon} from './CircleIcon';
import {CodeBlockIcon} from './CodeBlockIcon';
import {CurveIcon} from './CurveIcon';
import {GridIcon} from './GridIcon';
import {ImgIcon} from './ImgIcon';
import {LayoutIcon} from './LayoutIcon';
import {LineIcon} from './LineIcon';
import {NodeIcon} from './NodeIcon';
import {RayIcon} from './RayIcon';
import {RectIcon} from './RectIcon';
import {ShapeIcon} from './ShapeIcon';
import {TxtIcon} from './TxtIcon';
import {VideoIcon} from './VideoIcon';
import {View2DIcon} from './View2DIcon';

export const IconMap: Record<string, FunctionComponent> = {
  Circle: CircleIcon,
  CodeBlock: CodeBlockIcon,
  Curve: CurveIcon,
  Grid: GridIcon,
  Img: ImgIcon,
  Layout: LayoutIcon,
  Line: LineIcon,
  Node: NodeIcon,
  Ray: RayIcon,
  Rect: RectIcon,
  Shape: ShapeIcon,
  Txt: TxtIcon,
  TxtLeaf: TxtIcon,
  Video: VideoIcon,
  View2D: View2DIcon,
};
