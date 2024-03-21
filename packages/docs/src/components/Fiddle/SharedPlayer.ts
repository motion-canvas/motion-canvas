import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import {parser as javascript} from '@lezer/javascript';
import type {View2D} from '@motion-canvas/2d';
import type {
  FullSceneDescription,
  Player as PlayerType,
  Project,
  Stage as StageType,
  ThreadGeneratorFactory,
} from '@motion-canvas/core';

type Setter = (value: PlayerType) => void;

interface Config {
  setter: Setter;
  parent: HTMLDivElement;
  ratio: number;
  onError?: (message: string) => void;
  onBorrow: Setter;
}

const VisiblePlayers = new Map<HTMLDivElement, number>();
const ConfigMap = new Map<Setter, Config>();

const Observer = ExecutionEnvironment.canUseDOM
  ? new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          const target = entry.target as HTMLDivElement;
          if (entry.isIntersecting) {
            VisiblePlayers.set(target, entry.intersectionRatio);
          } else {
            VisiblePlayers.delete(target);
          }
        }

        const current = VisiblePlayers.get(CurrentParent);
        if (current !== undefined && current > 0.75) return;

        let bestRatio = 0;
        let bestConfig: Config = null;
        for (const config of ConfigMap.values()) {
          const visible = VisiblePlayers.get(config.parent);
          if (visible !== undefined && visible > bestRatio) {
            bestRatio = visible;
            bestConfig = config;
          }
        }

        if (bestConfig && (current === undefined || bestRatio > current)) {
          borrowPlayer(
            bestConfig.setter,
            bestConfig.parent,
            bestConfig.ratio,
            bestConfig.onError,
          ).then(bestConfig.onBorrow);
        }
      },
      {
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    )
  : null;

let ProjectInstance: Project = null;
let Description: FullSceneDescription<ThreadGeneratorFactory<View2D>> = null;
let PlayerInstance: PlayerType = null;
let StageInstance: StageType = null;
let CurrentSetter: Setter = null;
let CurrentParent: HTMLDivElement = null;
let CurrentRatio = 1;
let ErrorHandler: (message: string) => void = null;

export function disposePlayer(setter: Setter) {
  const config = ConfigMap.get(setter);
  if (config) {
    Observer?.unobserve(config.parent);
    ConfigMap.delete(setter);
  }

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
  setter: Setter,
  parent: HTMLDivElement,
  ratio: number,
  onError?: (message: string) => void,
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
    const {makeScene2D, Code, LezerHighlighter} = await import(
      /* webpackIgnore: true */ '@motion-canvas/2d'
    );
    Code.defaultHighlighter = new LezerHighlighter(
      javascript.configure({
        dialect: 'jsx ts',
      }),
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
      experimentalFeatures: true,
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
        ErrorHandler?.(`Runtime error: ${payload.message}`);
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

export function tryBorrowPlayer(
  setter: Setter,
  parent: HTMLDivElement,
  ratio: number,
  onError: (error: string) => void,
  onBorrow: Setter,
) {
  if (!ConfigMap.has(setter)) {
    Observer?.observe(parent);
    ConfigMap.set(setter, {
      setter,
      parent,
      ratio,
      onError,
      onBorrow,
    });
  }
}
