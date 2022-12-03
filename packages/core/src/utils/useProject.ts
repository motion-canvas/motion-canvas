import type {Project} from '../Project';

let currentProject: Project;

/**
 * Get a reference to the current project.
 */
export function useProject() {
  return currentProject;
}

export function useLogger() {
  return currentProject.logger;
}

export function setProject(project: Project) {
  currentProject = project;
}
