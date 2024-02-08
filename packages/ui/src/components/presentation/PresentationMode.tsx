import {useApplication} from '../../contexts';
import {CustomStage} from '../viewport';
import {PresentationControls} from './PresentationControls';
import {useLayoutEffect, useRef, Ref, useState} from 'preact/hooks';
import {SlideGraph} from './SlideGraph';
import { useShortcuts } from '../../contexts';
import { ModuleType, Modules } from '@motion-canvas/core';

export function PresentationMode() {
  const {presenter} = useApplication();
  const stageRef = useRef<HTMLDivElement>();
  const [keyPressed, setKeyPressed] = useState(null);
  const {setCurrentModule, setHoverEnabled} = useShortcuts();
  
  // setHoverEnabled(false);
  // setCurrentModule(Modules.Presentation); // The hover would only work on the canvas, which is still the same viewport anyway, so we'll just force it
  return (
    <>
      <CustomStage forwardRef={stageRef} keyPressed={keyPressed} stage={presenter.stage} />
      <SlideGraph />
      <PresentationControls onKeyPressed={(key) => setKeyPressed(key)} customStage={stageRef} />
    </>
  );
}
