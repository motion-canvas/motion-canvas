import {ComponentChildren, createContext} from 'preact';
import {useContext} from 'preact/hooks';
import type {
  Player,
  Renderer,
  Project,
  Presenter,
  ProjectMetadata,
  SettingsMetadata,
} from '@motion-canvas/core';

import type {CustomStageOverlayPropsType} from "../components/viewport/CustomStageOverlay"
import { JSXInternal } from 'preact/src/jsx';

interface Application {
  project: Project;
  player: Player;
  renderer: Renderer;
  presenter: Presenter;
  meta: ProjectMetadata;
  settings: SettingsMetadata;
  // customStageOverlay: JSX.Element;
  customStageOverlay: (a: CustomStageOverlayPropsType) => JSXInternal.Element
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
