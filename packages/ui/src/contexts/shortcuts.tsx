import {Signal, useSignal} from '@preact/signals';
import {ComponentChildren, createContext} from 'preact';
import {Ref, useContext, useEffect, useRef} from 'preact/hooks';
import {MouseButton} from '../utils';
import {useApplication} from './application';

export interface Action {
  name: string;
  update: (event: PointerEvent) => void;
  finish: (value: boolean) => void;
}

export interface Shortcut {
  key: string;
  modifiers: {
    shift?: boolean;
    ctrl?: boolean;
    alt?: boolean;
  };
  display: string | false;
  description: string;
}

export type ShortcutConfig<T extends string> = {
  context: string;
  shortcuts: ShortcutMap<T>;
};

export type ShortcutMap<T extends string> = {
  [Key in T]?: Shortcut;
};

export type ShortcutCallback = () => Promise<Action | void> | Action | void;

export type ShortcutCallbacks<T extends string> = {
  [Key in T]?: ShortcutCallback;
};

export function makeShortcuts<T extends string>(
  context: string,
  shortcuts: ShortcutMap<T>,
): ShortcutConfig<T> {
  return {context, shortcuts};
}

export const GLOBAL_PRESENTER_SHORTCUTS = makeShortcuts('presenter', {
  togglePlayback: {
    display: 'Space',
    description: 'Toggle playback',
    key: ' ',
    modifiers: {},
  },
  previousSlide: {
    display: '←',
    description: 'Previous slide',
    key: 'ArrowLeft',
    modifiers: {},
  },
  nextSlide: {
    display: '→',
    description: 'Next slide',
    key: 'ArrowRight',
    modifiers: {},
  },
  firstSlide: {
    display: 'Shift + ←',
    description: 'First slide',
    key: 'ArrowLeft',
    modifiers: {shift: true},
  },
  lastSlide: {
    display: 'Shift + →',
    description: 'Last slide',
    key: 'ArrowRight',
    modifiers: {shift: true},
  },
  toggleFullscreen: {
    display: 'F',
    description: 'Toggle fullscreen',
    key: 'f',
    modifiers: {},
  },
});

export const VIEWPORT_SHORTCUTS = makeShortcuts('viewport', {
  zoomFit: {display: '0', description: 'Zoom to fit', key: '0', modifiers: {}},
  zoomIn: {display: '=', description: 'Zoom in', key: '=', modifiers: {}},
  zoomOut: {display: '-', description: 'Zoom out', key: '-', modifiers: {}},
  toggleGrid: {
    display: "'",
    description: 'Toggle grid',
    key: "'",
    modifiers: {},
  },
  copyCoordinates: {
    display: 'P',
    description: 'Copy coordinates',
    key: 'p',
    modifiers: {},
  },
  ...(typeof EyeDropper !== 'undefined'
    ? {
        colorPicker: {
          display: 'I',
          description: 'Use color picker',
          key: 'i',
          modifiers: {},
        },
      }
    : {}),
});

export const TIMELINE_SHORTCUTS = makeShortcuts('timeline', {
  focusPlayhead: {
    display: 'F',
    description: 'Focus playhead',
    key: 'f',
    modifiers: {},
  },
  moveRangeStart: {
    display: 'B',
    description: 'Move range start to playhead',
    key: 'b',
    modifiers: {},
  },
  moveRangeEnd: {
    display: 'N',
    description: 'Move range end to playhead',
    key: 'n',
    modifiers: {},
  },
});

