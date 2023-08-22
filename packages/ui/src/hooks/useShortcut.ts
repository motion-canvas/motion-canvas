import {useShortcuts, ShortcutModules} from '../contexts/shortcuts';
import {useHover} from './useHover';

type UseHoverType<T extends HTMLElement> = [React.RefObject<T>, boolean];

export function useShortcut<T extends HTMLElement>(
  shortcutModule: ShortcutModules,
): UseHoverType<T> {
  const {setCurrentModule} = useShortcuts();
  const [ref, value] = useHover<T>(
    () => {
      setCurrentModule(shortcutModule);
    },
    () => {
      setCurrentModule('none');
    },
  );

  return [ref, value];
}
