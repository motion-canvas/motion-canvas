import {
  createSignal,
  SignalValue,
  SimpleSignal,
} from '@motion-canvas/core/lib/signals';
import {BBox, SerializedVector2} from '@motion-canvas/core/lib/types';
import {DesiredLength} from '../partials';
import {computed, signal} from '../decorators';
import {Shape, ShapeProps} from './Shape';
import {View2D} from './View2D';
import {lazy, threadable} from '@motion-canvas/core/lib/decorators';
import {map, TimingFunction, tween} from '@motion-canvas/core/lib/tweening';

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
  private tweenProgress = createSignal<number | null>(null);
  private targetData: string | null = null;
  private targetBBox: BBox | null = null;

  public constructor(props: PathProps) {
    super(props);
  }

  public static getPathBBox(data: string) {
    Path.pathElement.setAttribute('d', data);
    return new BBox(Path.pathElement.getBBox());
  }

  @computed()
  public getCurrentPathBBox() {
    return Path.getPathBBox(this.data());
  }

  protected override desiredSize(): SerializedVector2<DesiredLength> {
    const {x, y} = super.desiredSize();
    const bbox = this.getCurrentPathBBox().size;
    return {
      x: x ?? bbox.x,
      y: y ?? bbox.y,
    };
  }

  protected override getPath(): Path2D {
    const progress = this.tweenProgress() ?? 0;
    const pathBBox = this.getCurrentPathBBox().center;
    const path = new Path2D();
    path.addPath(
      new Path2D(this.data()),
      new DOMMatrix()
        .scaleSelf(1 - progress)
        .translateSelf(-pathBBox.x, -pathBBox.y),
    );
    if (this.targetData) {
      const center = this.targetBBox!.center;
      path.addPath(
        new Path2D(this.targetData),
        new DOMMatrix().scaleSelf(progress).translateSelf(-center.x, -center.y),
      );
    }
    return path;
  }

  @threadable()
  protected *tweenData(
    newPath: string,
    time: number,
    timingFunction: TimingFunction,
  ) {
    this.targetData = newPath;
    this.targetBBox = Path.getPathBBox(newPath);

    const autoWidth = this.customWidth() === null;
    const autoHeight = this.customHeight() === null;
    const oldBBox = this.getCurrentPathBBox();

    this.tweenProgress(0);
    yield* tween(
      time,
      value => {
        const progress = timingFunction(value);
        this.tweenProgress(progress);
        if (autoWidth)
          this.customWidth(
            map(oldBBox.width, this.targetBBox!.width, progress),
          );
        if (autoHeight)
          this.customHeight(
            map(oldBBox.height, this.targetBBox!.height, progress),
          );
      },
      () => {
        this.tweenProgress(null);
        this.targetData = null;
        this.targetBBox = null;

        if (autoWidth) this.customWidth(null);
        if (autoHeight) this.customHeight(null);
        this.data(newPath);
      },
    );
  }
}
