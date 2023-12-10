import styles from '@site/src/components/NavbarLink/styles.module.css';
import clsx from 'clsx';
import React, {ReactNode, useMemo} from 'react';

export interface NavbarLinkProps {
  href: string;
  suffix: string;
  amount: false | null | number;
  children: ReactNode;
}

export default function NavbarLink({
  href,
  suffix,
  amount,
  children,
}: NavbarLinkProps) {
  const formatted = useMemo(() => {
    if (!amount) return null;
    return amount >= 1000 ? `${Math.round(amount / 100) / 10}k` : amount;
  }, [amount]);

  return (
    <div className={clsx(styles.root, amount === null && styles.loading)}>
      {amount !== false && (
        <div className={styles.badge}>
          <small>
            <strong>{formatted}</strong> {suffix}
          </small>
        </div>
      )}
      <a href={href} className={styles.icon}>
        {children}
      </a>
    </div>
  );
}
