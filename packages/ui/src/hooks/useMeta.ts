import type {Meta, Metadata} from '@motion-canvas/core/lib';
import {useCallback} from 'preact/hooks';
import {usePlayer} from './usePlayer';
import {useSubscribableValue} from './useSubscribable';

/**
 * Get a stateful value representing the contents of the given meta file and
 * a function to update it.
 *
 * @param meta - The meta object to extract data from.
 */
export function useMeta<T extends Metadata>(
  meta: Meta<T>,
): [T, (value: Partial<T>) => void] {
  const data = useSubscribableValue(meta.onDataChanged);
  const setter = useCallback(
    (value: Partial<T>) => meta.setDataSync(value),
    [meta],
  );

  return [data, setter];
}

/**
 * Get a stateful value representing the contents of the project's meta file and
 * a function to update it.
 */
export function useProjectMeta() {
  const {project} = usePlayer();
  return useMeta(project.meta);
}
