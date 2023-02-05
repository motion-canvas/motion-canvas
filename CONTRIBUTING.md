# Contributing to Motion Canvas

This is an initial version of the Contribution Guide. Feel free to discuss it
and suggest any changes on [our discord server][discord].

## Code of Conduct

Before contributing to the project, please read our
[Code of Conduct](./CODE_OF_CONDUCT.md).

## Reporting a bug

Before you submit an issue, please search [the issue tracker][issues]. An issue
for your problem might already exist and the discussion might inform you of
workarounds readily available.

You can file new issues by [selecting an issue template][new-issue] and filling
out the necessary information.

## Proposing a Change

If you intend to change the public API, or make any non-trivial changes to the
implementation, make sure to [create an issue][new-feature] first. This will let
us discuss a proposal before you put significant effort into it. After a
proposal has been discussed it may receive the [accepted][label-accepted] label
indicating that it's ready to be implemented.

If you're only fixing a bug, it's fine to submit a pull request right away
without creating an issue but make sure it contains a clear and concise
description of said bug.

## Working on Issues

Before you start working on an issue make sure that no one is assigned to it.
Otherwise, you may duplicate other people's efforts. If somebody claims an issue
but doesn't follow up for more than two weeks, it’s fine to take it over, but
you should still leave a comment. You should also assign yourself to any issue
you're working on, to let others know.

## Semantic Versioning

Motion Canvas follows [semantic versioning][semver].

## Making a Pull Request

1. Fork the motion-canvas/core repo.
2. In your forked repo, create a new branch for your changes:
   ```shell
   git checkout -b my-fix-branch master
   ```
3. Update the code.
4. Commit your changes using a **descriptive commit message** that follows
   [Angular Commit Message Conventions][commit-format].
   ```shell
   git commit --all
   ```
5. Push your branch to GitHub:
   ```shell
   git push origin my-fix-branch
   ```
6. In GitHub, send a pull request to [the main branch][main] and **request a
   review** from [aarthificial](https://github.com/aarthificial).

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
[discord]: https://discord.gg/XnnWTrHYAW
[semantic-release]:
  https://semantic-release.gitbook.io/semantic-release/support/faq#can-i-set-the-initial-release-version-of-my-package-to-0.0.1
[main]: https://github.com/motion-canvas/motion-canvas/tree/main
[issues]: https://github.com/motion-canvas/motion-canvas/issues
[new-issue]: https://github.com/motion-canvas/motion-canvas/issues/new/choose
[new-feature]:
  https://github.com/motion-canvas/motion-canvas/issues/new?template=feature_request.md
[commit-format]:
  https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit
[angular]: https://github.com/angular/angular/blob/main/CONTRIBUTING.md
[react]: https://reactjs.org/docs/how-to-contribute.html
[label-accepted]: https://github.com/motion-canvas/motion-canvas/labels/accepted
