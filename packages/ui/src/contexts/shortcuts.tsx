import {ComponentChildren, createContext} from 'preact';
import {useContext, useMemo, useState} from 'preact/hooks';
import KeyCodes from '../utils/KeyCodes';
import ViewportKeybindings from '../components/viewport/ViewportKeybindings';
import TimelineKeyBindings from '../components/timeline/TimelineKeybindings';
import PresentationKeyBindings from '../components/presentation/PresentationKeybindings';
import {GlobalKeyBindings} from '../Editor'
import { Module, ModuleShortcuts, ShortcutsByModule } from '../global';

export declare type ShortcutsState = {
  currentModule: Module;
  moduleShortcuts: ModuleShortcuts<any>,
  allShortcuts: ShortcutsByModule;
  setCurrentModule?: (module: Module) => void;
};

declare const InitialShortcuts: ShortcutsByModule;
InitialShortcuts[Module.Global] = GlobalKeyBindings
InitialShortcuts[Module.Viewport] = ViewportKeybindings
InitialShortcuts[Module.Timeline] = TimelineKeyBindings
InitialShortcuts[Module.Presentation] = PresentationKeyBindings
InitialShortcuts[Module.None] = {}

const ShortcutsContext = createContext<ShortcutsState>({
  currentModule: Module.None,
  moduleShortcuts:  InitialShortcuts[Module.None],
  allShortcuts: InitialShortcuts,
});

export function ShortcutsProvider({children}: {children: ComponentChildren}) {
  const [currentModule, setCurrentModule] = useState<Module>(Module.None);
  const moduleShortcuts = useMemo<ModuleShortcuts<any>>(() => InitialShortcuts[currentModule], [currentModule]);
  return (
    <ShortcutsContext.Provider
      value={{moduleShortcuts, currentModule, setCurrentModule, allShortcuts: InitialShortcuts}}
    >
      {children}
    </ShortcutsContext.Provider>
  );
}

export function useShortcuts() {
  return useContext(ShortcutsContext);
}
