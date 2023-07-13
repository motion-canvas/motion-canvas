import {ComponentChildren, createContext} from 'preact';
import {useContext, useState} from 'preact/hooks';

export type Shortcut = {
  key: string;
  action: string;
  available?: () => boolean;
};

export type ShortcutModules = 'global' | 'timeline' | 'viewport' | 'none';
type ShortcutsByModule = Record<ShortcutModules, Shortcut[]>;
type ShortcutsState = {
  currentModule: ShortcutModules;
  shortcuts: ShortcutsByModule;
  setCurrentModule?: (module: ShortcutModules) => void;
};

const InitialShortcuts: ShortcutsByModule = {
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
    {key: '0', action: 'Zoom to fit'},
    {key: '=', action: 'Zoom in'},
    {key: '-', action: 'Zoom out'},
    {key: "'", action: 'Toggle grid'},
    {key: 'P', action: 'Copy coordinates'},
    {
      key: 'I',
      action: 'Use color picker',
      available: () => typeof EyeDropper === 'function',
    },
  ],
  timeline: [{key: 'F', action: 'Focus playhead'}],
  none: [],
};

const ShortcutsContext = createContext<ShortcutsState>({
  currentModule: 'none',
  shortcuts: InitialShortcuts,
});

export function ShortcutsProvider({children}: {children: ComponentChildren}) {
  const [currentModule, setCurrentModule] = useState<ShortcutModules>('none');

  return (
    <ShortcutsContext.Provider
      value={{currentModule, setCurrentModule, shortcuts: InitialShortcuts}}
    >
      {children}
    </ShortcutsContext.Provider>
  );
}

export function useShortcuts() {
  return useContext(ShortcutsContext);
}
