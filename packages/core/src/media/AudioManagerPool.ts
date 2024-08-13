import {Logger} from '../app';
import {Sound} from '../scenes';
import {AudioManager} from './AudioManager';

export class AudioManagerPool {
  private pools: {
    am: AudioManager;
    sounds: Sound[];
    gain: GainNode;
  }[] = [];

  public constructor(private readonly logger: Logger) {}

  public setupPools(sounds: Sound[], time: number) {
    this.pools = [];

    for (const sound of sounds) {
      const pool = this.pools.find(
        pool =>
          !pool.am.isInRange(sound.offset) &&
          pool.am.getSource() === sound.audio,
      );
      if (pool !== undefined) {
        pool.am.setOffset(sound.offset);
        pool.am.setTrim(sound.start, sound.end);
        pool.sounds.unshift(sound);
      } else {
        const am = new AudioManager(this.logger);
        am.setOffset(sound.offset);
        am.setTrim(sound.start, sound.end);
        am.setSource(sound.audio);

        let gain = undefined as unknown as GainNode;
        am.setFilter((ctx, src) => {
          gain = ctx.createGain();
          src.connect(gain);
          return gain;
        });

        this.pools.push({am, sounds: [sound], gain});
      }
    }
    this.prepare(time);
    this.setTime(time);
  }

  public setMuted(muted: boolean) {
    this.pools.forEach(pool => pool.am.setMuted(muted));
  }

  public setVolume(volume: number) {
    this.pools.forEach(pool => pool.am.setVolume(volume));
  }

  public setTime(time: number) {
    this.pools.forEach(pool => pool.am.setTime(time));
  }

  public async setPaused(paused: boolean, time: number) {
    await Promise.all(
      this.pools.map(pool =>
        pool.am.setPaused(paused || !pool.am.isInRange(time)),
      ),
    );
  }

  public prepare(time: number) {
    for (const pool of this.pools) {
      const latest = pool.sounds.find(s => s.offset <= time);
      if (latest !== undefined && pool.am.getOffset() !== latest.offset) {
        pool.am.setOffset(latest.offset);
        pool.am.setTrim(latest.start, latest.end);
        pool.am.setTime(time);

        pool.gain.gain.value = Math.pow(10, (latest.gain ?? 0) / 10);
        pool.am.setPlaybackRate(
          Math.pow(2, (latest.detune ?? 0) / 1200) * (latest.playbackRate ?? 1),
          true,
        );
      }
    }
  }
}
