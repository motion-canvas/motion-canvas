import { Module } from '../global';
import {useHover} from './useHover';
import { useShortcuts } from '../contexts/shortcuts';

type UseHoverType<T extends HTMLElement> = [React.RefObject<T>, boolean];

export function useShortcut<T extends HTMLElement>(
  shortcutModule: Module,
): UseHoverType<T> {
  const {setCurrentModule} = useShortcuts();
  const [ref, value] = useHover<T>(
    () => {
      setCurrentModule(shortcutModule);
    },
    () => {
      setCurrentModule(Module.None);
    },
  );

  return [ref, value];
}
