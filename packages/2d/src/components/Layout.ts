import {compound, computed, Property, property} from '../decorators';
import {
  Origin,
  PossibleSpacing,
  Rect,
  Size,
  Spacing,
  transformAngle,
  Vector2,
  originToOffset,
} from '@motion-canvas/core/lib/types';
import {isReactive, Signal, SignalValue} from '@motion-canvas/core/lib/utils';
import {
  InterpolationFunction,
  TimingFunction,
  tween,
} from '@motion-canvas/core/lib/tweening';
import {
  FlexAlign,
  FlexBasis,
  FlexDirection,
  FlexJustify,
  FlexWrap,
  LayoutMode,
  Length,
  ResolvedLayoutMode,
} from '../partials';
import {threadable} from '@motion-canvas/core/lib/decorators';
import {ThreadGenerator} from '@motion-canvas/core/lib/threading';
import {Node, NodeProps} from './Node';
import {TwoDView} from '../scenes';

export interface LayoutProps extends NodeProps {
  layout?: LayoutMode;
  tagName?: keyof HTMLElementTagNameMap;

  width?: SignalValue<Length>;
  height?: SignalValue<Length>;
  maxWidth?: SignalValue<Length>;
  maxHeight?: SignalValue<Length>;
  minWidth?: SignalValue<Length>;
  minHeight?: SignalValue<Length>;
  ratio?: SignalValue<number>;

  marginTop?: SignalValue<number>;
  marginBottom?: SignalValue<number>;
  marginLeft?: SignalValue<number>;
  marginRight?: SignalValue<number>;
  margin?: SignalValue<PossibleSpacing>;

  paddingTop?: SignalValue<number>;
  paddingBottom?: SignalValue<number>;
  paddingLeft?: SignalValue<number>;
  paddingRight?: SignalValue<number>;
  padding?: SignalValue<PossibleSpacing>;

  direction?: SignalValue<FlexDirection>;
  basis?: SignalValue<FlexBasis>;
  grow?: SignalValue<number>;
  shrink?: SignalValue<number>;
  wrap?: SignalValue<FlexWrap>;

  justifyContent?: SignalValue<FlexJustify>;
  alignItems?: SignalValue<FlexAlign>;
  rowGap?: SignalValue<Length>;
  columnGap?: SignalValue<Length>;
  gap?: SignalValue<Length>;

  fontFamily?: SignalValue<string>;
  fontSize?: SignalValue<number>;
  fontStyle?: SignalValue<string>;
  fontWeight?: SignalValue<number>;
  lineHeight?: SignalValue<number>;
  letterSpacing?: SignalValue<number>;
  textWrap?: SignalValue<boolean>;

  x?: SignalValue<number>;
  y?: SignalValue<number>;
  position?: SignalValue<Vector2>;
  size?: SignalValue<Size>;
  rotation?: SignalValue<number>;
  offsetX?: SignalValue<number>;
  offsetY?: SignalValue<number>;
  offset?: SignalValue<Vector2>;
  scaleX?: SignalValue<number>;
  scaleY?: SignalValue<number>;
  scale?: SignalValue<Vector2>;
  clip?: SignalValue<boolean>;
}

export class Layout extends Node {
  @property(null)
  public declare readonly layout: Signal<LayoutMode, this>;

  @property(null)
  public declare readonly maxWidth: Signal<Length, this>;
  @property(null)
  public declare readonly maxHeight: Signal<Length, this>;
  @property(null)
  public declare readonly minWidth: Signal<Length, this>;
  @property(null)
  public declare readonly minHeight: Signal<Length, this>;
  @property(null)
  public declare readonly ratio: Signal<number | null, this>;

  @property(0)
  public declare readonly marginTop: Signal<number, this>;
  @property(0)
  public declare readonly marginBottom: Signal<number, this>;
  @property(0)
  public declare readonly marginLeft: Signal<number, this>;
  @property(0)
  public declare readonly marginRight: Signal<number, this>;
  @compound(
    {
      top: 'marginTop',
      bottom: 'marginBottom',
      left: 'marginLeft',
      right: 'marginRight',
    },
    Spacing,
  )
  @property(undefined, Spacing.lerp, Spacing)
  public declare readonly margin: Property<PossibleSpacing, Spacing, this>;

