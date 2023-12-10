import {decorate, threadable} from '../decorators';
import {ThreadGenerator} from '../threading';
import {useLogger, useThread} from '../utils';

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

  const thread = useThread();

  let position = from;
  let velocity = spring.initialVelocity ?? 0;

  const update = (dt: number) => {
    if (spring === null) {
      return;
    }
    const positionDelta = position - to;

    // Using hooks law: F=-kx; with k being the spring constant and x the offset
    // to the settling position
    const force = -spring.stiffness * positionDelta - spring.damping * velocity;

    // Update the velocity based on the given timestep
    velocity += (force / spring.mass) * dt;

    position += velocity * dt;
  };

  // Set simulation constant framerate
  const simulationFrames = 120;

  // Calculate a timestep based on on the simulation framerate
  const timeStep = 1 / simulationFrames;

  onProgress(from, 0);

  const startTime = thread.time();
  let simulationTime = startTime;

  let settled = false;
  while (!settled) {
    while (simulationTime < thread.fixed) {
      const difference = thread.fixed - simulationTime;

      if (timeStep > difference) {
        update(difference);
        simulationTime = thread.fixed;
      } else {
        update(timeStep);
        simulationTime += timeStep;
      }

      // Perform the check during every iteration:
      if (
        Math.abs(to - position) < settleTolerance &&
        Math.abs(velocity) < settleTolerance
      ) {
        // Set the thread time to simulation time:
        thread.time(simulationTime);
        settled = true;
        // Break out when settled
        break;
      }
    }

    // Only yield if we haven't settled yet.
    if (!settled) {
      onProgress(position, thread.fixed - startTime);
      yield;
    }
  }

  onProgress(to, thread.fixed - startTime);
  onEnd?.(to, thread.fixed - startTime);
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
