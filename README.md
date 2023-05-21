<br/>
<p align="center">
  <a href="https://motion-canvas.github.io">
    <img width="180" src="https://motion-canvas.github.io/img/logo_dark.svg" alt="Motion Canvas logo">
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

Motion Canvas serves as a comprehensive solution encompassing two key components:

- Firstly, it functions as a TypeScript library that leverages generators as a means to program animations effectively. This powerful feature facilitates the creation of dynamic and visually appealing animations with relative ease.
- Secondly, Motion Canvas offers an integrated editor that provides users with a real-time preview of their animations. This editor not only showcases the animations as they unfold but also grants users the ability to make real-time edits to certain elements of the animation. 
This functionality proves invaluable as it streamlines the animation creation process, eliminating the need for tedious and time-consuming manual adjustments. 

By combining the benefits of a versatile TypeScript library and an intuitive editor, Motion Canvas enables users to craft informative vector animations and seamlessly synchronize them with voice-overs. This specialized tool caters to the needs of animators, designers, and content creators, empowering them to deliver captivating and synchronized visual experiences.

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

When developing the core, start both `core:watch` and `template:serve`.

This will pick up any changes you make to the core package, automatically
rebuild the `template` project and refresh the page.

Similarly, when developing the 2D package, start `2d:watch` and
`template:serve`.

### Developing UI

If you want to develop the UI, first build the template project by running:
`template:build`. Next, start `ui:serve`.

### Developing Player

Like with UI, to develop the player, first build the template: `template:build`.
Then, start `player:serve`.

## Contributing

Read through our [Contribution Guide](./CONTRIBUTING.md) to learn how you can
help make Motion Canvas better.

[authenticate]:
  https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-with-a-personal-access-token
[template]: https://github.com/motion-canvas/project-template#using-the-template
[discord]: https://chat.motioncanvas.io
[docs]: https://motioncanvas.io/docs/quickstart
