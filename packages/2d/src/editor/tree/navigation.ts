import {Node} from '@motion-canvas/2d';
import {useShortcuts} from '@motion-canvas/ui';
import {useComputed} from '@preact/signals';
import {usePluginState} from '../Provider';
import {SCENE_GRAPH_SHORTCUTS} from '../shortcuts';

export function useKeyboardNavigation() {
  const {selectedNode, scene, afterRender, openNodes, selectNode} =
    usePluginState();

  const detachedNodes = useComputed(() => {
    afterRender.value;
    const detachedNodes: string[] = [];
    for (const node of scene.value?.getDetachedNodes() ?? []) {
      detachedNodes.push(node.key);
    }
    return detachedNodes;
  });

  function selectView() {
    selectNode(scene.value?.getView()?.key ?? null);
  }

  function findNextNodeUp(node: Node): string | null {
    const detachedIndex = detachedNodes.value.indexOf(node.key);
    if (detachedIndex > 0) {
      return detachedNodes.value[detachedIndex - 1];
    } else if (detachedIndex === 0) {
      // Go back to the scene graph after reaching the top of detached nodes:
      return findLowestNode();
    }

    const parent = node.parent();
    if (!parent) {
      return null;
    }

    const siblings = parent.peekChildren();
    const index = siblings.indexOf(node);
    if (index < 1) {
      return parent.key;
    }

    let current = siblings[index - 1];
    while (current) {
      const children = current.peekChildren();
      if (openNodes.has(current.key) && children.length > 0) {
        current = children.at(-1)!;
      } else {
        return current.key;
      }
    }

    return null;
  }

  function findNextNodeDown(node: Node): string | null {
    if (openNodes.has(node.key)) {
      const children = node.peekChildren();
      if (children.length > 0) {
        return children[0].key;
      }
    }

    let current = node;
    while (current) {
      const parent = current.parent();
      if (!parent) {
        const detachedIndex = detachedNodes.value.indexOf(node.key);
        if (detachedIndex >= 0) {
          return detachedNodes.value[detachedIndex + 1] ?? null;
        }

        // Try jumping down to the detached section after reaching the bottom:
        return detachedNodes.value[0] ?? null;
      }

      const siblings = parent.peekChildren();
      const index = siblings.indexOf(current);
      if (index < siblings.length - 1) {
        return siblings[index + 1].key;
      }

      current = parent;
    }

    return null;
  }

  function findLowestNode(): string | null {
    let current: Node | undefined = scene.value?.getView();
    while (current) {
      const children = current.peekChildren();
      if (openNodes.has(current.key) && children.length > 0) {
        current = children.at(-1)!;
      } else {
        return current.key;
      }
    }
    return null;
  }

  useShortcuts(SCENE_GRAPH_SHORTCUTS, {
    moveUp: () => {
      const node = selectedNode.value;
      if (!node) {
        selectView();
        return;
      }

      selectNode(findNextNodeUp(node) ?? node.key);
    },
    collapseOrMoveUp: () => {
      const node = selectedNode.value;
      if (!node) {
        selectView();
        return;
      }

      if (!openNodes.delete(node.key)) {
        selectNode(node.parent()?.key ?? node.key);
      }
    },
    modeDown: () => {
      const node = selectedNode.value;
      if (!node) {
        selectView();
        return;
      }

      selectNode(findNextNodeDown(node) ?? node.key);
    },
    expandOrMoveDown: () => {
      const node = selectedNode.value;
      if (!node) {
        selectView();
        return;
      }

      if (node.peekChildren().length === 0 || !openNodes.add(node.key)) {
        selectNode(findNextNodeDown(node) ?? node.key);
      }
    },
  });
}
