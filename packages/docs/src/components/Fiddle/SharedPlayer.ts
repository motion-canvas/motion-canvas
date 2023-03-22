import {
  Logger,
  Player,
  Project,
  ProjectMetadata,
  Stage,
} from '@motion-canvas/core';
import type {
  FullSceneDescription,
  ThreadGeneratorFactory,
} from '@motion-canvas/core/lib/scenes';
import type {View2D} from '@motion-canvas/2d/lib/components';
import {makeScene2D} from '@motion-canvas/2d';
import {ValueDispatcher} from '@motion-canvas/core/lib/events';
import runtime from '@site/src/components/Fiddle/runtime';
import DefaultPlugin from '@motion-canvas/core/lib/plugin/DefaultPlugin';

declare global {
  interface Window {
    mc: typeof runtime & {
      makeScene2D: unknown;
    };
  }
}

let ProjectInstance: Project = null;
let Description: FullSceneDescription<ThreadGeneratorFactory<View2D>> = null;
let PlayerInstance: Player = null;
let StageInstance: Stage = null;
let CurrentSetter: (value: Player) => void = null;
let CurrentParent: HTMLElement = null;

export function disposePlayer(setter: (value: Player) => void) {
  if (CurrentSetter !== setter || !ProjectInstance) return;
  PlayerInstance.deactivate();
  CurrentSetter = null;
  CurrentParent = null;
  StageInstance.finalBuffer.remove();
}

export function borrowPlayer(
  setter: (value: Player) => void,
  parent: HTMLDivElement,
): Player {
  if (setter === CurrentSetter) return;

  if (!ProjectInstance) {
    window.mc = {
      ...runtime,
      makeScene2D: config => {
        Description.config = config;
        Description.onReplaced.current = Description;
        return Description;
      },
    };

    Description = makeScene2D(function* () {
      yield;
    }) as FullSceneDescription<ThreadGeneratorFactory<View2D>>;
    Description.onReplaced = new ValueDispatcher(Description);

    ProjectInstance = {
      name: 'fiddle',
      logger: new Logger(),
      plugins: [DefaultPlugin],
      scenes: [Description],
    } as Project;
    ProjectInstance.meta = new ProjectMetadata(ProjectInstance);
    ProjectInstance.meta.shared.size.set([960, 960 / 4]);

    PlayerInstance = new Player(ProjectInstance, {
      size: ProjectInstance.meta.shared.size.get(),
    });
    StageInstance = new Stage();
    StageInstance.configure({
      size: ProjectInstance.meta.shared.size.get(),
    });
    PlayerInstance.onRender.subscribe(async () => {
      await StageInstance.render(
        PlayerInstance.playback.currentScene,
        PlayerInstance.playback.previousScene,
      );
    });

    // TODO Find a way to attach the logger only for DEV:
    // ProjectInstance.logger.onLogged.subscribe(console.log);
  }

  CurrentParent?.removeChild(StageInstance.finalBuffer);
  CurrentSetter?.(null);
  CurrentSetter = setter;
  CurrentParent = parent;

  PlayerInstance.activate();
  PlayerInstance.requestReset();

  CurrentParent?.append(StageInstance.finalBuffer);
  CurrentSetter(PlayerInstance);
  return PlayerInstance;
}

export function tryBorrowPlayer(
  setter: (value: Player) => void,
  parent: HTMLDivElement,
): Player | null {
  return CurrentSetter ? null : borrowPlayer(setter, parent);
}
