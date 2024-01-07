import {Scene2D} from '@motion-canvas/2d';
import {SceneRenderEvent} from '@motion-canvas/core';
import {useApplication, useCurrentScene} from '@motion-canvas/ui';
import {
  ReadonlySignal,
  Signal,
  computed,
  signal,
  useSignalEffect,
} from '@preact/signals';
import {ComponentChildren, createContext} from 'preact';
import {useContext, useMemo} from 'preact/hooks';

export interface PluginState {
  selectedKey: Signal<string | null>;
  hoveredKey: Signal<string | null>;
  openNodes: Map<string, boolean>;
  scene: ReadonlySignal<Scene2D | null>;
  selectedChain: ReadonlySignal<Set<string>>;
  afterRender: ReadonlySignal<number>;
}

const PluginContext = createContext<PluginState | null>(null);

export const NodeInspectorKey = '@motion-canvas/2d/node-inspector';

export function usePluginState() {
  return useContext(PluginContext)!;
}

export function Provider({children}: {children?: ComponentChildren}) {
  const {inspection} = useApplication();
  const currentScene = useCurrentScene();

  const state = useMemo(() => {
    const scene = signal(currentScene as Scene2D);
    const selectedKey = signal<string | null>(null);
    const afterRender = signal(0);
    const hoveredKey = signal<string | null>(null);
    const openNodes = new Map<string, boolean>();
    const selectedChain = computed(() => {
      const chain = new Set<string>();
      const key = selectedKey.value;
      const selectedNode = scene.value?.getNode(key);
      if (selectedNode) {
        let node = selectedNode.parent() ?? null;
        while (node) {
          chain.add(node.key);
          node = node.parent();
        }
      }

      return chain;
    });

    return {
      selectedKey,
      hoveredKey,
      afterRender,
      openNodes,
      selectedChain,
      scene,
    } satisfies PluginState;
  }, []);

  state.scene.value = currentScene as Scene2D;

  useSignalEffect(
    () =>
      state.scene.value?.onRenderLifecycle.subscribe(([event]) => {
        if (event === SceneRenderEvent.AfterRender) {
          state.afterRender.value++;
        }
      }),
  );

  useSignalEffect(() => {
    const {key, payload} = inspection.value;
    if (key === NodeInspectorKey) {
      state.selectedKey.value = payload as string;
    }
  });

  useSignalEffect(() => {
    const nodeKey = state.selectedKey.value;
    const {key, payload} = inspection.peek();

    if (key === NodeInspectorKey && !nodeKey) {
      inspection.value = {key: '', payload: null};
    } else if (payload !== nodeKey) {
      inspection.value = {key: NodeInspectorKey, payload: nodeKey};
    }
  });

  return (
    <PluginContext.Provider value={state}>{children}</PluginContext.Provider>
  );
}
