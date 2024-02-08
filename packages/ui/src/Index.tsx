import {Header} from './components/layout';
import styles from './Index.module.scss';
import { Modules, Action, KeyBindingMapping, ModuleType } from '@motion-canvas/core';

export class UIAction extends Action {
  public getTooltip(module = (Modules.Global as ModuleType)) {
    const actionKeys = KeyBindingMapping.getActionKeys(this, module);
    return `${this.name} ${actionKeys.map(k => '[' + k.shortName + ']').join(' or ')}`;
 }
}

export interface ProjectData {
  name: string;
  fileName: string;
  url: string;
}

export interface IndexProps {
  projects: ProjectData[];
}

export function Index({projects}: IndexProps) {
  return (
    <div className={styles.root}>
      <Header className={styles.header}>Projects</Header>
      <div className={styles.list}>
        {projects.map(project => (
          <a className={styles.element} href={`./${project.fileName}`}>
            <div className={styles.title}>{project.name}</div>
            <div className={styles.subtitle}>{project.url}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