  @property(0)
  public declare readonly paddingTop: Signal<number, this>;
  @property(0)
  public declare readonly paddingBottom: Signal<number, this>;
  @property(0)
  public declare readonly paddingLeft: Signal<number, this>;
  @property(0)
  public declare readonly paddingRight: Signal<number, this>;
  @compound(
    {
      top: 'paddingTop',
      bottom: 'paddingBottom',
      left: 'paddingLeft',
      right: 'paddingRight',
    },
    Spacing,
  )
  @property(undefined, Spacing.lerp, Spacing)
  public declare readonly padding: Property<PossibleSpacing, Spacing, this>;

  @property('row')
  public declare readonly direction: Signal<FlexDirection, this>;
  @property(null)
  public declare readonly basis: Signal<FlexBasis, this>;
  @property(0)
  public declare readonly grow: Signal<number, this>;
  @property(1)
  public declare readonly shrink: Signal<number, this>;
  @property('nowrap')
  public declare readonly wrap: Signal<FlexWrap, this>;

  @property('normal')
  public declare readonly justifyContent: Signal<FlexJustify, this>;
  @property('normal')
  public declare readonly alignItems: Signal<FlexAlign, this>;
  @property(null)
  public declare readonly gap: Signal<Length, this>;
  @property(null)
  public declare readonly rowGap: Signal<Length, this>;
  @property(null)
  public declare readonly columnGap: Signal<Length, this>;

  @property(null)
  public declare readonly fontFamily: Signal<string | null, this>;
  @property(null)
  public declare readonly fontSize: Signal<number | null, this>;
  @property(null)
  public declare readonly fontStyle: Signal<string | null, this>;
  @property(null)
  public declare readonly fontWeight: Signal<number | null, this>;
  @property(null)
  public declare readonly lineHeight: Signal<number | null, this>;
  @property(null)
  public declare readonly letterSpacing: Signal<number | null, this>;
  @property(null)
  public declare readonly textWrap: Signal<boolean | null, this>;

  @property(0)
  protected declare readonly customX: Signal<number, this>;
  @property(0)
  public declare readonly x: Signal<number, this>;
  protected getX(): number {
    const mode = this.resolvedMode();
    if (mode !== 'enabled') {
      return this.customX();
    }

    return this.computedPosition().x;
  }
  protected setX(value: SignalValue<number>) {
    this.customX(value);
  }

  @property(0)
  protected declare readonly customY: Signal<number, this>;
  @property(0)
  public declare readonly y: Signal<number, this>;
  protected getY(): number {
    const mode = this.resolvedMode();
    if (mode !== 'enabled') {
      return this.customY();
    }

    return this.computedPosition().y;
  }
  protected setY(value: SignalValue<number>) {
    this.customY(value);
  }

  @property(null)
  protected declare readonly customWidth: Signal<Length, this>;
  @property(null)
  public declare readonly width: Property<Length, number, this>;
  protected getWidth(): number {
    return this.computedSize().width;
  }
  protected setWidth(value: SignalValue<Length>) {
    this.customWidth(value);
  }

  @threadable()
  protected *tweenWidth(
    value: SignalValue<Length>,
    time: number,
    timingFunction: TimingFunction,
    interpolationFunction: InterpolationFunction<Length>,
  ): ThreadGenerator {
    const width = this.customWidth();
    const lock = typeof width !== 'number' || typeof value !== 'number';
    let from: number;
    if (lock) {
      from = this.width();
    } else {
      from = width;
    }

    let to: number;
    if (lock) {
      this.width(value);
      to = this.width();
    } else {
      to = value;
    }

    this.width(from);
    lock && this.lockSize();
    yield* tween(time, value =>
      this.width(interpolationFunction(from, to, timingFunction(value))),
    );
    this.width(value);
    lock && this.releaseSize();
  }

  @property(null)
  protected declare readonly customHeight: Signal<Length, this>;
  @property(null)
  public declare readonly height: Property<Length, number, this>;
  protected getHeight(): number {
    return this.computedSize().height;
  }
  protected setHeight(value: SignalValue<Length>) {
    this.customHeight(value);
  }

