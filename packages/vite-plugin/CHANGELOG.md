# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.1.0](https://github.com/motion-canvas/motion-canvas/compare/v2.0.0...v2.1.0) (2023-02-07)


### Bug Fixes

* **vite-plugin:** add missing headers to html ([#219](https://github.com/motion-canvas/motion-canvas/issues/219)) ([2552bcf](https://github.com/motion-canvas/motion-canvas/commit/2552bcfbe2e90f3d4b86810d39f8cee24349e405)), closes [#201](https://github.com/motion-canvas/motion-canvas/issues/201)





# 2.0.0 (2023-02-04)


### Code Refactoring

* remove legacy package ([6a84120](https://github.com/motion-canvas/motion-canvas/commit/6a84120d949a32dff0ad413a9f359510ff109af1))


### Features

* add markdown logs ([#138](https://github.com/motion-canvas/motion-canvas/issues/138)) ([e42447a](https://github.com/motion-canvas/motion-canvas/commit/e42447a0c07a8192c06d21c5f1801f0266279075))
* add rendering again ([#43](https://github.com/motion-canvas/motion-canvas/issues/43)) ([c10d3db](https://github.com/motion-canvas/motion-canvas/commit/c10d3dbb63f6248eda04128ef0aa9d72c1edfcf7))
* add scaffolding package ([#36](https://github.com/motion-canvas/motion-canvas/issues/36)) ([266a561](https://github.com/motion-canvas/motion-canvas/commit/266a561c619b57b403ec9c64185985b48bff29da)), closes [#30](https://github.com/motion-canvas/motion-canvas/issues/30)
* detect circular signal dependencies ([#129](https://github.com/motion-canvas/motion-canvas/issues/129)) ([6fcdb41](https://github.com/motion-canvas/motion-canvas/commit/6fcdb41df90dca1c39537a4f6d4960ab551f4d6e))
* extract konva to separate package ([#60](https://github.com/motion-canvas/motion-canvas/issues/60)) ([4ecad3c](https://github.com/motion-canvas/motion-canvas/commit/4ecad3ca2732bd5147af670c230f8f959129a707))
* make exporting concurrent ([4f9ef8d](https://github.com/motion-canvas/motion-canvas/commit/4f9ef8d40d9d9c1147e2edfc0766c5ea5cc4297c))
* make scenes independent of names ([#53](https://github.com/motion-canvas/motion-canvas/issues/53)) ([417617e](https://github.com/motion-canvas/motion-canvas/commit/417617eb5f0af771e7413c9ce4c7e9b998e3e490)), closes [#25](https://github.com/motion-canvas/motion-canvas/issues/25)
* navigate to scene and node source ([#144](https://github.com/motion-canvas/motion-canvas/issues/144)) ([86d495d](https://github.com/motion-canvas/motion-canvas/commit/86d495d01a9f8f0a58e676fedb6df9c12a14d14a))
* support for multiple projects ([#57](https://github.com/motion-canvas/motion-canvas/issues/57)) ([573752d](https://github.com/motion-canvas/motion-canvas/commit/573752dd4d79d62a1a30958f1ed550d2cf22c344)), closes [#141414](https://github.com/motion-canvas/motion-canvas/issues/141414)
* support multiple players ([#128](https://github.com/motion-canvas/motion-canvas/issues/128)) ([24f75cf](https://github.com/motion-canvas/motion-canvas/commit/24f75cf7cdaf38f890e3936edf175afbfd340210))
* switch to Vite ([#28](https://github.com/motion-canvas/motion-canvas/issues/28)) ([65b9133](https://github.com/motion-canvas/motion-canvas/commit/65b91337dbc47fe51cecc83657f79fab15343a0d)), closes [#141414](https://github.com/motion-canvas/motion-canvas/issues/141414) [#13](https://github.com/motion-canvas/motion-canvas/issues/13)
* **vite-plugin:** improve audio handling ([#154](https://github.com/motion-canvas/motion-canvas/issues/154)) ([482f144](https://github.com/motion-canvas/motion-canvas/commit/482f14447ae54543346fab0f9e5b94631c5cfd4d))


### Reverts

* "ci(release): 9.1.3 [skip ci]" ([62953a6](https://github.com/motion-canvas/motion-canvas/commit/62953a6a8a1b1da3eb2e5f51c9fe60c716d6b94b))
* ci(release): 1.0.1 [skip ci] ([#175](https://github.com/motion-canvas/motion-canvas/issues/175)) ([161a046](https://github.com/motion-canvas/motion-canvas/commit/161a04647ecdc8203daf2d887a6a44c79a92ee20))
* ci(release): 2.0.0 [skip ci] ([#176](https://github.com/motion-canvas/motion-canvas/issues/176)) ([551096b](https://github.com/motion-canvas/motion-canvas/commit/551096bf636a791ea7c7c1d38d8e03c360433008))


### BREAKING CHANGES

* remove legacy package
* change to import paths

See [the migration guide](https://motion-canvas.github.io/guides/migration/12.0.0) for more info.
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
