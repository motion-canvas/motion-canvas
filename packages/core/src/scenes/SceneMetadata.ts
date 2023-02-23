import {MetaField, ObjectMetaField} from '../meta';
import {SavedTimeEvent} from './TimeEvents';
import {Random} from './Random';

/**
 * Create a runtime representation of the scene metadata.
 */
export function createSceneMetadata() {
  return new ObjectMetaField('scene', {
    version: new MetaField('version', 1),
    timeEvents: new MetaField<SavedTimeEvent[]>('time events', []),
    seed: new MetaField('seed', Random.createSeed()),
  });
}

/**
 * A runtime representation of the scene metadata.
 */
export type SceneMetadata = ReturnType<typeof createSceneMetadata>;
