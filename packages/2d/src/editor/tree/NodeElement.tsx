import {NODE_NAME, Node} from '@motion-canvas/2d';
import {useComputed, useSignal, useSignalEffect} from '@preact/signals';
import {useRef} from 'preact/hooks';
import {usePluginState} from '../Provider';
import {IconMap} from '../icons/IconMap';
import {TreeElement} from './TreeElement';

interface NodeElementProps {
  node: Node;
  depth?: number;
}

export function NodeElement({node, depth = 0}: NodeElementProps) {
  const {selectedKey, hoveredKey, openNodes, selectedChain, afterRender} =
    usePluginState();
  const ref = useRef<HTMLDivElement>(null);
  const open = useSignal(
    selectedChain.peek().has(node.key) || (openNodes.get(node.key) ?? false),
  );
  const nodeSignal = useSignal(node);
  nodeSignal.value = node;

  const children = useComputed(() => {
    afterRender.value;
    return nodeSignal.value.peekChildren();
  });

  useSignalEffect(() => {
    open.value = openNodes.get(nodeSignal.value.key) ?? false;
  });

  useSignalEffect(() => {
    const chain = selectedChain.value;
    if (chain.has(nodeSignal.value.key)) {
      open.value = true;
    }
  });

  useSignalEffect(() => {
    openNodes.set(nodeSignal.value.key, open.value);
  });

  useSignalEffect(() => {
    const key = selectedKey.value;
    if (node.key === key) {
      ref.current?.scrollIntoView({block: 'nearest', behavior: 'instant'});
    }
  });

  const Icon = IconMap[node[NODE_NAME]] ?? IconMap.Node;

  return (
    <TreeElement
      forwardRef={ref}
      open={open}
      depth={depth}
      icon={<Icon />}
      label={node.key}
      selected={selectedKey.value === node.key}
      onClick={event => {
        selectedKey.value = node.key;
        event.stopPropagation();
      }}
      onPointerEnter={() => (hoveredKey.value = node.key)}
      onPointerLeave={() => (hoveredKey.value = null)}
    >
      {children.value.length > 0 &&
        children.value.map(child => (
          <NodeElement node={child} depth={depth + 1} />
        ))}
    </TreeElement>
  );
}
