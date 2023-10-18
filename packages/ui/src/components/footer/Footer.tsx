import {useShortcuts} from '../../contexts/shortcuts';
import {Versions} from './Versions';
import styles from './Footer.module.scss';

export function Footer() {
  const {moduleShortcuts, currentModule} = useShortcuts();
  return (
    <div className={styles.root}>
      <div className={styles.shortcuts}>
        {Object.values(moduleShortcuts)
          .filter(({available}) => !available || available())
          .map(({name, keys}) => (
            <div className={styles.shortcut}>
              {keys.map(k => <code className={styles.key}>{k.code}</code>)}
              <span className={styles.action}>{name}</span>
            </div>
          ))}
      </div>
      <Versions />
    </div>
  );
}
