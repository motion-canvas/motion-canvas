import {signal} from '@preact/signals';

interface LabelClipDrag {
  left: number | null;
  dragging: boolean;
}

export const labelClipDraggingSignal = signal<LabelClipDrag>({
  left: null,
  dragging: false,
});
