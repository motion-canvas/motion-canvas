# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [12.0.0-alpha.2](https://github.com/motion-canvas/motion-canvas/compare/v12.0.0-alpha.1...v12.0.0-alpha.2) (2022-09-07)


### Features

* better naming conventions ([#62](https://github.com/motion-canvas/motion-canvas/issues/62)) ([a9d764f](https://github.com/motion-canvas/motion-canvas/commit/a9d764fbceb639497ef45f44c90f9b6e408213d3))


### BREAKING CHANGES

* change names of timing and interpolation functions

`TweenFunction` is now called `InterpolationFunction`.
Individual functions are now called `[type]Lerp` instead of `[type]Tween`.
For instance: `colorTween` is now `colorLerp`.

`InterpolationFunction` is now called `TimingFunction`.
This name is better aligned with the CSS spec.





# [12.0.0-alpha.1](https://github.com/motion-canvas/motion-canvas/compare/v12.0.0-alpha.0...v12.0.0-alpha.1) (2022-08-31)


### Bug Fixes

* **legacy:** add missing files ([#61](https://github.com/motion-canvas/motion-canvas/issues/61)) ([fad87d5](https://github.com/motion-canvas/motion-canvas/commit/fad87d5aa5500e7c63cb914fc51044db6225502e))





# [12.0.0-alpha.0](https://github.com/motion-canvas/motion-canvas/compare/v11.1.0...v12.0.0-alpha.0) (2022-08-31)


### Features

* extract konva to separate package ([#60](https://github.com/motion-canvas/motion-canvas/issues/60)) ([4ecad3c](https://github.com/motion-canvas/motion-canvas/commit/4ecad3ca2732bd5147af670c230f8f959129a707))


### BREAKING CHANGES

* change to import paths

See [the migration guide](https://motion-canvas.github.io/guides/migration/12.0.0) for more info.
