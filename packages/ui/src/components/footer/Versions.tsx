import styles from './Versions.module.scss';
import {useApplication} from '../../contexts';
import clsx from 'clsx';
import {useEffect} from 'preact/hooks';
import {useState} from 'react';
import {compareVersions} from '../../utils';

export function Versions() {
  const {project} = useApplication();
  const [newVersion, setNewVersion] = useState(project.versions.core);
  const isOld = compareVersions(project.versions.core, newVersion) < 0;

  useEffect(() => {
    const abort = new AbortController();
    fetch('https://registry.npmjs.org/@motion-canvas/core/latest', {
      signal: abort.signal,
    })
      .then(response => response.json())
      .then(response => setNewVersion(response.version));
    return () => abort.abort();
  }, []);

  return (
    <div className={styles.root}>
      {isOld && (
        <a
          href={`https://motioncanvas.io/blog/version-${newVersion}`}
          target="_blank"
          title="See what's new"
          className={clsx(styles.link, styles.main)}
        >
          UPDATE AVAILABLE
        </a>
      )}
      <div
        title="Copy version information"
        className={styles.link}
        onClick={() => {
          const versions = Object.entries(project.versions)
            .filter(([, version]) => !!version)
            .map(([name, version]) => `- ${name}: ${version}`)
            .join('\n');

          navigator.clipboard.writeText(versions);
        }}
      >
        {project.versions.core}
      </div>
    </div>
  );
}
