import {Reference, useRef} from '@motion-canvas/core/lib/utils';
import {Node} from 'konva/lib/Node';
import {LayoutText, LayoutTextConfig} from './LayoutText';
import {Pin} from './Pin';
import {Center, Origin} from '@motion-canvas/core/lib/types';

interface PinnedLabelConfig extends LayoutTextConfig {
  children: string;
  target: Reference<Node>;
  ref?: Reference<LayoutText>;
  direction?: Center;
}

export function PinnedLabel(config: PinnedLabelConfig) {
  const {children, target, ref, direction, ...rest} = config;
  const reference = ref ?? useRef<LayoutText>();
  return (
    <>
      <LayoutText
        ref={reference}
        text={children}
        padd={[30, 0]}
        fill={'rgba(255, 255, 255, 0.54'}
        origin={Origin.BottomLeft}
        {...rest}
      />
      <Pin
        target={target.value}
        attach={reference.value}
        direction={direction ?? Center.Vertical}
      />
    </>
  );
}
