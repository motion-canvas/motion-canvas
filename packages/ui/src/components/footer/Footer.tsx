import {useComputed} from '@preact/signals';
import {useShortcutContext} from '../../contexts/shortcuts';
import styles from './Footer.module.scss';
import {Versions} from './Versions';

export function Footer() {
  const {surface, configs} = useShortcutContext();
  const hints = useComputed(() => {
    const config = configs.current.get(surface.value);
    if (!config) return [];
    return Object.values(config);
  });

  return (
    <div className={styles.root}>
      <div className={styles.shortcuts}>
        {hints.value.map(({display, description}) => (
          <div className={styles.shortcut}>
            <code className={styles.key}>{display}</code>
            <span className={styles.action}>{description}</span>
          </div>
        ))}
      </div>
      <Versions />
    </div>
  );
}
