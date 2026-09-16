# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 4.0.0 (2026-09-15)

### Bug Fixes

* exclude preact from optimizations ([#894](https://github.com/motion-canvas/motion-canvas/issues/894)) ([15687cc](https://github.com/motion-canvas/motion-canvas/commit/15687cc975abcf4538a5ce51402d2308057d42e5))
* fix dependency bundling ([#897](https://github.com/motion-canvas/motion-canvas/issues/897)) ([5376012](https://github.com/motion-canvas/motion-canvas/commit/5376012cd02b8bca5abc2d3cf5a724662244c449))
* fix dependency bundling again ([#898](https://github.com/motion-canvas/motion-canvas/issues/898)) ([d6e0f48](https://github.com/motion-canvas/motion-canvas/commit/d6e0f48e67cf6baee710b8d5b185e620e67ceda5))
* fix project selection screen ([#938](https://github.com/motion-canvas/motion-canvas/issues/938)) ([3b3f287](https://github.com/motion-canvas/motion-canvas/commit/3b3f2871d9884c67f7d46215dd12fc02e27f8054))
* optimize saving frames to disk ([#1007](https://github.com/motion-canvas/motion-canvas/issues/1007)) ([d79af91](https://github.com/motion-canvas/motion-canvas/commit/d79af91a4caa5bcf3ca98ec3a4b6d892c29c7fd9))
* remove dependency pre-bundling warning ([#676](https://github.com/motion-canvas/motion-canvas/issues/676)) ([38c81ff](https://github.com/motion-canvas/motion-canvas/commit/38c81ffa5ea0ef2d2beec9d015896f5873629d74))
* **vite-plugin, ui:** project file path on selection ([#1090](https://github.com/motion-canvas/motion-canvas/issues/1090)) ([f15b375](https://github.com/motion-canvas/motion-canvas/commit/f15b3753d47bcca8cd2d3f213f5624cf5e54142d))
* **vite-plugin:** add missing headers to html ([#219](https://github.com/motion-canvas/motion-canvas/issues/219)) ([2552bcf](https://github.com/motion-canvas/motion-canvas/commit/2552bcfbe2e90f3d4b86810d39f8cee24349e405)), closes [#201](https://github.com/motion-canvas/motion-canvas/issues/201)
* **vite-plugin:** can't assign port ([#538](https://github.com/motion-canvas/motion-canvas/issues/538)) ([61b692b](https://github.com/motion-canvas/motion-canvas/commit/61b692bf97bb7e15d31469ada2e3dda84c2b99f8))
* **vite-plugin:** create empty output directory if not exist ([#787](https://github.com/motion-canvas/motion-canvas/issues/787)) ([20cceef](https://github.com/motion-canvas/motion-canvas/commit/20cceef8525e809bff9706fcd7082d7e103a085b))
* **vite-plugin:** handle unusual characters in file names ([#821](https://github.com/motion-canvas/motion-canvas/issues/821)) ([1e57497](https://github.com/motion-canvas/motion-canvas/commit/1e5749785d55a41605a5438eee08672ef01f3914)), closes [#764](https://github.com/motion-canvas/motion-canvas/issues/764)
* **vite-plugin:** ignore query param in devserver ([#351](https://github.com/motion-canvas/motion-canvas/issues/351)) ([5644d72](https://github.com/motion-canvas/motion-canvas/commit/5644d72d36adcdc817f0856aaff0be5507338cb8))

### Code Refactoring

* remove legacy package ([6a84120](https://github.com/motion-canvas/motion-canvas/commit/6a84120d949a32dff0ad413a9f359510ff109af1))

### Features

* add markdown logs ([#138](https://github.com/motion-canvas/motion-canvas/issues/138)) ([e42447a](https://github.com/motion-canvas/motion-canvas/commit/e42447a0c07a8192c06d21c5f1801f0266279075))
* add new hooks for plugins ([#679](https://github.com/motion-canvas/motion-canvas/issues/679)) ([74e18bc](https://github.com/motion-canvas/motion-canvas/commit/74e18bce71abd7e26a6415240603241b48cb36c2))
* add option to group output by scenes ([#477](https://github.com/motion-canvas/motion-canvas/issues/477)) ([9934593](https://github.com/motion-canvas/motion-canvas/commit/99345937e7ac92fb674fdee10288e467ffd941e2))
* add rendering again ([#43](https://github.com/motion-canvas/motion-canvas/issues/43)) ([c10d3db](https://github.com/motion-canvas/motion-canvas/commit/c10d3dbb63f6248eda04128ef0aa9d72c1edfcf7))
* add scaffolding package ([#36](https://github.com/motion-canvas/motion-canvas/issues/36)) ([266a561](https://github.com/motion-canvas/motion-canvas/commit/266a561c619b57b403ec9c64185985b48bff29da)), closes [#30](https://github.com/motion-canvas/motion-canvas/issues/30)
* application settings ([#697](https://github.com/motion-canvas/motion-canvas/issues/697)) ([54016f5](https://github.com/motion-canvas/motion-canvas/commit/54016f5cf3500abe13a217537307a3735d60f536)), closes [#167](https://github.com/motion-canvas/motion-canvas/issues/167)
* button for opening the output directory ([#663](https://github.com/motion-canvas/motion-canvas/issues/663)) ([79f320c](https://github.com/motion-canvas/motion-canvas/commit/79f320c07c422ca927b34bf339094fe0e70ffd0d))
* **core:** hot module replacement for audio ([#793](https://github.com/motion-canvas/motion-canvas/issues/793)) ([d40c1a8](https://github.com/motion-canvas/motion-canvas/commit/d40c1a83c645c8984cca1ebc6fe687b445a0550c))
* detect circular signal dependencies ([#129](https://github.com/motion-canvas/motion-canvas/issues/129)) ([6fcdb41](https://github.com/motion-canvas/motion-canvas/commit/6fcdb41df90dca1c39537a4f6d4960ab551f4d6e))
* display current package versions ([#501](https://github.com/motion-canvas/motion-canvas/issues/501)) ([2972f67](https://github.com/motion-canvas/motion-canvas/commit/2972f673e201310e69688ab6f2c1adf1cddf2bf3))
* extract konva to separate package ([#60](https://github.com/motion-canvas/motion-canvas/issues/60)) ([4ecad3c](https://github.com/motion-canvas/motion-canvas/commit/4ecad3ca2732bd5147af670c230f8f959129a707))
* finalize custom exporters ([#660](https://github.com/motion-canvas/motion-canvas/issues/660)) ([6a50430](https://github.com/motion-canvas/motion-canvas/commit/6a50430cdf9928992ca078eba39c484a5253da2b))
* get name from meta file ([#552](https://github.com/motion-canvas/motion-canvas/issues/552)) ([ae2ed8a](https://github.com/motion-canvas/motion-canvas/commit/ae2ed8a5998768f160ec340d8b63d600d27bc15c))
* make exporting concurrent ([4f9ef8d](https://github.com/motion-canvas/motion-canvas/commit/4f9ef8d40d9d9c1147e2edfc0766c5ea5cc4297c))
* make scenes independent of names ([#53](https://github.com/motion-canvas/motion-canvas/issues/53)), closes [#25](https://github.com/motion-canvas/motion-canvas/issues/25)
* navigate to scene and node source ([#144](https://github.com/motion-canvas/motion-canvas/issues/144)) ([86d495d](https://github.com/motion-canvas/motion-canvas/commit/86d495d01a9f8f0a58e676fedb6df9c12a14d14a))
* new playback architecture ([#402](https://github.com/motion-canvas/motion-canvas/issues/402)), closes [#166](https://github.com/motion-canvas/motion-canvas/issues/166)
* plugin architecture ([#564](https://github.com/motion-canvas/motion-canvas/issues/564)) ([1c375b8](https://github.com/motion-canvas/motion-canvas/commit/1c375b81e0af8a76467d42dd46a7031adb9d71d3))
* support for multiple projects ([#57](https://github.com/motion-canvas/motion-canvas/issues/57)) ([573752d](https://github.com/motion-canvas/motion-canvas/commit/573752dd4d79d62a1a30958f1ed550d2cf22c344))
* support multiple players ([#128](https://github.com/motion-canvas/motion-canvas/issues/128)) ([24f75cf](https://github.com/motion-canvas/motion-canvas/commit/24f75cf7cdaf38f890e3936edf175afbfd340210))
* switch to Vite ([#28](https://github.com/motion-canvas/motion-canvas/issues/28)), closes [#13](https://github.com/motion-canvas/motion-canvas/issues/13)
* update vite from v3 to v4 ([#495](https://github.com/motion-canvas/motion-canvas/issues/495)) ([c409eee](https://github.com/motion-canvas/motion-canvas/commit/c409eee0e61b67e43afed240c5ae279714681246)), closes [#197](https://github.com/motion-canvas/motion-canvas/issues/197)
* **vite-plugin:** add CORS Proxy ([#357](https://github.com/motion-canvas/motion-canvas/issues/357)) ([a3c5822](https://github.com/motion-canvas/motion-canvas/commit/a3c58228b7d3dab08fc27414d19870d35773b280)), closes [#338](https://github.com/motion-canvas/motion-canvas/issues/338)
* **vite-plugin:** add entry point ([#721](https://github.com/motion-canvas/motion-canvas/issues/721)) ([e634b6c](https://github.com/motion-canvas/motion-canvas/commit/e634b6cb67b3c569d21d424661708ca946ea4cc3))
* **vite-plugin:** improve audio handling ([#154](https://github.com/motion-canvas/motion-canvas/issues/154)) ([482f144](https://github.com/motion-canvas/motion-canvas/commit/482f14447ae54543346fab0f9e5b94631c5cfd4d))
* **vite-plugin:** let plugins override config ([#1054](https://github.com/motion-canvas/motion-canvas/issues/1054)) ([9b01eb5](https://github.com/motion-canvas/motion-canvas/commit/9b01eb58b746dd2b4019db2af32f5f3ec1f7b761))
* **vite-plugin:** support glob for project files ([#834](https://github.com/motion-canvas/motion-canvas/issues/834)) ([67029c4](https://github.com/motion-canvas/motion-canvas/commit/67029c4c2cf756cbe2b7ed59dc55cb895de81d52)), closes [#324](https://github.com/motion-canvas/motion-canvas/issues/324)
* webgl shaders ([#920](https://github.com/motion-canvas/motion-canvas/issues/920)) ([849216e](https://github.com/motion-canvas/motion-canvas/commit/849216ed34c4d29742c621b43a95ec4d99f8c755))

### Reverts

* "ci(release): 9.1.3 [skip ci]" ([62953a6](https://github.com/motion-canvas/motion-canvas/commit/62953a6a8a1b1da3eb2e5f51c9fe60c716d6b94b))
* ci(release): 1.0.1 [skip ci] ([#175](https://github.com/motion-canvas/motion-canvas/issues/175)) ([161a046](https://github.com/motion-canvas/motion-canvas/commit/161a04647ecdc8203daf2d887a6a44c79a92ee20))
* ci(release): 2.0.0 [skip ci] ([#176](https://github.com/motion-canvas/motion-canvas/issues/176)) ([551096b](https://github.com/motion-canvas/motion-canvas/commit/551096bf636a791ea7c7c1d38d8e03c360433008))

### BREAKING CHANGES

* `makeProject` no longer accepts some settings.

  Settings such as `background` and `audioOffset` are now stored in the project
  meta file.
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
     background: '#141414',
   });
   ```
  Including `import '@motion-canvas/core/lib/patches';` at the top of the project file is no longer necessary.
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
* change to import paths

  See [the migration guide](https://motion-canvas.github.io/guides/migration/12.0.0) for more info.
* remove legacy package


## Unreleased

### Build System

* upgrade `fast-glob` from `^3.3.1` to `^3.3.3`

  The project-glob expander behind `src/utils.ts`
  (`fg.isDynamicPattern()` and `fg.sync(path, {onlyFiles: true})`)
  moves to the registry `latest`, so this package, Docusaurus'
  `copy-webpack-plugin` / `globby` chain and the rest of the tree
  share a single hoisted copy. 3.3.2 fixes square-bracket escaping on
  Windows and escaping after brace expansion; 3.3.3 raises the
  `micromatch` floor to `^4.0.8` (which promotes the repo's hoisted
  `micromatch` from 4.0.7 to 4.0.8 — the ReDoS fix) and applies
  absolute negative patterns to the full path. The API used here is
  unchanged. Verified with the `tsc` build, `npm run examples:build`
  (the real glob consumer), the unit suites and the e2e rendering
  test.

* upgrade the MIME and source-map toolchain

  Four direct dependencies move to the registry `latest` (uninstall
  first, then `npm add` / `npm add -D` @ `latest`, then `npm dedupe`):

  - `mime-types` `^2.1.35` → `^3.0.2` (`src/partials/exporter.ts` uses
    `mime.extension(mimeType)` to name exported image sequences);
  - `source-map` `^0.6.1` → `^0.8.0` (`src/partials/webgl.ts` builds
    the GLSL `#include` source map from synchronous `SourceNode`s);
  - `@types/mime-types` `^2.1.1` → `^3.0.1` and
    `@types/follow-redirects` `^1.14.1` → `^1.14.4` (declarations-only
    refreshes; types for `mime-types` are still not bundled upstream).

  The runtime `follow-redirects` range is normalized from `^1.15.2` to
  `^1.16.0` (the already-installed copy) because npm 11.19.0's
  workspace uninstall of `@types/follow-redirects` also drops the
  runtime dependency from the manifest, so it had to be re-added.

  User-visible behavior change: `mime-types` 3.x resolves JPEG through
  `mime-db` 1.54.0's `["jpg", "jpeg", "jpe"]` ordering, so
  `extension('image/jpeg')` now yields `jpg` (was `jpeg`) and JPEG
  image sequences are written as `frame.jpg`. PNG and WEBP are
  unchanged. The public `mime-types` API used here is otherwise
  identical; 3.x only drops Node < 18, upgrades `mime-db` and switches
  extension-conflict resolution to the `mime-score` algorithm.

  `source-map` 0.7.x moved mappings encoding to WebAssembly and made
  `SourceMapConsumer` promise-based, but the synchronous
  `SourceNode` / `SourceMapGenerator` APIs used here are unchanged and
  keep working in Node (the wasm blob is read via `fs.readFileSync`);
  0.8.0 switches `SourceNode.sourceContents` to a null-prototype
  object and types `toJSON()` as `RawSourceMap`, which is why the
  `declare module 'source-map'` augmentation decorating the serialized
  map with `includeMap` is still required. The module's own
  `SourceNode.add` augmentation is redundant against the new upstream
  signatures but harmless.

  No source files were touched. Verified with the `tsc` build,
  `npx lerna run build`, `npm run examples:build`, the `core` / `2d`
  unit suites, `npm run e2e:test -- run`, `npm run ui:type`
  (`Found 0 errors`), `npx eslint "**/*.ts?(x)"` and
  `npm run prettier:fix` (no reflows), plus a Node smoke test of the
  `source-map` 0.8 wasm path and a scratch Vite build through
  `webglPlugin()` with a real GLSL `#include` (valid v3 map emitted).

* support Vite 8 and migrate the plugin to Rolldown/Oxc

  The peer range moves from `4.x || 5.x` to `^8.0.0` for the
  workspace-wide Vite 4 → 8 upgrade (root `vite` `^4.5.0` ->
  `^8.3.0`; see the root CHANGELOG for the full migration narrative).
  The package stays CommonJS (`main: lib/index.js`, no
  `"type": "module"`) and emits no runtime `require('vite')` — all Vite
  surface used is type-level except one helper in `webgl.ts`.

  Type resolution:

  - `tsconfig.json`: `module`/`moduleResolution` `commonjs`/`node` ->
    `node16`/`node16`. Vite 8 ships ESM-only declarations behind its
    exports map; legacy `node` resolution cannot find them at all
    (`Cannot find module 'vite'` in every partial), and under `node16`
    a CJS module may not value-import them (`TS1479`, even for
    `import type`).
  - Every `from 'vite'` import is now
    `import type … with {'resolution-mode': 'import'}` — TS 5.4's
    import attribute for ESM types consumed from CJS
    (`main.ts`, `plugins.ts` and all ten partials). The emitted `lib`
    was checked for `require('vite')`: none.

  API migrations:

  - `src/partials/projects.ts`:
    - `build.target: 'modules'` -> `'baseline-widely-available'`.
      `'modules'` was removed in Vite 7; the editor build keeps
      `'esnext'`.
    - `esbuild: {jsx: 'automatic', jsxImportSource:
      '@motion-canvas/2d/lib'}` -> `oxc: {jsx: {runtime: 'automatic',
      importSource: '@motion-canvas/2d/lib'}}`. Vite 8 replaced
      esbuild with Oxc for TS/JSX transforms; the old `esbuild` option
      still works through a deprecated compatibility layer.
    - `build.rollupOptions` -> `build.rolldownOptions` (Vite 8 rename;
      Rolldown supports `preserveEntrySignatures: 'strict'` and the
      generated `input` map).
  - `src/partials/editor.ts`: the virtual `\0virtual:editor` module now
    emits project imports via `path.resolve(filePath)` instead of the
    config-relative `filePath`. Vite 8/Rolldown no longer resolves
    relative specifiers inside a virtual module against the process
    cwd, which broke the e2e dev server with

    ```
    Internal server error: Failed to resolve import
    "./tests/project.ts?project" from " virtual:editor".
    ```

    Both branches (single-project and `?project=` lookup) were fixed.
  - `src/partials/webgl.ts`: the `normalizePath` value import from
    `vite` is gone (it would have to be a runtime require of an
    ESM-only package from a CJS build). The `//# sourceURL` now uses
    `path.relative(config.root, base).replace(/\\/g, '/')`, which is
    equivalent for the relative path used here.

  Consumer notes:

  - `@motion-canvas/ffmpeg`'s server `tsconfig` also moved to
    `node16` with a `resolution-mode` type import (own CHANGELOG).
  - `packages/examples` and `packages/template` configs became `.mts`
    (Vite 8's planned native config loader rejects ESM syntax in
    files loaded as CommonJS), and the examples config now calls
    `motionCanvas.default(...)` because an ESM-loaded config resolves
    the CJS plugin package to its namespace object.

  Verified: `npm run vite-plugin:build` (`tsc`, clean) and a check that
  `lib/**` contains no `require('vite')`; `npx lerna run build` (6
  projects); `npm run examples:build`, `npm run template:build`,
  `npm run player:build`; `timeout 60s npm run core:test` /
  `2d:test`; `npm run e2e:test -- run`; a live `npm run examples:dev`
  smoke test that serves `/` and `/src/quickstart` (200) and
  transforms both virtual editor modules with absolute project ids;
  `npx eslint "**/*.ts?(x)"` and `npm run prettier` (clean).

* bump `@types/node` from `^18.14.0` to `^24.1.0`

  Aligns the package with the project's Node 24 floor; root `overrides`
  now force a single hoisted `@types/node@24.13.5` across the whole
  workspace, which also satisfies the `vite`/`vitest` peer ranges.
  `@types/node@24` types the stream `finish` event as `() => void`, so
  `writeBase64` in `src/partials/exporter.ts` returns
  `new Promise<void>` and registers `.on('finish', () => resolve())`
  instead of passing `resolve` directly (passing it now fails with
  TS2345, and calling `resolve()` on an untyped `Promise<unknown>` fails
  with TS2794).

  Verified: `npm run vite-plugin:build` (`tsc`), `npx lerna run build`
  (6 projects), `timeout 60s npm run core:test` / `2d:test`,
  `npm run e2e:test -- run`, `npx eslint "**/*.{ts,tsx,mts}"` and
  `npm run prettier` (clean).

## [3.17.2](https://github.com/motion-canvas/motion-canvas/compare/v3.17.1...v3.17.2) (2024-12-14)


### Bug Fixes

* **vite-plugin, ui:** project file path on selection ([#1090](https://github.com/motion-canvas/motion-canvas/issues/1090)) ([f15b375](https://github.com/motion-canvas/motion-canvas/commit/f15b3753d47bcca8cd2d3f213f5624cf5e54142d))





# [3.17.0](https://github.com/motion-canvas/motion-canvas/compare/v3.16.0...v3.17.0) (2024-08-13)


### Features

* **vite-plugin:** let plugins override config ([#1054](https://github.com/motion-canvas/motion-canvas/issues/1054)) ([9b01eb5](https://github.com/motion-canvas/motion-canvas/commit/9b01eb58b746dd2b4019db2af32f5f3ec1f7b761))





## [3.15.1](https://github.com/motion-canvas/motion-canvas/compare/v3.15.0...v3.15.1) (2024-03-21)


### Bug Fixes

* optimize saving frames to disk ([#1007](https://github.com/motion-canvas/motion-canvas/issues/1007)) ([d79af91](https://github.com/motion-canvas/motion-canvas/commit/d79af91a4caa5bcf3ca98ec3a4b6d892c29c7fd9))





## [3.14.1](https://github.com/motion-canvas/motion-canvas/compare/v3.14.0...v3.14.1) (2024-02-06)


### Bug Fixes

* fix project selection screen ([#938](https://github.com/motion-canvas/motion-canvas/issues/938)) ([3b3f287](https://github.com/motion-canvas/motion-canvas/commit/3b3f2871d9884c67f7d46215dd12fc02e27f8054))





# [3.14.0](https://github.com/motion-canvas/motion-canvas/compare/v3.13.0...v3.14.0) (2024-02-04)


### Features

* webgl shaders ([#920](https://github.com/motion-canvas/motion-canvas/issues/920)) ([849216e](https://github.com/motion-canvas/motion-canvas/commit/849216ed34c4d29742c621b43a95ec4d99f8c755))





# [3.13.0](https://github.com/motion-canvas/motion-canvas/compare/v3.12.4...v3.13.0) (2024-01-10)

**Note:** Version bump only for package @motion-canvas/vite-plugin





## [3.12.3](https://github.com/motion-canvas/motion-canvas/compare/v3.12.2...v3.12.3) (2024-01-04)

**Note:** Version bump only for package @motion-canvas/vite-plugin





## [3.12.2](https://github.com/motion-canvas/motion-canvas/compare/v3.12.1...v3.12.2) (2023-12-31)


### Bug Fixes

* fix dependency bundling again ([#898](https://github.com/motion-canvas/motion-canvas/issues/898)) ([d6e0f48](https://github.com/motion-canvas/motion-canvas/commit/d6e0f48e67cf6baee710b8d5b185e620e67ceda5))





## [3.12.1](https://github.com/motion-canvas/motion-canvas/compare/v3.12.0...v3.12.1) (2023-12-31)


### Bug Fixes

* fix dependency bundling ([#897](https://github.com/motion-canvas/motion-canvas/issues/897)) ([5376012](https://github.com/motion-canvas/motion-canvas/commit/5376012cd02b8bca5abc2d3cf5a724662244c449))





# [3.12.0](https://github.com/motion-canvas/motion-canvas/compare/v3.11.0...v3.12.0) (2023-12-31)


### Bug Fixes

* exclude preact from optimizations ([#894](https://github.com/motion-canvas/motion-canvas/issues/894)) ([15687cc](https://github.com/motion-canvas/motion-canvas/commit/15687cc975abcf4538a5ce51402d2308057d42e5))
* **vite-plugin:** create empty output directory if not exist ([#787](https://github.com/motion-canvas/motion-canvas/issues/787)) ([20cceef](https://github.com/motion-canvas/motion-canvas/commit/20cceef8525e809bff9706fcd7082d7e103a085b))
* **vite-plugin:** handle unusual characters in file names ([#821](https://github.com/motion-canvas/motion-canvas/issues/821)) ([1e57497](https://github.com/motion-canvas/motion-canvas/commit/1e5749785d55a41605a5438eee08672ef01f3914)), closes [#764](https://github.com/motion-canvas/motion-canvas/issues/764)


### Features

* **vite-plugin:** support glob for project files ([#834](https://github.com/motion-canvas/motion-canvas/issues/834)) ([67029c4](https://github.com/motion-canvas/motion-canvas/commit/67029c4c2cf756cbe2b7ed59dc55cb895de81d52)), closes [#324](https://github.com/motion-canvas/motion-canvas/issues/324)





# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.11.0](https://github.com/motion-canvas/motion-canvas/compare/v3.10.1...v3.11.0) (2023-10-13)

### Features

- **core:** hot module replacement for audio
  ([#793](https://github.com/motion-canvas/motion-canvas/issues/793))
  ([d40c1a8](https://github.com/motion-canvas/motion-canvas/commit/d40c1a83c645c8984cca1ebc6fe687b445a0550c))

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.10.0](https://github.com/motion-canvas/motion-canvas/compare/v3.9.0...v3.10.0) (2023-07-23)

**Note:** Version bump only for package @motion-canvas/vite-plugin

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.9.0](https://github.com/motion-canvas/motion-canvas/compare/v3.8.0...v3.9.0) (2023-05-29)

### Features

- application settings
  ([#697](https://github.com/motion-canvas/motion-canvas/issues/697))
  ([54016f5](https://github.com/motion-canvas/motion-canvas/commit/54016f5cf3500abe13a217537307a3735d60f536)),
  closes [#167](https://github.com/motion-canvas/motion-canvas/issues/167)
- **vite-plugin:** add entry point
  ([#721](https://github.com/motion-canvas/motion-canvas/issues/721))
  ([e634b6c](https://github.com/motion-canvas/motion-canvas/commit/e634b6cb67b3c569d21d424661708ca946ea4cc3))

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.8.0](https://github.com/motion-canvas/motion-canvas/compare/v3.7.0...v3.8.0) (2023-05-13)

### Bug Fixes

- remove dependency pre-bundling warning
  ([#676](https://github.com/motion-canvas/motion-canvas/issues/676))
  ([38c81ff](https://github.com/motion-canvas/motion-canvas/commit/38c81ffa5ea0ef2d2beec9d015896f5873629d74))

### Features

- add new hooks for plugins
  ([#679](https://github.com/motion-canvas/motion-canvas/issues/679))
  ([74e18bc](https://github.com/motion-canvas/motion-canvas/commit/74e18bce71abd7e26a6415240603241b48cb36c2))

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.7.0](https://github.com/motion-canvas/motion-canvas/compare/v3.6.2...v3.7.0) (2023-05-10)

### Features

- button for opening the output directory
  ([#663](https://github.com/motion-canvas/motion-canvas/issues/663))
  ([79f320c](https://github.com/motion-canvas/motion-canvas/commit/79f320c07c422ca927b34bf339094fe0e70ffd0d))
- finalize custom exporters
  ([#660](https://github.com/motion-canvas/motion-canvas/issues/660))
  ([6a50430](https://github.com/motion-canvas/motion-canvas/commit/6a50430cdf9928992ca078eba39c484a5253da2b))

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.4.0](https://github.com/motion-canvas/motion-canvas/compare/v3.3.4...v3.4.0) (2023-03-28)

### Features

- get name from meta file
  ([#552](https://github.com/motion-canvas/motion-canvas/issues/552))
  ([ae2ed8a](https://github.com/motion-canvas/motion-canvas/commit/ae2ed8a5998768f160ec340d8b63d600d27bc15c))
- plugin architecture
  ([#564](https://github.com/motion-canvas/motion-canvas/issues/564))
  ([1c375b8](https://github.com/motion-canvas/motion-canvas/commit/1c375b81e0af8a76467d42dd46a7031adb9d71d3))

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.3.0](https://github.com/motion-canvas/motion-canvas/compare/v3.2.1...v3.3.0) (2023-03-18)

### Bug Fixes

- **vite-plugin:** can't assign port
  ([#538](https://github.com/motion-canvas/motion-canvas/issues/538))
  ([61b692b](https://github.com/motion-canvas/motion-canvas/commit/61b692bf97bb7e15d31469ada2e3dda84c2b99f8))

### Features

- add option to group output by scenes
  ([#477](https://github.com/motion-canvas/motion-canvas/issues/477))
  ([9934593](https://github.com/motion-canvas/motion-canvas/commit/99345937e7ac92fb674fdee10288e467ffd941e2))
- update vite from v3 to v4
  ([#495](https://github.com/motion-canvas/motion-canvas/issues/495))
  ([c409eee](https://github.com/motion-canvas/motion-canvas/commit/c409eee0e61b67e43afed240c5ae279714681246)),
  closes [#197](https://github.com/motion-canvas/motion-canvas/issues/197)

# [3.2.0](https://github.com/motion-canvas/motion-canvas/compare/v3.1.0...v3.2.0) (2023-03-10)

### Features

- display current package versions
  ([#501](https://github.com/motion-canvas/motion-canvas/issues/501))
  ([2972f67](https://github.com/motion-canvas/motion-canvas/commit/2972f673e201310e69688ab6f2c1adf1cddf2bf3))

# [3.1.0](https://github.com/motion-canvas/motion-canvas/compare/v3.0.2...v3.1.0) (2023-03-07)

**Note:** Version bump only for package @motion-canvas/vite-plugin

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

### Features

- **vite-plugin:** add CORS Proxy
  ([#357](https://github.com/motion-canvas/motion-canvas/issues/357))
  ([a3c5822](https://github.com/motion-canvas/motion-canvas/commit/a3c58228b7d3dab08fc27414d19870d35773b280)),
  closes [#338](https://github.com/motion-canvas/motion-canvas/issues/338)

# [2.4.0](https://github.com/motion-canvas/motion-canvas/compare/v2.3.0...v2.4.0) (2023-02-18)

### Bug Fixes

- **vite-plugin:** ignore query param in devserver
  ([#351](https://github.com/motion-canvas/motion-canvas/issues/351))
  ([5644d72](https://github.com/motion-canvas/motion-canvas/commit/5644d72d36adcdc817f0856aaff0be5507338cb8))

# [2.2.0](https://github.com/motion-canvas/motion-canvas/compare/v2.1.0...v2.2.0) (2023-02-09)

**Note:** Version bump only for package @motion-canvas/vite-plugin

# [2.1.0](https://github.com/motion-canvas/motion-canvas/compare/v2.0.0...v2.1.0) (2023-02-07)

### Bug Fixes

- **vite-plugin:** add missing headers to html
  ([#219](https://github.com/motion-canvas/motion-canvas/issues/219))
  ([2552bcf](https://github.com/motion-canvas/motion-canvas/commit/2552bcfbe2e90f3d4b86810d39f8cee24349e405)),
  closes [#201](https://github.com/motion-canvas/motion-canvas/issues/201)

# 2.0.0 (2023-02-04)

### Code Refactoring

- remove legacy package
  ([6a84120](https://github.com/motion-canvas/motion-canvas/commit/6a84120d949a32dff0ad413a9f359510ff109af1))

### Features

- add markdown logs
  ([#138](https://github.com/motion-canvas/motion-canvas/issues/138))
  ([e42447a](https://github.com/motion-canvas/motion-canvas/commit/e42447a0c07a8192c06d21c5f1801f0266279075))
- add rendering again
  ([#43](https://github.com/motion-canvas/motion-canvas/issues/43))
  ([c10d3db](https://github.com/motion-canvas/motion-canvas/commit/c10d3dbb63f6248eda04128ef0aa9d72c1edfcf7))
- add scaffolding package
  ([#36](https://github.com/motion-canvas/motion-canvas/issues/36))
  ([266a561](https://github.com/motion-canvas/motion-canvas/commit/266a561c619b57b403ec9c64185985b48bff29da)),
  closes [#30](https://github.com/motion-canvas/motion-canvas/issues/30)
- detect circular signal dependencies
  ([#129](https://github.com/motion-canvas/motion-canvas/issues/129))
  ([6fcdb41](https://github.com/motion-canvas/motion-canvas/commit/6fcdb41df90dca1c39537a4f6d4960ab551f4d6e))
- extract konva to separate package
  ([#60](https://github.com/motion-canvas/motion-canvas/issues/60))
  ([4ecad3c](https://github.com/motion-canvas/motion-canvas/commit/4ecad3ca2732bd5147af670c230f8f959129a707))
- make exporting concurrent
  ([4f9ef8d](https://github.com/motion-canvas/motion-canvas/commit/4f9ef8d40d9d9c1147e2edfc0766c5ea5cc4297c))
- make scenes independent of names
  ([#53](https://github.com/motion-canvas/motion-canvas/issues/53))
  ([417617e](https://github.com/motion-canvas/motion-canvas/commit/417617eb5f0af771e7413c9ce4c7e9b998e3e490)),
  closes [#25](https://github.com/motion-canvas/motion-canvas/issues/25)
- navigate to scene and node source
  ([#144](https://github.com/motion-canvas/motion-canvas/issues/144))
  ([86d495d](https://github.com/motion-canvas/motion-canvas/commit/86d495d01a9f8f0a58e676fedb6df9c12a14d14a))
- support for multiple projects
  ([#57](https://github.com/motion-canvas/motion-canvas/issues/57))
  ([573752d](https://github.com/motion-canvas/motion-canvas/commit/573752dd4d79d62a1a30958f1ed550d2cf22c344)),
  closes [#141414](https://github.com/motion-canvas/motion-canvas/issues/141414)
- support multiple players
  ([#128](https://github.com/motion-canvas/motion-canvas/issues/128))
  ([24f75cf](https://github.com/motion-canvas/motion-canvas/commit/24f75cf7cdaf38f890e3936edf175afbfd340210))
- switch to Vite
  ([#28](https://github.com/motion-canvas/motion-canvas/issues/28))
  ([65b9133](https://github.com/motion-canvas/motion-canvas/commit/65b91337dbc47fe51cecc83657f79fab15343a0d)),
  closes [#141414](https://github.com/motion-canvas/motion-canvas/issues/141414)
  [#13](https://github.com/motion-canvas/motion-canvas/issues/13)
- **vite-plugin:** improve audio handling
  ([#154](https://github.com/motion-canvas/motion-canvas/issues/154))
  ([482f144](https://github.com/motion-canvas/motion-canvas/commit/482f14447ae54543346fab0f9e5b94631c5cfd4d))

### Reverts

- "ci(release): 9.1.3 [skip ci]"
  ([62953a6](https://github.com/motion-canvas/motion-canvas/commit/62953a6a8a1b1da3eb2e5f51c9fe60c716d6b94b))
- ci(release): 1.0.1 [skip ci]
  ([#175](https://github.com/motion-canvas/motion-canvas/issues/175))
  ([161a046](https://github.com/motion-canvas/motion-canvas/commit/161a04647ecdc8203daf2d887a6a44c79a92ee20))
- ci(release): 2.0.0 [skip ci]
  ([#176](https://github.com/motion-canvas/motion-canvas/issues/176))
  ([551096b](https://github.com/motion-canvas/motion-canvas/commit/551096bf636a791ea7c7c1d38d8e03c360433008))

### BREAKING CHANGES

- remove legacy package
- change to import paths

See
[the migration guide](https://motion-canvas.github.io/guides/migration/12.0.0)
for more info.

- change the way scenes are imported

Scene files no longer need to follow the pattern: `[name].scene.tsx`. When
importing scenes in the project file, a dedicated `?scene` query param should be
used:

```ts
import example from './scenes/example?scene';

export default new Project({
  name: 'project',
  scenes: [example],
});
```

- change the overall structure of a project

`vite` and `@motion-canvas/vite-plugin` packages are now required to build a
project:

```
npm i -D vite @motion-canvas/vite-plugin
```

The following `vite.config.ts` file needs to be created in the root of the
project:

```ts
import {defineConfig} from 'vite';
import motionCanvas from '@motion-canvas/vite-plugin';

export default defineConfig({
  plugins: [motionCanvas()],
});
```

Types exposed by Motion Canvas are no longer global. An additional
`motion-canvas.d.ts` file needs to be created in the `src` directory:

```ts
/// <reference types="@motion-canvas/core/project" />
```

Finally, the `bootstrap` function no longer exists. Project files should export
an instance of the `Project` class instead:

```ts
import {Project} from '@motion-canvas/core/lib';

import example from './scenes/example.scene';

export default new Project({
  name: 'project',
  scenes: [example],
  // same options as in bootstrap() are available:
```
