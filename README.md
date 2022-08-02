# Motion Canvas Core

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lernajs.io/)

## Disclaimer

The API is a subject to change and may vary drastically in newer versions.

[The current documentation][docs] is still lacking and will be expanded in
the following weeks.

## Using Motion Canvas

Make sure that [Node.js](https://nodejs.org/) is installed on your machine.
The recommended version is 16. You can check the currently installed version
using:

```shell
node -v
```

### Authenticate to GitHub Packages

[Detailed information on how to authenticate][authenticate].

1. Generate a PAT (Personal Access Token).
   1. On [github.com](https://github.com),
      go to `Settings` > `Developer settings` > `Personal access tokens`.
   2. Click `Generate new token`.
   3. Enter the note for your token, for instance `npm`.
   4. Choose `read:packages` from the available scopes.
   5. Click `Generate token`
   6. Copy the generated token.
2. Log in using npm
   1. In your terminal, enter the following command:
      ```shell
      npm login --scope=@motion-canvas --registry=https://npm.pkg.github.com
      ```
   2. Answer the prompt.
      `Username` is your GitHub username,
      `Password` is the token you just generated.
      `Email` is your GitHub email address.
      For instace:
      ```text
      > Username: Jacob
      > Password: ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
      > Email: jacob@mail.com
      ```

### Set up a project

You can use [the project template][template] to quickly bootstrap your
project. Otherwise, below are the steps to set it up manually:

1. Create a directory for your project and open it in a terminal.
2. Initialize a new npm package inside:
   ```shell
   npm init
   ```
3. Create a `.npmrc` file with the following content:
   ```text
   @motion-canvas:registry=https://npm.pkg.github.com
   ```
4. Install Motion Canvas
   ```shell
   npm i @motion-canvas/core @motion-canvas/ui
   ```
5. Create a `tsconfig.json` file with the following content:
   ```json
   {
     "extends": "@motion-canvas/core/tsconfig.project.json",
     "compilerOptions": {
       "baseUrl": "src"
     }
   }
   ```
6. Create a simple scene in `src/scenes/example.scene.tsx`:

   ```ts
   import {makeKonvaScene} from '@motion-canvas/core/lib/scenes';
   import {waitFor} from '@motion-canvas/core/lib/flow';

   export default makeKonvaScene(function* example(view) {
     // animation code goes here

     yield* waitFor(5);
   });
   ```

7. Initialize the project with your scene in `src/project.ts`:

   ```ts
   import '@motion-canvas/core/lib/patches';
   import {bootstrap} from '@motion-canvas/core/lib';

   import example from './scenes/example.scene';

   bootstrap({
     name: 'my-project',
     scenes: [example],
   });
   ```

8. So far, your project structure should look like this:
   ```text
   my-project/
   ├─ node_modules/        <- Generated automatically
   ├─ output/              <- Create this folder to render your animation
   ├─ src/
   │  ├─ scenes/
   │  │  └─ example.scene.tsx
   │  └─ project.ts
   ├─ .npmrc
   ├─ package.json         <- Generated automatically
   ├─ package-lock.json    <- Generated automatically
   └─ tsconfig.json
   ```
9. Add a `serve` script to your `package.json`:
   ```json
   {
     "scripts": {
       "serve": "motion-canvas src/project.ts"
     }
   }
   ```

### Run Motion Canvas

Start your project using the `serve` script:

```shell
npm run serve
```

You can now open Motion Canvas in your browser by visiting
[http://localhost:9000/](http://localhost:9000/).

In case of any problems, please visit [our discord server][discord].

## Developing Motion Canvas locally

The project is maintained as one monorepo containing the following packages:

| Name       | Description                                              |
| ---------- | -------------------------------------------------------- |
| `core`     | All logic related to running and rendering animations.   |
| `ui`       | The user interface used for editing.                     |
| `template` | A template project included for developer's convenience. |

After cloning the repo, run `npm install` in the root of the project to install
all necessary dependencies.

### Developing Core

When developing the core, start both `core:watch` and `template:serve`.

This will pick up any changes you make to the core package,
automatically rebuild the `template` project and refresh the page.

### Developing UI

If you want to develop the UI, start both `ui:serve` and `template:ui`.

`ui:serve` will start another webpack dev server specifically for the UI.
Meanwhile, `template:ui` will start the template project with a `--ui-server`
flag that will load the UI from said server instead of a static file.

You can combine it with `core:ui` to develop everything at once.

## Contributing

Read through our [Contribution Guide](./CONTRIBUTING.md) to learn how you can
help make Motion Canvas better.

[authenticate]: https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-with-a-personal-access-token
[template]: https://github.com/motion-canvas/project-template#using-the-template
[discord]: https://www.patreon.com/posts/53003221
[docs]: https://motion-canvas.github.io/api
