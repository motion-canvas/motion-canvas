import {useComputed} from '@preact/signals';
import clsx from 'clsx';
import {useShortcutContext} from '../../contexts/shortcuts';
import styles from './Footer.module.scss';
import {Versions} from './Versions';

export function Footer() {
  const {action, surface, configs} = useShortcutContext();
  const hints = useComputed(() => {
    const config = configs.current.get(surface.value);
    if (!config) return [];
    return Object.values(config);
  });

  return (
    <div className={styles.root}>
      <div className={styles.shortcuts}>
        {action.value && (
          <div className={clsx(styles.shortcut, styles.action)}>
            {action.value.name}
          </div>
        )}
        {hints.value.map(({display, description}) => (
          <div className={styles.shortcut}>
            <code className={styles.key}>{display}</code>
            <span className={styles.description}>{description}</span>
          </div>
        ))}
      </div>
      <Versions />
    </div>
  );
}
('');
