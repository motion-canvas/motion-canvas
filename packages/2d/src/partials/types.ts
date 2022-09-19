export type FlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';

export type JustifyContent =
  | 'flex-start'
  | 'center'
  | 'flex-end'
  | 'space-between'
  | 'space-around'
  | 'space-evenly';

export type AlignItems =
  | 'auto'
  | 'flex-start'
  | 'center'
  | 'flex-end'
  | 'stretch'
  | 'baseline'
  | 'space-between'
  | 'space-around';

export type ResolvedLayoutMode = 'disabled' | 'enabled' | 'root' | 'pop';
export type LayoutMode = ResolvedLayoutMode | null;

export type Length = number | `${number}%` | null;
