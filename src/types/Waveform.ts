export interface Waveform {
  version: number;
  channels: number;
  sample_rate: number;
  samples_per_pixel: number;
  bits: 8 | 16;
  length: number;
  data: number[];
}
