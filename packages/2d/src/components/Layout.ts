import {
  cloneable,
  computed,
  initial,
  inspectable,
  signal,
  Vector2LengthSignal,
  vector2Signal,
} from '../decorators';
import {
  Origin,
  originToOffset,
  PossibleSpacing,
  PossibleVector2,
  Rect,
  SerializedVector2,
  SpacingSignal,
  Vector2,
  Vector2Signal,
} from '@motion-canvas/core/lib/types';
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
  TextWrap,
} from '../partials';
import {threadable} from '@motion-canvas/core/lib/decorators';
import {ThreadGenerator} from '@motion-canvas/core/lib/threading';
import {Node, NodeProps} from './Node';
import {drawLine, lineTo} from '../utils';
import {spacingSignal} from '../decorators/spacingSignal';
import {
  createSignal,
  SignalValue,
  SimpleSignal,
} from '@motion-canvas/core/lib/signals';

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
  textWrap?: SignalValue<TextWrap>;

  size?: SignalValue<PossibleVector2>;
  offsetX?: SignalValue<number>;
  offsetY?: SignalValue<number>;
  offset?: SignalValue<PossibleVector2>;
  clip?: SignalValue<boolean>;
}

export class Layout extends Node {
  @initial(null)
  @signal()
  public declare readonly layout: SimpleSignal<LayoutMode, this>;

  @initial(null)
  @signal()
  public declare readonly maxWidth: SimpleSignal<Length, this>;
  @initial(null)
  @signal()
  public declare readonly maxHeight: SimpleSignal<Length, this>;
  @initial(null)
  @signal()
  public declare readonly minWidth: SimpleSignal<Length, this>;
  @initial(null)
  @signal()
  public declare readonly minHeight: SimpleSignal<Length, this>;
  @initial(null)
  @signal()
  public declare readonly ratio: SimpleSignal<number | null, this>;

  @spacingSignal('margin')
  public declare readonly margin: SpacingSignal<this>;

  @spacingSignal('padding')
  public declare readonly padding: SpacingSignal<this>;

  @initial('row')
  @signal()
  public declare readonly direction: SimpleSignal<FlexDirection, this>;
  @initial(null)
  @signal()
  public declare readonly basis: SimpleSignal<FlexBasis, this>;
  @initial(0)
  @signal()
  public declare readonly grow: SimpleSignal<number, this>;
  @initial(1)
  @signal()
  public declare readonly shrink: SimpleSignal<number, this>;
  @initial('nowrap')
  @signal()
  public declare readonly wrap: SimpleSignal<FlexWrap, this>;

  @initial('normal')
  @signal()
  public declare readonly justifyContent: SimpleSignal<FlexJustify, this>;
  @initial('normal')
  @signal()
  public declare readonly alignItems: SimpleSignal<FlexAlign, this>;
  @initial(null)
  @signal()
  public declare readonly gap: SimpleSignal<Length, this>;
  @initial(null)
  @signal()
  public declare readonly rowGap: SimpleSignal<Length, this>;
  @initial(null)
  @signal()
  public declare readonly columnGap: SimpleSignal<Length, this>;

  @initial(null)
  @signal()
  public declare readonly fontFamily: SimpleSignal<string | null, this>;
  @initial(null)
  @signal()
  public declare readonly fontSize: SimpleSignal<number | null, this>;
  @initial(null)
  @signal()
  public declare readonly fontStyle: SimpleSignal<string | null, this>;
  @initial(null)
  @signal()
  public declare readonly fontWeight: SimpleSignal<number | null, this>;
  @initial(null)
  @signal()
  public declare readonly lineHeight: SimpleSignal<number | null, this>;
  @initial(null)
  @signal()
  public declare readonly letterSpacing: SimpleSignal<number | null, this>;
  @initial(null)
  @signal()
  public declare readonly textWrap: SimpleSignal<TextWrap, this>;

  @cloneable(false)
  @inspectable(false)
  @signal()
  protected declare readonly customX: SimpleSignal<number, this>;
  protected getX(): number {
    if (this.isLayoutRoot()) {
      return this.customX();
    }

    return this.computedPosition().x;
  }
  protected setX(value: SignalValue<number>) {
    this.customX(value);
  }

  @cloneable(false)
  @inspectable(false)
  @signal()
  protected declare readonly customY: SimpleSignal<number, this>;

