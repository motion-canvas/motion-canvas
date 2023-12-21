import type {
  Player,
  Presenter,
  Project,
  ProjectMetadata,
  Renderer,
  SettingsMetadata,
} from '@motion-canvas/core';
import {ComponentChildren, createContext} from 'preact';
import {useContext, useRef} from 'preact/hooks';
import {useSubscribable} from '../hooks';
import {EditorPlugin} from '../plugin';
import {LoggerManager} from '../utils';

interface Application {
  project: Project;
  player: Player;
  renderer: Renderer;
  presenter: Presenter;
  meta: ProjectMetadata;
  settings: SettingsMetadata;
  plugins: EditorPlugin[];
  logger: LoggerManager;
}

const ApplicationContext = createContext<Application | null>(null);

export function useApplication(): Application {
  return useContext(ApplicationContext);
}

export function ApplicationProvider({
  application,
  children,
}: {
  application: Omit<Application, 'logger'>;
  children: ComponentChildren;
}) {
  const manager = useRef<LoggerManager | null>(null);
  manager.current ??= new LoggerManager(application.project.logger);
  useSubscribable(
    application.player.onRecalculated,
    () => manager.current.clear(),
    [],
  );

  return (
    <ApplicationContext.Provider
      value={{
        ...application,
        logger: manager.current,
      }}
    >
      {application.plugins.reduce((children, plugin) => {
        const Component = plugin.provider;
        return Component ? <Component>{children}</Component> : children;
      }, children)}
    </ApplicationContext.Provider>
  );
}
