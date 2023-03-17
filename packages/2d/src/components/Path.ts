import {SignalValue, SimpleSignal} from '@motion-canvas/core/lib/signals';
import {BBox, SerializedVector2} from '@motion-canvas/core/lib/types';
import {DesiredLength} from '../partials';
import {computed, signal} from '../decorators';
import {Shape, ShapeProps} from './Shape';
import {View2D} from './View2D';
import {lazy} from '@motion-canvas/core/lib/decorators';

export interface PathProps extends ShapeProps {
  data?: SignalValue<string>;
}

export class Path extends Shape {
  @lazy(() => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    svg.appendChild(path);
    View2D.shadowRoot.appendChild(svg);
    return path;
  })
  protected static pathElement: SVGPathElement;
  @signal()
  public declare readonly data: SimpleSignal<string, this>;

  public constructor(props: PathProps) {
    super(props);
  }

  @computed()
  public getPathBBox() {
    Path.pathElement.setAttribute('d', this.data());
    return new BBox(Path.pathElement.getBBox());
  }

  protected override applyStyle(context: CanvasRenderingContext2D): void {
    super.applyStyle(context);
    const pathBBox = this.getPathBBox().center;
    context.translate(-pathBBox.x, -pathBBox.y);
  }

  protected override desiredSize(): SerializedVector2<DesiredLength> {
    return this.getPathBBox().size;
  }

  protected override getPath(): Path2D {
    return new Path2D(this.data());
  }
}
