import {Scene2D} from '@motion-canvas/2d';
import {SceneRenderEvent} from '@motion-canvas/core';
import {useCurrentScene} from '@motion-canvas/ui';
import {
  ReadonlySignal,
  Signal,
  computed,
  signal,
  useSignal,
  useSignalEffect,
} from '@preact/signals';
import {ComponentChildren, createContext} from 'preact';
import {useContext, useMemo} from 'preact/hooks';

export interface InspectionState {
  selectedKey: Signal<string | null>;
  hoveredKey: Signal<string | null>;
  openNodes: Map<string, boolean>;
  scene: ReadonlySignal<Scene2D | null>;
  selectedChain: ReadonlySignal<Set<string>>;
  afterRender: ReadonlySignal<number>;
}

const InspectionContext = createContext<InspectionState | null>(null);

export function useInspection() {
  return useContext(InspectionContext)!;
}

export function Provider({children}: {children?: ComponentChildren}) {
  const currentScene = useCurrentScene();

  const state = useMemo(() => {
    const scene = useSignal(currentScene as Scene2D);
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
    } satisfies InspectionState;
  }, []);

  state.scene.value = currentScene as Scene2D;

  useSignalEffect(() =>
    state.scene.value.onRenderLifecycle.subscribe(([event]) => {
      if (event === SceneRenderEvent.AfterRender) {
        state.afterRender.value++;
      }
    }),
  );

  return (
    <InspectionContext.Provider value={state}>
      {children}
    </InspectionContext.Provider>
  );
}
