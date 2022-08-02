import {Size} from '../types';
import {Group} from 'konva/lib/Group';

export class LayeredLayout extends Group {
  public getLayoutSize(): Size {
    return this.getChildrenRect({skipTransform: true});
  }
}
