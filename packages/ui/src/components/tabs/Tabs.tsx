import clsx from 'clsx';
import {ComponentChildren, Ref, createContext, type JSX} from 'preact';
import {useContext} from 'preact/hooks';
import styles from './Tabs.module.scss';

interface TabsState {
  tab: string | null;
  setTab: (tab: string | null) => void;
}

const TabsContext = createContext<TabsState>({
  tab: null,
  setTab: () => {},
});

export function Tabs({
  className,
  ...props
}: JSX.HTMLAttributes<HTMLDivElement>) {
  return <div className={clsx(className, styles.tabs)} {...props} />;
}

export interface TabGroupProps extends TabsState {
  children: ComponentChildren;
}

export function TabGroup({children, ...rest}: TabGroupProps) {
  return <TabsContext.Provider value={rest}>{children}</TabsContext.Provider>;
}

export interface TabProps extends JSX.HTMLAttributes<HTMLButtonElement> {
  children: ComponentChildren;
  forwardRef?: Ref<HTMLButtonElement>;
  tab: string;
}

export function Tab({className, tab, forwardRef, ...props}: TabProps) {
  const {tab: currentTab, setTab} = useContext(TabsContext);
  const active = tab === currentTab;

  return (
    <button
      ref={forwardRef}
      onClick={() => setTab(active ? null : tab)}
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
