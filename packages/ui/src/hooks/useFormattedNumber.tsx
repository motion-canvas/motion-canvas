import {useMemo} from 'preact/hooks';

export function useFormattedNumber(value: number, precision = 6) {
  return useMemo(() => {
    if (typeof value !== 'number') {
      return null;
    }

    const absolute = Math.abs(value);
    let adjustedPrecision = precision;
    if (absolute >= 10) {
      adjustedPrecision--;
    }
    if (absolute >= 100) {
      adjustedPrecision--;
    }

    return value.toFixed(Math.max(0, adjustedPrecision));
  }, [value, precision]);
}
