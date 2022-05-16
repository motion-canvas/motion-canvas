import {Size} from '../types';
import {IRect, Vector2d} from 'konva/lib/types';
import {Group} from 'konva/lib/Group';
import {Shape} from 'konva/lib/Shape';
import {Container, ContainerConfig} from 'konva/lib/Container';

export class LayeredLayout extends Group {
  public getLayoutSize(custom?: ContainerConfig): Size {
    return this.getChildrenRect({skipTransform: true});
  }
}
