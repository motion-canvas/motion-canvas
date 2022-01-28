import {Group} from 'konva/lib/Group';
import {Rect} from 'konva/lib/shapes/Rect';
import {Text} from 'konva/lib/shapes/Text';
import {Vector2d} from 'konva/lib/types';
import {Origin, Direction} from '../types/Origin';
import {tween} from '../tweening';

export class ObjectNode extends Group {
  public readonly box: Rect;
  public readonly text: Text;
  private _origin: Origin = Origin.Middle;

  public constructor() {
    super();

    this.box = new Rect({
      x: 0,
      y: 0,
      height: 80,
      cornerRadius: 8,
      fill: '#242424',
    });

    this.text = new Text({
      x: 0,
      y: 0,
      fontSize: 28,
      align: 'center',
      fontFamily: 'JetBrains Mono',
      fill: 'white',
    });

    this.add(this.box);
    this.add(this.text);
  }

  public setOrigin(origin: Origin): this {
    if (this._origin === origin) return;
    this._origin = origin;
    this.recalculate();

    return this;
  }

  public setText(text: string): this {
    this.text.text(text);
    this.recalculate();

    return this;
  }

  public *animateText(text: string) {
    const from = this.recalculateValues();
    const previousText = this.text.text();
    this.text.text(text);
    const to = this.recalculateValues();
    this.text.text(previousText);

    yield* tween(0.3, value => {
      this.box.width(value.easeInOutCubic(from.width, to.width));
      this.text.width(value.easeInOutCubic(from.width, to.width));
      this.box.offset(value.vector2d(from.box, to.box, value.easeInOutCubic()));
      this.text.offset(
        value.vector2d(from.text, to.text, value.easeInOutCubic()),
      );
      this.text.text(value.text(previousText, text, value.easeInOutCubic()));
    });

    this.recalculate();
  }

  private recalculate() {
    const values = this.recalculateValues();

    this.box.offset(values.box);
    this.text.offset(values.text);
    this.box.width(values.width);
    this.text.width(values.width);
  }

  private recalculateValues() {
    const previousWidth = this.text.width();
    this.text.width(null);
    const width = this.text.getTextWidth();
    const height = this.text.getTextHeight();
    const boxWidth = Math.ceil((width + 80) / 20) * 20;
    this.text.width(previousWidth);

    const box: Vector2d = {x: 0, y: 0};
    const text: Vector2d = {x: 0, y: 0};

    if (this._origin & Direction.Left) {
      box.x = text.x = boxWidth;
    } else if (this._origin & Direction.Right) {
      box.x = text.x = 0;
    } else {
      box.x = text.x = boxWidth / 2;
    }

    if (this._origin & Direction.Top) {
      box.y = 80;
      text.y = height / 2 + 40;
    } else if (this._origin & Direction.Bottom) {
      box.y = 0;
      text.y = height / 2 - 40;
    } else {
      box.y = 40;
      text.y = height / 2;
    }

    return {
      width: boxWidth,
      box,
      text,
    };
  }
}