  @threadable()
  protected *tweenHeight(
    value: SignalValue<Length>,
    time: number,
    timingFunction: TimingFunction,
    interpolationFunction: InterpolationFunction<Length>,
  ): ThreadGenerator {
    const height = this.customHeight();
    const lock = typeof height !== 'number' || typeof value !== 'number';

    let from: number;
    if (lock) {
      from = this.height();
    } else {
      from = height;
    }

    let to: number;
    if (lock) {
      this.height(value);
      to = this.height();
    } else {
      to = value;
    }

    this.height(from);
    lock && this.lockSize();
    yield* tween(time, value =>
      this.height(interpolationFunction(from, to, timingFunction(value))),
    );
    this.height(value);
    lock && this.releaseSize();
  }

  @compound(['width', 'height'], Size)
  @property(undefined, Size.lerp, Size)
  public declare readonly size: Property<
    {width: Length; height: Length},
    Size,
    this
  >;

  @computed()
  protected customSize(): {width: Length; height: Length} {
    return {
      width: this.customWidth(),
      height: this.customHeight(),
    };
  }

  @threadable()
  protected *tweenSize(
    value: SignalValue<{width: Length; height: Length}>,
    time: number,
    timingFunction: TimingFunction,
    interpolationFunction: InterpolationFunction<Size>,
  ): ThreadGenerator {
    const size = this.customSize();
    let from: Size;
    if (typeof size.height !== 'number' || typeof size.width !== 'number') {
      from = this.size();
    } else {
      from = <Size>size;
    }

    let to: Size;
    if (
      typeof value === 'object' &&
      typeof value.height === 'number' &&
      typeof value.width === 'number'
    ) {
      to = <Size>value;
    } else {
      this.size(value);
      to = this.size();
    }

    this.size(from);
    this.lockSize();
    yield* tween(time, value =>
      this.size(interpolationFunction(from, to, timingFunction(value))),
    );
    this.releaseSize();
    this.size(value);
  }

  @property(0)
  public declare readonly rotation: Signal<number, this>;

  @property(0)
  public declare readonly offsetX: Signal<number, this>;

  @property(0)
  public declare readonly offsetY: Signal<number, this>;

  @compound({x: 'offsetX', y: 'offsetY'}, Vector2)
  @property(undefined, Vector2.lerp, Vector2)
  public declare readonly offset: Signal<Vector2, this>;

  @property(1)
  public declare readonly scaleX: Signal<number, this>;

  @property(1)
  public declare readonly scaleY: Signal<number, this>;

  @compound({x: 'scaleX', y: 'scaleY'}, Vector2)
  @property(undefined, Vector2.lerp, Vector2)
  public declare readonly scale: Signal<Vector2, this>;

  @property(undefined, Vector2.lerp, Vector2)
  public declare readonly absoluteScale: Signal<Vector2, this>;

  protected getAbsoluteScale(): Vector2 {
    const matrix = this.localToWorld();
    return new Vector2(
      Vector2.magnitude(matrix.m11, matrix.m12),
      Vector2.magnitude(matrix.m21, matrix.m22),
    );
  }

  protected setAbsoluteScale(value: SignalValue<Vector2>) {
    // TODO Implement setter
  }

  @compound(['x', 'y'], Vector2)
  @property(undefined, Vector2.lerp, Vector2)
  public declare readonly position: Signal<Vector2, this>;

  @property(undefined, Vector2.lerp, Vector2)
  public declare readonly absolutePosition: Signal<Vector2, this>;

  protected getAbsolutePosition(): Vector2 {
    const matrix = this.localToWorld();
    return new Vector2(matrix.m41, matrix.m42);
  }

  protected setAbsolutePosition(value: SignalValue<Vector2>) {
    if (isReactive(value)) {
      this.position(() => value().transformAsPoint(this.worldToParent()));
    } else {
      this.position(value.transformAsPoint(this.worldToParent()));
    }
  }

  @property()
  public declare readonly absoluteRotation: Signal<Vector2, this>;

  protected getAbsoluteRotation() {
    const matrix = this.localToWorld();
    return (Math.atan2(matrix.m12, matrix.m11) * 180) / Math.PI;
  }

  protected setAbsoluteRotation(value: SignalValue<number>) {
    if (isReactive(value)) {
      this.rotation(() => transformAngle(value(), this.worldToParent()));
    } else {
      this.rotation(transformAngle(value, this.worldToParent()));
    }
  }

  @property(false)
  public declare readonly clip: Signal<boolean, this>;

  public readonly element: HTMLElement;
  public readonly styles: CSSStyleDeclaration;

