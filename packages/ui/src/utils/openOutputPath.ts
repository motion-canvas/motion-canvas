import {withLoader} from './withLoader';

export function openOutputPath() {
  return withLoader(async () => {
    await fetch('/__open-output-path');
  });
}
