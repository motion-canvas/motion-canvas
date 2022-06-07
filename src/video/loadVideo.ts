import {MP4Demuxer} from './MP4Demuxer';

const videos = new WeakMap<object, ImageBitmap[]>();
const keys: Record<string, object> = {};

export async function loadVideo(src: string) {
  const key = getKey(src);
  const previous = videos.get(key);
  if (previous) {
    return previous;
  }

  // TODO Replace with a more complex object to notify about changes etc.
  const frames: ImageBitmap[] = [];
  videos.set(key, frames);

  // TODO Actually check if the project is being rendered.
  const isRendering = false;
  if (isRendering) {
    await decode(src, frames);
  } else {
    decode(src, frames).catch(console.error);
  }

  return frames;
}

function getKey(src: string) {
  keys[src] ??= {src};
  return keys[src];
}

async function decode(src: string, frames: ImageBitmap[]) {
  let error: DOMException = null;
  const demuxer = new MP4Demuxer(src);
  const decoder = new VideoDecoder({
    output: frame => {
      createImageBitmap(frame).then(value => {
        frames.push(value);
        frame.close();
      });
    },
    error: e => {
      error = e;
    },
  });

  const config = await demuxer.getConfig();
  decoder.configure(config);
  demuxer.start((chunk: EncodedVideoChunk) => {
    decoder.decode(chunk);
  });
  await decoder.flush();
  if (error) {
    throw error;
  }
}
