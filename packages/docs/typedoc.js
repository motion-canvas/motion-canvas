// @ts-check

const mdn = require('mdn-links');
const fs = require('fs');

/** @type {typeof import('typedoc')} */
let td;

module.exports = () => ({
  name: 'docusaurus-typedoc-plugin',
  async loadContent() {
    td = await import('typedoc');

    const dir = './src/generated';
    if (fs.existsSync(dir) && process.env.NODE_ENV !== 'production') {
      const api = JSON.parse(
        await fs.promises.readFile(`${dir}/api.json`, 'utf8'),
      );
      return api.lookups;
    }

    fs.mkdirSync(`${dir}/markdown`, {recursive: true});

    const core = await parseTypes(
      {
        theme: 'custom',
        excludeInternal: true,
        excludePrivate: true,
        entryPoints: [
          '../core/src/app',
          '../core/src/decorators',
          '../core/src/events',
          '../core/src/flow',
          '../core/src/media',
          '../core/src/meta',
          '../core/src/plugin',
          '../core/src/scenes',
          '../core/src/signals',
          '../core/src/threading',
          '../core/src/transitions',
          '../core/src/tweening',
          '../core/src/types',
          '../core/src/utils',
        ],
        tsconfig: '../core/tsconfig.build.json',
      },
      'core',
    );
    const ui = await parseTypes(
      {
        theme: 'custom',
        excludeExternals: true,
        excludeInternal: true,
        excludePrivate: true,
        entryPoints: [
          '../2d/src/lib/components',
          '../2d/src/lib/curves',
          '../2d/src/lib/code',
          '../2d/src/lib/decorators',
          '../2d/src/lib/partials',
          '../2d/src/lib/scenes',
          '../2d/src/lib/utils',
        ],
        tsconfig: '../2d/src/lib/tsconfig.build.json',
      },
      '2d',
      core,
    );

    const sidebar = [];
    const lookups = {};
    let urlLookups = {};
    let previousProject;
    let mdContents = [];

    for (const project of [core, ui]) {
      urlLookups = {
        ...urlLookups,
        ...project.urlLookup,
      };
      mdContents.push(...project.mdContents);

      lookups[project.id] = project.lookup;
      sidebar.push(project.sidebar);
      if (previousProject) {
        let previous = previousProject.sidebar;
        while (previous.items?.length) {
          previous = previous.items.at(-1);
        }
        previousProject.lookup[previous.reflectionId].next = {
          title: project.sidebar.label,
          permalink: project.sidebar.href,
        };
        project.lookup[project.id].previous = {
          title: previous.label,
          permalink: previous.href,
        };
      }
      previousProject = project;
    }

    await fs.promises.writeFile(
      `${dir}/markdown/index.js`,
      `
      ${mdContents.map(id => `import ${id} from './${id}.md';`).join('\n')}
      export {
        ${mdContents.map(id => `${id},\n`).join('\n')}
      }`,
      'utf8',
    );

    await fs.promises.writeFile(
      `${dir}/sidebar.json`,
      JSON.stringify(sidebar),
      'utf8',
    );

    await fs.promises.writeFile(
      `${dir}/api.json`,
      JSON.stringify({lookups, urlLookups}),
      'utf8',
    );

    return lookups;
  },
  async contentLoaded({content, actions}) {
    if (content === null) {
      return;
    }

    for (const [id, lookup] of Object.entries(content)) {
      actions.addRoute({
        path: lookup[id].url,
        component: '@site/src/components/Api/ApiPage.tsx',
        routes: Object.values(lookup)
          .filter(reflection => reflection.hasOwnPage)
          .map(reflection => ({
            path: reflection.url,
            component: '@site/src/components/Api/ApiItem.tsx',
            exact: true,
            sidebar: 'api',
            reflectionId: reflection.id,
            projectId: id,
          })),
        exact: false,
      });
    }
  },
});