export const GLOBAL_EDITOR_SHORTCUTS = makeShortcuts('editor', {
  togglePlayback: {
    display: 'Space',
    description: 'Toggle playback',
    key: ' ',
    modifiers: {},
  },
  previousFrame: {
    display: '<-',
    description: 'Previous frame',
    key: 'ArrowLeft',
    modifiers: {},
  },
  nextFrame: {
    display: '->',
    description: 'Next frame',
    key: 'ArrowRight',
    modifiers: {},
  },
  firstFrame: {
    display: 'Shift + <-',
    description: 'Reset to first frame',
    key: 'ArrowLeft',
    modifiers: {shift: true},
  },
  lastFrame: {
    display: 'Shift + ->',
    description: 'Seek to last frame',
    key: 'ArrowRight',
    modifiers: {shift: true},
  },
  toggleAudio: {
    display: 'M',
    description: 'Toggle audio',
    key: 'm',
    modifiers: {},
  },
  volumeUp: {
    display: '↑',
    description: 'Volume up',
    key: 'ArrowUp',
    modifiers: {},
  },
  volumeDown: {
    display: '↓',
    description: 'Volume down',
    key: 'ArrowDown',
    modifiers: {},
  },
  toggleLoop: {
    display: 'L',
    description: 'Toggle loop',
    key: 'l',
    modifiers: {},
  },
});

interface ModifierState {
  shift: boolean;
  ctrl: boolean;
  alt: boolean;
}

type ConfigMap = Map<string, ShortcutMap<string>>;
type CallbackMap = Map<string, Set<(key: string) => Promise<Action | boolean>>>;

interface ShortcutsContextValue {
  action: Signal<Action | null>;
  global: Signal<string | null>;
  surface: Signal<string | null>;
  modifiers: Signal<ModifierState>;
  configs: Ref<ConfigMap>;
  callbacks: Ref<CallbackMap>;
}

const ShortcutsContext = createContext<ShortcutsContextValue>(null);

export function ShortcutsProvider({children}: {children: ComponentChildren}) {
  const {plugins} = useApplication();
  const global = useSignal<string | null>(null);
  const surface = useSignal<string | null>(null);
  const action = useSignal<Action | null>(null);
  const modifiers = useSignal<ModifierState>({
    shift: false,
    ctrl: false,
    alt: false,
  });
  const callbacks = useRef<CallbackMap>(new Map());
  const configMap: ConfigMap = new Map();
  for (const config of [
    GLOBAL_EDITOR_SHORTCUTS,
    GLOBAL_PRESENTER_SHORTCUTS,
    TIMELINE_SHORTCUTS,
    VIEWPORT_SHORTCUTS,
    ...plugins.flatMap(plugin => plugin.shortcuts ?? []),
  ]) {
    const shortcutMap = configMap.get(config.context) ?? {};
    for (const [key, shortcut] of Object.entries(config.shortcuts)) {
      if (key in shortcutMap) {
        console.warn(
          `Duplicate shortcut "${key}" in context "${config.context}"`,
        );
      }
      shortcutMap[key] = shortcut;
    }
    configMap.set(config.context, shortcutMap);
  }
  const configsRef = useRef(configMap);
  configsRef.current = configMap;

  const updateModifiers = (event: MouseEvent | KeyboardEvent) => {
    modifiers.value = {
      shift: event.shiftKey,
      ctrl: event.ctrlKey,
      alt: event.altKey,
    };
  };

  async function evaluate(event: KeyboardEvent, context: string) {
    const config = configsRef.current.get(context)!;
    const callbackSet = callbacks.current.get(context);

    if (!config || !callbackSet || callbackSet.size === 0) return;
    for (const [key, shortcut] of Object.entries(config)) {
      if (
        event.key === shortcut.key &&
        !!shortcut.modifiers.shift === event.shiftKey &&
        !!shortcut.modifiers.ctrl === event.ctrlKey &&
        !!shortcut.modifiers.alt === event.altKey
      ) {
        event.preventDefault();
        event.stopPropagation();

        for (const callback of callbackSet) {
          const result = await callback(key);
          if (typeof result === 'object') {
            action.value = result;
          }
          if (result) {
            break;
          }
        }

        return true;
      }
    }
  }

  const evaluateAll = async (event: KeyboardEvent) => {
    updateModifiers(event);

    if (action.value) {
      if (event.key === 'Escape') {
        action.value.finish(false);
        action.value = null;
      } else if (event.key === 'Enter') {
        action.value.finish(true);
        action.value = null;
      }
      return;
    }

    if (document.activeElement.tagName === 'INPUT') {
      return;
    }
    if (surface.value && (await evaluate(event, surface.value))) {
      return;
    }
    if (global.value && (await evaluate(event, global.value))) {
      return;
    }
  };

  useEffect(() => {
    let keyDownLock = false;
    const keyDown = (event: KeyboardEvent) => {
      if (keyDownLock) {
        return;
      }
      keyDownLock = true;
      evaluateAll(event).finally(() => {
        keyDownLock = false;
      });
    };

    const pointerMove = (event: PointerEvent) => {
      updateModifiers(event);
      if (action.value) {
        document.body.setPointerCapture(event.pointerId);
        action.value.update(event);
      }
    };

    const pointerUp = (event: PointerEvent) => {
      const isPrimary = event.button === MouseButton.Left;
      const isSecondary = event.button === MouseButton.Right;
      if (action.value && (isPrimary || isSecondary)) {
        document.body.releasePointerCapture(event.pointerId);
        action.value.finish(isPrimary);
        action.value = null;
      }
    };

    window.addEventListener('keydown', keyDown, true);
    window.addEventListener('pointermove', pointerMove, true);
    window.addEventListener('pointerup', pointerUp, true);
    window.addEventListener('keyup', updateModifiers, true);
    return () => {
      window.removeEventListener('keydown', keyDown, true);
      window.removeEventListener('pointermove', pointerMove, true);
      window.removeEventListener('pointerup', pointerUp, true);
      window.removeEventListener('keyup', updateModifiers, true);
    };
  }, []);

  return (
    <ShortcutsContext.Provider
      value={{
        action,
        modifiers,
        callbacks,
        surface,
        global,
        configs: configsRef,
      }}
    >
      {children}
    </ShortcutsContext.Provider>
  );
}

