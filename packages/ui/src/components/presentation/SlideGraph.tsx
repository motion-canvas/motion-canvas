import {useApplication} from '../../contexts';
import {useSubscribableValue} from '../../hooks';
import { Expandable } from '../fields';
import {Header} from '../layout';
import {SceneGroup} from './SceneGroup';
import styles from './SlideGraph.module.scss';

export function SlideGraph() {
  const {presenter} = useApplication();
  const scenes = useSubscribableValue(presenter.playback.onScenesRecalculated);
  return (
    <div className={styles.root} style={{bottom: '16px', top: 'unset'}}>
    <Expandable title={"SLIDES"}>
      {scenes.map(scene => (
        <SceneGroup key={scene.name} scene={scene} />
      ))} </Expandable>
    </div>
  );
}
