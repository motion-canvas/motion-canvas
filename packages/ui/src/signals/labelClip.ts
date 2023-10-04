import {signal} from '@preact/signals';

interface LabelClipDrag {
  left: number;
  dragging: boolean;
}

export const labelClipDragging = signal<LabelClipDrag>({
  left: 0,
  dragging: false,
});
