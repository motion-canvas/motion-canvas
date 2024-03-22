import {
  WorkerConfiguredResponse,
  WorkerConfigureRequest,
  WorkerExtractedResponse,
  WorkerExtractRequest,
  WorkerRequest,
  WorkerStoredResponse,
} from './types';

const Canvas = new OffscreenCanvas(1, 1);
const Context = Canvas.getContext('bitmaprenderer')!;

onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const {data} = event;
  switch (data.type) {
    case 'configure':
      postMessage(await configure(data));
      break;
    case 'extract':
      postMessage(await extract(data));
      break;
  }
};

function configure({
  width,
  height,
}: WorkerConfigureRequest): WorkerConfiguredResponse {
  Canvas.width = width;
  Canvas.height = height;
  return {type: 'configured'};
}

async function extract({
  bitmap,
  metadata,
}: WorkerExtractRequest): Promise<WorkerExtractedResponse> {
  Context.transferFromImageBitmap(bitmap);
  bitmap.close();
  const blob = await Canvas.convertToBlob({
    type: metadata.mimeType,
    quality: metadata.quality,
  });
  const base64 = await blobToBase64(blob);
  import.meta.hot!.send('motion-canvas:export', {
    ...metadata,
    data: base64,
  });
  return {type: 'extracted'};
}

function blobToBase64(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

if (import.meta.hot) {
  import.meta.hot.on('motion-canvas:export-ack', response => {
    postMessage({
      type: 'stored',
      frame: response.frame,
    } as WorkerStoredResponse);
  });
}
