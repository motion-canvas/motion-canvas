import {useApplication} from '../../contexts';
import {CustomStage} from '../viewport';
import {PresentationControls} from './PresentationControls';
import {useLayoutEffect, useRef, Ref, useState} from 'preact/hooks';
import {SlideGraph} from './SlideGraph';

export function PresentationMode() {
  const {presenter} = useApplication();
  const stageRef = useRef<HTMLDivElement>();
  const [keyPressed, setKeyPressed] = useState(null);
  return (
    <>
      <CustomStage forwardRef={stageRef} keyPressed={keyPressed} stage={presenter.stage} />
      <SlideGraph />
      <PresentationControls onKeyPressed={(key) => setKeyPressed(key)} customStage={stageRef} />
    </>
  );
}