async function parseTypes(options, projectName, externalProject) {
  const app = await td.Application.bootstrap(options, [
    new td.TSConfigReader(),
  ]);

  app.converter.addUnknownSymbolResolver(ref => {
    const name = ref.symbolReference.path[0].path;
    if (externalProject) {
      let reference = externalProject.nameLookup[name];
      if (!reference) {
        const match = /(.+)<.*>(.*)/.exec(name);
        if (match) {
          const name = match[1] + match[2];
          reference = externalProject.nameLookup[name];
        }
      }
      if (reference) {
        if (ref.symbolReference.path.length > 0) {
          for (const value of ref.symbolReference.path.slice(1)) {
            reference = reference.children
              .map(({id}) => externalProject.lookup[id])
              .find(child => child.name === value.path);
          }
        }

        return reference?.href;
      }
    }

    return mdn.getLink(name) ?? undefined;
  });

  const project = await app.convert();
  if (!project) return null;

  const hasOwnPage = [
    td.ReflectionKind.Module,
    td.ReflectionKind.Reference,
    td.ReflectionKind.Interface,
    td.ReflectionKind.Namespace,
    td.ReflectionKind.Project,
    td.ReflectionKind.Class,
    td.ReflectionKind.Enum,
  ];

  const signatureKinds = new Set([
    td.ReflectionKind.CallSignature,
    td.ReflectionKind.ConstructorSignature,
    td.ReflectionKind.GetSignature,
    td.ReflectionKind.SetSignature,
    td.ReflectionKind.IndexSignature,
  ]);

  const traverse = reflection => {
    reflection.hasOwnPage = hasOwnPage.includes(reflection.kind);
    reflection.docId = reflection.parent
      ? `${reflection.parent.docId}-${reflection.name}`
      : reflection.name;

    if (reflection.hasOwnPage) {
      reflection.url = `${reflection.parent.url}/${reflection.name}`;
      reflection.sidebar = {
        type: 'link',
        href: reflection.url,
        label: reflection.name,
        reflectionId: reflection.id,
      };
      reflection.parent.sidebar ??= {};
      reflection.parent.sidebar.type = 'category';
      reflection.parent.sidebar.collapsed = true;
      reflection.parent.sidebar.collapsible = true;
      reflection.parent.sidebar.items ??= [];
      reflection.parent.sidebar.items.push(reflection.sidebar);

      let previous = reflection.parent.sidebar.items.at(-2);
      while (previous?.items?.length) {
        previous = previous.items.at(-1);
      }
      if (!previous) {
        previous = reflection.parent.sidebar;
      }
      if (previous) {
        previous.next = {
          title: reflection.name,
          permalink: reflection.url,
        };
        reflection.sidebar.previous = {
          title: previous.label,
          permalink: previous.href,
        };
      }
    } else {
      reflection.url = reflection.parent.url;
      let name = reflection.name;
      if (reflection.flags?.isStatic) {
        name = `static-${name}`;
      }
      if (signatureKinds.has(reflection.kind) && reflection.parent.anchor) {
        reflection.anchor = reflection.parent.anchor;
      } else if (reflection.parent.anchor) {
        reflection.anchor = reflection.parent.anchor + '-' + name;
      } else {
        reflection.anchor = name;
      }
    }

    const isHidden =
      reflection.flags?.isPrivate || reflection.flags?.isProtected;
    reflection.href =
      reflection.anchor && !isHidden
        ? reflection.url + '#' + reflection.anchor
        : reflection.url;

    reflection.traverse(traverse);
  };

  project.url = `/api/${projectName}`;
  project.href = project.url;
  project.docId = project.name;
  project.hasOwnPage = true;
  project.sidebar = {
    type: 'link',
    href: project.url,
    label: project.name,
  };
  project.traverse(traverse);

  const lookup = {};
  const nameLookup = {};
  const urlLookup = {};

  app.serializer.addSerializer({
    priority: -10,
    supports() {
      return true;
    },
    toObject(item, obj) {
      obj.project = project.id;
      return obj;
    },
  });

  app.serializer.addSerializer({
    priority: -20,
    supports(item) {
      return (
        item instanceof td.DeclarationReflection &&
        item.kind === td.ReflectionKind.Module
      );
    },
    toObject(item, obj) {
      obj.importPath =
        item.name === 'index'
          ? `${project.name}/lib`
          : `${project.name}/lib/${item.name}`;
      return obj;
    },
  });

  app.serializer.addSerializer({
    priority: -30,
    supports(item) {
      return item instanceof td.Reflection;
    },
    toObject(item, obj) {
      obj.experimental = isExperimental(item);

      if (!obj.experimental && item instanceof td.DeclarationReflection) {
        const signatures = [
          ...(obj.signatures ?? []),
          obj.setSignature,
          obj.getSignature,
          ...(obj.indexSignatures ?? []),
        ].filter(item => !!item);

        obj.experimental = signatures.some(signature =>
          isExperimental(lookup[signature.id]),
        );
      }

      return obj;
    },
  });

  app.serializer.addSerializer({
    priority: -40,
    supports(item) {
      return item instanceof td.Reflection;
    },
    toObject(item, obj) {
      urlLookup[item.href] = {
        id: item.id,
        projectId: project.id,
      };
      nameLookup[obj.name] = obj;
      lookup[obj.id] = obj;
      obj.url = item.url;
      obj.anchor = item.anchor;
      obj.href = item.href;
      obj.hasOwnPage = item.hasOwnPage;
      obj.docId = item.docId;
      obj.next = item.sidebar?.next;
      obj.previous = item.sidebar?.previous;
      return {id: item.id, project: project.id};
    },
  });

  const promises = [];
  const mdContents = [];
  app.serializer.addSerializer({
    priority: -50,
    supports(item) {
      return item instanceof td.Comment || item instanceof td.CommentTag;
    },
    toObject(item, obj) {
      if (item instanceof td.CommentTag) {
        obj.contentId = getContentName(project.id, promises.length);
        mdContents.push(obj.contentId);
        promises.push(
          fs.promises.writeFile(
            `./src/generated/markdown/${obj.contentId}.md`,
            partsToMarkdown(item.content),
          ),
          'utf8',
        );
      }

      if (item.summary) {
        obj.summaryText = partsToText(item.summary);
        obj.summaryId = getContentName(project.id, promises.length);
        mdContents.push(obj.summaryId);
        promises.push(
          fs.promises.writeFile(
            `./src/generated/markdown/${obj.summaryId}.md`,
            partsToMarkdown(item.summary),
          ),
          'utf8',
        );
      }
      return obj;
    },
  });
  app.serializer.projectToObject(project, process.cwd());

  await Promise.all(promises);

  return {
    id: project.id,
    name: projectName,
    lookup,
    sidebar: project.sidebar,
    nameLookup,
    urlLookup,
    mdContents,
  };
}

function getContentName(project, index) {
  return `content_${project}_${index}`;
}

function partsToMarkdown(parts) {
  return parts
    .map(part => {
      if (part.kind === 'inline-tag' && part.tag === '@link') {
        if (part.target instanceof td.DeclarationReflection) {
          return `[\`${part.text}\`](${part.target.href})`;
        } else if (part.target) {
          return `[\`${part.text}\`](${part.target})`;
        } else {
          console.error(part);
          throw new Error('Invalid link: ' + part.text);
        }
      }
      return part.text;
    })
    .join('');
}

function partsToText(parts) {
  return parts
    .map(part => {
      if (part.kind === 'code') {
        return part.text.startsWith('```') ? '' : part.text.slice(1, -1);
      }
      return part.text;
    })
    .join('');
}

function isExperimental(reflection) {
  const tags = reflection?.comment?.modifierTags;
  if (!tags) return false;

  if (typeof tags === 'string') {
    return tags === '@experimental';
  }

  if (Array.isArray(tags)) {
    return tags.some(tag => tag === '@experimental');
  }

  return tags.has('@experimental');
}
