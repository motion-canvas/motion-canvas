import {
  compound,
  computed,
  initialize,
  Property,
  property,
} from '../decorators';
import {createSignal, Signal} from '@motion-canvas/core/lib/utils';
import {
  PossibleSpacing,
  Rect,
  Spacing,
  Vector2,
} from '@motion-canvas/core/lib/types';
import {
  FlexAlign,
  FlexDirection,
  FlexWrap,
  FlexJustify,
  LayoutMode,
  Length,
  FlexBasis,
} from './types';
import {TwoDView} from '../scenes';

export interface LayoutProps {
  tagName?: keyof HTMLElementTagNameMap;
  mode?: LayoutMode;

  maxWidth?: Length;
  maxHeight?: Length;
  minWidth?: Length;
  minHeight?: Length;
  ratio?: number;

  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  margin?: PossibleSpacing;

  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  padding?: PossibleSpacing;

  direction?: FlexDirection;
  basis?: FlexBasis;
  grow?: number;
  shrink?: number;
  wrap?: FlexWrap;

  justifyContent?: FlexJustify;
  alignItems?: FlexAlign;
  rowGap?: Length;
  columnGap?: Length;
  gap?: Length;

  fontFamily?: string;
  fontSize?: number;
  fontStyle?: string;
  fontWeight?: number;
  lineHeight?: number;
  letterSpacing?: number;
  textWrap?: boolean;
}

export class Layout {
  @property(null)
  public declare readonly mode: Signal<LayoutMode, this>;

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
  @compound({
    top: 'marginTop',
    bottom: 'marginBottom',
    left: 'marginLeft',
    right: 'marginRight',
  })
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
  @compound({
    top: 'paddingTop',
    bottom: 'paddingBottom',
    left: 'paddingLeft',
    right: 'paddingRight',
  })
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

  public readonly element: HTMLElement;
  public readonly styles: CSSStyleDeclaration;
  private sizeLockCounter = createSignal(0);

  public constructor({tagName = 'div', ...props}: LayoutProps) {
    const frame = document.querySelector<HTMLIFrameElement>(
      `#${TwoDView.frameID}`,
    );

    this.element = (frame?.contentDocument ?? document).createElement(tagName);
    this.styles = getComputedStyle(this.element);

    this.element.style.display = 'flex';
    this.element.style.boxSizing = 'border-box';

    initialize(this, {defaults: props});
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

  public lockSize() {
    this.sizeLockCounter(this.sizeLockCounter() + 1);
  }

  public releaseSize() {
    this.sizeLockCounter(this.sizeLockCounter() - 1);
  }

  public getComputedLayout(): Rect {
    return new Rect(this.element.getBoundingClientRect());
  }

  public setWidth(width: Length): this {
    this.element.style.width = this.parseLength(width);
    return this;
  }

  public setHeight(height: Length): this {
    this.element.style.height = this.parseLength(height);
    return this;
  }

  @computed()
  public applyFlex() {
    const mode = this.mode();
    this.element.style.position =
      mode === 'disabled' || mode === 'root' ? 'absolute' : 'relative';

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
    this.element.style.gap = this.parseLength(this.gap());
    this.element.style.rowGap = this.parseLength(this.rowGap());
    this.element.style.columnGap = this.parseLength(this.columnGap());

    if (this.sizeLockCounter() > 0) {
      this.element.style.flexGrow = '0';
      this.element.style.flexShrink = '0';
    } else {
      this.element.style.flexGrow = this.parsePixels(this.grow());
      this.element.style.flexShrink = this.parsePixels(this.shrink());
    }
  }

  @computed()
  public applyFont() {
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
}
