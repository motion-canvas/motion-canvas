import {createContext} from 'preact';

export interface TimelineState {
  fullLength: number;
  viewLength: number;
  offset: number;
  scale: number;
  startFrame: number;
  endFrame: number;
  density: number;
  duration: number;
}

const TimelineContext = createContext<TimelineState>({
  fullLength: 0,
  viewLength: 0,
  offset: 0,
  scale: 1,
  density: 1,
  duration: 0,
  endFrame: 0,
  startFrame: 0,
});

export {TimelineContext};
