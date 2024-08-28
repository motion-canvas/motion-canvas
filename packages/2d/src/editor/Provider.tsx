import {Node, Scene2D} from '@motion-canvas/2d';
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
import {SignalSet} from './utils';

export interface PluginState {
  selectedNode: ReadonlySignal<Node | null>;
  hoveredKey: Signal<string | null>;
  selectNode: (nodeKey: string | null) => void;
  openNodes: SignalSet<string>;
  openDetached: Signal<boolean>;
  visibleNodes: Set<string>;
  scene: ReadonlySignal<Scene2D | null>;
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
    const afterRender = signal(0);
    const openDetached = signal(false);
    const visibleNodes = new Set<string>();
    const scene = signal(currentScene as Scene2D);
    const selectedNode = computed(() => {
      afterRender.value;
      const {key, payload} = inspection.value;
      if (key === NodeInspectorKey) {
        return scene.value?.getNode(payload as string) ?? null;
      }
      return null;
    });
    const hoveredKey = signal<string | null>(null);
    const openNodes = new SignalSet<string>();
    const selectNode = (nodeKey: string | null) => {
      const {key, payload} = inspection.peek();

      if (key === NodeInspectorKey && !nodeKey) {
        inspection.value = {key: '', payload: null};
      } else if (payload !== nodeKey) {
        inspection.value = {key: NodeInspectorKey, payload: nodeKey};
      }
    };

    return {
      selectedNode,
      selectNode,
      hoveredKey,
      afterRender,
      openNodes,
      openDetached,
      visibleNodes,
      scene,
    } satisfies PluginState;
  }, []);

  state.scene.value = currentScene as Scene2D;

  useSignalEffect(() =>
    state.scene.value?.onRenderLifecycle.subscribe(([event]) => {
      if (event === SceneRenderEvent.AfterRender) {
        state.afterRender.value++;
      }
    }),
  );

  // Expand all nodes necessary to reveal the selected one:
  useSignalEffect(() => {
    const selectedNode = state.selectedNode.value;

    if (selectedNode && !state.visibleNodes.has(selectedNode.key ?? '')) {
      let node = selectedNode.parent() ?? null;
      if (!node && selectedNode !== selectedNode.view()) {
        state.openDetached.value = true;
      }

      while (node) {
        state.openNodes.add(node.key);
        const parent = node.parent();
        if (!parent && node !== node.view()) {
          state.openDetached.value = true;
        }
        node = parent;
      }
    }
  });

  return (
    <PluginContext.Provider value={state}>{children}</PluginContext.Provider>
  );
}
