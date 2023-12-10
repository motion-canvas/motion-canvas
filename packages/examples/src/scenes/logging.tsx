import {Circle, makeScene2D} from '@motion-canvas/2d';
import {useLogger, waitFor, waitUntil} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const logger = useLogger();

  view.add(<Circle key="circle" />);

  // Basic Logging
  yield* waitUntil('basic logging');
  logger.debug('Just here to debug some code.');
  logger.info('All fine, just a little info.');
  logger.warn('Be careful, something has gone wrong.');
  logger.error('Oops. An error occured.');

  // Logging Payloads
  yield* waitUntil('logging payloads');

  logger.debug({
    message: 'Some more advanced logging',
    inspect: 'circle',
    object: {
      someProperty: 'some property value',
    },
    durationMs: 200,
    remarks: 'Some remarks about this log. Can also contain <b>HTML</b> tags.',
    stack: new Error('').stack,
  });

  // Profiling
  yield* waitUntil('profiling');

  logger.profile('id');
  yield* waitFor(2);
  logger.profile('id', {
    message: 'Id second call',
    object: {
      someProperty: 'some property value',
    },
  });

  yield* waitFor(2);
});
