import {initialize, property} from '../decorators';
import {Signal, useSignal} from '@motion-canvas/core/lib/utils';
import {Rect} from '@motion-canvas/core/lib/types';
import {AlignItems, FlexDirection, JustifyContent, LayoutMode} from './types';

export interface LayoutProps {
  mode?: LayoutMode;
  width?: number;
  height?: number;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  direction?: FlexDirection;
  justifyContent?: JustifyContent;
  alignItems?: AlignItems;
  ratio?: string;
}

export class Layout {
  @property(null)
  public declare readonly mode: Signal<LayoutMode, this>;
  @property(null)
  public declare readonly width: Signal<number | `${number}%`, this>;
  @property(null)
  public declare readonly height: Signal<number | `${number}%`, this>;
  @property(0)
  public declare readonly marginTop: Signal<number, this>;
  @property(0)
  public declare readonly marginBottom: Signal<number, this>;
  @property(0)
  public declare readonly marginLeft: Signal<number, this>;
  @property(0)
  public declare readonly marginRight: Signal<number, this>;
  @property('row')
  public declare readonly direction: Signal<FlexDirection, this>;
  @property('none')
  public declare readonly ratio: Signal<string, this>;
  @property('flex-start')
  public declare readonly justifyContent: Signal<JustifyContent, this>;
  @property('auto')
  public declare readonly alignItems: Signal<AlignItems, this>;

  public readonly element: HTMLDivElement;

  private isDirty = true;

  public constructor(props: LayoutProps) {
    this.element = document.createElement('div');
    this.element.style.display = 'flex';

    initialize(this, {defaults: props});
    this.update.onChanged.subscribe(() => {
      this.isDirty = true;
    });
  }

  public toPixels(value: number) {
    return `${value}px`;
  }

  public getComputedLayout(): Rect {
    const rect = this.element.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height,
      x: rect.x,
      y: rect.y,
    };
  }

  public updateIfNecessary(): boolean {
    if (this.isDirty) {
      this.update();
      this.isDirty = false;
      return true;
    }

    return false;
  }

  private readonly update = useSignal(() => {
    const mode = this.mode();
    this.element.style.position =
      mode === 'disabled' || mode === 'root' ? 'absolute' : '';

    const width = this.width();
    if (width === null) {
      this.element.style.width = 'auto';
    } else if (typeof width === 'string') {
      this.element.style.width = width;
    } else {
      this.element.style.width = this.toPixels(width);
    }

    const height = this.height();
    if (height === null) {
      this.element.style.height = 'auto';
    } else if (typeof height === 'string') {
      this.element.style.height = height;
    } else {
      this.element.style.height = this.toPixels(height);
    }

    this.element.style.marginTop = this.toPixels(this.marginTop());
    this.element.style.marginBottom = this.toPixels(this.marginBottom());
    this.element.style.marginLeft = this.toPixels(this.marginLeft());
    this.element.style.marginRight = this.toPixels(this.marginRight());
    this.element.style.flexDirection = this.direction();
    this.element.style.aspectRatio = this.ratio();
    this.element.style.justifyContent = this.justifyContent();
    this.element.style.alignItems = this.alignItems();
  });
}
