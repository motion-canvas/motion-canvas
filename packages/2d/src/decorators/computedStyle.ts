import {capitalize} from '@motion-canvas/core/lib/utils';
import {Layout} from 'components';

export function computedStyle<T>(
  styleName: string,
  parse: (value: string) => T = value => value as T,
): PropertyDecorator {
  return (target: any, key) => {
    target[`compute${capitalize(<string>key)}`] = function (this: Layout) {
      this.requestLayoutUpdate();
      return parse.apply(this, [this.styles.getPropertyValue(styleName)]);
    };
  };
}
