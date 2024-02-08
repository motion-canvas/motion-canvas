import {ComponentChildren, createContext} from 'preact';
import {useContext, useMemo, useState, useEffect} from 'preact/hooks';
import {ViewportKeybindings} from '../components/viewport/ViewportKeybindings';
import {TimelineKeybindings} from '../components/timeline/TimelineKeybindings';
import { PresentationKeybindings } from '../components/presentation/PresentationKeybindings';
import { Modules, KeyBindingMapping, ModuleType } from '@motion-canvas/core';
import { KeyCodes } from '@motion-canvas/core';
import { UIAction } from '../Index';

export declare type ModuleShortcuts = Record<string, UIAction>
export declare type ShortcutsByModule = Record<ModuleType | string, ModuleShortcuts>
export const GlobalKeybindings : ModuleShortcuts = {
  ZOOM_TO_FIT: new UIAction('Zoom to fit', KeyCodes.KEY_0),
  TOGGLE_PLAYBACK:  new UIAction('Toggle playback', KeyCodes.SPACEBAR),
  PREVIOUS_FRAME: new UIAction('Previous frame', KeyCodes.LEFT_ARROW),
  NEXT_FRAME: new UIAction('Next frame', KeyCodes.RIGHT_ARROW),
  TO_FIRST_FRAME: new UIAction('Reset to first frame', KeyCodes.LEFT_ARROW.modifier(KeyCodes.SHIFT)),
  TO_LAST_FRAME: new UIAction('Seek to last frame', KeyCodes.RIGHT_ARROW.modifier(KeyCodes.SHIFT)),
  TOGGLE_AUDIO: new UIAction('Toggle audio', KeyCodes.KEY_M),
  TOGGLE_LOOP: new UIAction('Toggle loop', KeyCodes.KEY_L),
}



const InitialShortcuts: ShortcutsByModule = {
  [Modules.Global as ModuleType]: GlobalKeybindings,
  [Modules.Viewport as ModuleType]: ViewportKeybindings,
  [Modules.Timeline as ModuleType]: TimelineKeybindings,
  [Modules.Presentation as ModuleType]: PresentationKeybindings,
  [Modules.Player as ModuleType]: {},
  [Modules.Renderer as ModuleType]: {},
  [Modules.None as ModuleType]: {},

};

Object.values(InitialShortcuts).forEach(moduleShortcuts =>
  Object.values(moduleShortcuts).forEach(moduleAction =>
    KeyBindingMapping.bindActionToKey(moduleAction, moduleAction.keys)
  )
);


export declare type ShortcutsState = {
  currentModule: ModuleType;
  setCurrentModule?: (module: ModuleType | string, disableHover? : boolean) => void;
  hoverEnabled: boolean;
  setHoverEnabled?: (hoverEnabled: boolean) => void;
  moduleShortcuts: ModuleShortcuts,
  allShortcuts: ShortcutsByModule;
};

const ShortcutsContext = createContext<ShortcutsState>({
  currentModule: Modules.None as ModuleType,
  hoverEnabled: true,
  moduleShortcuts:  InitialShortcuts[Modules.None as ModuleType],
  allShortcuts: InitialShortcuts,
});

export function ShortcutsProvider({children}: {children: ComponentChildren}) {
  const [currentModule, setCurrentModuleState] = useState<ModuleType>(Modules.None as ModuleType);
  const [hoverEnabled, setHoverEnabled] = useState(true);
  const setCurrentModule = (module: string) => {
    // console.log(`Switching to module ${module}. Hover enabled? ${hoverEnabled}`);
    if(hoverEnabled){
      setCurrentModuleState(module as ModuleType);
    }
  }
  const moduleShortcuts = useMemo<ModuleShortcuts>(() => {
    const newShortcuts = InitialShortcuts[currentModule];
    // console.log(`Got new shortcuts for module ${currentModule}`, newShortcuts);
    return newShortcuts
  }, [currentModule]);

  // useEffect(() => {
  //   console.log(`Changing to module ${currentModule}`);
  // }, [currentModule])

  return (
    <ShortcutsContext.Provider
      value={{currentModule, setCurrentModule, hoverEnabled, setHoverEnabled, moduleShortcuts, allShortcuts: InitialShortcuts}}
    >
      {children}
    </ShortcutsContext.Provider>
  );
}

export function useShortcuts() {
  return useContext(ShortcutsContext);
}
