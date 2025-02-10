import {describe, expect, it} from 'vitest';
import {Vector2} from '../types';
import {Vector2MetaField} from './Vector2MetaField';

describe('Vector2MetaField', () => {
  describe('Parses correctly', () => {
    it('Coerces vector values according to bounds when updating values', () => {
      const min: [number, number] = [10, 20];
      const max: [number, number] = [1000, 2000] as const;
      const name = 'Some name';
      const initial = new Vector2(12, 22);
      const prototype = new Vector2MetaField(name, initial).min(min).max(max);

      // Lower bound coercion
      const field1 = prototype.clone();
      field1.set([9, 22]);
      expect(field1.get().toArray()).toStrictEqual([10, 22]);

      const field2 = prototype.clone();
      field2.set([20, 19]);
      expect(field2.get().toArray()).toStrictEqual([20, 20]);

      // Upper bound coercion
      const field3 = prototype.clone();
      field3.set([1200, 22]);
      expect(field3.get().toArray()).toStrictEqual([1000, 22]);

      const field4 = prototype.clone();
      field4.set([500, 2200]);
      expect(field4.get().toArray()).toStrictEqual([500, 2000]);
    });

    it('Coerces vector values according to bounds when updating bounds', () => {
      const name = 'Some name';
      const initial = new Vector2(12, 22);
      const prototype = new Vector2MetaField(name, initial);

      // Lower bound coercion
      const field1 = prototype.clone();
      field1.min([20, 30]);
      expect(field1.get().toArray()).toStrictEqual([20, 30]);

      // Upper bound coercion
      const field2 = prototype.clone();
      field2.max([10, 20]);
      expect(field2.get().toArray()).toStrictEqual([10, 20]);
    });

    it('Throws error when bounds cross', () => {
      const name = 'Some name';
      const initial = new Vector2(1, 2);
      const field = new Vector2MetaField(name, initial);

      expect(() => field.min([10, 20]).max([9, 30])).toThrow();
      expect(() => field.min([10, 20]).max([200, -10])).toThrow();
    });
  });
});