  @property(0)
  protected declare readonly sizeLockCounter: Signal<number, this>;

  public constructor({tagName = 'div', ...props}: LayoutProps) {
    super(props);

    this.element = TwoDView.document.createElement(tagName);
    this.element.style.display = 'flex';
    this.element.style.boxSizing = 'border-box';

    this.styles = getComputedStyle(this.element);
  }

  public lockSize() {
    this.sizeLockCounter(this.sizeLockCounter() + 1);
  }

  public releaseSize() {
    this.sizeLockCounter(this.sizeLockCounter() - 1);
  }

  @computed()
  protected parentTransform(): Layout | null {
    let parent: Node | null = this.parent();
    while (parent) {
      if (parent instanceof Layout) {
        return parent;
      }
      parent = parent.parent();
    }

    return null;
  }

  @computed()
  public anchorPosition() {
    const size = this.computedSize();
    const offset = this.offset();

    return size.vector.scale(0.5).mul(offset);
  }

  /**
   * Get the resolved layout mode of this node.
   *
   * @remarks
   * When the mode is `null`, its value will be inherited from the parent.
   *
   * Use {@link Layout.mode} to get the raw mode set for this node (without
   * inheritance).
   */
  @computed()
  protected resolvedMode(): ResolvedLayoutMode {
    const parentMode = this.parentTransform()?.resolvedMode();
    let mode = this.layout();

    if (mode === null) {
      if (!parentMode || parentMode === 'disabled') {
        mode = 'disabled';
      } else {
        mode = 'enabled';
      }
    }

    if (mode === 'root' && parentMode !== 'disabled') {
      mode = 'enabled';
    }

    return mode;
  }

  public override localToParent(): DOMMatrix {
    const matrix = new DOMMatrix();
    const size = this.computedSize();
    matrix.translateSelf(this.x(), this.y());
    matrix.rotateSelf(0, 0, this.rotation());
    matrix.scaleSelf(this.scaleX(), this.scaleY());
    matrix.translateSelf(
      (size.width / -2) * this.offsetX(),
      (size.height / -2) * this.offsetY(),
    );

    return matrix;
  }

  protected getComputedLayout(): Rect {
    return new Rect(this.element.getBoundingClientRect());
  }

  @computed()
  public computedPosition(): Vector2 {
    this.requestLayoutUpdate();
    const rect = this.getComputedLayout();

    const position = new Vector2(
      rect.x + (rect.width / 2) * this.offsetX(),
      rect.y + (rect.height / 2) * this.offsetY(),
    );

    const parent = this.parentTransform();
    if (parent) {
      const parentRect = parent.getComputedLayout();
      position.x -= parentRect.x + (parentRect.width - rect.width) / 2;
      position.y -= parentRect.y + (parentRect.height - rect.height) / 2;
    }

    return position;
  }

  @computed()
  protected computedSize(): Size {
    this.requestLayoutUpdate();
    return new Size(this.getComputedLayout());
  }

  /**
   * Find the closest layout root and apply any new layout changes.
   */
  @computed()
  protected requestLayoutUpdate() {
    const mode = this.resolvedMode();
    const parent = this.parentTransform();
    if (mode === 'disabled' || mode === 'root' || !parent) {
      this.view()?.element.append(this.element);
      parent?.requestFontUpdate();
      this.updateLayout();
    } else {
      parent.requestLayoutUpdate();
    }
  }

  /**
   * Apply any new layout changes to this node and its children.
   */
  @computed()
  protected updateLayout() {
    this.applyFont();
    this.applyFlex();
    if (this.resolvedMode() !== 'disabled') {
      this.syncDOM();
    }
  }

  @computed()
  protected syncDOM() {
    this.element.innerText = '';
    const queue = [...this.children()];
    while (queue.length) {
      const child = queue.shift()!;
      if (child instanceof Layout) {
        this.element.append(child.element);
        child.updateLayout();
      } else {
        queue.push(...child.children());
      }
    }
  }

  /**
   * Apply any new font changes to this node and all of its ancestors.
   */
  @computed()
  protected requestFontUpdate() {
    this.parentTransform()?.requestFontUpdate();
    this.applyFont();
  }

  protected override getCacheRect(): Rect {
    const size = this.computedSize();
    return new Rect(size.vector.scale(-0.5), size);
  }

