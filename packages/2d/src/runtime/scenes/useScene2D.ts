import {useScene} from '@motion-canvas/core/lib/utils';
import type {Scene2D} from './Scene2D';

export function useScene2D(): Scene2D {
  return <Scene2D>useScene();
}
