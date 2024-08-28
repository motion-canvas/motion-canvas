import {NODE_NAME, Node} from '@motion-canvas/2d';
import {useComputed, useSignal, useSignalEffect} from '@preact/signals';
import {useEffect, useRef} from 'preact/hooks';
import {usePluginState} from '../Provider';
import {IconMap} from '../icons/IconMap';
import {TreeElement} from './TreeElement';

interface NodeElementProps {
  node: Node;
  depth?: number;
}

export function NodeElement({node, depth = 0}: NodeElementProps) {
  const {
    selectedNode,
    visibleNodes,
    selectNode,
    hoveredKey,
    openNodes,
    afterRender,
  } = usePluginState();
  const ref = useRef<HTMLDivElement>(null);
  const nodeSignal = useSignal(node);
  nodeSignal.value = node;

  const open = useComputed(() => openNodes.has(nodeSignal.value.key));

  useEffect(() => {
    visibleNodes.add(node.key);
    return () => {
      visibleNodes.delete(node.key);
    };
  }, [node.key]);

  const children = useComputed(() => {
    afterRender.value;
    return nodeSignal.value.peekChildren();
  });

  useSignalEffect(() => {
    if (node.key === selectedNode.value?.key) {
      ref.current?.scrollIntoView({block: 'nearest', behavior: 'instant'});
    }
  });

  const Icon = IconMap[node[NODE_NAME]] ?? IconMap.Node;

  return (
    <TreeElement
      forwardRef={ref}
      open={open.value}
      hasChildren={children.value.length > 0}
      onToggle={value => openNodes.toggle(node.key, value)}
      depth={depth}
      icon={<Icon />}
      label={node.key}
      selected={selectedNode.value === node}
      onClick={event => {
        selectNode(node.key);
        event.stopPropagation();
      }}
      onPointerEnter={() => (hoveredKey.value = node.key)}
      onPointerLeave={() => (hoveredKey.value = null)}
    >
      {open.value &&
        children.value.length > 0 &&
        children.value.map(child => (
          <NodeElement node={child} depth={depth + 1} />
        ))}
    </TreeElement>
  );
}
