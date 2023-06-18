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
| `core`        | All logic related to running and rendering animations.         |
| `2d`          | The default renderer for 2D motion graphics                    |
| `create`      | A package for bootstrapping new projects.                      |
| `docs`        | [Our documentation website.][docs]                             |
| `e2e`         | End-to-end tests.                                              |
| `examples`    | Animation examples used in documentation.                      |
| `player`      | A custom element for displaying animations in a browser.       |
| `template`    | A template project included for developer's convenience.       |
| `ui`          | The user interface used for editing.                           |
| `vite-plugin` | A plugin for Vite used for developing and bundling animations. |

After cloning the repo, run `npm install` in the root of the project to install
all necessary dependencies. Then run `npx lerna run build` to build all the
packages.

### Developing Core & 2D

When developing the core, start both `core:dev` and `template:dev`.

This will pick up any changes you make to the core package, automatically
rebuild the `template` project and refresh the page.

Similarly, when developing the 2D package, start `2d:dev` and `template:dev`.

### Developing UI

If you want to develop the UI, first build the template project by running:
`template:build`. Next, start `ui:dev`.

### Developing Player

Like with UI, to develop the player, first build the template: `template:build`.
Then, start `player:dev`.

## Contributing

Read through our [Contribution Guide](./CONTRIBUTING.md) to learn how you can
help make Motion Canvas better.

[authenticate]:
  https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-with-a-personal-access-token
[template]: https://github.com/motion-canvas/project-template#using-the-template
[discord]: https://chat.motioncanvas.io
[docs]: https://motioncanvas.io/docs/quickstart
