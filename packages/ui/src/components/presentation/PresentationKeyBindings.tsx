class Key {
  public constructor(public code: string = '', public name: string = 'None') {}
}

class KeyBinding {
  public getDescription() {
    return `${this.action} ${this.keys
      .map(k => '[' + k.name + ']')
      .join(' or ')}`;
  } 
  public includes(keyCode: string) {
    return this.keys.some(k => k.code === keyCode);
  }
  public constructor(public keys: Key[], public action: string = 'None') {}
}
 
export class KeyBindings {
  public static readonly UP_ARROW = new Key('ArrowUp', 'Up Arrow');
  public static readonly DOWN_ARROW = new Key('ArrowDown', 'Down Arrow');
  public static readonly RIGHT_ARROW = new Key('ArrowRight', 'Right Arrow');
  public static readonly LEFT_ARROW = new Key('ArrowLeft', 'Left Arrow');
  public static readonly KEY_A = new Key('a', 'A');
  public static readonly KEY_B = new Key('b', 'B');
  public static readonly KEY_C = new Key('c', 'C');
  public static readonly KEY_D = new Key('d', 'D');
  public static readonly KEY_E = new Key('e', 'E');
  public static readonly KEY_F = new Key('f', 'F');
  public static readonly KEY_G = new Key('g', 'G');
  public static readonly KEY_H = new Key('h', 'H');
  public static readonly KEY_I = new Key('i', 'I');
  public static readonly KEY_J = new Key('j', 'J');
  public static readonly KEY_K = new Key('k', 'K');
  public static readonly KEY_L = new Key('l', 'L');
  public static readonly KEY_M = new Key('m', 'M');
  public static readonly KEY_N = new Key('n', 'N');
  public static readonly KEY_O = new Key('o', 'O');
  public static readonly KEY_P = new Key('p', 'P');
  public static readonly KEY_Q = new Key('q', 'Q');
  public static readonly KEY_R = new Key('r', 'R');
  public static readonly KEY_S = new Key('s', 'S');
  public static readonly KEY_T = new Key('t', 'T');
  public static readonly KEY_U = new Key('u', 'U');
  public static readonly KEY_V = new Key('v', 'V');
  public static readonly KEY_W = new Key('w', 'W');
  public static readonly KEY_X = new Key('x', 'X');
  public static readonly KEY_Y = new Key('y', 'Y');
  public static readonly KEY_Z = new Key('z', 'Z');
  public static readonly SPACEBAR = new Key(' ', 'Space');
  public static readonly ESC = new Key('esc', 'Space');
}

export class PresentationKeyBindings {
  public static readonly NEXT_SLIDE = new KeyBinding(
    [KeyBindings.UP_ARROW],
    'Next slide',
  );
  public static readonly PREV_SLIDE = new KeyBinding(
    [KeyBindings.DOWN_ARROW, KeyBindings.LEFT_ARROW],
    'Previous slide',
  );
  public static readonly TOGGLE_FULLSCREEN = new KeyBinding(
    [KeyBindings.KEY_F],
    'Toggle Fullscreen',
  );
  public static readonly RESUME = new KeyBinding(
    [KeyBindings.SPACEBAR, KeyBindings.RIGHT_ARROW],
    'Resume',
  );
}
