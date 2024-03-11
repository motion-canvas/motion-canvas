import {FunctionComponent, NodeConstructor, PropsOf} from '../components';

/**
 * Create a higher order component with default props.
 *
 * @example
 * ```tsx
 * const MyTxt = withDefaults(Txt, {
 *   fill: '#f3303f',
 * });
 *
 * // ...
 *
 * view.add(<MyTxt>Hello, World!</MyTxt>);
 * ```
 *
 * @param component - The base class or function component to wrap.
 * @param defaults - The default props to apply.
 */
export function withDefaults<T extends FunctionComponent | NodeConstructor>(
  component: T,
  defaults: PropsOf<T>,
) {
  const Node = component;
  return (props: PropsOf<T>) => <Node {...defaults} {...props} />;
}
