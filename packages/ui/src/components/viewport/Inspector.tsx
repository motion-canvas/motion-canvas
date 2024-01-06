import {FunctionComponent} from 'preact';
import {useMemo} from 'preact/hooks';
import {useApplication, usePanels} from '../../contexts';
import styles from './Viewport.module.scss';

export function Inspector() {
  const {inspection} = useApplication();
  const {inspectors} = usePanels();
  const lookup = useMemo(() => {
    const lookup = new Map<string, FunctionComponent>();
    for (const config of inspectors) {
      lookup.set(config.key, config.component);
    }

    return lookup;
  }, [inspectors]);

  const Component = lookup.get(inspection.value.key);

  return Component ? (
    <div className={styles.inspectorOverlay}>
      <div className={styles.inspector}>
        <Component />
      </div>
    </div>
  ) : null;
}
