import {Toggle} from '@motion-canvas/ui';
import {clsx} from 'clsx';
import {ComponentChildren, JSX} from 'preact';
import {Ref} from 'preact/hooks';
import styles from './index.module.scss';

const DEPTH_VAR = '--depth';

interface TreeElementProps
  extends Omit<
    JSX.HTMLAttributes<HTMLDivElement>,
    'label' | 'icon' | 'onToggle'
  > {
  icon?: ComponentChildren;
  label: ComponentChildren;
  children?: ComponentChildren;
  selected?: boolean;
  open: boolean;
  hasChildren?: boolean;
  onToggle?: (value: boolean) => void;
  depth?: number;
  forwardRef?: Ref<HTMLDivElement>;
}

export function TreeElement({
  label,
  children,
  selected,
  hasChildren,
  depth = 0,
  open,
  onToggle,
  icon,
  forwardRef,
  ...props
}: TreeElementProps) {
  return (
    <>
      <div
        className={clsx(
          styles.entry,
          selected && styles.active,
          hasChildren && styles.parent,
        )}
        onDblClick={() => {
          if (hasChildren) {
            onToggle?.(!open);
          }
        }}
        {...props}
        style={{[DEPTH_VAR]: `${depth}`}}
      >
        <div ref={forwardRef} className={styles.label}>
          {hasChildren && (
            <Toggle
              animated={false}
              open={open}
              onToggle={onToggle}
              onDblClick={e => {
                e.stopPropagation();
              }}
            />
          )}
          {icon}
          {label}
        </div>
      </div>
      {children}
    </>
  );
}
