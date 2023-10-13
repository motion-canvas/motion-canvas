import {useApplication} from '../../contexts';
import {CustomStage} from '../viewport';
import {PresentationControls} from './PresentationControls';
import {useLayoutEffect, useRef, Ref} from 'preact/hooks';
import {SlideGraph} from './SlideGraph';

export function PresentationMode() {
  const {presenter} = useApplication();
  const stageRef = useRef<HTMLDivElement>();
  return (
    <>
      <CustomStage forwardRef={stageRef} stage={presenter.stage} />
      <SlideGraph />
      <PresentationControls customStage={stageRef} />
    </>
  );
}
