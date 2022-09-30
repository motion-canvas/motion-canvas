import {computed, initialize, property} from '../decorators';
import {createSignal, Signal} from '@motion-canvas/core/lib/utils';
import {Rect} from '@motion-canvas/core/lib/types';
import {
  AlignItems,
  FlexDirection,
  JustifyContent,
  LayoutMode,
  Length,
} from './types';
import {TwoDView} from '../scenes';

export interface LayoutProps {
  tagName?: keyof HTMLElementTagNameMap;
  mode?: LayoutMode;
  width?: number;
  height?: number;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  direction?: FlexDirection;
  justifyContent?: JustifyContent;
  alignItems?: AlignItems;
  ratio?: string;

  fontFamily?: string;
  fontSize?: number;
  fontStyle?: string;
  fontWeight?: number;
  lineHeight?: number;
  letterSpacing?: number;
  wrap?: boolean;
}

export class Layout {
  @property(null)
  public declare readonly mode: Signal<LayoutMode, this>;

  @property(0)
  public declare readonly marginTop: Signal<number, this>;
  @property(0)
  public declare readonly marginBottom: Signal<number, this>;
  @property(0)
  public declare readonly marginLeft: Signal<number, this>;
  @property(0)
  public declare readonly marginRight: Signal<number, this>;

  @property(0)
  public declare readonly paddingTop: Signal<number, this>;
  @property(0)
  public declare readonly paddingBottom: Signal<number, this>;
  @property(0)
  public declare readonly paddingLeft: Signal<number, this>;
  @property(0)
  public declare readonly paddingRight: Signal<number, this>;

  @property('row')
  public declare readonly direction: Signal<FlexDirection, this>;
  @property('none')
  public declare readonly ratio: Signal<string, this>;
  @property('flex-start')
  public declare readonly justifyContent: Signal<JustifyContent, this>;
  @property('auto')
  public declare readonly alignItems: Signal<AlignItems, this>;

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
  public declare readonly wrap: Signal<boolean | null, this>;

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

  public toPixels(value: number) {
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
    if (width === null) {
      this.element.style.width = 'auto';
    } else if (typeof width === 'string') {
      this.element.style.width = width;
    } else {
      this.element.style.width = this.toPixels(width);
    }

    return this;
  }

  public setHeight(height: Length): this {
    if (height === null) {
      this.element.style.height = 'auto';
    } else if (typeof height === 'string') {
      this.element.style.height = height;
    } else {
      this.element.style.height = this.toPixels(height);
    }

    return this;
  }

  @computed()
  public applyFlex() {
    const mode = this.mode();
    this.element.style.position =
      mode === 'disabled' || mode === 'root' ? 'absolute' : 'relative';

    this.element.style.marginTop = this.toPixels(this.marginTop());
    this.element.style.marginBottom = this.toPixels(this.marginBottom());
    this.element.style.marginLeft = this.toPixels(this.marginLeft());
    this.element.style.marginRight = this.toPixels(this.marginRight());
    this.element.style.paddingTop = this.toPixels(this.paddingTop());
    this.element.style.paddingBottom = this.toPixels(this.paddingBottom());
    this.element.style.paddingLeft = this.toPixels(this.paddingLeft());
    this.element.style.paddingRight = this.toPixels(this.paddingRight());
    this.element.style.flexDirection = this.direction();
    this.element.style.aspectRatio = this.ratio();
    this.element.style.justifyContent = this.justifyContent();
    this.element.style.alignItems = this.alignItems();

    this.element.style.flexGrow = this.sizeLockCounter() > 0 ? '0' : '';
    this.element.style.flexShrink = this.sizeLockCounter() > 0 ? '0' : '';
  }

  @computed()
  public applyFont() {
    this.element.style.fontFamily = this.fontFamily() ?? '';
    const fontSize = this.fontSize();
    this.element.style.fontSize = fontSize ? this.toPixels(fontSize) : '';
    this.element.style.fontStyle = this.fontStyle() ?? '';
    const lineHeight = this.lineHeight();
    this.element.style.lineHeight =
      lineHeight === null ? '' : this.toPixels(lineHeight);
    const fontWeight = this.fontWeight();
    this.element.style.fontWeight =
      fontWeight === null ? '' : fontWeight.toString();
    const letterSpacing = this.letterSpacing();
    this.element.style.letterSpacing = letterSpacing
      ? this.toPixels(letterSpacing)
      : '';
    const wrap = this.wrap();
    this.element.style.whiteSpace =
      wrap === null ? '' : wrap ? 'normal' : 'nowrap';
  }
}
