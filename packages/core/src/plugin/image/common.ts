export interface FrameMetaData {
  subDirectories: string[];
  mimeType: string;
  frame: number;
  name: string;
}

export function exportBlob({meta, blob}: {meta: FrameMetaData; blob: Blob}) {
  const reader = new FileReader();
  reader.onload = () => {
    import.meta.hot!.send('motion-canvas:export', {
      ...meta,
      data: reader.result as string,
    });
  };
  reader.readAsDataURL(blob);
}
