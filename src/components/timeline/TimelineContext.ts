import {createContext} from 'preact';

export interface TimelineState {
  /**
   * Length of the entire timeline in pixels
   */
  fullLength: number;
  /**
   * Length of the visible area in pixels.
   */
  viewLength: number;
  /**
   * The left offset of the view in pixels.
   */
  offset: number;
  /**
   * How zoomed in the timeline is.
   */
  scale: number;
  /**
   * First frame covered by the infinite scroll.
   */
  startFrame: number;
  /**
   * Last frame covered by the infinite scroll.
   */
  endFrame: number;
  /**
   * Frames per pixel rounded to the closest power of two.
   */
  density: number;
  /**
   * Frames per timeline segment.
   */
  segmentDensity: number;
  /**
   * Animation duration in frames.
   */
  duration: number;
}

const TimelineContext = createContext<TimelineState>({
  fullLength: 0,
  viewLength: 0,
  offset: 0,
  scale: 1,
  density: 1,
  segmentDensity: 1,
  duration: 0,
  endFrame: 0,
  startFrame: 0,
});

export {TimelineContext};
