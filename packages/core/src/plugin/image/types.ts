export interface FrameMetadata {
  subDirectories: string[];
  quality: number;
  mimeType: string;
  name: string;
  frame: number;
}

export type WorkerExtractRequest = {
  type: 'extract';
  bitmap: ImageBitmap;
  metadata: FrameMetadata;
};

export type WorkerConfigureRequest = {
  type: 'configure';
  width: number;
  height: number;
};

export type WorkerRequest = WorkerExtractRequest | WorkerConfigureRequest;

export type WorkerExtractedResponse = {
  type: 'extracted';
};

export type WorkerConfiguredResponse = {
  type: 'configured';
};

export type WorkerStoredResponse = {
  type: 'stored';
  frame: number;
};

export type WorkerResponse =
  | WorkerExtractedResponse
  | WorkerConfiguredResponse
  | WorkerStoredResponse;
