import clsx from 'clsx';
import {useEffect} from 'preact/hooks';
import {useState} from 'react';
import {useApplication} from '../../contexts';
import {compareVersions} from '../../utils';
import styles from './Versions.module.scss';

export function Versions() {
  const {project} = useApplication();
  const versions = {
    core: '0.0.0',
    ...(project.versions ?? {}),
  };
  const [newVersion, setNewVersion] = useState(versions.core);
  const isOld = compareVersions(versions.core, newVersion) < 0;

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
          href="https://github.com/motion-canvas/motion-canvas/releases"
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
          const text = Object.entries(versions)
            .filter(([, version]) => !!version)
            .map(([name, version]) => `- ${name}: ${version}`)
            .join('\n');

          navigator.clipboard.writeText(text);
        }}
      >
        <code>{versions.core}</code>
      </div>
    </div>
  );
}
