# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.8.0](https://github.com/motion-canvas/motion-canvas/compare/v3.7.0...v3.8.0) (2023-05-13)

### Bug Fixes

- **2d:** correctly support external image urls
  ([#678](https://github.com/motion-canvas/motion-canvas/issues/678))
  ([a08556b](https://github.com/motion-canvas/motion-canvas/commit/a08556b6e2822a55db593f610ea4dd6cb8494adb)),
  closes [#677](https://github.com/motion-canvas/motion-canvas/issues/677)
- **2d:** ignore children with disabled layout
  ([#669](https://github.com/motion-canvas/motion-canvas/issues/669))
  ([b98c462](https://github.com/motion-canvas/motion-canvas/commit/b98c4625c3634495e86ca23d19355035e457db06)),
  closes [#580](https://github.com/motion-canvas/motion-canvas/issues/580)

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.7.0](https://github.com/motion-canvas/motion-canvas/compare/v3.6.2...v3.7.0) (2023-05-10)

**Note:** Version bump only for package @motion-canvas/2d

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.6.2](https://github.com/motion-canvas/motion-canvas/compare/v3.6.1...v3.6.2) (2023-05-09)

### Bug Fixes

- **2d:** fix types
  ([#659](https://github.com/motion-canvas/motion-canvas/issues/659))
  ([a32af29](https://github.com/motion-canvas/motion-canvas/commit/a32af29ef3bd2e5dbf08697ebfee53230fceadc1))

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.6.1](https://github.com/motion-canvas/motion-canvas/compare/v3.6.0...v3.6.1) (2023-05-08)

### Bug Fixes

- prevent consumePromises from halting
  ([#657](https://github.com/motion-canvas/motion-canvas/issues/657))
  ([363a189](https://github.com/motion-canvas/motion-canvas/commit/363a189b0c7f5926c9d5ae00b58b48e8ed4d9b48))

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.6.0](https://github.com/motion-canvas/motion-canvas/compare/v3.5.1...v3.6.0) (2023-05-08)

### Bug Fixes

- **2d:** correctly append Txt nodes to view
  ([#644](https://github.com/motion-canvas/motion-canvas/issues/644))
  ([24bb51a](https://github.com/motion-canvas/motion-canvas/commit/24bb51aa04778c33ce327926b27332efaa554e5f))
- **2d:** fix cyclic dependency in cardinal points
  ([#645](https://github.com/motion-canvas/motion-canvas/issues/645))
  ([def23f9](https://github.com/motion-canvas/motion-canvas/commit/def23f925ee7200c8740ecd51c7f6117d67b6ef8))

### Features

- **2d:** add arcLength helper methods to Curve
  ([#627](https://github.com/motion-canvas/motion-canvas/issues/627))
  ([3c7546e](https://github.com/motion-canvas/motion-canvas/commit/3c7546e7a509deb6fff8f669c3df0a69b492bd2e))
- **2d:** add cardinal points
  ([#636](https://github.com/motion-canvas/motion-canvas/issues/636))
  ([2136a25](https://github.com/motion-canvas/motion-canvas/commit/2136a2558a9ed968ee505e4e5cce33d989dfdc13)),
  closes [#391](https://github.com/motion-canvas/motion-canvas/issues/391)
- **2d:** add completion property for curves
  ([#635](https://github.com/motion-canvas/motion-canvas/issues/635))
  ([6577d6d](https://github.com/motion-canvas/motion-canvas/commit/6577d6ddfaf779ba02f3862d2a357166138b99ca))
- **2d:** add Ray node
  ([#628](https://github.com/motion-canvas/motion-canvas/issues/628))
  ([649447c](https://github.com/motion-canvas/motion-canvas/commit/649447cd5f2089afc64cc7bd4b0276e69d1e9a30))
- **2d:** support HMR for images
  ([#641](https://github.com/motion-canvas/motion-canvas/issues/641))
  ([cf17520](https://github.com/motion-canvas/motion-canvas/commit/cf17520aa8ddf19dcfc419c63cf7255892d45b71))
- add DEG2RAD and RAD2DEG constants
  ([#630](https://github.com/motion-canvas/motion-canvas/issues/630))
  ([01801e8](https://github.com/motion-canvas/motion-canvas/commit/01801e8766058e75a6a020400650fb00f8f430cc))

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.5.1](https://github.com/motion-canvas/motion-canvas/compare/v3.5.0...v3.5.1) (2023-04-08)

### Bug Fixes

- **2d:** fix curve arrow alignment when animating start signal
  ([#615](https://github.com/motion-canvas/motion-canvas/issues/615))
  ([2fefc40](https://github.com/motion-canvas/motion-canvas/commit/2fefc4026050159ba204c7629832ad83e8bfa51b))

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.5.0](https://github.com/motion-canvas/motion-canvas/compare/v3.4.0...v3.5.0) (2023-04-06)

### Bug Fixes

- **2d:** calculate arrow orientations for curves correctly
  ([#597](https://github.com/motion-canvas/motion-canvas/issues/597))
  ([1626811](https://github.com/motion-canvas/motion-canvas/commit/1626811ec4cd1bd2a3d43e393ced40a7da462c3a))
- **2d:** smoothly play videos when presenting
  ([#600](https://github.com/motion-canvas/motion-canvas/issues/600))
  ([294fe6a](https://github.com/motion-canvas/motion-canvas/commit/294fe6ac056ab074c77214fcf9035f53fac9258c)),
  closes [#578](https://github.com/motion-canvas/motion-canvas/issues/578)
- **2d:** wait for reused async resources
  ([#599](https://github.com/motion-canvas/motion-canvas/issues/599))
  ([280e065](https://github.com/motion-canvas/motion-canvas/commit/280e065fe69e9a744b7b12eb4609e7d87f76bb63)),
  closes [#593](https://github.com/motion-canvas/motion-canvas/issues/593)

### Features

- **2d:** add Bézier nodes
  ([#603](https://github.com/motion-canvas/motion-canvas/issues/603))
  ([9841cfd](https://github.com/motion-canvas/motion-canvas/commit/9841cfdc3947ca4e6d6e42ed21eae88e855f855d))
- **2d:** improve Video node
  ([#601](https://github.com/motion-canvas/motion-canvas/issues/601))
  ([3801d83](https://github.com/motion-canvas/motion-canvas/commit/3801d83415bbdeeee5d6d53d0c18e5d9e78fba56))

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.4.0](https://github.com/motion-canvas/motion-canvas/compare/v3.3.4...v3.4.0) (2023-03-28)

### Bug Fixes

- **2d:** clone size correctly
  ([#562](https://github.com/motion-canvas/motion-canvas/issues/562))
  ([cdd3df1](https://github.com/motion-canvas/motion-canvas/commit/cdd3df1bff25b04b905e289264831d8d328caaab)),
  closes [#559](https://github.com/motion-canvas/motion-canvas/issues/559)
- **2d:** fix CodeBlock types
  ([#563](https://github.com/motion-canvas/motion-canvas/issues/563))
  ([25160fa](https://github.com/motion-canvas/motion-canvas/commit/25160fa4d92af88429110356e42f6e3b4f88a90f)),
  closes [#560](https://github.com/motion-canvas/motion-canvas/issues/560)

### Features

- **2d:** add spline node
  ([#514](https://github.com/motion-canvas/motion-canvas/issues/514))
  ([3ce2111](https://github.com/motion-canvas/motion-canvas/commit/3ce2111309e698450dc4c6e2ad47024995863e73))

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.3.4](https://github.com/motion-canvas/motion-canvas/compare/v3.3.3...v3.3.4) (2023-03-19)

### Bug Fixes

- **2d:** fix circle segment
  ([#557](https://github.com/motion-canvas/motion-canvas/issues/557))
  ([adebff4](https://github.com/motion-canvas/motion-canvas/commit/adebff492b76a512d79151b00adf1b383d25c5b5))

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.3.3](https://github.com/motion-canvas/motion-canvas/compare/v3.3.2...v3.3.3) (2023-03-18)

### Bug Fixes

- **2d:** fix nested cache canvases
  ([#554](https://github.com/motion-canvas/motion-canvas/issues/554))
  ([e601441](https://github.com/motion-canvas/motion-canvas/commit/e6014413b215af6fb1a7953f8db83893d4025f0b)),
  closes [#551](https://github.com/motion-canvas/motion-canvas/issues/551)

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.3.2](https://github.com/motion-canvas/motion-canvas/compare/v3.3.1...v3.3.2) (2023-03-18)

### Bug Fixes

- **2d:** add missing Fragment export
  ([#553](https://github.com/motion-canvas/motion-canvas/issues/553))
  ([229afb4](https://github.com/motion-canvas/motion-canvas/commit/229afb4fe7d95f09b480ab4a813f8dff549f381f))

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.3.1](https://github.com/motion-canvas/motion-canvas/compare/v3.3.0...v3.3.1) (2023-03-18)

### Bug Fixes

- **2d:** add missing jsx dev runtime
  ([#547](https://github.com/motion-canvas/motion-canvas/issues/547))
  ([d61cb7d](https://github.com/motion-canvas/motion-canvas/commit/d61cb7dd24ab66ae17d5bd6f5ccb34c4fd1e7569)),
  closes [#545](https://github.com/motion-canvas/motion-canvas/issues/545)

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.3.0](https://github.com/motion-canvas/motion-canvas/compare/v3.2.1...v3.3.0) (2023-03-18)

### Bug Fixes

- **2d:** better error handling
  ([#524](https://github.com/motion-canvas/motion-canvas/issues/524))
  ([b7475ba](https://github.com/motion-canvas/motion-canvas/commit/b7475ba5ff35d37ee198577d1205d6ecd6fd2092))
- **2d:** fix Txt decorators
  ([#526](https://github.com/motion-canvas/motion-canvas/issues/526))
  ([25b30ed](https://github.com/motion-canvas/motion-canvas/commit/25b30ed3861f46d72147335480912ce5f564be79))
- **2d:** textWrap not working in Firefox
  ([#541](https://github.com/motion-canvas/motion-canvas/issues/541))
  ([f10e057](https://github.com/motion-canvas/motion-canvas/commit/f10e057fd13ed9dcc70ebc0ca63963708ec159c8)),
  closes [#517](https://github.com/motion-canvas/motion-canvas/issues/517)
- restrict size of cache canvas
  ([#544](https://github.com/motion-canvas/motion-canvas/issues/544))
  ([49ec554](https://github.com/motion-canvas/motion-canvas/commit/49ec55490718e503d9a39437ae13c189dc4fe9ea))

### Features

- **core:** tree shaking
  ([#523](https://github.com/motion-canvas/motion-canvas/issues/523))
  ([65fec78](https://github.com/motion-canvas/motion-canvas/commit/65fec7825fda33812b13f57bfeb1d82193a5d190))
- **docs:** fiddle editor
  ([#542](https://github.com/motion-canvas/motion-canvas/issues/542))
  ([3c68fef](https://github.com/motion-canvas/motion-canvas/commit/3c68fefdf7bf375ee9345aba7dbf9e5ff35e3c3d))

# [3.2.0](https://github.com/motion-canvas/motion-canvas/compare/v3.1.0...v3.2.0) (2023-03-10)

### Bug Fixes

- **2d:** fix line arc length
  ([#503](https://github.com/motion-canvas/motion-canvas/issues/503))
  ([4f1cd59](https://github.com/motion-canvas/motion-canvas/commit/4f1cd59e6bcba0b16b36be88b28a60ae46d4d9ab)),
  closes [#497](https://github.com/motion-canvas/motion-canvas/issues/497)

### Features

- **2d:** add Polygon component
  ([#463](https://github.com/motion-canvas/motion-canvas/issues/463))
  ([15adb3e](https://github.com/motion-canvas/motion-canvas/commit/15adb3e312a4998b44c0b9c5fe5b5236f51c71c9)),
  closes [#455](https://github.com/motion-canvas/motion-canvas/issues/455)
- world space cache
  ([#498](https://github.com/motion-canvas/motion-canvas/issues/498))
  ([633e9e1](https://github.com/motion-canvas/motion-canvas/commit/633e9e140dfbbe397df6ddc1f96ed30782ddce94)),
  closes [#342](https://github.com/motion-canvas/motion-canvas/issues/342)

# [3.1.0](https://github.com/motion-canvas/motion-canvas/compare/v3.0.2...v3.1.0) (2023-03-07)

### Bug Fixes

- **2d:** fix cache bbox for lines
  ([#467](https://github.com/motion-canvas/motion-canvas/issues/467))
  ([9fd1444](https://github.com/motion-canvas/motion-canvas/commit/9fd144417bb0b6301da6c522a988775f5ff142ac)),
  closes [#466](https://github.com/motion-canvas/motion-canvas/issues/466)
- **2d:** fix letterSpacing
  ([#448](https://github.com/motion-canvas/motion-canvas/issues/448))
  ([bb5ffc4](https://github.com/motion-canvas/motion-canvas/commit/bb5ffc48efa82b9db818e8e52aa35e9c2ad8ce89)),
  closes [#447](https://github.com/motion-canvas/motion-canvas/issues/447)
- support multiple async players
  ([#450](https://github.com/motion-canvas/motion-canvas/issues/450))
  ([d7ec469](https://github.com/motion-canvas/motion-canvas/commit/d7ec469e747eefd909f4dd59dd713f5d86308222)),
  closes [#434](https://github.com/motion-canvas/motion-canvas/issues/434)

### Features

- **2d:** add textAlign property
  ([#451](https://github.com/motion-canvas/motion-canvas/issues/451))
  ([3d15825](https://github.com/motion-canvas/motion-canvas/commit/3d15825f3cc5a35ba081a31510741b824f3bc6ab)),
  closes [#303](https://github.com/motion-canvas/motion-canvas/issues/303)

## [3.0.2](https://github.com/motion-canvas/motion-canvas/compare/v3.0.1...v3.0.2) (2023-02-27)

### Bug Fixes

- **2d:** correct layout defaults
  ([#442](https://github.com/motion-canvas/motion-canvas/issues/442))
  ([c116c35](https://github.com/motion-canvas/motion-canvas/commit/c116c355179ba3b2487634fb82b9a5bc2ea266bf))

# [3.0.0](https://github.com/motion-canvas/motion-canvas/compare/v2.6.0...v3.0.0) (2023-02-27)

### Bug Fixes

- **2d:** fix initial value of endOffset
  ([#433](https://github.com/motion-canvas/motion-canvas/issues/433))
  ([9fe82b3](https://github.com/motion-canvas/motion-canvas/commit/9fe82b3d21ba0150a2378e541a4652ca707c2d15))
- **2d:** textDirection property for RTL/LTR text
  ([#404](https://github.com/motion-canvas/motion-canvas/issues/404))
  ([f240b1b](https://github.com/motion-canvas/motion-canvas/commit/f240b1bd140a884f6901b7cfcb97ce3e9ce4b48d))

### Code Refactoring

- introduce improved names
  ([#425](https://github.com/motion-canvas/motion-canvas/issues/425))
  ([4a2188d](https://github.com/motion-canvas/motion-canvas/commit/4a2188d339587fa658b2134befc3fe63c835c5d7))

### Features

- new playback architecture
  ([#402](https://github.com/motion-canvas/motion-canvas/issues/402))
  ([bbe3e2a](https://github.com/motion-canvas/motion-canvas/commit/bbe3e2a24de068a88f49ed7a2f13e9717039733b)),
  closes [#166](https://github.com/motion-canvas/motion-canvas/issues/166)

### Reverts

- feat: upgrade code-fns for new theme options and lazy loading
  ([#435](https://github.com/motion-canvas/motion-canvas/issues/435))
  ([3f5e439](https://github.com/motion-canvas/motion-canvas/commit/3f5e43968f7add7c6322c9c8358d3b6fc178c2fe))

### BREAKING CHANGES

- multiple name changes

To avoid collisions, names of certain classes have changed:

- `Text => Txt`
- `Image => Img`
- `Rect (type) => BBox`

Cache related methods of `Node` have changed:

- `getCacheRect => getCacheBBox`
- `cacheRect => cacheBBox`
- `fullCacheRect => fullCacheBBox`

The `CodeBlock` property has changed:

- `CodeBlock.selectionOpacity => CodeBlock.unselectedOpacity`

* `makeProject` no longer accepts some settings.

Settings such as `background` and `audioOffset` are now stored in the project
meta file.

# [2.6.0](https://github.com/motion-canvas/motion-canvas/compare/v2.5.0...v2.6.0) (2023-02-24)

### Bug Fixes

- **2d:** handle division by zero in lines
  ([#407](https://github.com/motion-canvas/motion-canvas/issues/407))
  ([a17871a](https://github.com/motion-canvas/motion-canvas/commit/a17871a2ce63dd5bb32bc719037327c4e9dde217))

### Features

- **2d:** add Icon Component
  ([#306](https://github.com/motion-canvas/motion-canvas/issues/306))
  ([3479631](https://github.com/motion-canvas/motion-canvas/commit/3479631ef34e39f90a8d8de441317672be1840d9)),
  closes [#305](https://github.com/motion-canvas/motion-canvas/issues/305)
- **2d:** add save and restore methods to nodes
  ([#406](https://github.com/motion-canvas/motion-canvas/issues/406))
  ([870e194](https://github.com/motion-canvas/motion-canvas/commit/870e1947d97382bc6d82857c077140bbef7cf7e8))
- **2d:** add z-index property to nodes
  ([#398](https://github.com/motion-canvas/motion-canvas/issues/398))
  ([4280af3](https://github.com/motion-canvas/motion-canvas/commit/4280af3b4b7bd5970fe5e743949a0fcca2c314f3))
- add missing flexbox properties
  ([#405](https://github.com/motion-canvas/motion-canvas/issues/405))
  ([4e78b4b](https://github.com/motion-canvas/motion-canvas/commit/4e78b4b2fe4df42ce0a8da6fd41ad38b0104e7f5))
- upgrade code-fns for new theme options and lazy loading
  ([#401](https://github.com/motion-canvas/motion-canvas/issues/401))
  ([8965ab1](https://github.com/motion-canvas/motion-canvas/commit/8965ab1bef8b6ae919c8001d0527f5793293b285)),
  closes [#396](https://github.com/motion-canvas/motion-canvas/issues/396)
  [#322](https://github.com/motion-canvas/motion-canvas/issues/322)
- **vite-plugin:** add CORS Proxy
  ([#357](https://github.com/motion-canvas/motion-canvas/issues/357))
  ([a3c5822](https://github.com/motion-canvas/motion-canvas/commit/a3c58228b7d3dab08fc27414d19870d35773b280)),
  closes [#338](https://github.com/motion-canvas/motion-canvas/issues/338)

# [2.5.0](https://github.com/motion-canvas/motion-canvas/compare/v2.4.0...v2.5.0) (2023-02-20)

### Bug Fixes

- **2d:** fix signal initialization
  ([#382](https://github.com/motion-canvas/motion-canvas/issues/382))
  ([ea36e79](https://github.com/motion-canvas/motion-canvas/commit/ea36e791a20bfd1b491ffa9917be686c51bc3899))
- **2d:** handle floating point errors in acos
  ([#381](https://github.com/motion-canvas/motion-canvas/issues/381))
  ([5bca8fd](https://github.com/motion-canvas/motion-canvas/commit/5bca8fd0bbdcf28f2793c124b7d6b0afd560c4b8))
- plug memory leaks
  ([#385](https://github.com/motion-canvas/motion-canvas/issues/385))
  ([de0af00](https://github.com/motion-canvas/motion-canvas/commit/de0af00a7d2e019e2a933791c62b7901755be7b0))
- support color to null tweening
  ([#387](https://github.com/motion-canvas/motion-canvas/issues/387))
  ([02e9f22](https://github.com/motion-canvas/motion-canvas/commit/02e9f22027a1c3a85ffcc259aeca913318fb6f54))

### Features

- **2d:** add closed property for circle
  ([#378](https://github.com/motion-canvas/motion-canvas/issues/378))
  ([62a9605](https://github.com/motion-canvas/motion-canvas/commit/62a9605d4c54e7bf2d2d44d47bf769f5b27378a5))
- **2d:** make `View2D` extend `Rect`
  ([#379](https://github.com/motion-canvas/motion-canvas/issues/379))
  ([93db5fc](https://github.com/motion-canvas/motion-canvas/commit/93db5fc41617c0902e85fda90fbfc930c2b4634b))

# [2.4.0](https://github.com/motion-canvas/motion-canvas/compare/v2.3.0...v2.4.0) (2023-02-18)

### Bug Fixes

- **2d:** fix Gradient and Pattern signals
  ([#376](https://github.com/motion-canvas/motion-canvas/issues/376))
  ([6e0dc8a](https://github.com/motion-canvas/motion-canvas/commit/6e0dc8af8d19f93fd6a42addca2b3a2958b4dd33))
- **2d:** fix layout calculation for nodes not explicitly added to view
  ([#331](https://github.com/motion-canvas/motion-canvas/issues/331))
  ([528e2d5](https://github.com/motion-canvas/motion-canvas/commit/528e2d5a0abec99819e022d2848b256ece9f869a))
- **2d:** format whitespaces according to HTML
  ([#372](https://github.com/motion-canvas/motion-canvas/issues/372))
  ([83fb565](https://github.com/motion-canvas/motion-canvas/commit/83fb565742d98f060c0400c8cbaf9961b69f34d0)),
  closes [#370](https://github.com/motion-canvas/motion-canvas/issues/370)
- typo on codeblock remove comments
  ([#368](https://github.com/motion-canvas/motion-canvas/issues/368))
  ([2025adc](https://github.com/motion-canvas/motion-canvas/commit/2025adc6e7aa11d81b6f5f6989e8eae18cf86cb7))

### Features

- **2d:** add default computed values for signals
  ([#259](https://github.com/motion-canvas/motion-canvas/issues/259))
  ([18f61a6](https://github.com/motion-canvas/motion-canvas/commit/18f61a668420dec8afba52d52a6557e7a7919ba2))
- **2d:** add moveBelow, moveAbove and moveTo methods to Node
  ([#365](https://github.com/motion-canvas/motion-canvas/issues/365))
  ([16752a3](https://github.com/motion-canvas/motion-canvas/commit/16752a3b8ae7461b33d6208a9675729f374e8324))
- **2d:** unify layout properties
  ([#355](https://github.com/motion-canvas/motion-canvas/issues/355))
  ([3cae97e](https://github.com/motion-canvas/motion-canvas/commit/3cae97ea704d0533020fa87326dacadcc037d517)),
  closes [#352](https://github.com/motion-canvas/motion-canvas/issues/352)

# [2.3.0](https://github.com/motion-canvas/motion-canvas/compare/v2.2.0...v2.3.0) (2023-02-11)

### Bug Fixes

- **2d:** make Text respect textWrap=pre
  ([#287](https://github.com/motion-canvas/motion-canvas/issues/287))
  ([cb07f4b](https://github.com/motion-canvas/motion-canvas/commit/cb07f4bdf07edc8a086b934ca5ab769682b9a010))

### Features

- **2d:** add antialiased signal to Shape
  ([#282](https://github.com/motion-canvas/motion-canvas/issues/282))
  ([7c6905d](https://github.com/motion-canvas/motion-canvas/commit/7c6905d72c6c2f49e10f0a80704c0afe3504d01b))
- **2d:** add LaTeX component
  ([#228](https://github.com/motion-canvas/motion-canvas/issues/228))
  ([4c26d2a](https://github.com/motion-canvas/motion-canvas/commit/4c26d2aaf0c697486639aa917cd5c585d3d0ea74))
- **2d:** add smooth corners and sharpness to rect
  ([#310](https://github.com/motion-canvas/motion-canvas/issues/310))
  ([f7fbefd](https://github.com/motion-canvas/motion-canvas/commit/f7fbefd27f7f6972cfb5a45a68e5d0aed9593ae4))
- added a theme property to the CodeBlock component
  ([#279](https://github.com/motion-canvas/motion-canvas/issues/279))
  ([fe34fa8](https://github.com/motion-canvas/motion-canvas/commit/fe34fa8ebfe66cd356fb1c3d85adedef11e03b45))

# [2.2.0](https://github.com/motion-canvas/motion-canvas/compare/v2.1.0...v2.2.0) (2023-02-09)

### Features

- **2d:** add video component property getter
  ([#240](https://github.com/motion-canvas/motion-canvas/issues/240))
  ([59de5ab](https://github.com/motion-canvas/motion-canvas/commit/59de5ab2c089589773a2f9ad7588eda7d72693a7))

# [2.1.0](https://github.com/motion-canvas/motion-canvas/compare/v2.0.0...v2.1.0) (2023-02-07)

### Bug Fixes

- **2d:** fix font ligatures in CodeBlock
  ([#231](https://github.com/motion-canvas/motion-canvas/issues/231))
  ([11ee3fe](https://github.com/motion-canvas/motion-canvas/commit/11ee3fef5ad878313cf19833df6881333ced4dac))
- **2d:** fix Line cache
  ([#232](https://github.com/motion-canvas/motion-canvas/issues/232))
  ([a953b64](https://github.com/motion-canvas/motion-canvas/commit/a953b64540c020657845efc84d4179142a7a0974)),
  closes [#205](https://github.com/motion-canvas/motion-canvas/issues/205)
- **2d:** handle lines with no points
  ([#233](https://github.com/motion-canvas/motion-canvas/issues/233))
  ([8108474](https://github.com/motion-canvas/motion-canvas/commit/81084743dfad7b6419760796fda825047909d4d4)),
  closes [#212](https://github.com/motion-canvas/motion-canvas/issues/212)
- **2d:** improve Rect radius
  ([#221](https://github.com/motion-canvas/motion-canvas/issues/221))
  ([3437e42](https://github.com/motion-canvas/motion-canvas/commit/3437e42713a3f4a8d44d246ee01e2eb23b61e06a)),
  closes [#207](https://github.com/motion-canvas/motion-canvas/issues/207)
- **2d:** stop code highlighting from jumping
  ([#230](https://github.com/motion-canvas/motion-canvas/issues/230))
  ([67ef1c4](https://github.com/motion-canvas/motion-canvas/commit/67ef1c497056dd1f8f9e20d1d7fc1af03ec3849e))
- fix compound property setter
  ([#218](https://github.com/motion-canvas/motion-canvas/issues/218))
  ([6cd1b95](https://github.com/motion-canvas/motion-canvas/commit/6cd1b952df950554eb637c9f8e82947c415d00c5)),
  closes [#208](https://github.com/motion-canvas/motion-canvas/issues/208)
  [#210](https://github.com/motion-canvas/motion-canvas/issues/210)

# 2.0.0 (2023-02-04)

### Bug Fixes

- **2d:** add missing shape export
  ([#111](https://github.com/motion-canvas/motion-canvas/issues/111))
  ([02a1fa7](https://github.com/motion-canvas/motion-canvas/commit/02a1fa7ea62155e498809f2e57ff29a18c82ac12))
- **2d:** fix import order
  ([#94](https://github.com/motion-canvas/motion-canvas/issues/94))
  ([bcc0bcf](https://github.com/motion-canvas/motion-canvas/commit/bcc0bcffae47855bd8f7ab06454aaebe93c4aa24)),
  closes [#76](https://github.com/motion-canvas/motion-canvas/issues/76)
- **2d:** fix Line overview crashing
  ([#142](https://github.com/motion-canvas/motion-canvas/issues/142))
  ([6bd5fd9](https://github.com/motion-canvas/motion-canvas/commit/6bd5fd941e583e44f5d920ecd20215efb1eed58a))
- **2d:** some signal setters not returning owners
  ([#143](https://github.com/motion-canvas/motion-canvas/issues/143))
  ([09ab7f9](https://github.com/motion-canvas/motion-canvas/commit/09ab7f96afcaae608399a653c0b4878ba9b467d4))
- **2d:** switch iframes to ShadowDOM
  ([#90](https://github.com/motion-canvas/motion-canvas/issues/90))
  ([86176be](https://github.com/motion-canvas/motion-canvas/commit/86176be055c08aba59272afcda00ed586f6c7ad6))
- fix scaffolding
  ([#93](https://github.com/motion-canvas/motion-canvas/issues/93))
  ([95c55ed](https://github.com/motion-canvas/motion-canvas/commit/95c55ed338127dad22f42b24c8f6b101b8863be7))
- previous scene being rendered twice
  ([#97](https://github.com/motion-canvas/motion-canvas/issues/97))
  ([90205bd](https://github.com/motion-canvas/motion-canvas/commit/90205bdc1a086abe5f73b04cb4616c6af5ec4377))
- use correct scene sizes
  ([#146](https://github.com/motion-canvas/motion-canvas/issues/146))
  ([f279638](https://github.com/motion-canvas/motion-canvas/commit/f279638f9ad7ed1f4c44900d48c10c2d6560946e))

### Code Refactoring

- remove legacy package
  ([6a84120](https://github.com/motion-canvas/motion-canvas/commit/6a84120d949a32dff0ad413a9f359510ff109af1))

### Features

- **2d:** add methods for rearranging children
  ([#81](https://github.com/motion-canvas/motion-canvas/issues/81))
  ([63f6c1a](https://github.com/motion-canvas/motion-canvas/commit/63f6c1aa51ac4ecd093151c8cd30910f2e72bcac))
- **2d:** add option for preformatted text
  ([#147](https://github.com/motion-canvas/motion-canvas/issues/147))
  ([989be53](https://github.com/motion-canvas/motion-canvas/commit/989be532d86642e1125bb7fa62a801b09c1b8f26))
- **2d:** code selection and modification
  ([#163](https://github.com/motion-canvas/motion-canvas/issues/163))
  ([e8e884a](https://github.com/motion-canvas/motion-canvas/commit/e8e884a1a5574425dbf15272718911c12cfa2327))
- **2d:** construct lines using signals
  ([#133](https://github.com/motion-canvas/motion-canvas/issues/133))
  ([2968a24](https://github.com/motion-canvas/motion-canvas/commit/2968a2426564469fb4f4343fe71a6d30e95361f2))
- **2d:** improve property declarations
  ([27e7d26](https://github.com/motion-canvas/motion-canvas/commit/27e7d267ee91bf1e8ca79686b6ec31347f9f4d41))
- **2d:** improve Rect corner radius
  ([#120](https://github.com/motion-canvas/motion-canvas/issues/120))
  ([b471fe0](https://github.com/motion-canvas/motion-canvas/commit/b471fe0e37c0a426d3af8299c9c3c22539e7df05))
- **2d:** simplify layout prop
  ([c24cb12](https://github.com/motion-canvas/motion-canvas/commit/c24cb12a22b7c85fdfb051917fa9ee1e0911717c))
- **2d:** unify desired sizes
  ([#118](https://github.com/motion-canvas/motion-canvas/issues/118))
  ([401a799](https://github.com/motion-canvas/motion-canvas/commit/401a79946b034a96b9abff2f3fb5efd6cc9080f3))
- add advanced caching
  ([#69](https://github.com/motion-canvas/motion-canvas/issues/69))
  ([2a644c9](https://github.com/motion-canvas/motion-canvas/commit/2a644c9315acfcc5280a5eacc9904df140a61e4f))
- add base class for shapes
  ([#67](https://github.com/motion-canvas/motion-canvas/issues/67))
  ([d38c172](https://github.com/motion-canvas/motion-canvas/commit/d38c1724e129c553739cbfc27c4e5cd8f737f067))
- add basic logger
  ([#88](https://github.com/motion-canvas/motion-canvas/issues/88))
  ([3d82e86](https://github.com/motion-canvas/motion-canvas/commit/3d82e863af3dc88b3709adbcd0b84e790d05c3b8)),
  closes [#17](https://github.com/motion-canvas/motion-canvas/issues/17)
- add basic transform to Node class
  ([#83](https://github.com/motion-canvas/motion-canvas/issues/83))
  ([9e114c8](https://github.com/motion-canvas/motion-canvas/commit/9e114c8830a99c78e6a4fd9265b0e7552758af14))
- add cloning ([#80](https://github.com/motion-canvas/motion-canvas/issues/80))
  ([47d7a0f](https://github.com/motion-canvas/motion-canvas/commit/47d7a0fa5da9a03d8ed91557db651f6f960e28b1))
- add CodeBlock component based on code-fns to 2D
  ([#78](https://github.com/motion-canvas/motion-canvas/issues/78))
  ([ad346f1](https://github.com/motion-canvas/motion-canvas/commit/ad346f118d63b1e321ec315e1c70b925670124a1))
- add default renderer
  ([#63](https://github.com/motion-canvas/motion-canvas/issues/63))
  ([9255490](https://github.com/motion-canvas/motion-canvas/commit/92554900965fe088538f5e703dbab2fd84f904d7)),
  closes [#56](https://github.com/motion-canvas/motion-canvas/issues/56)
  [#58](https://github.com/motion-canvas/motion-canvas/issues/58)
- add Grid node
  ([e1f83da](https://github.com/motion-canvas/motion-canvas/commit/e1f83da1f43d20d392df4acb11e3df9cc457585d))
- add inspection
  ([#82](https://github.com/motion-canvas/motion-canvas/issues/82))
  ([4d7f2ae](https://github.com/motion-canvas/motion-canvas/commit/4d7f2aee6daeda1a2146b632dfdc28b455295776))
- add markdown logs
  ([#138](https://github.com/motion-canvas/motion-canvas/issues/138))
  ([e42447a](https://github.com/motion-canvas/motion-canvas/commit/e42447a0c07a8192c06d21c5f1801f0266279075))
- add missing layout props
  ([#72](https://github.com/motion-canvas/motion-canvas/issues/72))
  ([f808a56](https://github.com/motion-canvas/motion-canvas/commit/f808a562b192fd03dba4b0d353284db344d6a80b))
- add node spawners
  ([#149](https://github.com/motion-canvas/motion-canvas/issues/149))
  ([da18a4e](https://github.com/motion-canvas/motion-canvas/commit/da18a4e24104022a84ecd6cec1666b520186058f))
- add polyline ([#84](https://github.com/motion-canvas/motion-canvas/issues/84))
  ([4ceaf84](https://github.com/motion-canvas/motion-canvas/commit/4ceaf842915ac43d81f292c58a4dc73a8d1bb8e9))
- add random number generator
  ([#116](https://github.com/motion-canvas/motion-canvas/issues/116))
  ([d505312](https://github.com/motion-canvas/motion-canvas/commit/d5053123eef308c7a2a61d92b6e76c637f4ed0b8)),
  closes [#14](https://github.com/motion-canvas/motion-canvas/issues/14)
- add reparent helper
  ([80b95a9](https://github.com/motion-canvas/motion-canvas/commit/80b95a9ce89d4a2eeea7e467257486e961602d69))
- add Text and Image components
  ([#70](https://github.com/motion-canvas/motion-canvas/issues/70))
  ([85c7dcd](https://github.com/motion-canvas/motion-canvas/commit/85c7dcdb4f8ca2f0bfb03950c85a8d6f6652fcdf))
- add video node
  ([#86](https://github.com/motion-canvas/motion-canvas/issues/86))
  ([f4aa654](https://github.com/motion-canvas/motion-canvas/commit/f4aa65437a18cc85b00199f80cd5e04654c00c4b))
- better dependencies between packages
  ([#152](https://github.com/motion-canvas/motion-canvas/issues/152))
  ([a0a37b3](https://github.com/motion-canvas/motion-canvas/commit/a0a37b3645fcb91206e65fd0a95b2f486b308c75))
- better dependencies between packages
  ([#153](https://github.com/motion-canvas/motion-canvas/issues/153))
  ([59a73d4](https://github.com/motion-canvas/motion-canvas/commit/59a73d49a7b92c416e1f836a0f53bb676e9f924b))
- **core:** switch to vitest
  ([#99](https://github.com/motion-canvas/motion-canvas/issues/99))
  ([762eeb0](https://github.com/motion-canvas/motion-canvas/commit/762eeb0a99c2f378d20dbd147f815ba6736099d9)),
  closes [#48](https://github.com/motion-canvas/motion-canvas/issues/48)
- filter reordering
  ([#119](https://github.com/motion-canvas/motion-canvas/issues/119))
  ([2398d0f](https://github.com/motion-canvas/motion-canvas/commit/2398d0f9d57f36b47c9c66a988ca5607e9a3a30e))
- implement absolute scale setter
  ([842079a](https://github.com/motion-canvas/motion-canvas/commit/842079a6547af4032719c85837df3db7c1c6d30a))
- improve async signals
  ([#156](https://github.com/motion-canvas/motion-canvas/issues/156))
  ([db27b9d](https://github.com/motion-canvas/motion-canvas/commit/db27b9d5fb69a88f42afd98c86c4a1cdceb88ea1))
- introduce basic caching
  ([#68](https://github.com/motion-canvas/motion-canvas/issues/68))
  ([6420d36](https://github.com/motion-canvas/motion-canvas/commit/6420d362d0e4ae058f55b6ff6bb2a3a32dec559b))
- merge properties and signals
  ([#124](https://github.com/motion-canvas/motion-canvas/issues/124))
  ([da3ba83](https://github.com/motion-canvas/motion-canvas/commit/da3ba83d82ee74f5a5c3631b07597f08cdf9e8e4))
- minor improvements
  ([403c7c2](https://github.com/motion-canvas/motion-canvas/commit/403c7c27ad969880a14c498ec6cefb9e7e7b7544))
- minor improvements
  ([#77](https://github.com/motion-canvas/motion-canvas/issues/77))
  ([7c6e584](https://github.com/motion-canvas/motion-canvas/commit/7c6e584aca353c9af55f0acb61b32b5f99727dba))
- navigate to scene and node source
  ([#144](https://github.com/motion-canvas/motion-canvas/issues/144))
  ([86d495d](https://github.com/motion-canvas/motion-canvas/commit/86d495d01a9f8f0a58e676fedb6df9c12a14d14a))
- new animator ([#91](https://github.com/motion-canvas/motion-canvas/issues/91))
  ([d85f2f8](https://github.com/motion-canvas/motion-canvas/commit/d85f2f8a54c0f8bbfbc451884385f30e5b3ec206))
- signal error handling
  ([#89](https://github.com/motion-canvas/motion-canvas/issues/89))
  ([472ac65](https://github.com/motion-canvas/motion-canvas/commit/472ac65938b804a6b698c8522ec0c3b6bdbcf1b1))
- simplify size access
  ([#65](https://github.com/motion-canvas/motion-canvas/issues/65))
  ([3315e64](https://github.com/motion-canvas/motion-canvas/commit/3315e64641e9778bc48ea3fb707e3c0eeb581dfe))
- simplify size access further
  ([#66](https://github.com/motion-canvas/motion-canvas/issues/66))
  ([9091a5e](https://github.com/motion-canvas/motion-canvas/commit/9091a5e05d8fadf72c50832c7c4467ac4424b72c))
- switch to signals
  ([#64](https://github.com/motion-canvas/motion-canvas/issues/64))
  ([d22d237](https://github.com/motion-canvas/motion-canvas/commit/d22d23728597e6fa82ea5c5a99a6c0a56819bded))
- turn Layout into node
  ([#75](https://github.com/motion-canvas/motion-canvas/issues/75))
  ([cdf8dc0](https://github.com/motion-canvas/motion-canvas/commit/cdf8dc0a35522482dee2dd78a69606b79f52246e))
- unify core types
  ([#71](https://github.com/motion-canvas/motion-canvas/issues/71))
  ([9c5853d](https://github.com/motion-canvas/motion-canvas/commit/9c5853d8bc65204693c38109a25d1fefd44241b7))
- unify references and signals
  ([#137](https://github.com/motion-canvas/motion-canvas/issues/137))
  ([063aede](https://github.com/motion-canvas/motion-canvas/commit/063aede0842f948d2c6704c6edd426e954bb4668))

### Reverts

- ci(release): 1.0.1 [skip ci]
  ([#175](https://github.com/motion-canvas/motion-canvas/issues/175))
  ([161a046](https://github.com/motion-canvas/motion-canvas/commit/161a04647ecdc8203daf2d887a6a44c79a92ee20))
- ci(release): 2.0.0 [skip ci]
  ([#176](https://github.com/motion-canvas/motion-canvas/issues/176))
  ([551096b](https://github.com/motion-canvas/motion-canvas/commit/551096bf636a791ea7c7c1d38d8e03c360433008))

### BREAKING CHANGES

- remove legacy package
