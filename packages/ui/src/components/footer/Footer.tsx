import {useShortcuts} from '../../contexts/shortcuts';
import styles from './Footer.module.scss';
import {Versions} from './Versions';

export function Footer() {
  const {shortcuts, currentModule} = useShortcuts();
  return (
    <div className={styles.root}>
      <div className={styles.shortcuts}>
        {shortcuts[currentModule]
          .filter(({available}) => !available || available())
          .map(({key, action}) => (
            <div className={styles.shortcut}>
              <code className={styles.key}>{key}</code>
              <span className={styles.action}>{action}</span>
            </div>
          ))}
      </div>
      <Versions />
    </div>
  );
}
