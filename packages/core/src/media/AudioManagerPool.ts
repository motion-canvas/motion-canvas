import {Logger} from '../app';
import {Sound} from '../scenes';
import {AudioManager} from './AudioManager';

export class AudioManagerPool {
  private pool: {
    manager: AudioManager;
    current?: Sound;
    sounds: Sound[];
  }[] = [];

  public constructor(private readonly logger: Logger) {}

  public async setupPool(sounds: Sound[]) {
    this.pool = [];

    for (const sound of sounds) {
      let group = this.pool.find(
        group => !group.manager.isInRange(sound.offset),
      );

      if (group !== undefined) {
        group.sounds.unshift(sound);
      } else {
        group = {manager: new AudioManager(this.logger), sounds: [sound]};
        this.pool.push(group);
      }

      group.manager.setSound(sound);
      await group.manager.loadMetadata();
    }
  }

  public setMuted(muted: boolean) {
    this.pool.forEach(group => group.manager.setMuted(muted));
  }

  public setVolume(volume: number) {
    this.pool.forEach(group => group.manager.setVolume(volume));
  }

  public setTime(time: number) {
    this.pool.forEach(group => group.manager.setTime(time));
  }

  public async setPaused(paused: boolean, time: number) {
    await Promise.all(
      this.pool.map(group =>
        group.manager.setPaused(paused || !group.manager.isInRange(time)),
      ),
    );
  }

  public prepare(time: number, delta: number) {
    for (const group of this.pool) {
      const latest = group.sounds.find(sound => sound.offset <= time);

      if (latest !== undefined && group.current !== latest) {
        group.manager.setSound(latest);

        if (time < latest.offset + delta) {
          // if a sound started between last frame and this frame,
          // start playback from the start.
          // this prevents the starts of sounds from being cut off.
          group.manager.setTime(latest.offset);
        } else {
          group.manager.setTime(time);
        }
      }

      group.current = latest;
    }
  }
}