  protected getY(): number {
    if (this.isLayoutRoot()) {
      return this.customY();
    }

    return this.computedPosition().y;
  }
  protected setY(value: SignalValue<number>) {
    this.customY(value);
  }

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
    const width = this.desiredSize().x;
    const lock = typeof width !== 'number' || typeof value !== 'number';
    let from: number;
    if (lock) {
      from = this.size.x();
    } else {
      from = width;
    }

    let to: number;
    if (lock) {
      this.size.x(value);
      to = this.size.x();
    } else {
      to = value;
    }

    this.size.x(from);
    lock && this.lockSize();
    yield* tween(time, value =>
      this.size.x(interpolationFunction(from, to, timingFunction(value))),
    );
    this.size.x(value);
    lock && this.releaseSize();
  }

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
    const height = this.desiredSize().y;
    const lock = typeof height !== 'number' || typeof value !== 'number';

    let from: number;
    if (lock) {
      from = this.size.y();
    } else {
      from = height;
    }

    let to: number;
    if (lock) {
      this.size.y(value);
      to = this.size.y();
    } else {
      to = value;
    }

    this.size.y(from);
    lock && this.lockSize();
    yield* tween(time, value =>
      this.size.y(interpolationFunction(from, to, timingFunction(value))),
    );
    this.size.y(value);
    lock && this.releaseSize();
  }

  @cloneable(false)
  @initial({x: null, y: null})
  @vector2Signal({x: 'width', y: 'height'})
  public declare readonly size: Vector2LengthSignal<this>;

  @inspectable(false)
  @signal()
  protected declare readonly customWidth: SimpleSignal<Length, this>;
  @inspectable(false)
  @signal()
  protected declare readonly customHeight: SimpleSignal<Length, this>;
  @computed()
  protected desiredSize(): SerializedVector2<Length> {
    return {
      x: this.customWidth(),
      y: this.customHeight(),
    };
  }

  @threadable()
  protected *tweenSize(
    value: SignalValue<SerializedVector2<Length>>,
    time: number,
    timingFunction: TimingFunction,
    interpolationFunction: InterpolationFunction<Vector2>,
  ): ThreadGenerator {
    const size = this.desiredSize();
    let from: Vector2;
    if (typeof size.x !== 'number' || typeof size.y !== 'number') {
      from = this.size();
    } else {
      from = <Vector2>size;
    }

    let to: Vector2;
    if (
      typeof value === 'object' &&
      typeof value.x === 'number' &&
      typeof value.y === 'number'
    ) {
      to = <Vector2>value;
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

  @vector2Signal('offset')
  public declare readonly offset: Vector2Signal<this>;

  @initial(false)
  @signal()
  public declare readonly clip: SimpleSignal<boolean, this>;

  public readonly element: HTMLElement;
  public readonly styles: CSSStyleDeclaration;

  protected readonly sizeLockCounter = createSignal(0);

  public constructor({tagName = 'div', ...props}: LayoutProps) {
    super(props);

    this.element = document.createElement(tagName);
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

    return size.scale(0.5).mul(offset);
  }

  /**
   * Get the resolved layout mode of this node.
   *
   * @remarks
   * When the mode is `null`, its value will be inherited from the parent.
   *
   * Use {@link layout} to get the raw mode set for this node (without
   * inheritance).
   */
  @computed()
  public layoutEnabled(): boolean {
    return this.layout() ?? this.parentTransform()?.layoutEnabled() ?? false;
  }

  @computed()
  public isLayoutRoot(): boolean {
    return !this.layoutEnabled() || !this.parentTransform()?.layoutEnabled();
  }

  public override localToParent(): DOMMatrix {
    const matrix = new DOMMatrix();
    const offset = this.size().mul(this.offset()).scale(-0.5);
    matrix.translateSelf(this.position.x(), this.position.y());
    matrix.rotateSelf(0, 0, this.rotation());
    matrix.scaleSelf(this.scale.x(), this.scale.y());
    matrix.translateSelf(offset.x, offset.y);

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
      rect.x + (rect.width / 2) * this.offset.x(),
      rect.y + (rect.height / 2) * this.offset.y(),
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
  protected computedSize(): Vector2 {
    this.requestLayoutUpdate();
    return this.getComputedLayout().size;
  }

  /**
   * Find the closest layout root and apply any new layout changes.
   */
  @computed()
  protected requestLayoutUpdate() {
    const parent = this.parentTransform();
    if (this.appendedToView()) {
      parent?.requestFontUpdate();
      this.updateLayout();
    } else {
      parent!.requestLayoutUpdate();
    }
  }

  @computed()
  protected appendedToView() {
    const root = this.isLayoutRoot();
    if (root) {
      this.view()?.element.append(this.element);
    }

    return root;
  }

  /**
   * Apply any new layout changes to this node and its children.
   */
  @computed()
  protected updateLayout() {
    this.applyFont();
    this.applyFlex();
    if (this.layoutEnabled()) {
      const children = this.layoutChildren();
      for (const child of children) {
        child.updateLayout();
      }
    }
  }

  @computed()
  protected layoutChildren(): Layout[] {
    this.element.innerText = '';
    const queue = [...this.children()];
    const result: Layout[] = [];
    while (queue.length) {
      const child = queue.shift();
      if (child instanceof Layout) {
        this.element.append(child.element);
        result.push(child);
      } else if (child) {
        queue.push(...child.children());
      }
    }

    return result;
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
    return Rect.fromSizeCentered(this.computedSize());
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

  public override drawOverlay(
    context: CanvasRenderingContext2D,
    matrix: DOMMatrix,
  ) {
    const size = this.computedSize();
    const offset = size.mul(this.offset()).scale(0.5).transformAsPoint(matrix);
    const rect = Rect.fromSizeCentered(size);
    const layout = rect.transformCorners(matrix);
    const padding = rect
      .addSpacing(this.padding().scale(-1))
      .transformCorners(matrix);
    const margin = rect.addSpacing(this.margin()).transformCorners(matrix);

    context.beginPath();
    drawLine(context, margin);
    drawLine(context, layout);
    context.closePath();
    context.fillStyle = 'rgba(255,193,125,0.6)';
    context.fill('evenodd');

    context.beginPath();
    drawLine(context, layout);
    drawLine(context, padding);
    context.closePath();
    context.fillStyle = 'rgba(180,255,147,0.6)';
    context.fill('evenodd');

    context.beginPath();
    drawLine(context, layout);
    context.closePath();
    context.lineWidth = 1;
    context.strokeStyle = 'white';
    context.stroke();

    const radius = 8;
    context.beginPath();
    lineTo(context, offset.addY(-radius));
    lineTo(context, offset.addY(radius));
    lineTo(context, offset);
    lineTo(context, offset.addX(-radius));
    context.arc(offset.x, offset.y, radius, 0, Math.PI * 2);
    context.stroke();
  }

  public getOriginDelta(origin: Origin) {
    const size = this.computedSize().scale(0.5);
    const offset = this.offset().mul(size);
    if (origin === Origin.Middle) {
      return offset.flipped;
    }

    const newOffset = originToOffset(origin).mul(size);
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
    const oldOffset = this.offset().mul(size);
    const newOffset = offset.mul(size);
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
    this.element.style.position = this.isLayoutRoot() ? 'absolute' : 'relative';

    const size = this.desiredSize();
    this.element.style.width = this.parseLength(size.x);
    this.element.style.height = this.parseLength(size.y);
    this.element.style.maxWidth = this.parseLength(this.maxWidth());
    this.element.style.minWidth = this.parseLength(this.minWidth());
    this.element.style.maxHeight = this.parseLength(this.maxHeight());
    this.element.style.minWidth = this.parseLength(this.minWidth());
    this.element.style.aspectRatio = this.parseValue(this.ratio());

    this.element.style.marginTop = this.parsePixels(this.margin.top());
    this.element.style.marginBottom = this.parsePixels(this.margin.bottom());
    this.element.style.marginLeft = this.parsePixels(this.margin.left());
    this.element.style.marginRight = this.parsePixels(this.margin.right());

    this.element.style.paddingTop = this.parsePixels(this.padding.top());
    this.element.style.paddingBottom = this.parsePixels(this.padding.bottom());
    this.element.style.paddingLeft = this.parsePixels(this.padding.left());
    this.element.style.paddingRight = this.parsePixels(this.padding.right());

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
      wrap === null
        ? ''
        : typeof wrap === 'boolean'
        ? wrap
          ? 'normal'
          : 'nowrap'
        : wrap;
  }

  public override hit(position: Vector2): Node | null {
    const local = position.transformAsPoint(this.localToParent().inverse());
    if (this.cacheRect().includes(local)) {
      return super.hit(position) ?? this;
    }

    return null;
  }
}
