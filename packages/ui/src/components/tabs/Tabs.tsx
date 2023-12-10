import clsx from 'clsx';
import {cloneElement, ComponentChildren, JSX, Ref, VNode} from 'preact';
import styles from './Tabs.module.scss';

function isTab(node: VNode): node is VNode<TabProps> {
  return node.type === Tab;
}

export function Tabs({
  className,
  ...props
}: JSX.HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx(className, styles.tabs)} {...props} />;
}

export interface TabGroupProps {
  children: VNode | VNode[];
  tab: string | null;
  setTab: (tab: string | null) => void;
}

export function TabGroup({children, tab, setTab}: TabGroupProps) {
  const array = Array.isArray(children) ? children : [children];
  return (
    <>
      {array.map(child => {
        if (isTab(child)) {
          const active = child.props.tab === tab;
          return cloneElement(child, {
            active,
            onClick: () => setTab(active ? null : child.props.tab),
          });
        }
        return child;
      })}
    </>
  );
}

export interface TabProps extends JSX.HTMLAttributes<HTMLButtonElement> {
  children: ComponentChildren;
  forwardRef?: Ref<HTMLButtonElement>;
  active?: boolean;
  tab: string;
}

export function Tab({className, forwardRef, active, ...props}: TabProps) {
  return (
    <button
      ref={forwardRef}
      className={clsx(styles.tab, active && styles.active, className)}
      {...props}
    />
  );
}

export interface TabLinkProps extends JSX.HTMLAttributes<HTMLAnchorElement> {
  children: ComponentChildren;
  disabled?: boolean;
}

export function TabLink({className, href, disabled, ...props}: TabLinkProps) {
  return (
    <a
      className={clsx(
        styles.tab,
        (!href || disabled) && styles.disabled,
        className,
      )}
      href={href}
      {...props}
    />
  );
}

export function Space() {
  return <div className={styles.space} />;
}
