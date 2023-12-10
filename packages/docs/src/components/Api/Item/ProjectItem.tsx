import Link from '@docusaurus/Link';
import {useApiLookup} from '@site/src/contexts/api';
import clsx from 'clsx';
import React from 'react';
import type {JSONOutput} from 'typedoc';
import styles from './styles.module.css';

export default function ProjectItem({
  reflection,
}: {
  reflection: JSONOutput.DeclarationReflection;
}) {
  const lookup = useApiLookup(reflection.project);
  const modules = reflection.groups[0].children
    .map(id => lookup[id])
    .filter(module => !!module);

  return (
    <article className="margin-top--lg">
      <section className={clsx('row')}>
        {modules.map(module => (
          <article key={module.id} className="col col--6 margin-bottom--lg">
            <Link
              href={module.href}
              className={clsx('card padding--lg', styles.cardContainer)}
            >
              <h2 className={clsx('text--truncate', styles.cardTitle)}>
                <code>{module.name}</code>
              </h2>
              <div className={clsx('text--truncate', styles.cardDescription)}>
                {module.comment?.summaryText ?? '\u00A0'}
              </div>
            </Link>
          </article>
        ))}
      </section>
    </article>
  );
}
