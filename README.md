# Motion Canvas Core

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

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
      For instance:
      ```text
      > Username: Jacob
      > Password: ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
      > Email: jacob@mail.com
      ```

### Set up a project

Run the following command in order to scaffold a new Motion Canvas project:

```bash
npm init @motion-canvas
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

| Name          | Description                                                    |
| ------------- | -------------------------------------------------------------- |
| `core`        | All logic related to running and rendering animations.         |
| `ui`          | The user interface used for editing.                           |
| `template`    | A template project included for developer's convenience.       |
| `docs`        | [Our documentation website.][docs]                             |
| `vite-plugin` | A plugin for Vite used for developing and bundling animations. |

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
