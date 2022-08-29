# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [11.1.0](https://github.com/motion-canvas/motion-canvas/compare/v11.1.0-alpha.0...v11.1.0) (2022-08-29)

**Note:** Version bump only for package @motion-canvas/ui





# [11.1.0-alpha.0](https://github.com/motion-canvas/motion-canvas/compare/v11.0.0...v11.1.0-alpha.0) (2022-08-29)


### Features

* support for multiple projects ([#57](https://github.com/motion-canvas/motion-canvas/issues/57)) ([573752d](https://github.com/motion-canvas/motion-canvas/commit/573752dd4d79d62a1a30958f1ed550d2cf22c344)), closes [#141414](https://github.com/motion-canvas/motion-canvas/issues/141414)





# [11.0.0](https://github.com/motion-canvas/motion-canvas/compare/v11.0.0-alpha.0...v11.0.0) (2022-08-26)

**Note:** Version bump only for package @motion-canvas/ui





# [11.0.0-alpha.0](https://github.com/motion-canvas/motion-canvas/compare/v10.2.0...v11.0.0-alpha.0) (2022-08-26)

**Note:** Version bump only for package @motion-canvas/ui





# [10.2.0](https://github.com/motion-canvas/motion-canvas/compare/v10.1.0...v10.2.0) (2022-08-25)


### Features

* added file type and quality options to rendering panel ([#50](https://github.com/motion-canvas/motion-canvas/issues/50)) ([bee71ef](https://github.com/motion-canvas/motion-canvas/commit/bee71ef2673c269db47a4433831720b7ad0fb4e8)), closes [#24](https://github.com/motion-canvas/motion-canvas/issues/24)
* **ui:** timeline overhaul ([#47](https://github.com/motion-canvas/motion-canvas/issues/47)) ([4232a60](https://github.com/motion-canvas/motion-canvas/commit/4232a6072540b54451e99e18c1001db0175bb93f)), closes [#20](https://github.com/motion-canvas/motion-canvas/issues/20)





# [10.1.0](https://github.com/motion-canvas/motion-canvas/compare/v10.0.2...v10.1.0) (2022-08-15)


### Features

* add rendering again ([#43](https://github.com/motion-canvas/motion-canvas/issues/43)) ([c10d3db](https://github.com/motion-canvas/motion-canvas/commit/c10d3dbb63f6248eda04128ef0aa9d72c1edfcf7))





## [10.0.2](https://github.com/motion-canvas/motion-canvas/compare/v10.0.1...v10.0.2) (2022-08-15)

**Note:** Version bump only for package @motion-canvas/ui





# [10.0.0](https://github.com/motion-canvas/motion-canvas/compare/v9.1.2...v10.0.0) (2022-08-14)


### Features

* switch to Vite ([#28](https://github.com/motion-canvas/motion-canvas/issues/28)) ([65b9133](https://github.com/motion-canvas/motion-canvas/commit/65b91337dbc47fe51cecc83657f79fab15343a0d)), closes [#141414](https://github.com/motion-canvas/motion-canvas/issues/141414) [#13](https://github.com/motion-canvas/motion-canvas/issues/13)


### Reverts

* "ci(release): 9.1.3 [skip ci]" ([62953a6](https://github.com/motion-canvas/motion-canvas/commit/62953a6a8a1b1da3eb2e5f51c9fe60c716d6b94b))


### BREAKING CHANGES

* change the overall structure of a project

`vite` and `@motion-canvas/vite-plugin` packages are now required to build a project:
```
npm i -D vite @motion-canvas/vite-plugin
```
The following `vite.config.ts` file needs to be created in the root of the project:
```ts
import {defineConfig} from 'vite';
import motionCanvas from '@motion-canvas/vite-plugin';

export default defineConfig({
  plugins: [motionCanvas()],
});
```

Types exposed by Motion Canvas are no longer global.
An additional `motion-canvas.d.ts` file needs to be created in the `src` directory:
```ts
/// <reference types="@motion-canvas/core/project" />
```

 Finally, the `bootstrap` function no longer exists.
 Project files should export an instance of the `Project` class instead:
 ```ts
 import {Project} from '@motion-canvas/core/lib';

 import example from './scenes/example.scene';

 export default new Project({
   name: 'project',
   scenes: [example],
   // same options as in bootstrap() are available:





## 9.1.2 (2022-08-06)


### Bug Fixes

* **ui:** don't seek when editing time events ([#26](https://github.com/motion-canvas/motion-canvas/issues/26)) ([524c200](https://github.com/motion-canvas/motion-canvas/commit/524c200ef1bd6a6f52096d04c2aeed24a24cda6f))





## 9.1.1 (2022-08-03)


### Bug Fixes

* **ui:** downgrade preact ([#1](https://github.com/motion-canvas/motion-canvas/issues/1)) ([5f7456f](https://github.com/motion-canvas/motion-canvas/commit/5f7456fe4c5a1cc76ccd8fed5a6f9a8a4e846d27))





# 9.1.0 (2022-08-03)


### Features

* merge with ui ([5fe2407](https://github.com/motion-canvas/motion-canvas/commit/5fe2407923e1a53691b753f952d7977a85fccbf6))
