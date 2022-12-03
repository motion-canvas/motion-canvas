import styles from './Tabs.module.scss';

import {ComponentChildren, Ref} from 'preact';

export interface BadgeInterface {
  children?: ComponentChildren;
  badgeRef?: Ref<HTMLDivElement>;
}

export function Badge({children, badgeRef}: BadgeInterface) {
  return (
    <div ref={badgeRef} className={styles.badge}>
      {children}
    </div>
  );
}
