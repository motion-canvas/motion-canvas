import {ComponentChildren, createContext} from 'preact';
import {useContext} from 'preact/hooks';

export interface TimelineState {
  /**
   * Length of the visible area in pixels.
   */
  viewLength: number;
  /**
   * Scroll offset from the left in pixels. Measured from frame 0.
   */
  offset: number;
  /**
   * First frame covered by the infinite scroll.
   */
  firstVisibleFrame: number;
  /**
   * First time in seconds covered by the infinite scroll.
   */
  firstVisibleTime: number;
  /**
   * Last frame covered by the infinite scroll.
   */
  lastVisibleFrame: number;
  /**
   * Last time in seconds covered by the infinite scroll.
   */
  lastVisibleTime: number;
  /**
   * Frames per pixel rounded to the closest power of two.
   */
  density: number;
  /**
   * Frames per timeline segment.
   */
  segmentDensity: number;
  /**
   * Convert frames to percents.
   */
  framesToPercents: (value: number) => number;
  /**
   * Convert seconds to percents.
   */
  secondsToPercents: (value: number) => number;
  /**
   * Convert frames to pixels.
   */
  framesToPixels: (value: number) => number;
  /**
   * Convert seconds to pixels.
   */
  secondsToPixels: (value: number) => number;
  /**
   * Convert pixels to frames.
   */
  pixelsToFrames: (value: number) => number;
  /**
   * Convert pixels to seconds.
   */
  pixelsToSeconds: (value: number) => number;
  /**
   * Convert current pointer position to frames.
   */
  pointerToFrames: (value: number) => number;
  /**
   * Convert current pointer position to seconds.
   */
  pointerToSeconds: (value: number) => number;
}

const TimelineContext = createContext<TimelineState>({
  viewLength: 0,
  offset: 0,
  density: 1,
  segmentDensity: 1,
  lastVisibleFrame: 0,
  lastVisibleTime: 0,
  firstVisibleFrame: 0,
  firstVisibleTime: 0,
  framesToPercents: value => value,
  secondsToPercents: value => value,
  framesToPixels: value => value,
  secondsToPixels: value => value,
  pixelsToFrames: value => value,
  pixelsToSeconds: value => value,
  pointerToFrames: value => value,
  pointerToSeconds: value => value,
});

export function TimelineContextProvider({
  state,
  children,
}: {
  state: TimelineState;
  children: ComponentChildren;
}) {
  return (
    <TimelineContext.Provider value={state}>
      {children}
    </TimelineContext.Provider>
  );
}

export function useTimelineContext() {
  return useContext(TimelineContext);
}
