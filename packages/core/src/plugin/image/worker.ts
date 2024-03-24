import {exportBlob, FrameMetaData} from './common';

onmessage = (
  event: MessageEvent<{
    meta: FrameMetaData;
    blob: Blob;
  }>,
) => {
  exportBlob(event.data);
};

if (import.meta.hot) {
  import.meta.hot.on('motion-canvas:export-ack', response => {
    postMessage(response);
  });
}
