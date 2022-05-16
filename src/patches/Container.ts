import {Node} from 'konva/lib/Node';
import {Container} from 'konva/lib/Container';
import {IRect} from 'konva/lib/types';

declare module 'konva/lib/Container' {
  export interface Container {
    getChildrenRect(config?: {
      skipTransform?: boolean;
      skipShadow?: boolean;
      skipStroke?: boolean;
      relativeTo?: Container<Node>;
    }): IRect;
  }
}

Container.prototype.updateLayout = function (this: Container): void {
  for (const child of this.children) {
    child.updateLayout();
    if (child.wasDirty()) {
      this.markDirty();
    }
  }

  Node.prototype.updateLayout.call(this);
};

Container.prototype._centroid = true;

const super_setChildrenIndices = Container.prototype._setChildrenIndices;
Container.prototype._setChildrenIndices = function (this: Container) {
  super_setChildrenIndices.call(this);
  this.markDirty();
};

Container.prototype.getChildrenRect = Container.prototype.getClientRect;
Container.prototype.getClientRect = Node.prototype.getClientRect;
