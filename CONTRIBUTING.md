# Contributing to Motion Canvas

This is an initial version of the Contribution Guide.
Feel free to discuss it and suggest any changes on [our discord server][discord].

## Code of Conduct

Before contributing to the project, please read our
[Code of Conduct](./CODE_OF_CONDUCT.md).

## Reporting a bug

Before you submit an issue, please search [the issue tracker][issues].
An issue for your problem might already exist and the discussion might inform
you of workarounds readily available.

You can file new issues by [selecting an issue template][new-issue] and
filling out the necessary information.

## Proposing a Change

If you intend to change the public API, or make any non-trivial changes to
the implementation, make sure to [create an issue][new-feature] first. This
will let us discuss a proposal before you put significant effort into it.

If you're only fixing a bug, it's fine to submit a pull request right away but
make sure it contains a clear and concise description of said bug.

## Semantic Versioning

Motion Canvas follows [semantic versioning][semver].
Due to [the limitations of `semantic-release`][semantic-release] the major
version is not set to zero. Nevertheless, Motion Canvas is still in early
development and breaking changes are very much expected and welcome. Before
the public release to npm, the version will be reset back to `1.0.0`.

## Making a Pull Request

1. Fork the motion-canvas/core repo.
2. In your forked repo, create a new branch for your changes:
   ```shell
   git checkout -b my-fix-branch master
   ```
3. Update the code.
4. Format your code with prettier (`npm run prettier:fix`).
5. Make sure your code lints (`npm run lint:fix`)
6. Commit your changes using a descriptive commit message that follows
   [Angular Commit Message Conventions][commit-format].
   ```shell
   git commit --all
   ```
7. Push your branch to GitHub:
   ```shell
   git push origin my-fix-branch
   ```
8. In GitHub, send a pull request to [the master branch][master].

### Addressing review feedback

1. Make required updates to the code.
2. Rerun prettier and eslint.
3. Create a fixup commit and push it to your GitHub repo:
   ```shell
   git commit --all --fixup HEAD
   git push
   ```

## Attribution

This Contribution Guide was partially inspired by [React][react] and
[Angular][angular].

[semver]: https://semver.org/
[discord]: https://www.patreon.com/posts/53003221
[semantic-release]: https://semantic-release.gitbook.io/semantic-release/support/faq#can-i-set-the-initial-release-version-of-my-package-to-0.0.1
[master]: https://github.com/aarthificial/motion-canvas/tree/master
[issues]: https://github.com/motion-canvas/core/issues
[new-issue]: https://github.com/motion-canvas/core/issues/new/choose
[new-feature]: https://github.com/motion-canvas/core/issues/new?template=feature_request.md
[commit-format]: https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit
[angular]: https://github.com/angular/angular/blob/main/CONTRIBUTING.md
[react]: https://reactjs.org/docs/how-to-contribute.html
