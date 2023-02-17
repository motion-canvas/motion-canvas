import {decorate, threadable} from '../decorators';
import {ThreadGenerator} from '../threading';
import {useProject, useThread, useLogger} from '../utils';

type ProgressFunction = (value: number, time: number) => void;

decorate(spring, threadable());
export function spring(
  spring: Spring | null,
  from: number,
  to: number,
  settleTolerance: number,
  onProgress: ProgressFunction,
  onEnd?: ProgressFunction,
): ThreadGenerator;

export function spring(
  spring: Spring | null,
  from: number,
  to: number,
  onProgress: ProgressFunction,
  onEnd?: ProgressFunction,
): ThreadGenerator;

export function* spring(
  spring: Spring | null,
  from: number,
  to: number,
  settleToleranceOrOnProgress: number | ProgressFunction,
  onProgressOrOnEnd?: ProgressFunction,
  onEnd?: ProgressFunction,
): ThreadGenerator {
  const settleTolerance =
    typeof settleToleranceOrOnProgress === 'number'
      ? settleToleranceOrOnProgress
      : 0.001;

  onEnd =
    typeof settleToleranceOrOnProgress === 'number' ? onEnd : onProgressOrOnEnd;

  const onProgress: ProgressFunction = (value: number, time: number) => {
    if (typeof settleToleranceOrOnProgress === 'function') {
      settleToleranceOrOnProgress(value, time);
    } else if (typeof onProgressOrOnEnd === 'function') {
      onProgressOrOnEnd(value, time);
    }
  };

  spring = spring ?? {
    mass: 0.05,
    stiffness: 10,
    damping: 0.5,
  };

  if (spring.mass <= 0) {
    useLogger().error(new Error('Spring mass must be greater than 0.'));
    return;
  }
  if (spring.stiffness < 0) {
    useLogger().error(
      new Error('Spring stiffness must be greater or equal to 0.'),
    );
    return;
  }
  if (spring.damping < 0) {
    useLogger().error(
      new Error('Spring damping must be greater or equal to 0.'),
    );
    return;
  }

  const project = useProject();
  const thread = useThread();

  const startTime = thread.time();

  // figure out the step length for each frame

  let position = from;
  let velocity = spring.initialVelocity ?? 0;
  let settled = false;

  const update = (dt: number) => {
    if (spring === null) {
      return;
    }
    const positionDelta = position - to;

    // Using hooks law: F=-kx; with k being the spring constant and x the offset
    // to the settling position
    const force = -spring.stiffness * positionDelta - spring.damping * velocity;

    //updating the velocity
    velocity += (force / spring.mass) * dt;

    // apply velocity to the position
    position += velocity * dt;
  };

  // Set simulation constant framerate
  const simulationFrames = 120;

  // Calculate a timestep based on on the simulation framerate
  const timeStep = 1 / simulationFrames;

  // Calculate the number steps needed for each frame of the project
  const stepsPerFrame = simulationFrames / project.framerate;

  let lastUpdate = startTime;

  onProgress(from, 0);

  // That is a stash we push leftover timesteps to
  let accumulation = 0;

  while (!settled) {
    // We wait until the thread starts to account for offsets like
    // `waitFor(0.005)`

    const timeOffset = project.time - lastUpdate;

    if (timeOffset <= 0) {
      yield;
      continue;
    }
    lastUpdate = project.time;

    // Add the timeSteps for the current frame to the stash
    accumulation += stepsPerFrame * timeStep;

    let divider = 1;

    // For the case we have uneven `timeStep` sizes, like when we have a
    // framerate of 25 and a simulation framerate of 60 we end up having
    // 2.4 steps per frame. So we just make substeps until the stash
    // has less then 0.001 steps left.
    while (divider < 10000) {
      // Calculate the substep size based on the divider
      const step = timeStep / divider;

      // Sub step until there are no longer sub steps available
      while (accumulation / step >= 1) {
        update(step);
        // remove the substeps from the stash
        accumulation -= step;
      }

      // Increase the divider
      divider *= 10;
    }

    // The simulation would run forever but is often barely noticeable after
    // some seconds. We fix this by checking if the delta between `to` and
    // `position` is smaller than the given `settleTolerance`. But we also need
    // to check if the velocity is below the tolerance too.
    if (
      Math.abs(to) - Math.abs(position) < settleTolerance &&
      Math.abs(velocity) < settleTolerance
    ) {
      settled = true;
    }

    const value = position;

    onProgress(value, project.time - startTime);
    yield;
  }

  onProgress(to, project.time - startTime);
  onEnd?.(to, project.time - startTime);
}

export interface Spring {
  mass: number;
  stiffness: number;
  damping: number;
  initialVelocity?: number;
}

export function makeSpring(
  mass: number,
  stiffness: number,
  damping: number,
  initialVelocity?: number,
): Spring {
  return {
    mass,
    stiffness,
    damping,
    initialVelocity,
  };
}

export const BeatSpring: Spring = makeSpring(0.13, 5.7, 1.2, 10.0);
export const PlopSpring: Spring = makeSpring(0.2, 20.0, 0.68, 0.0);
export const BounceSpring: Spring = makeSpring(0.08, 4.75, 0.05, 0.0);
export const SwingSpring: Spring = makeSpring(0.39, 19.85, 2.82, 0.0);
export const JumpSpring: Spring = makeSpring(0.04, 10.0, 0.7, 8.0);
export const StrikeSpring: Spring = makeSpring(0.03, 20.0, 0.9, 4.8);
export const SmoothSpring: Spring = makeSpring(0.16, 15.35, 1.88, 0.0);
