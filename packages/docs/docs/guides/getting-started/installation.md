---
sidebar_position: 1
---

# Installation

Make sure that [Node.js](https://nodejs.org/) is installed on your machine.
The recommended version is 16. You can check the currently installed version
using:

```shell
node -v
```

## Authenticate to GitHub Packages

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

Run the following command in order to scaffold a new Motion Canvas project:

```bash
npm init @motion-canvas
```

[authenticate]: https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-with-a-personal-access-token
[discord]: https://www.patreon.com/posts/53003221