  protected override draw(context: CanvasRenderingContext2D) {
    if (this.clip()) {
      const size = this.computedSize();
      if (size.width === 0 || size.height === 0) {
        return;
      }

      context.beginPath();
      context.rect(size.width / -2, size.height / -2, size.width, size.height);
      context.closePath();
      context.clip();
    }

    this.drawChildren(context);
  }

  public getOriginDelta(origin: Origin) {
    const size = this.computedSize().scale(0.5);
    const offset = this.offset().mul(size.vector);
    if (origin === Origin.Middle) {
      return offset.flipped;
    }

    const newOffset = originToOffset(origin).mul(size.vector);
    return newOffset.sub(offset);
  }

  /**
   * Update the offset of this node and adjust the position to keep it in the
   * same place.
   *
   * @param offset - The new offset.
   */
  public moveOffset(offset: Vector2) {
    const size = this.computedSize().scale(0.5);
    const oldOffset = this.offset().mul(size.vector);
    const newOffset = offset.mul(size.vector);
    this.offset(offset);
    this.position(this.position().add(newOffset).sub(oldOffset));
  }

  protected parseValue(value: number | string | null): string {
    return value === null ? '' : value.toString();
  }

  protected parsePixels(value: number | null): string {
    return value === null ? '' : `${value}px`;
  }

  protected parseLength(value: null | number | string): string {
    if (value === null) {
      return '';
    }
    if (typeof value === 'string') {
      return value;
    }
    return `${value}px`;
  }

  @computed()
  protected applyFlex() {
    const mode = this.resolvedMode();
    this.element.style.position =
      mode === 'disabled' || mode === 'root' ? 'absolute' : 'relative';

    this.element.style.width = this.parseLength(this.customWidth());
    this.element.style.height = this.parseLength(this.customHeight());
    this.element.style.maxWidth = this.parseLength(this.maxWidth());
    this.element.style.minWidth = this.parseLength(this.minWidth());
    this.element.style.maxHeight = this.parseLength(this.maxHeight());
    this.element.style.minWidth = this.parseLength(this.minWidth());
    this.element.style.aspectRatio = this.parseValue(this.ratio());

    this.element.style.marginTop = this.parsePixels(this.marginTop());
    this.element.style.marginBottom = this.parsePixels(this.marginBottom());
    this.element.style.marginLeft = this.parsePixels(this.marginLeft());
    this.element.style.marginRight = this.parsePixels(this.marginRight());

    this.element.style.paddingTop = this.parsePixels(this.paddingTop());
    this.element.style.paddingBottom = this.parsePixels(this.paddingBottom());
    this.element.style.paddingLeft = this.parsePixels(this.paddingLeft());
    this.element.style.paddingRight = this.parsePixels(this.paddingRight());

    this.element.style.flexDirection = this.direction();
    this.element.style.flexBasis = this.parseLength(this.basis());
    this.element.style.flexWrap = this.wrap();

    this.element.style.justifyContent = this.justifyContent();
    this.element.style.alignItems = this.alignItems();
    this.element.style.rowGap = this.parseLength(this.rowGap());
    this.element.style.columnGap = this.parseLength(this.columnGap());
    this.element.style.gap = this.parseLength(this.gap());

    if (this.sizeLockCounter() > 0) {
      this.element.style.flexGrow = '0';
      this.element.style.flexShrink = '0';
    } else {
      this.element.style.flexGrow = this.parseValue(this.grow());
      this.element.style.flexShrink = this.parseValue(this.shrink());
    }
  }

  @computed()
  protected applyFont() {
    this.element.style.fontFamily = this.parseValue(this.fontFamily());
    this.element.style.fontSize = this.parsePixels(this.fontSize());
    this.element.style.fontStyle = this.parseValue(this.fontStyle());
    this.element.style.lineHeight = this.parsePixels(this.lineHeight());
    this.element.style.fontWeight = this.parseValue(this.fontWeight());
    this.element.style.letterSpacing = this.parsePixels(this.letterSpacing());

    const wrap = this.textWrap();
    this.element.style.whiteSpace =
      wrap === null ? '' : wrap ? 'normal' : 'nowrap';
  }

  public override hit(position: Vector2): Node | null {
    const local = position.transformAsPoint(this.localToParent().inverse());
    if (this.getCacheRect().includes(local)) {
      return super.hit(position) ?? this;
    }

    return null;
  }
}
