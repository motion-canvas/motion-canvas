import {decorate, threadable} from '../decorators';
import {ThreadGenerator} from '../threading';
import {useProject, useThread, useLogger} from '../utils';

decorate(spring, threadable());
export function* spring(
  spring: Spring | null,
  from: number,
  to: number,
  settleTolerance: number | null,
  onProgress: (value: number, time: number) => void,
  onEnd?: (value: number, time: number) => void,
): ThreadGenerator {
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
  const timeStep = 1 / project.framerate;

  settleTolerance = settleTolerance ?? 0.001;
  let position = from;
  let velocity = spring.initalVelocity ?? 0;
  let settled = false;

  onProgress(from, 0);
  while (!settled) {
    const positionDelta = position - to;

    // using hooks law: F=-kx; with k being the spring constant and x the offset to the settling position
    const force = -spring.stiffness * positionDelta - spring.damping * velocity;

    //updating the velocity
    velocity += (force / spring.mass) * timeStep;

    // apply velocity to the position
    position += velocity * timeStep;

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

    const time = project.time - startTime;
    const value = position;

    if (time > 0) {
      onProgress(value, time);
    }
    yield;
  }
  const endTime = thread.time();

  thread.time(endTime);

  onProgress(to, endTime);
  onEnd?.(to, endTime);
}

export interface Spring {
  mass: number;
  stiffness: number;
  damping: number;
  initalVelocity?: number;
}

export function makeSpring(
  mass: number,
  stiffness: number,
  damping: number,
  initalVelocity?: number,
): Spring {
  return {
    mass,
    stiffness,
    damping,
    initalVelocity,
  };
}

export const beatSpring: Spring = makeSpring(0.13, 5.7, 1.2, 10.0);
export const ploppSpring: Spring = makeSpring(0.2, 20.0, 0.68, 0.0);
export const bounceSpring: Spring = makeSpring(0.08, 4.75, 0.05, 0.0);
export const swingSpring: Spring = makeSpring(0.39, 19.85, 2.82, 0.0);
export const jumpSpring: Spring = makeSpring(0.04, 10.0, 0.7, 8.0);
export const strikeSpring: Spring = makeSpring(0.03, 20.0, 0.9, 4.8);
export const smoothSpring: Spring = makeSpring(0.16, 15.35, 1.88, 0.0);
