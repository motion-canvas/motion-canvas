import {ComponentChildren, createContext} from 'preact';
import {useContext} from 'preact/hooks';
import {Player, Renderer, Project, ProjectMetadata} from '@motion-canvas/core';

interface Application {
  project: Project;
  player: Player;
  renderer: Renderer;
  meta: ProjectMetadata;
}

const ApplicationContext = createContext<Application | null>(null);

export function useApplication(): Application {
  return useContext(ApplicationContext);
}

export function ApplicationProvider({
  application,
  children,
}: {
  application: Application;
  children: ComponentChildren;
}) {
  return (
    <ApplicationContext.Provider value={application}>
      {children}
    </ApplicationContext.Provider>
  );
}
