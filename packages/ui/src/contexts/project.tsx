import {ComponentChildren, createContext} from 'preact';
import {useContext} from 'preact/hooks';
import type {Project} from '@motion-canvas/core/lib';

const ProjectContext = createContext<Project | null>(null);

export function useProject() {
  return useContext(ProjectContext);
}

export function ProjectProvider({
  project,
  children,
}: {
  project: Project;
  children: ComponentChildren;
}) {
  return (
    <ProjectContext.Provider value={project}>
      {children}
    </ProjectContext.Provider>
  );
}
