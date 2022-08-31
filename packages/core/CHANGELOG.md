# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [12.0.0-alpha.0](https://github.com/motion-canvas/motion-canvas/compare/v11.1.0...v12.0.0-alpha.0) (2022-08-31)


### Features

* extract konva to separate package ([#60](https://github.com/motion-canvas/motion-canvas/issues/60)) ([4ecad3c](https://github.com/motion-canvas/motion-canvas/commit/4ecad3ca2732bd5147af670c230f8f959129a707))


### BREAKING CHANGES

* change to import paths

See [the migration guide](https://motion-canvas.github.io/guides/migration/12.0.0) for more info.





# [11.1.0](https://github.com/motion-canvas/motion-canvas/compare/v11.1.0-alpha.0...v11.1.0) (2022-08-29)

**Note:** Version bump only for package @motion-canvas/core





# [11.1.0-alpha.0](https://github.com/motion-canvas/motion-canvas/compare/v11.0.0...v11.1.0-alpha.0) (2022-08-29)


### Features

* support for multiple projects ([#57](https://github.com/motion-canvas/motion-canvas/issues/57)) ([573752d](https://github.com/motion-canvas/motion-canvas/commit/573752dd4d79d62a1a30958f1ed550d2cf22c344)), closes [#141414](https://github.com/motion-canvas/motion-canvas/issues/141414)





# [11.0.0](https://github.com/motion-canvas/motion-canvas/compare/v11.0.0-alpha.0...v11.0.0) (2022-08-26)

**Note:** Version bump only for package @motion-canvas/core





# [11.0.0-alpha.0](https://github.com/motion-canvas/motion-canvas/compare/v10.2.0...v11.0.0-alpha.0) (2022-08-26)


### Features

* make scenes independent of names ([#53](https://github.com/motion-canvas/motion-canvas/issues/53)) ([417617e](https://github.com/motion-canvas/motion-canvas/commit/417617eb5f0af771e7413c9ce4c7e9b998e3e490)), closes [#25](https://github.com/motion-canvas/motion-canvas/issues/25)


### BREAKING CHANGES

* change the way scenes are imported

Scene files no longer need to follow the pattern: `[name].scene.tsx`.
When importing scenes in the project file, a dedicated `?scene` query param should be used:
```ts
import example from './scenes/example?scene';

export default new Project({
  name: 'project',
  scenes: [example],
});
```





# [10.2.0](https://github.com/motion-canvas/motion-canvas/compare/v10.1.0...v10.2.0) (2022-08-25)


### Bug Fixes

* **core:** keep falsy values with deepTween ([#45](https://github.com/motion-canvas/motion-canvas/issues/45)) ([93c934f](https://github.com/motion-canvas/motion-canvas/commit/93c934f9b59462581267cca5033bf132b831ce54))


### Features

* added file type and quality options to rendering panel ([#50](https://github.com/motion-canvas/motion-canvas/issues/50)) ([bee71ef](https://github.com/motion-canvas/motion-canvas/commit/bee71ef2673c269db47a4433831720b7ad0fb4e8)), closes [#24](https://github.com/motion-canvas/motion-canvas/issues/24)
* **core:** add configurable line numbers ([#44](https://github.com/motion-canvas/motion-canvas/issues/44)) ([831334c](https://github.com/motion-canvas/motion-canvas/commit/831334ca32a504991e875af37446fef4f055c285)), closes [#12](https://github.com/motion-canvas/motion-canvas/issues/12)





# [10.1.0](https://github.com/motion-canvas/motion-canvas/compare/v10.0.2...v10.1.0) (2022-08-15)


### Features

* add rendering again ([#43](https://github.com/motion-canvas/motion-canvas/issues/43)) ([c10d3db](https://github.com/motion-canvas/motion-canvas/commit/c10d3dbb63f6248eda04128ef0aa9d72c1edfcf7))





## [10.0.2](https://github.com/motion-canvas/motion-canvas/compare/v10.0.1...v10.0.2) (2022-08-15)


### Bug Fixes

* **core:** add missing type references ([#41](https://github.com/motion-canvas/motion-canvas/issues/41)) ([325c244](https://github.com/motion-canvas/motion-canvas/commit/325c2442814ca19407fe0060a819aded4456f90e))





# [10.0.0](https://github.com/motion-canvas/motion-canvas/compare/v9.1.2...v10.0.0) (2022-08-14)


### Features

* add scaffolding package ([#36](https://github.com/motion-canvas/motion-canvas/issues/36)) ([266a561](https://github.com/motion-canvas/motion-canvas/commit/266a561c619b57b403ec9c64185985b48bff29da)), closes [#30](https://github.com/motion-canvas/motion-canvas/issues/30)
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