export function useShortcutContext() {
  return useContext(ShortcutsContext);
}

export function useModifiers() {
  return useShortcutContext().modifiers;
}

export function useSurfaceShortcuts<T extends HTMLElement>(
  config: ShortcutConfig<string>,
) {
  const {surface} = useShortcutContext();
  const ref = useRef<T>(null);

  useEffect(() => {
    const onEnter = () => {
      surface.value = config.context;
    };
    const onLeave = () => {
      if (surface.value === config.context) {
        surface.value = null;
      }
    };
    ref.current.addEventListener('pointerenter', onEnter);
    ref.current.addEventListener('pointermove', onEnter);
    ref.current.addEventListener('pointerleave', onLeave);
    return () => {
      ref.current.removeEventListener('pointerenter', onEnter);
      ref.current.removeEventListener('pointermove', onEnter);
      ref.current.removeEventListener('pointerleave', onLeave);
      if (surface.value === config.context) {
        surface.value = null;
      }
    };
  }, [config]);

  return ref;
}

export function useShortcut<T extends string>(
  config: ShortcutConfig<T>,
  name: T,
  handler: ShortcutCallback,
) {
  return useShortcuts<T>(config, {[name]: handler} as ShortcutCallbacks<T>);
}

export function useShortcuts<T extends string>(
  config: ShortcutConfig<T>,
  handlers: ShortcutCallbacks<T>,
) {
  const {callbacks} = useShortcutContext();
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    let callbackSet = callbacks.current.get(config.context);
    if (!callbackSet) {
      callbackSet = new Set();
      callbacks.current.set(config.context, callbackSet);
    }

    const handler = async (key: T) => {
      const callback = handlersRef.current[key];
      if (callback) {
        const result = await callback();
        if (typeof result === 'object') {
          return result;
        }
        return true;
      }
      return false;
    };

    callbackSet.add(handler);
    return () => {
      callbackSet.delete(handler);
    };
  }, [config]);
}
