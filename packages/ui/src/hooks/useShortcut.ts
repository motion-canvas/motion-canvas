import {useHover} from './useHover';
import { useShortcuts } from '../contexts/shortcuts';
import { Modules, Action, KeyBindingMapping, ModuleType } from '@motion-canvas/core';
import { ModuleShortcuts } from '../contexts/shortcuts';

type UseHoverType<T extends HTMLElement> = {ref: React.RefObject<T>, value: boolean};

export function useShortcut<T extends HTMLElement>(
  shortcutModule: string,
): {
  hoverRef: UseHoverType<T>;
  moduleShortcuts: ModuleShortcuts;
}{
  const {moduleShortcuts, setCurrentModule} = useShortcuts();
  const [ref, value] = useHover<T>(
    () => {
      setCurrentModule(shortcutModule as ModuleType);
    },
    () => {
      setCurrentModule(Modules.None as ModuleType);
    },
  );

  return {hoverRef: {ref, value}, moduleShortcuts};
}
