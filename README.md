# Motion Canvas Core

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

## Disclaimer

The API is a subject to change and may vary drastically in newer versions.

[The current documentation][docs] is still lacking and will be expanded in
the following weeks.

## Using Motion Canvas

Check out the [getting started][docs] guide to learn how to use Motion Canvas.

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
all necessary dependencies.

### Developing Core & 2D

When developing the core, start both `core:watch` and `template:serve`.

This will pick up any changes you make to the core package,
automatically rebuild the `template` project and refresh the page.

Similarly, when developing the 2D package, start `2d:watch` and `template:serve`.

### Developing UI

If you want to develop the UI, first build the template project by running:
`template:build`. Next, start `ui:serve`.

### Developing Player

Like with UI, to develop the player, first build the template: `template:build`.
Then, start `player:serve`.

## Contributing

Read through our [Contribution Guide](./CONTRIBUTING.md) to learn how you can
help make Motion Canvas better.

[authenticate]: https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-with-a-personal-access-token
[template]: https://github.com/motion-canvas/project-template#using-the-template
[discord]: https://www.patreon.com/posts/53003221
[docs]: https://motion-canvas.github.io/guides/getting-started/quickstart
