import {Fragment} from 'preact';

export interface ElementSwitchProps<T extends string> {
  value: T;
  cases: Partial<Record<T, () => JSX.Element>>;
}

export function ElementSwitch<T extends string>({
  value,
  cases,
}: ElementSwitchProps<T>) {
  const Element = cases[value] ?? Fragment;
  return <Element />;
}
