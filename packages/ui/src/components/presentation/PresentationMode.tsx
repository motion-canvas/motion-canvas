import {useApplication} from '../../contexts';
import {CustomStage} from '../viewport';
import {PresentationControls} from './PresentationControls';
import {useLayoutEffect, useRef, Ref, useState} from 'preact/hooks';
import {SlideGraph} from './SlideGraph';

export function PresentationMode() {
  const {presenter} = useApplication();
  const stageRef = useRef<HTMLDivElement>();
  const [showOverlay, setShowOverlay] = useState(true);
  return (
    <>
      <CustomStage forwardRef={stageRef} showOverlay={showOverlay} stage={presenter.stage} />
      <SlideGraph />
      <PresentationControls onShowOverlay={() => setShowOverlay(prev => !prev)} customStage={stageRef} />
    </>
  );
}
