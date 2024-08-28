import {Logger} from '../app';
import {Sound} from '../scenes';
import {AudioManager} from './AudioManager';

export class AudioManagerPool {
  private pool: AudioManager[] = [];
  private managers: Map<Sound, AudioManager> = new Map();
  private sounds: Sound[] = [];

  private muted: boolean = true;
  private volume: number = 1;
  private paused: boolean = true;

  public constructor(private readonly logger: Logger) {}

  public async setupPool(sounds: Sound[]) {
    this.pool = [];
    this.managers.clear();
    this.sounds = sounds;
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
    this.managers.forEach(manager => manager.setMuted(muted));
  }

  public setVolume(volume: number) {
    this.volume = volume;
    this.managers.forEach(manager => manager.setVolume(volume));
  }

  public setTime(time: number) {
    this.managers.forEach(manager => manager.setTime(time));
  }

  public async setPaused(paused: boolean) {
    this.paused = paused;
    await Promise.all(
      Array.from(this.managers.values()).map(manager =>
        manager.setPaused(paused),
      ),
    );
  }

  public prepare(time: number, delta: number) {
    for (const sound of this.sounds) {
      if (sound.offset >= time && sound.offset < time + delta) {
        let manager = this.managers.get(sound);
        if (manager) continue;

        // sound is starting
        manager = this.pool.pop() ?? new AudioManager(this.logger);
        manager.setSound(sound);
        manager.setMuted(this.muted);
        manager.setVolume(this.volume);
        manager.setTime(time);
        manager.setPaused(this.paused);
        this.managers.set(sound, manager);
      } else {
        const manager = this.managers.get(sound);
        if (!manager || manager.isInRange(time)) continue;

        // sound has ended
        manager.setPaused(true);
        this.pool.push(manager);
        this.managers.delete(sound);
      }
    }
  }
}
