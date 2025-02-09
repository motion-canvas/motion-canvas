import {describe, expect, it} from 'vitest';
import {Vector2} from '../types';
import {
  Vector2MetaField,
  Vector2MetaFieldConstructorParameters,
} from './Vector2MetaField';

describe('Vector2MetaField', () => {
  describe('Enforces invariants', () => {
    it('Throws error when constructing where some element of the vector is out of bounds', () => {
      const min: [number, number] = [10, 20];
      const max: [number, number] = [1000, 2000] as const;
      const name = 'Some name';
      const parameters: Vector2MetaFieldConstructorParameters = {
        min,
        max,
      };

      // Lower bound violation
      expect(
        () => new Vector2MetaField(name, new Vector2([9, 22]), parameters),
      ).toThrow();
      expect(
        () => new Vector2MetaField(name, new Vector2([20, 19]), parameters),
      ).toThrow();

      // Upper bound violation
      expect(
        () => new Vector2MetaField(name, new Vector2([1200, 22]), parameters),
      ).toThrow();
      expect(
        () => new Vector2MetaField(name, new Vector2([500, 2200]), parameters),
      ).toThrow();
    });

    it('Throws error when setting value where some element of the vector is out of bounds', () => {
      const min: [number, number] = [10, 20];
      const max: [number, number] = [1000, 2000] as const;
      const name = 'Some name';
      const parameters: Vector2MetaFieldConstructorParameters = {
        min,
        max,
      };

      const field = new Vector2MetaField(
        name,
        new Vector2([100, 200]),
        parameters,
      );

      // Lower bound violation
      expect(() => field.set(new Vector2([9, 22]))).toThrow();
      expect(() => field.set(new Vector2([20, 19]))).toThrow();

      // Upper bound violation
      expect(() => field.set(new Vector2([1200, 22]))).toThrow();
      expect(() => field.set(new Vector2([500, 2200]))).toThrow();
    });

    it('Throws error when bounds parameters cross', () => {
      const name = 'Some name';
      const initial = new Vector2(1, 2);

      expect(
        () =>
          new Vector2MetaField(name, initial, {
            min: [10, 20],
            max: [9, 30],
          }),
      ).toThrow();
      expect(
        () =>
          new Vector2MetaField(name, initial, {
            min: [10, 20],
            max: [200, -10],
          }),
      ).toThrow();
    });
  });
});
