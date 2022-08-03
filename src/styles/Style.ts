import type {Node} from 'konva/lib/Node';
import Color from 'colorjs.io';

export interface Style {
  labelFont: string;
  bodyFont: string;
  background: string;
  backgroundLight: string;
  foreground: string;
  foregroundLight: string;
}

export const MISSING_STYLE: Style = {
  labelFont: '20px "Times New Roman"',
  bodyFont: '20px Arial',
  background: '#FF00FF',
  backgroundLight: '#FF00FF',
  foreground: '#FF00FF',
  foregroundLight: '#FF00FF',
};

export function getStyle(node: Node): Style {
  let mergedStyle = {};

  do {
    const style = node.style?.() ?? null;
    if (style) {
      mergedStyle = {
        ...style,
        ...mergedStyle,
      };
    }

    node = node.getParent();
  } while (node);

  return {
    ...MISSING_STYLE,
    ...mergedStyle,
  };
}

export function getFontColor(background: string) {
  const color = new Color(background);
  return color.lab.l > 50 ? 'rgba(0, 0, 0, 0.87)' : 'rgba(255, 255, 255, 0.87)';
}
