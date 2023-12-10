import {capitalize} from '@motion-canvas/core';
import {Layout} from '../components';

export function defaultStyle<T>(
  styleName: string,
  parse: (value: string) => T = value => value as T,
): PropertyDecorator {
  return (target: any, key) => {
    target[`getDefault${capitalize(<string>key)}`] = function (this: Layout) {
      this.requestLayoutUpdate();
      const old = (<any>this.element.style)[styleName];
      (<any>this.element.style)[styleName] = '';
      const ret = parse.call(this, this.styles.getPropertyValue(styleName));
      (<any>this.element.style)[styleName] = old;
      return ret;
    };
  };
}
