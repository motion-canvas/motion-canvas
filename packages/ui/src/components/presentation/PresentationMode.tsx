import {useApplication} from '../../contexts';
import {CustomStage} from '../viewport';
import {PresentationControls} from './PresentationControls';
import {SlideGraph} from './SlideGraph';

export function PresentationMode() {
  const {presenter} = useApplication();
  return (
    <>
      <CustomStage stage={presenter.stage} />
      <SlideGraph />
      <PresentationControls />
    </>
  );
}
