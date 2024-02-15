<br/>
<p align="center">
  <a href="https://motion-canvas.github.io">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://motion-canvas.github.io/img/logo_dark.svg">
      <img width="180" alt="Motion Canvas logo" src="https://motion-canvas.github.io/img/logo.svg">
    </picture>
  </a>
</p>
<p align="center">
  <a href="https://lerna.js.org"><img src="https://img.shields.io/badge/published%20with-lerna-c084fc?style=flat" alt="published with lerna"></a>
  <a href="https://vitejs.dev"><img src="https://img.shields.io/badge/powered%20by-vite-646cff?style=flat" alt="powered by vite"></a>
  <a href="https://www.npmjs.com/package/@motion-canvas/core"><img src="https://img.shields.io/npm/v/@motion-canvas/core?style=flat" alt="npm package version"></a>
  <a href="https://chat.motioncanvas.io"><img src="https://img.shields.io/discord/1071029581009657896?style=flat&logo=discord&logoColor=fff&color=404eed" alt="discord"></a>
</p>
<br/>

# Motion Canvas

Motion Canvas is two things:

- A TypeScript library that uses generators to program animations.
- An editor providing a real-time preview of said animations.

It's a specialized tool designed to create informative vector animations and
synchronize them with voice-overs.

Aside from providing the preview, the editor allows you to edit certain aspects
of the animation which could otherwise be tedious.

## Using Motion Canvas

Check out our [getting started][docs] guide to learn how to use Motion Canvas.

## Developing Motion Canvas locally

The project is maintained as one monorepo containing the following packages:

| Name          | Description                                                    |
| ------------- | -------------------------------------------------------------- |
| `2d`          | The default renderer for 2D motion graphics                    |
| `core`        | All logic related to running and rendering animations.         |
| `create`      | A package for bootstrapping new projects.                      |
| `docs`        | [Our documentation website.][docs]                             |
| `e2e`         | End-to-end tests.                                              |
| `examples`    | Animation examples used in documentation.                      |
| `internal`    | Internal helpers used for building the packages.               |
| `player`      | A custom element for displaying animations in a browser.       |
| `template`    | A template project included for developer's convenience.       |
| `ui`          | The user interface used for editing.                           |
| `vite-plugin` | A plugin for Vite used for developing and bundling animations. |

After cloning the repo, run `npm install` in the root of the project to install
all necessary dependencies. Then run `npx lerna run build` to build all the
packages.

### Developing Editor

When developing the editor, run the following command:

```bash
npm run template:dev
```

It will start a vite server that watches the `core`, `2d`, `ui`, and
`vite-plugin` packages. The `template` package itself contains a simple Motion
Canvas project that can be used during development.

### Developing Player

To develop the player, first build the template: `npm run template:build`. Then,
start `npm run player:dev`.

## Installing a local version of Motion Canvas in a project

It can be useful to install a local version of Motion Canvas in a standalone
project. For example, when you want to use your own fork with some custom-made
features to create your animations.

Let's assume the following project structure:

```
projects/
├── motion-canvas/ <- your local monorepo
└── my-project/ <- a bootstrapped project
    └── package.json
```

You can link the local packages from the monorepo by updating the `package.json`
of your project. Simply replace the version with a `file:` followed by a
relative path to the package you want to link:

```diff
  "dependencies": {
-   "@motion-canvas/core": "^3.11.0",
+   "@motion-canvas/core": "file:../motion-canvas/packages/core",
    // ...
  },
```

If you're linking the `ui` package, you'll also need to modify `vite.config.ts`
to allow vite to load external files:

```ts
import {defineConfig} from 'vite';
import motionCanvas from '@motion-canvas/vite-plugin';

export default defineConfig({
  server: {
    fs: {
      // let it load external files
      strict: false,
    },
  },
  plugins: [motionCanvas()],
});
```

This is necessary because the editor styles are loaded using the `/@fs/` prefix
and since the linked `ui` package is outside the project, vite needs permission
to access it.

Then run `npm install` in to apply the changes and that's it.

You can use the same technique to test out any custom package you're working on.

## Contributing

Read through our [Contribution Guide](./CONTRIBUTING.md) to learn how you can
help make Motion Canvas better.

[authenticate]:
  https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-with-a-personal-access-token
[template]: https://github.com/motion-canvas/project-template#using-the-template
[discord]: https://chat.motioncanvas.io
[docs]: https://motioncanvas.io/docs/quickstart
