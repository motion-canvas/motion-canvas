import {useSignal} from '@preact/signals';
import {usePluginState} from '../Provider';
import {NodeElement} from './NodeElement';
import {TreeElement} from './TreeElement';
import {TreeRoot} from './TreeRoot';

export function DetachedRoot() {
  const {afterRender, scene} = usePluginState();
  const open = useSignal(false);
  const currentScene = scene.value;
  const children = currentScene ? [...currentScene.getDetachedNodes()] : [];
  afterRender.value;

  return children.length > 0 ? (
    <TreeRoot>
      <TreeElement open={open} label="Detached nodes">
        {children.map(child => (
          <NodeElement node={child} depth={1} />
        ))}
      </TreeElement>
    </TreeRoot>
  ) : null;
}
