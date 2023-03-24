import styles from './Index.module.scss';

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
      <div className={styles.header}>Projects</div>
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
