import {IRect, Vector2d} from 'konva/lib/types';
import mixColor from 'mix-color';

export class TimeTween {
  public constructor(public value: number) {}

  public easeInOutCirc(from = 0, to = 1) {
    const value =
      this.value < 0.5
        ? (1 - Math.sqrt(1 - Math.pow(2 * this.value, 2))) / 2
        : (Math.sqrt(1 - Math.pow(-2 * this.value + 2, 2)) + 1) / 2;
    return TimeTween.map(from, to, value);
  }

  public easeOutExpo(from = 0, to = 1, value?: number) {
    value ??= this.value;
    value = value === 1 ? 1 : 1 - Math.pow(2, -10 * value);
    return TimeTween.map(from, to, value);
  }

  public easeInExpo(from = 0, to = 1, value?: number) {
    value ??= this.value;
    value = value === 0 ? 0 : Math.pow(2, 10 * value - 10);
    return TimeTween.map(from, to, value);
  }

  public linear(from = 0, to = 1, value?: number) {
    return TimeTween.map(from, to, value ?? this.value);
  }

  public easeInCirc(from = 0, to = 1) {
    const value = 1 - Math.sqrt(1 - Math.pow(this.value, 2));
    return TimeTween.map(from, to, value);
  }

  public easeOutCirc(from = 0, to = 1) {
    const value = Math.sqrt(1 - Math.pow(this.value - 1, 2));
    return TimeTween.map(from, to, value);
  }

  public easeInOutCubic(from = 0, to = 1) {
    const value =
      this.value < 0.5
        ? 4 * this.value * this.value * this.value
        : 1 - Math.pow(-2 * this.value + 2, 3) / 2;
    return TimeTween.map(from, to, value);
  }

  public easeInOutQuint(from = 0, to = 1) {
    const value =
      this.value < 0.5
        ? 16 * this.value * this.value * this.value * this.value * this.value
        : 1 - Math.pow(-2 * this.value + 2, 5) / 2;
    return TimeTween.map(from, to, value);
  }

  public text(from: string, to: string, value?: number) {
    // left to right
    if (to.length > from.length) {
      const current = Math.floor(to.length * (value ?? this.value));
      const currentLength = Math.floor(
        TimeTween.map(from.length - 1, to.length, value ?? this.value),
      );
      let text = '';
      for (let i = 0; i < to.length; i++) {
        if (i < current) {
          text += to[i];
        } else if (from[i] || i <= currentLength) {
          text += from[i] ?? to[i];
        }
      }

      return text;
    }
    // right to left
    else {
      const current = Math.round(from.length * (1 - (value ?? this.value)));
      const currentLength = Math.floor(
        TimeTween.map(from.length + 1, to.length, value ?? this.value),
      );
      let text = [];
      for (let i = from.length - 1; i >= 0; i--) {
        if (i < current) {
          text.unshift(from[i]);
        } else if (to[i] || i < currentLength) {
          text.unshift(to[i] ?? from[i]);
        }
      }

      return text.join('');
    }
  }

  public color(from: string, to: string, value?: number) {
    return mixColor(from, to, value ?? this.value);
  }

  public vector2d(from: Vector2d, to: Vector2d, value?: number) {
    return {
      x: TimeTween.map(from.x, to.x, value ?? this.value),
      y: TimeTween.map(from.y, to.y, value ?? this.value),
    };
  }

  public rectArc(
    from: Partial<IRect>,
    to: Partial<IRect>,
    reverse?: boolean,
    value?: number,
  ) {
    value ??= this.easeInOutQuint(0, Math.PI / 2);
    let xValue = Math.sin(value);
    let yValue = 1 - Math.cos(value);
    if (reverse) {
      [xValue, yValue] = [yValue, xValue];
    }

    return {
      x: TimeTween.map(from.x ?? 0, to.x ?? 0, xValue),
      y: TimeTween.map(from.y ?? 0, to.y ?? 0, yValue),
      width: TimeTween.map(from.width ?? 0, to.width ?? 0, xValue),
      height: TimeTween.map(from.height ?? 0, to.height ?? 0, yValue),
    };
  }

  public static vector2d(from: Vector2d, to: Vector2d, value: number) {
    return {
      x: TimeTween.map(from.x, to.x, value),
      y: TimeTween.map(from.y, to.y, value),
    };
  }

  public static map(from: number, to: number, value: number) {
    return from + (to - from) * value;
  }
}
