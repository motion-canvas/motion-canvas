export type Language = 'js' | 'ts';

type ProjectInfo = {
  configFile: string;
  language: Language;
};

let ProjectInfo: ProjectInfo | null = null;

export function setProjectInfo(newProjectInfo: ProjectInfo) {
  ProjectInfo = newProjectInfo;
}

export function getProjectInfo(): ProjectInfo {
  if (ProjectInfo == null) {
    throw new Error(
      'ProjectInfo is undefined, try setting it first with setProjectInfo()',
    );
  }
  return ProjectInfo;
}
