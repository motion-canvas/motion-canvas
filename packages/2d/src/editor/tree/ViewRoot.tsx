import {useSignal, useSignalEffect} from '@preact/signals';
import {useInspection} from '../Provider';
import {NodeElement} from './NodeElement';
import {TreeRoot} from './TreeRoot';

export function ViewRoot() {
  const {scene} = useInspection();
  const view = useSignal(scene.value?.getView());

  useSignalEffect(() => {
    view.value = scene.value?.getView();
    return scene.value?.onReset.subscribe(() => {
      view.value = scene.value?.getView();
    });
  });

  return view.value ? (
    <TreeRoot>{<NodeElement node={view.value} />}</TreeRoot>
  ) : null;
}
