# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [12.0.0](https://github.com/motion-canvas/motion-canvas/compare/v12.0.0-alpha.6...v12.0.0) (2022-12-07)

**Note:** Version bump only for package @motion-canvas/create





# [12.0.0-alpha.6](https://github.com/motion-canvas/motion-canvas/compare/v12.0.0-alpha.5...v12.0.0-alpha.6) (2022-12-07)

**Note:** Version bump only for package @motion-canvas/create





# [12.0.0-alpha.5](https://github.com/motion-canvas/motion-canvas/compare/v12.0.0-alpha.4...v12.0.0-alpha.5) (2022-12-05)

**Note:** Version bump only for package @motion-canvas/create





# [12.0.0-alpha.4](https://github.com/motion-canvas/motion-canvas/compare/v12.0.0-alpha.3...v12.0.0-alpha.4) (2022-12-05)


### Bug Fixes

* fix scaffolding ([#93](https://github.com/motion-canvas/motion-canvas/issues/93)) ([95c55ed](https://github.com/motion-canvas/motion-canvas/commit/95c55ed338127dad22f42b24c8f6b101b8863be7))





# [12.0.0-alpha.3](https://github.com/motion-canvas/motion-canvas/compare/v12.0.0-alpha.2...v12.0.0-alpha.3) (2022-12-05)


### Code Refactoring

* remove legacy package ([6a84120](https://github.com/motion-canvas/motion-canvas/commit/6a84120d949a32dff0ad413a9f359510ff109af1))


### BREAKING CHANGES

* remove legacy package





# [12.0.0-alpha.2](https://github.com/motion-canvas/motion-canvas/compare/v12.0.0-alpha.1...v12.0.0-alpha.2) (2022-09-07)

**Note:** Version bump only for package @motion-canvas/create





# [12.0.0-alpha.0](https://github.com/motion-canvas/motion-canvas/compare/v11.1.0...v12.0.0-alpha.0) (2022-08-31)


### Features

* extract konva to separate package ([#60](https://github.com/motion-canvas/motion-canvas/issues/60)) ([4ecad3c](https://github.com/motion-canvas/motion-canvas/commit/4ecad3ca2732bd5147af670c230f8f959129a707))


### BREAKING CHANGES

* change to import paths

See [the migration guide](https://motion-canvas.github.io/guides/migration/12.0.0) for more info.





# [11.1.0](https://github.com/motion-canvas/motion-canvas/compare/v11.1.0-alpha.0...v11.1.0) (2022-08-29)

**Note:** Version bump only for package @motion-canvas/create





# [11.1.0-alpha.0](https://github.com/motion-canvas/motion-canvas/compare/v11.0.0...v11.1.0-alpha.0) (2022-08-29)


### Features

* support for multiple projects ([#57](https://github.com/motion-canvas/motion-canvas/issues/57)) ([573752d](https://github.com/motion-canvas/motion-canvas/commit/573752dd4d79d62a1a30958f1ed550d2cf22c344)), closes [#141414](https://github.com/motion-canvas/motion-canvas/issues/141414)





# [11.0.0](https://github.com/motion-canvas/motion-canvas/compare/v11.0.0-alpha.0...v11.0.0) (2022-08-26)

**Note:** Version bump only for package @motion-canvas/create





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

**Note:** Version bump only for package @motion-canvas/create





# [10.1.0](https://github.com/motion-canvas/motion-canvas/compare/v10.0.2...v10.1.0) (2022-08-15)

**Note:** Version bump only for package @motion-canvas/create





## [10.0.2](https://github.com/motion-canvas/motion-canvas/compare/v10.0.1...v10.0.2) (2022-08-15)

**Note:** Version bump only for package @motion-canvas/create





## [10.0.1](https://github.com/motion-canvas/motion-canvas/compare/v10.0.0...v10.0.1) (2022-08-15)


### Bug Fixes

* **create:** fix package type ([#40](https://github.com/motion-canvas/motion-canvas/issues/40)) ([f07aa5d](https://github.com/motion-canvas/motion-canvas/commit/f07aa5d8f6c3485464ed3158187340c7db7d5af7))





# [10.0.0](https://github.com/motion-canvas/motion-canvas/compare/v9.1.2...v10.0.0) (2022-08-14)


### Bug Fixes

* change executable file permissions ([#38](https://github.com/motion-canvas/motion-canvas/issues/38)) ([23025a2](https://github.com/motion-canvas/motion-canvas/commit/23025a2caefd993f7e4751b1efced3a25ed497a6))


### Features

* add scaffolding package ([#36](https://github.com/motion-canvas/motion-canvas/issues/36)) ([266a561](https://github.com/motion-canvas/motion-canvas/commit/266a561c619b57b403ec9c64185985b48bff29da)), closes [#30](https://github.com/motion-canvas/motion-canvas/issues/30)


### Reverts

* "ci(release): 9.1.3 [skip ci]" ([62953a6](https://github.com/motion-canvas/motion-canvas/commit/62953a6a8a1b1da3eb2e5f51c9fe60c716d6b94b))
