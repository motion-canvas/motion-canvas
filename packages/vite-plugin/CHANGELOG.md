# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.7.0-alpha.0](https://github.com/motion-canvas/motion-canvas/compare/v3.6.2...v3.7.0-alpha.0) (2023-05-10)

### Features

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
