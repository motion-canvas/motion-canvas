/**
 * Automatically generate a new blog entry for the current release.
 */

const {exec} = require('child_process');
const fs = require('fs');

const COMMIT_REGEX = /^(\w+)(?:\(.+\))?!?: (.+) \(#(\d+)\)/;

function runBash(command) {
  return new Promise((resolve, reject) =>
    exec(command, (error, stdout) => {
      if (error) reject(error);
      resolve(stdout);
    }),
  );
}

async function gitLog(from, to) {
  const log = await runBash(`git log --pretty=format:%s ${from}...${to}`);
  return log.split('\n');
}

async function gitTags() {
  const tags = await runBash(
    `git for-each-ref --sort=taggerdate --format "%(refname:short)" refs/tags`,
  );
  return tags
    .trim()
    .split('\n')
    .reverse()
    .filter(tag => !tag.includes('-alpha'));
}

function getDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function Issue({user, pr, header}) {
  return `  <Issue user={'${user}'} pr={${pr}}>
    ${header}
  </Issue>`;
}

function IssueGroup([type, issues]) {
  return `<IssueGroup type={'${type}'}>
${issues.map(Issue).join('\n')}  
</IssueGroup>`;
}

(async () => {
  const tags = await gitTags();
  const logs = await gitLog(tags[0], tags[1]);
  const types = {
    feat: [],
    fix: [],
  };
  for (const log of logs) {
    const match = COMMIT_REGEX.exec(log);
    if (!match) continue;
    const [, type, header, pr] = match;
    if (!(type in types)) continue;

    const response = await fetch(
      `https://api.github.com/repos/motion-canvas/motion-canvas/pulls/${pr}`,
    );
    const prData = await response.json();
    types[type].push({
      user: prData.user?.login ?? 'unknown',
      header,
      pr,
    });
  }

  const version = tags[0].substring(1);

  await fs.promises.writeFile(
    `blog/${getDate()}-version-${version}.mdx`,
    `---
slug: version-${version}
title: Motion Canvas v${version}
authors: aarthificial
---

import IssueGroup from '@site/src/components/Release/IssueGroup';
import Issue from '@site/src/components/Release/Issue';

${Object.entries(types).map(IssueGroup).join('\n')}

<small>
  Check out <Link to="/docs/updating">the Update Guide</Link> for information on
  how to update your existing projects.
</small>`,
    'utf8',
  );
})();
