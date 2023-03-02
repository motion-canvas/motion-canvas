import type {ThreadGenerator} from '../threading';
import {useScene} from './useScene';
import {useThread} from './useThread';

export function* beginSlide(name: string): ThreadGenerator {
  const {slides} = useScene();
  const thread = useThread();
  slides.register(name, thread.fixed);
  yield;

  while (slides.shouldWait(name)) {
    yield;
  }
}
