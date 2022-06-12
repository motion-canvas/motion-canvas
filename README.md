# Motion Canvas Core

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## Disclaimer

The API is a subject to change and may vary drastically in newer versions.

Documentation is still lacking and will be expanded in the following weeks.

## Using Motion Canvas

Make sure that [Node.js](https://nodejs.org/) is installed on your machine.
The recommended version is 16. You can check the currently installed version using:

```shell
node -v
```

### Authenticate to GitHub Packages

[Detailed information on how to authenticate](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-with-a-personal-access-token).

1. Generate a PAT (Personal Access Token).
   1. On [github.com](https://github.com), go to `Settings` > `Developer settings` > `Personal access tokens`.
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

You can use [the project template](https://github.com/motion-canvas/project-template#using-the-template) to quickly bootstrap your project.
Otherwise, below are the steps to set it up manually:

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
   import type {Scene} from '@motion-canvas/core/lib/Scene';
   import {ThreadGenerator} from '@motion-canvas/core/lib/threading';
   import {waitFor} from '@motion-canvas/core/lib/flow';

   export default function* example(scene: Scene): ThreadGenerator {
     yield* scene.transition();

     yield* waitFor(5);
     scene.canFinish();
   }
   ```

7. Initialize the project with your scene in `src/project.ts`:

   ```ts
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

You can now open Motion Canvas in your browser by visiting [http://localhost:9000/](http://localhost:9000/).

In case of any problems, please visit [our discord server](https://www.patreon.com/posts/53003221).

## Developing Motion Canvas locally

I recommend using [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces) for local development.

1. Set up the following directory structure:
   ```text
   motion-canvas/
   ├─ packages/
   │  ├─ core/     <- Cloned from GitHub
   │  ├─ ui/       <- Cloned from GitHub
   │  └─ example/  <- Set up like a normal project but don't install anything
   ├─ .npmrc
   └─ package.json
   ```
2. Configure workspaces in the root `package.json`:
   ```json
   {
     "name": "motion-canvas",
     "private": true,
     "scripts": {
       "build:core": "npm run build -w packages/core",
       "watch:core": "npm run watch -w packages/core",
       "build:ui": "npm run build -w packages/ui",
       "serve:ui": "npm run serve -w packages/ui",
       "serve:example": "npm run serve -w packages/example"
     },
     "workspaces": ["packages/*"]
   }
   ```
3. Run `npm install` in the root of your project to configure the symlinks.
4. Install Motion Canvas in the `example` project using workspaces:
   ```shell
   npm i @motion-canvas/core @motion-canvas/ui -w packages/example
   ```
5. Run `build:core` and `build:ui` to generate the necessary files.

### Developing Core

When developing the core, start both `watch:core` and `serve:example`.

This will pick up any changes you make to the core package,
automatically rebuild the `example` project and refresh the page.

### Developing UI

If you want to develop the UI, create a new npm script in the `example` project:

```json
{
  "scripts": {
    "ui": "motion-canvas src/project.ts --ui-server"
  }
}
```

And add it in your root `package.json`:

```json
{
  "scripts": {
    "ui:example": "npm run ui -w packages/example"
  }
}
```

You can now start both `serve:ui` and `ui:example`.

`serve:ui` will start another webpack dev server specifically for the UI.
Meanwhile, the `--ui-server` flag will instruct your project to load the UI from said server instead of a static file.

You can combine it with `watch:core` to develop everything at once.

## Contributing

Read through our [Contribution Guide](./CONTRIBUTING.md) to learn how you can help make Motion Canvas better.
