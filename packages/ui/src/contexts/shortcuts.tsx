import {ComponentChildren, createContext} from 'preact';
import {useContext, useState} from 'preact/hooks';

export type Shortcut = {
  key: string;
  action: string;
  isGlobal?: boolean;
};

export type ShortcutModules = 'global' | 'timeline' | 'none';
type ShortcutsByModule = Record<ShortcutModules, Shortcut[]>;
type ShortcutsState = {
  currentModule: ShortcutModules;
  shortcuts: ShortcutsByModule;
  setCurrentModule?: (module: ShortcutModules) => void;
};

const initialshortcuts: ShortcutsByModule = {
  global: [
    {key: 'Space', action: 'Toggle playback', isGlobal: true},
    {key: '←', action: 'Previous frame', isGlobal: true},
    {key: '→', action: 'Next frame', isGlobal: true},
    {key: 'Shift + ←', action: 'Reset to first frame', isGlobal: true},
    {key: 'Shift + →', action: 'Seek to last frame', isGlobal: true},
    {key: 'm', action: 'Toggle audio', isGlobal: true},
    {key: 'l', action: 'Toggle loop', isGlobal: true},
  ],
  timeline: [{key: 'f', action: 'Focus Playhead'}],
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
