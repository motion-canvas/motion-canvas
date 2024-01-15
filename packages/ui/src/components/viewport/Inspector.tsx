import {useSignal, useSignalEffect} from '@preact/signals';
import clsx from 'clsx';
import {FunctionComponent} from 'preact';
import {useEffect, useMemo, useRef} from 'preact/hooks';
import {useApplication, usePanels} from '../../contexts';
import {useReducedMotion} from '../../hooks';
import {IconButton} from '../controls';
import {ChevronRight} from '../icons/ChevronRight';
import styles from './Viewport.module.scss';

export function Inspector() {
  const ref = useRef<HTMLDivElement>();
  const open = useSignal(true);
  const render = useSignal(true);
  const {inspection} = useApplication();
  const {inspectors} = usePanels();
  const reducedMotion = useReducedMotion();
  const lookup = useMemo(() => {
    const lookup = new Map<string, FunctionComponent>();
    for (const config of inspectors) {
      lookup.set(config.key, config.component);
    }

    return lookup;
  }, [inspectors]);

  if (reducedMotion) {
    render.value = open.value;
  }

  useSignalEffect(() => {
    if (open.value) {
      render.value = true;
    }
  });

  useEffect(() => {
    const element = ref.current;
    if (!element || reducedMotion) {
      return;
    }
    const handle = () => {
      render.value = open.value;
    };
    element.addEventListener('transitionend', handle);
    return () => element.removeEventListener('transitionend', handle);
  }, [ref.current, reducedMotion]);

  const Component = lookup.get(inspection.value.key);

  return Component ? (
    <>
      <div
        ref={ref}
        className={clsx(styles.inspectorOverlay, open.value && styles.open)}
      >
        <div className={styles.inspector}>{render.value && <Component />}</div>
      </div>
      <IconButton
        className={clsx(styles.inspectorButton, open.value && styles.open)}
        title="Show inspector"
        onClick={() => {
          open.value = !open.value;
        }}
      >
        <ChevronRight />
      </IconButton>
    </>
  ) : null;
}
