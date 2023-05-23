import type {
  Project,
  Player as PlayerType,
  Stage as StageType,
  FullSceneDescription,
  ThreadGeneratorFactory,
  LogPayload,
} from '@motion-canvas/core';
import type {View2D} from '@motion-canvas/2d';

let ProjectInstance: Project = null;
let Description: FullSceneDescription<ThreadGeneratorFactory<View2D>> = null;
let PlayerInstance: PlayerType = null;
let StageInstance: StageType = null;
let CurrentSetter: (value: PlayerType) => void = null;
let CurrentParent: HTMLElement = null;
let CurrentRatio = 1;
let ErrorHandler: (message: LogPayload) => void = null;

export function disposePlayer(setter: (value: PlayerType) => void) {
  if (CurrentSetter !== setter || !ProjectInstance) return;
  PlayerInstance.deactivate();
  CurrentSetter = null;
  CurrentParent = null;
  StageInstance.finalBuffer.remove();
}

export function updatePlayer(description: typeof Description) {
  if (Description) {
    Description.onReplaced.current = description;
  }
}

export async function borrowPlayer(
  setter: (value: PlayerType) => void,
  parent: HTMLDivElement,
  ratio: number,
  onError?: (message: LogPayload) => void,
): Promise<PlayerType> {
  if (setter === CurrentSetter) return;
  if (
    StageInstance &&
    CurrentParent &&
    StageInstance.finalBuffer.parentElement === CurrentParent
  ) {
    CurrentParent?.removeChild(StageInstance.finalBuffer);
  }
  CurrentSetter?.(null);
  CurrentSetter = setter;
  CurrentParent = parent;
  ErrorHandler = onError;

  if (!ProjectInstance) {
    const {
      Logger,
      Player,
      ProjectMetadata,
      Stage,
      ValueDispatcher,
      DefaultPlugin,
    } = await import(/* webpackIgnore: true */ '@motion-canvas/core');
    const {makeScene2D} = await import(
      /* webpackIgnore: true */ '@motion-canvas/2d'
    );

    Description = makeScene2D(function* () {
      yield;
    }) as FullSceneDescription<ThreadGeneratorFactory<View2D>>;
    Description.onReplaced = new ValueDispatcher(Description);

    ProjectInstance = {
      name: 'fiddle',
      logger: new Logger(),
      plugins: [DefaultPlugin()],
      scenes: [Description],
    } as Project;
    ProjectInstance.meta = new ProjectMetadata(ProjectInstance);
    ProjectInstance.meta.shared.size.set(960);

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
    PlayerInstance.onRecalculated.subscribe(() => {
      if (StageInstance.finalBuffer.parentElement !== CurrentParent) {
        CurrentParent?.append(StageInstance.finalBuffer);
        CurrentSetter(PlayerInstance);
      }
    });

    ProjectInstance.logger.onLogged.subscribe(payload => {
      if (payload.level === 'error') {
        ErrorHandler?.(payload);
      }
    });
  }

  if (CurrentRatio !== ratio) {
    ProjectInstance.meta.shared.size.set([960, Math.floor(960 / ratio)]);
    Description.onReplaced.current = {
      ...Description.onReplaced.current,
      size: ProjectInstance.meta.shared.size.get(),
    };
    StageInstance.configure({
      size: ProjectInstance.meta.shared.size.get(),
    });
    CurrentRatio = ratio;
  }

  PlayerInstance.activate();
  PlayerInstance.requestReset();
  return PlayerInstance;
}

export async function tryBorrowPlayer(
  setter: (value: PlayerType) => void,
  parent: HTMLDivElement,
  ratio: number,
  onError?: (error: LogPayload) => void,
): Promise<PlayerType | null> {
  if (!CurrentSetter) {
    return borrowPlayer(setter, parent, ratio, onError);
  }

  return null;
}
