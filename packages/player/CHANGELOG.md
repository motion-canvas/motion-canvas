# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 4.0.0 (2026-09-15)

### Bug Fixes

* use correct scene sizes ([#146](https://github.com/motion-canvas/motion-canvas/issues/146)) ([f279638](https://github.com/motion-canvas/motion-canvas/commit/f279638f9ad7ed1f4c44900d48c10c2d6560946e))

### Features

* animation player ([#92](https://github.com/motion-canvas/motion-canvas/issues/92)) ([8155118](https://github.com/motion-canvas/motion-canvas/commit/8155118eb13dc2a8b422b81aabacc923ce2f919b))
* expose parts of player to outside of shadow root ([#956](https://github.com/motion-canvas/motion-canvas/issues/956)) ([c996d39](https://github.com/motion-canvas/motion-canvas/commit/c996d394dda9ba8c6a32f0360bf09e722ec15b0e)), closes [#950](https://github.com/motion-canvas/motion-canvas/issues/950)
* new playback architecture ([#402](https://github.com/motion-canvas/motion-canvas/issues/402)), closes [#166](https://github.com/motion-canvas/motion-canvas/issues/166)
* **player:** add auto mode ([c107259](https://github.com/motion-canvas/motion-canvas/commit/c107259f7c2a3886ccfe4ca0140d13064aed238f))
* **player:** improve accessibility ([0fc9235](https://github.com/motion-canvas/motion-canvas/commit/0fc923576e7b12f9bc799f3a4e861861d49a2406))
* project variables ([#255](https://github.com/motion-canvas/motion-canvas/issues/255)) ([4883295](https://github.com/motion-canvas/motion-canvas/commit/488329525939928af52b4a4d8488f1e1cd4cf6f7))
* support multiple players ([#128](https://github.com/motion-canvas/motion-canvas/issues/128)) ([24f75cf](https://github.com/motion-canvas/motion-canvas/commit/24f75cf7cdaf38f890e3936edf175afbfd340210))

### Reverts

* ci(release): 1.0.1 [skip ci] ([#175](https://github.com/motion-canvas/motion-canvas/issues/175)) ([161a046](https://github.com/motion-canvas/motion-canvas/commit/161a04647ecdc8203daf2d887a6a44c79a92ee20))
* ci(release): 2.0.0 [skip ci] ([#176](https://github.com/motion-canvas/motion-canvas/issues/176)) ([551096b](https://github.com/motion-canvas/motion-canvas/commit/551096bf636a791ea7c7c1d38d8e03c360433008))

### BREAKING CHANGES

* `makeProject` no longer accepts some settings.

  Settings such as `background` and `audioOffset` are now stored in the project
  meta file.


## Unreleased

### Build System

* upgrade `sass` from `^1.58.0` to `^1.104.1`

  The player's devDependency moves to the registry `latest` (uninstall
  first, then `npm add -D sass@latest`, then `npm dedupe`), aligning it
  with `packages/ui` on a single hoisted copy. `sass` is the optional
  preprocessor peer of the player's `vite@4.5.0`; 1.104.1 raises the
  engine floor to `>=20.19.0` and brings the new
  `chokidar@5.0.0` / `readdirp@5.1.1`, `immutable@5.1.9` and optional
  prebuilt `@parcel/watcher@2.6.0` subtree.

  Vite still calls sass through the legacy `render()` API, which has
  emitted a `legacy-js-api` deprecation warning per compiled file since
  sass 1.79.0; `packages/player/vite.config.ts` (like `packages/ui`)
  now silences it with
  `css.preprocessorOptions.scss.silenceDeprecations:
  ['legacy-js-api']` (supported by the legacy API since sass 1.78,
  removable once the toolchain uses the modern API). No stylesheets or
  source files changed. Verified with `npm run player:build` (zero
  deprecation warnings), `npm run template:build`, the e2e suite and
  the repo-wide lint/prettier checks.

* migrate the player build to Vite 8

  The player's `vite.config.ts` is consumed by the workspace-hoisted
  `vite@8.3.0` (the root devDependency moved from `^4.5.0` to
  `^8.3.0`; see the root CHANGELOG). Two config changes:

  - `build.rollupOptions` -> `build.rolldownOptions`: Vite 8 uses
    Rolldown and renamed the option; the
    `external: ['@motion-canvas/core']` entry is unaffected.
  - the `css.preprocessorOptions.scss.silenceDeprecations:
    ['legacy-js-api']` block is removed. Vite 6+ drives Dart Sass
    through the modern API and Vite 7 removed the legacy API, so the
    suppression added with the sass 1.104.1 upgrade is void and the
    build is warning-free without it.

  The config stays `.ts` (the player package is `"type": "module"`, so
  it already loads as ESM), the web-component output (`dist/main.js`,
  `format: 'es'`) and the virtual-template `load` hook are unchanged.

  Verified: `npm run player:build` (`tsc && vite build`),
  `npm run template:build`, `timeout 60s npm run core:test` /
  `2d:test`, `npm run e2e:test -- run`, `npx eslint "**/*.ts?(x)"` and
  `npm run prettier` (all clean).

## [3.17.2](https://github.com/motion-canvas/motion-canvas/compare/v3.17.1...v3.17.2) (2024-12-14)

**Note:** Version bump only for package @motion-canvas/player





# [3.17.0](https://github.com/motion-canvas/motion-canvas/compare/v3.16.0...v3.17.0) (2024-08-13)

**Note:** Version bump only for package @motion-canvas/player





# [3.16.0](https://github.com/motion-canvas/motion-canvas/compare/v3.15.2...v3.16.0) (2024-05-16)

**Note:** Version bump only for package @motion-canvas/player





## [3.15.2](https://github.com/motion-canvas/motion-canvas/compare/v3.15.1...v3.15.2) (2024-04-02)

**Note:** Version bump only for package @motion-canvas/player





## [3.15.1](https://github.com/motion-canvas/motion-canvas/compare/v3.15.0...v3.15.1) (2024-03-21)

**Note:** Version bump only for package @motion-canvas/player





# [3.15.0](https://github.com/motion-canvas/motion-canvas/compare/v3.14.2...v3.15.0) (2024-03-21)


### Features

* expose parts of player to outside of shadow root ([#956](https://github.com/motion-canvas/motion-canvas/issues/956)) ([c996d39](https://github.com/motion-canvas/motion-canvas/commit/c996d394dda9ba8c6a32f0360bf09e722ec15b0e)), closes [#950](https://github.com/motion-canvas/motion-canvas/issues/950)





## [3.14.1](https://github.com/motion-canvas/motion-canvas/compare/v3.14.0...v3.14.1) (2024-02-06)

**Note:** Version bump only for package @motion-canvas/player





# [3.14.0](https://github.com/motion-canvas/motion-canvas/compare/v3.13.0...v3.14.0) (2024-02-04)

**Note:** Version bump only for package @motion-canvas/player





# [3.13.0](https://github.com/motion-canvas/motion-canvas/compare/v3.12.4...v3.13.0) (2024-01-10)

**Note:** Version bump only for package @motion-canvas/player





## [3.12.1](https://github.com/motion-canvas/motion-canvas/compare/v3.12.0...v3.12.1) (2023-12-31)

**Note:** Version bump only for package @motion-canvas/player





# [3.12.0](https://github.com/motion-canvas/motion-canvas/compare/v3.11.0...v3.12.0) (2023-12-31)

**Note:** Version bump only for package @motion-canvas/player





# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.11.0](https://github.com/motion-canvas/motion-canvas/compare/v3.10.1...v3.11.0) (2023-10-13)

**Note:** Version bump only for package @motion-canvas/player

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.10.0](https://github.com/motion-canvas/motion-canvas/compare/v3.9.0...v3.10.0) (2023-07-23)

**Note:** Version bump only for package @motion-canvas/player

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.9.0](https://github.com/motion-canvas/motion-canvas/compare/v3.8.0...v3.9.0) (2023-05-29)

**Note:** Version bump only for package @motion-canvas/player

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.8.0](https://github.com/motion-canvas/motion-canvas/compare/v3.7.0...v3.8.0) (2023-05-13)

**Note:** Version bump only for package @motion-canvas/player

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.7.0](https://github.com/motion-canvas/motion-canvas/compare/v3.6.2...v3.7.0) (2023-05-10)

**Note:** Version bump only for package @motion-canvas/player

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.6.1](https://github.com/motion-canvas/motion-canvas/compare/v3.6.0...v3.6.1) (2023-05-08)

**Note:** Version bump only for package @motion-canvas/player

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.6.0](https://github.com/motion-canvas/motion-canvas/compare/v3.5.1...v3.6.0) (2023-05-08)

**Note:** Version bump only for package @motion-canvas/player

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.4.0](https://github.com/motion-canvas/motion-canvas/compare/v3.3.4...v3.4.0) (2023-03-28)

**Note:** Version bump only for package @motion-canvas/player

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.3.4](https://github.com/motion-canvas/motion-canvas/compare/v3.3.3...v3.3.4) (2023-03-19)

**Note:** Version bump only for package @motion-canvas/player

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.3.0](https://github.com/motion-canvas/motion-canvas/compare/v3.2.1...v3.3.0) (2023-03-18)

**Note:** Version bump only for package @motion-canvas/player

# [3.2.0](https://github.com/motion-canvas/motion-canvas/compare/v3.1.0...v3.2.0) (2023-03-10)

**Note:** Version bump only for package @motion-canvas/player

# [3.1.0](https://github.com/motion-canvas/motion-canvas/compare/v3.0.2...v3.1.0) (2023-03-07)

**Note:** Version bump only for package @motion-canvas/player

# [3.0.0](https://github.com/motion-canvas/motion-canvas/compare/v2.6.0...v3.0.0) (2023-02-27)

### Features

- new playback architecture
  ([#402](https://github.com/motion-canvas/motion-canvas/issues/402))
  ([bbe3e2a](https://github.com/motion-canvas/motion-canvas/commit/bbe3e2a24de068a88f49ed7a2f13e9717039733b)),
  closes [#166](https://github.com/motion-canvas/motion-canvas/issues/166)

### BREAKING CHANGES

- `makeProject` no longer accepts some settings.

Settings such as `background` and `audioOffset` are now stored in the project
meta file.

# [2.6.0](https://github.com/motion-canvas/motion-canvas/compare/v2.5.0...v2.6.0) (2023-02-24)

**Note:** Version bump only for package @motion-canvas/player

# [2.5.0](https://github.com/motion-canvas/motion-canvas/compare/v2.4.0...v2.5.0) (2023-02-20)

**Note:** Version bump only for package @motion-canvas/player

# [2.4.0](https://github.com/motion-canvas/motion-canvas/compare/v2.3.0...v2.4.0) (2023-02-18)

**Note:** Version bump only for package @motion-canvas/player

# [2.3.0](https://github.com/motion-canvas/motion-canvas/compare/v2.2.0...v2.3.0) (2023-02-11)

**Note:** Version bump only for package @motion-canvas/player

# [2.2.0](https://github.com/motion-canvas/motion-canvas/compare/v2.1.0...v2.2.0) (2023-02-09)

### Features

- project variables
  ([#255](https://github.com/motion-canvas/motion-canvas/issues/255))
  ([4883295](https://github.com/motion-canvas/motion-canvas/commit/488329525939928af52b4a4d8488f1e1cd4cf6f7))

# [2.1.0](https://github.com/motion-canvas/motion-canvas/compare/v2.0.0...v2.1.0) (2023-02-07)

**Note:** Version bump only for package @motion-canvas/player

# 2.0.0 (2023-02-04)

### Bug Fixes

- use correct scene sizes
  ([#146](https://github.com/motion-canvas/motion-canvas/issues/146))
  ([f279638](https://github.com/motion-canvas/motion-canvas/commit/f279638f9ad7ed1f4c44900d48c10c2d6560946e))

### Features

- animation player
  ([#92](https://github.com/motion-canvas/motion-canvas/issues/92))
  ([8155118](https://github.com/motion-canvas/motion-canvas/commit/8155118eb13dc2a8b422b81aabacc923ce2f919b))
- **player:** add auto mode
  ([c107259](https://github.com/motion-canvas/motion-canvas/commit/c107259f7c2a3886ccfe4ca0140d13064aed238f))
- **player:** improve accessibility
  ([0fc9235](https://github.com/motion-canvas/motion-canvas/commit/0fc923576e7b12f9bc799f3a4e861861d49a2406))
- support multiple players
  ([#128](https://github.com/motion-canvas/motion-canvas/issues/128))
  ([24f75cf](https://github.com/motion-canvas/motion-canvas/commit/24f75cf7cdaf38f890e3936edf175afbfd340210))

### Reverts

- ci(release): 1.0.1 [skip ci]
  ([#175](https://github.com/motion-canvas/motion-canvas/issues/175))
  ([161a046](https://github.com/motion-canvas/motion-canvas/commit/161a04647ecdc8203daf2d887a6a44c79a92ee20))
- ci(release): 2.0.0 [skip ci]
  ([#176](https://github.com/motion-canvas/motion-canvas/issues/176))
  ([551096b](https://github.com/motion-canvas/motion-canvas/commit/551096bf636a791ea7c7c1d38d8e03c360433008))
