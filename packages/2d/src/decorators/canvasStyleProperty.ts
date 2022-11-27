import {initial, parser, property, Property} from './property';
import {canvasStyleParser} from '../utils';
import {CanvasStyle, PossibleCanvasStyle} from '../partials';

export type CanvasStyleProperty<T> = Property<
  PossibleCanvasStyle,
  CanvasStyle,
  T
>;

export function canvasStyleProperty(): PropertyDecorator {
  return (target, key) => {
    property()(target, key);
    parser(canvasStyleParser)(target, key);
    initial(null)(target, key);
  };
}
