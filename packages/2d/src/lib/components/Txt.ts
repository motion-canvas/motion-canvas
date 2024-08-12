import {
  DEFAULT,
  InterpolationFunction,
  SignalValue,
  SimpleSignal,
  ThreadGenerator,
  TimingFunction,
  all,
  capitalize,
  threadable,
} from '@motion-canvas/core';
import {computed, initial, nodeName, signal} from '../decorators';
import {is} from '../utils';
import {Node} from './Node';
import {Shape, ShapeProps} from './Shape';
import {TxtLeaf} from './TxtLeaf';
import {ComponentChildren} from './types';

type TxtChildren = string | Node | (string | Node)[];
type AnyTxt = Txt | TxtLeaf;

export interface TxtProps extends ShapeProps {
  children?: TxtChildren;
  text?: SignalValue<string>;
}

@nodeName('Txt')
export class Txt extends Shape {
  /**
   * Create a bold text node.
   *
   * @remarks
   * This is a shortcut for
   * ```tsx
   * <Txt fontWeight={700} />
   * ```
   *
   * @param props - Additional text properties.
   */
  public static b(props: TxtProps) {
    return new Txt({...props, fontWeight: 700});
  }

  /**
   * Create an italic text node.
   *
   * @remarks
   * This is a shortcut for
   * ```tsx
   * <Txt fontStyle={'italic'} />
   * ```
   *
   * @param props - Additional text properties.
   */
  public static i(props: TxtProps) {
    return new Txt({...props, fontStyle: 'italic'});
  }

  @initial('')
  @signal()
  public declare readonly text: SimpleSignal<string, this>;

  protected getText(): string {
    return this.innerText();
  }

  protected setText(value: SignalValue<string>) {
    const children = this.children();
    let leaf: TxtLeaf | null = null;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (leaf === null && child instanceof TxtLeaf) {
        leaf = child;
      } else {
        child.parent(null);
      }
    }

    if (leaf === null) {
      leaf = new TxtLeaf({text: value});
      leaf.parent(this);
    } else {
      leaf.text(value);
    }

    this.setParsedChildren([leaf]);
  }

  protected override setChildren(value: SignalValue<ComponentChildren>) {
    if (this.children.context.raw() === value) {
      return;
    }

    if (typeof value === 'string') {
      this.text(value);
    } else {
      super.setChildren(value);
    }
  }

  @threadable()
  protected *tweenText(
    value: SignalValue<string>,
    time: number,
    timingFunction: TimingFunction,
    interpolationFunction: InterpolationFunction<string>,
  ): ThreadGenerator {
    const children = this.children();
    if (children.length !== 1 || !(children[0] instanceof TxtLeaf)) {
      this.text.save();
    }

    const leaf = this.childAs<TxtLeaf>(0)!;
    const oldText = leaf.text.context.raw();
    const oldSize = this.size.context.raw();
    leaf.text(value);
    const newSize = this.size();
    leaf.text(oldText ?? DEFAULT);

    if (this.height() === 0) {
      this.height(newSize.height);
    }

    yield* all(
      this.size(newSize, time, timingFunction),
      leaf.text(value, time, timingFunction, interpolationFunction),
    );

    this.children.context.setter(value);
    this.size(oldSize);
  }

  protected getLayout(): boolean {
    return true;
  }

  public constructor({children, text, ...props}: TxtProps) {
    super(props);
    this.children(text ?? children);
  }

  @computed()
  protected innerText(): string {
    const children = this.childrenAs<Txt | TxtLeaf>();
    let text = '';
    for (const child of children) {
      text += child.text();
    }

    return text;
  }

  @computed()
  protected parentTxt() {
    const parent = this.parent();
    return parent instanceof Txt ? parent : null;
  }

  protected override parseChildren(children: ComponentChildren): AnyTxt[] {
    const result: AnyTxt[] = [];
    const array = Array.isArray(children) ? children : [children];
    for (const child of array) {
      if (child instanceof Txt || child instanceof TxtLeaf) {
        result.push(child);
      } else if (typeof child === 'string') {
        result.push(new TxtLeaf({text: child}));
      }
    }

    return result;
  }

  protected override applyFlex() {
    super.applyFlex();
    this.element.style.display = this.findAncestor(is(Txt))
      ? 'inline'
      : 'block';
  }

  protected override draw(context: CanvasRenderingContext2D) {
    this.drawChildren(context);
  }
}

[
  'fill',
  'stroke',
  'lineWidth',
  'strokeFirst',
  'lineCap',
  'lineJoin',
  'lineDash',
  'lineDashOffset',
].forEach(prop => {
  (Txt.prototype as any)[`getDefault${capitalize(prop)}`] = function (
    this: Txt,
    initial: unknown,
  ) {
    return (this.parentTxt() as any)?.[prop]() ?? initial;
  };
});
