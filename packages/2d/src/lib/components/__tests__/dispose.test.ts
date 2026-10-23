import {SimpleSignal} from '@motion-canvas/core';
import {describe, expect, it, vi} from 'vitest';
import {initial, signal} from '../../decorators';
import {Node} from '../Node';
import {mockScene2D} from './mockScene2D';

describe('dispose', () => {
  mockScene2D();

  it('Reports which decorated property was overwritten', () => {
    class InvalidNode extends Node {
      @signal()
      public declare readonly bar: number;

      public constructor() {
        super({});
        this.bar = 3;
      }
    }

    const node = new InvalidNode();

    expect(() => node.dispose()).toThrowError(
      /Property "bar".*not a signal.*@signal\(\)/,
    );
  });

  it('Disposes a valid custom signal', () => {
    class ValidNode extends Node {
      @initial(0)
      @signal()
      public declare readonly bar: SimpleSignal<number, this>;
    }

    const node = new ValidNode({});
    const dispose = vi.spyOn(node.bar.context, 'dispose');

    node.dispose();

    expect(dispose).toHaveBeenCalledOnce();
  });
});
