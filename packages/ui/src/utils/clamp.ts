export function clamp(min: number, max: number, value: number) {
  return value < min ? min : value > max ? max : value;
}
