import {ComponentChildren, createContext} from 'preact';
import {useContext, useState} from 'preact/hooks';

export type Shortcut = {
  key: string;
  action: string;
};

export type ShortcutModules = 'global' | 'timeline' | 'viewport' | 'none';
type ShortcutsByModule = Record<ShortcutModules, Shortcut[]>;
type ShortcutsState = {
  currentModule: ShortcutModules;
  shortcuts: ShortcutsByModule;
  setCurrentModule?: (module: ShortcutModules) => void;
};

const initialshortcuts: ShortcutsByModule = {
  global: [
    {key: 'Space', action: 'Toggle playback'},
    {key: '<-', action: 'Previous frame'},
    {key: '->', action: 'Next frame'},
    {key: 'Shift + <-', action: 'Reset to first frame'},
    {key: 'Shift + ->', action: 'Seek to last frame'},
    {key: 'M', action: 'Toggle audio'},
    {key: 'L', action: 'Toggle loop'},
  ],
  viewport: [
    {key: '0', action: 'Reset zoom'},
    {key: '=', action: 'Zoom in'},
    {key: '-', action: 'Zoom out'},
    {key: "'", action: 'Toggle grid'},
  ],
  timeline: [{key: 'F', action: 'Focus playhead'}],
  none: [],
};

const ShortcutsContext = createContext<ShortcutsState>({
  currentModule: 'none',
  shortcuts: initialshortcuts,
});

export function ShortcutsProvider({children}: {children: ComponentChildren}) {
  const [currentModule, setCurrentModule] = useState<ShortcutModules>('none');

  return (
    <ShortcutsContext.Provider
      value={{currentModule, setCurrentModule, shortcuts: initialshortcuts}}
    >
      {children}
    </ShortcutsContext.Provider>
  );
}

export function useShortcuts() {
  return useContext(ShortcutsContext);
}
