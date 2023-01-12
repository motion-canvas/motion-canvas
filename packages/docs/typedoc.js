// @ts-check

const {
  Application,
  TSConfigReader,
  ReflectionKind,
  Reflection,
  DeclarationReflection,
  CommentTag,
  Comment,
} = require('typedoc');
const mdn = require('mdn-links');

module.exports = () => ({
  name: 'docusaurus-typedoc-plugin',
  async loadContent() {
    const core = await parseTypes(
      {
        theme: 'custom',
        excludeInternal: true,
        excludePrivate: true,
        entryPoints: [
          '../core/src/index.ts',
          '../core/src/decorators',
          '../core/src/events',
          '../core/src/flow',
          '../core/src/helpers',
          '../core/src/media',
          '../core/src/player',
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
    return [
      core,
      await parseTypes(
        {
          theme: 'custom',
          excludeExternals: true,
          excludeInternal: true,
          excludePrivate: true,
          entryPoints: [
            '../2d/src/components',
            '../2d/src/curves',
            '../2d/src/decorators',
            '../2d/src/partials',
            '../2d/src/scenes',
            '../2d/src/utils',
          ],
          tsconfig: '../2d/tsconfig.json',
        },
        '2d',
        core,
      ),
    ];
  },
  async contentLoaded({content, actions}) {
    if (content === null) {
      return;
    }

    const sidebar = [];
    const lookups = {};
    const promises = [];
    let urlLookups = {};
    let previousProject;
    let imports = '';
    let exports = '';

    for (const project of content) {
      urlLookups = {
        ...urlLookups,
        ...project.urlLookup,
      };
      for (let i = 0; i < project.mdContents.length; i++) {
        const md = project.mdContents[i];
        const name = getContentName(project.id, i);

        promises.push(actions.createData(`${name}.md`, md));
        imports += `import ${name} from "./${name}.md";\n`;
        exports += `${name},\n`;
      }

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

    await Promise.all(promises);
    const lookupData = await actions.createData(
      'lookup.json',
      JSON.stringify({sidebar, lookups, urlLookups}),
    );

    const contents = await actions.createData(
      'test.js',
      `${imports}const contents = {\n${exports}};\nexport default contents;`,
    );

    for (const project of content) {
      actions.addRoute({
        path: project.lookup[project.id].url,
        component: '@site/src/components/Api/ApiPage.tsx',
        routes: Object.values(project.lookup)
          .filter(reflection => reflection.hasOwnPage)
          .map(reflection => ({
            path: reflection.url,
            component: '@site/src/components/Api/ApiItem.tsx',
            exact: true,
            sidebar: 'api',
            reflectionId: reflection.id,
          })),
        modules: {
          lookup: lookupData,
          contents: contents,
        },
        exact: false,
        reflectionId: project.id,
        projectName: project.name,
      });
    }
  },
});

async function parseTypes(options, projectName, externalProject) {
  const app = new Application();
  app.options.addReader(new TSConfigReader());
  app.bootstrap(options);

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
            reference = reference.children.find(
              child => child.name === value.path,
            );
          }
        }

        return reference.href;
      }
    }

    return mdn.getLink(name) ?? undefined;
  });

  const project = app.convert();
  if (!project) return null;

  const hasOwnPage = [
    ReflectionKind.Module,
    ReflectionKind.Reference,
    ReflectionKind.Interface,
    ReflectionKind.Namespace,
    ReflectionKind.Project,
    ReflectionKind.Class,
    ReflectionKind.Enum,
  ];

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
      if (reflection.parent.anchor) {
        reflection.anchor = reflection.parent.anchor + '-' + name;
      } else {
        reflection.anchor = name;
      }
    }

    reflection.href = reflection.anchor
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
    priority: -Infinity,
    supports(item) {
      return item instanceof Reflection;
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
      return obj;
    },
  });

  app.serializer.addSerializer({
    priority: -Infinity,
    supports(item) {
      return (
        item instanceof DeclarationReflection &&
        item.kind === ReflectionKind.Module
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

  const mdContents = [];
  app.serializer.addSerializer({
    priority: -Infinity,
    supports(item) {
      return item instanceof Comment || item instanceof CommentTag;
    },
    toObject(item, obj) {
      if (item instanceof CommentTag) {
        obj.contentId = getContentName(project.id, mdContents.length);
        mdContents.push(partsToMarkdown(item.content));
      }

      if (item.summary) {
        obj.summaryText = partsToText(item.summary);
        obj.summaryId = getContentName(project.id, mdContents.length);
        mdContents.push(partsToMarkdown(item.summary));
      }
      return obj;
    },
  });
  app.serializer.projectToObject(project);

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
        if (part.target instanceof DeclarationReflection) {
          return `[\`${part.text}\`](${part.target.href})`;
        } else {
          return `[\`${part.text}\`](${part.target})`;
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
