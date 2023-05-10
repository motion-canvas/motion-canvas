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

- **core:** clear DependencyContext promises once resolved
  ([#617](https://github.com/motion-canvas/motion-canvas/issues/617))
  ([97b68da](https://github.com/motion-canvas/motion-canvas/commit/97b68dabfdf86c0e0a188212308b8aba0fb35cab))
- **core:** fix snapshots
  ([#638](https://github.com/motion-canvas/motion-canvas/issues/638))
  ([437cc5e](https://github.com/motion-canvas/motion-canvas/commit/437cc5efddbb242b10f7902e18fe15162a45d7bd))

### Features

- **2d:** add fromDegrees method to Vector2
  ([#622](https://github.com/motion-canvas/motion-canvas/issues/622))
  ([e78b9d5](https://github.com/motion-canvas/motion-canvas/commit/e78b9d51674269ab82e0c2fe4c475b5799b94975))
- add DEG2RAD and RAD2DEG constants
  ([#630](https://github.com/motion-canvas/motion-canvas/issues/630))
  ([01801e8](https://github.com/motion-canvas/motion-canvas/commit/01801e8766058e75a6a020400650fb00f8f430cc))
- **core:** add `loopFor` function
  ([#650](https://github.com/motion-canvas/motion-canvas/issues/650))
  ([a42eb52](https://github.com/motion-canvas/motion-canvas/commit/a42eb520fef7de06038f0df9eaad1fa35122c97a))
- **core:** add `loopUntil` function
  ([#624](https://github.com/motion-canvas/motion-canvas/issues/624))
  ([b7aa4b5](https://github.com/motion-canvas/motion-canvas/commit/b7aa4b57c76374e67bd19ce40c44cd650cf67327))
- **core:** add helper method for arc lerps
  ([#640](https://github.com/motion-canvas/motion-canvas/issues/640))
  ([bc304d2](https://github.com/motion-canvas/motion-canvas/commit/bc304d242e4819650fa86636180ac5594ba743d3))
- **core:** improve `SignalGenerator` chaining
  ([#651](https://github.com/motion-canvas/motion-canvas/issues/651))
  ([de72f1f](https://github.com/motion-canvas/motion-canvas/commit/de72f1f70edf7cc48fd670d9b38e0cc27f8bdb57)),
  closes [#480](https://github.com/motion-canvas/motion-canvas/issues/480)
- **core:** thread pausing
  ([#639](https://github.com/motion-canvas/motion-canvas/issues/639))
  ([c0aab58](https://github.com/motion-canvas/motion-canvas/commit/c0aab588b18c267d3bc04e25b2f80c792496dda2))

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.4.0](https://github.com/motion-canvas/motion-canvas/compare/v3.3.4...v3.4.0) (2023-03-28)

### Features

- auto meta fields
  ([#565](https://github.com/motion-canvas/motion-canvas/issues/565))
  ([645af6d](https://github.com/motion-canvas/motion-canvas/commit/645af6d2b7e8d9332b6f08419c318ee9434d7f3f))
- **core:** expand Vector2 type
  ([#579](https://github.com/motion-canvas/motion-canvas/issues/579))
  ([010bba5](https://github.com/motion-canvas/motion-canvas/commit/010bba593e1c3ce368ab409dce09dbde8f999958))
- plugin architecture
  ([#564](https://github.com/motion-canvas/motion-canvas/issues/564))
  ([1c375b8](https://github.com/motion-canvas/motion-canvas/commit/1c375b81e0af8a76467d42dd46a7031adb9d71d3))

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.3.4](https://github.com/motion-canvas/motion-canvas/compare/v3.3.3...v3.3.4) (2023-03-19)

### Bug Fixes

- **core:** fix tree shaking
  ([#555](https://github.com/motion-canvas/motion-canvas/issues/555))
  ([8de199e](https://github.com/motion-canvas/motion-canvas/commit/8de199eaf833622a96ad746c984fb7f3a77df4b8))

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.3.0](https://github.com/motion-canvas/motion-canvas/compare/v3.2.1...v3.3.0) (2023-03-18)

### Bug Fixes

- restrict size of cache canvas
  ([#544](https://github.com/motion-canvas/motion-canvas/issues/544))
  ([49ec554](https://github.com/motion-canvas/motion-canvas/commit/49ec55490718e503d9a39437ae13c189dc4fe9ea))

### Features

- add option to group output by scenes
  ([#477](https://github.com/motion-canvas/motion-canvas/issues/477))
  ([9934593](https://github.com/motion-canvas/motion-canvas/commit/99345937e7ac92fb674fdee10288e467ffd941e2))
- **core:** preserve custom fields in meta files
  ([#534](https://github.com/motion-canvas/motion-canvas/issues/534))
  ([2e3e22e](https://github.com/motion-canvas/motion-canvas/commit/2e3e22efd62ba671624526fc10ea7dd2a04a5240))
- **core:** tree shaking
  ([#523](https://github.com/motion-canvas/motion-canvas/issues/523))
  ([65fec78](https://github.com/motion-canvas/motion-canvas/commit/65fec7825fda33812b13f57bfeb1d82193a5d190))
- **docs:** fiddle editor
  ([#542](https://github.com/motion-canvas/motion-canvas/issues/542))
  ([3c68fef](https://github.com/motion-canvas/motion-canvas/commit/3c68fefdf7bf375ee9345aba7dbf9e5ff35e3c3d))
- update vite from v3 to v4
  ([#495](https://github.com/motion-canvas/motion-canvas/issues/495))
  ([c409eee](https://github.com/motion-canvas/motion-canvas/commit/c409eee0e61b67e43afed240c5ae279714681246)),
  closes [#197](https://github.com/motion-canvas/motion-canvas/issues/197)

# [3.2.0](https://github.com/motion-canvas/motion-canvas/compare/v3.1.0...v3.2.0) (2023-03-10)

### Features

- display current package versions
  ([#501](https://github.com/motion-canvas/motion-canvas/issues/501))
  ([2972f67](https://github.com/motion-canvas/motion-canvas/commit/2972f673e201310e69688ab6f2c1adf1cddf2bf3))
- use PossibleVector2 in Vector2 methods
  ([#478](https://github.com/motion-canvas/motion-canvas/issues/478))
  ([8ccb44a](https://github.com/motion-canvas/motion-canvas/commit/8ccb44a265016e25b2b177a65d44f801c9d861f9))
- world space cache
  ([#498](https://github.com/motion-canvas/motion-canvas/issues/498))
  ([633e9e1](https://github.com/motion-canvas/motion-canvas/commit/633e9e140dfbbe397df6ddc1f96ed30782ddce94)),
  closes [#342](https://github.com/motion-canvas/motion-canvas/issues/342)

# [3.1.0](https://github.com/motion-canvas/motion-canvas/compare/v3.0.2...v3.1.0) (2023-03-07)

### Bug Fixes

- **core:** fix playback state
  ([#471](https://github.com/motion-canvas/motion-canvas/issues/471))
  ([1c259d0](https://github.com/motion-canvas/motion-canvas/commit/1c259d0d574bb56dbc8bc448300d9b94ee4d0bc4))
- **core:** fix relative time
  ([#461](https://github.com/motion-canvas/motion-canvas/issues/461))
  ([8d4946e](https://github.com/motion-canvas/motion-canvas/commit/8d4946ebf56590bc3934087f95955180b4901566))
- support multiple async players
  ([#450](https://github.com/motion-canvas/motion-canvas/issues/450))
  ([d7ec469](https://github.com/motion-canvas/motion-canvas/commit/d7ec469e747eefd909f4dd59dd713f5d86308222)),
  closes [#434](https://github.com/motion-canvas/motion-canvas/issues/434)

### Features

- **core:** add intersects method to BBox
  ([#485](https://github.com/motion-canvas/motion-canvas/issues/485))
  ([604b0e7](https://github.com/motion-canvas/motion-canvas/commit/604b0e7c22b4e5d196310e650f7c764526a80712))
- **core:** presentation mode
  ([#486](https://github.com/motion-canvas/motion-canvas/issues/486))
  ([c4f2e48](https://github.com/motion-canvas/motion-canvas/commit/c4f2e48ae6c65804ae46edd88c29125b7f983d5c))
- navigate to slide source
  ([#490](https://github.com/motion-canvas/motion-canvas/issues/490))
  ([b5ae4bf](https://github.com/motion-canvas/motion-canvas/commit/b5ae4bf37076b262a20949cca030db3902186c8d))

# [3.0.0](https://github.com/motion-canvas/motion-canvas/compare/v2.6.0...v3.0.0) (2023-02-27)

### Bug Fixes

- **core:** clear semi-transparent backgrounds
  ([#424](https://github.com/motion-canvas/motion-canvas/issues/424))
  ([1ebff1c](https://github.com/motion-canvas/motion-canvas/commit/1ebff1c92bebce56d11c61eb9dadca47f5a80ac1)),
  closes [#423](https://github.com/motion-canvas/motion-canvas/issues/423)
- **core:** fix Vector2.exactlyEquals
  ([#437](https://github.com/motion-canvas/motion-canvas/issues/437))
  ([028d264](https://github.com/motion-canvas/motion-canvas/commit/028d26499d8f3fb34500b22e8dcde2d080c2e2b0))
- **core:** render only within the range
  ([#436](https://github.com/motion-canvas/motion-canvas/issues/436))
  ([36ccebe](https://github.com/motion-canvas/motion-canvas/commit/36ccebe5321d84eeaa16f8b74a79c1001ee7ac0b))

### Code Refactoring

- introduce improved names
  ([#425](https://github.com/motion-canvas/motion-canvas/issues/425))
  ([4a2188d](https://github.com/motion-canvas/motion-canvas/commit/4a2188d339587fa658b2134befc3fe63c835c5d7))

### Features

- new playback architecture
  ([#402](https://github.com/motion-canvas/motion-canvas/issues/402))
  ([bbe3e2a](https://github.com/motion-canvas/motion-canvas/commit/bbe3e2a24de068a88f49ed7a2f13e9717039733b)),
  closes [#166](https://github.com/motion-canvas/motion-canvas/issues/166)

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

### Features

- **2d:** add save and restore methods to nodes
  ([#406](https://github.com/motion-canvas/motion-canvas/issues/406))
  ([870e194](https://github.com/motion-canvas/motion-canvas/commit/870e1947d97382bc6d82857c077140bbef7cf7e8))
- **vite-plugin:** add CORS Proxy
  ([#357](https://github.com/motion-canvas/motion-canvas/issues/357))
  ([a3c5822](https://github.com/motion-canvas/motion-canvas/commit/a3c58228b7d3dab08fc27414d19870d35773b280)),
  closes [#338](https://github.com/motion-canvas/motion-canvas/issues/338)

# [2.5.0](https://github.com/motion-canvas/motion-canvas/compare/v2.4.0...v2.5.0) (2023-02-20)

### Bug Fixes

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

- **core:** add fadeTransition
  ([#384](https://github.com/motion-canvas/motion-canvas/issues/384))
  ([a248785](https://github.com/motion-canvas/motion-canvas/commit/a248785e87d1c6ebc08581f4fda6be428a89824c))
- **core:** add spring interpolation
  ([#356](https://github.com/motion-canvas/motion-canvas/issues/356))
  ([1463b15](https://github.com/motion-canvas/motion-canvas/commit/1463b1592e22fad9d8298c11270e2099119e2229))
- **core:** add step parameter to range function
  ([#373](https://github.com/motion-canvas/motion-canvas/issues/373))
  ([923209a](https://github.com/motion-canvas/motion-canvas/commit/923209a4106c8e7f570853dcc47a10e65e0d04d8))

# [2.4.0](https://github.com/motion-canvas/motion-canvas/compare/v2.3.0...v2.4.0) (2023-02-18)

### Bug Fixes

- **core:** playback speed is reset after saving with faulty code
  ([#204](https://github.com/motion-canvas/motion-canvas/issues/204)).
  ([#339](https://github.com/motion-canvas/motion-canvas/issues/339))
  ([6771e5e](https://github.com/motion-canvas/motion-canvas/commit/6771e5e17edcdc4cce074d7da0962cf71ba6c228))

### Features

- **2d:** add default computed values for signals
  ([#259](https://github.com/motion-canvas/motion-canvas/issues/259))
  ([18f61a6](https://github.com/motion-canvas/motion-canvas/commit/18f61a668420dec8afba52d52a6557e7a7919ba2))
- **core:** add Matrix2D type
  ([#340](https://github.com/motion-canvas/motion-canvas/issues/340))
  ([66b41e6](https://github.com/motion-canvas/motion-canvas/commit/66b41e6beaca5c2ba4b6bd1a7e68ca16d183b0e9))
- **core:** error double event name
  ([#341](https://github.com/motion-canvas/motion-canvas/issues/341))
  ([053b2a6](https://github.com/motion-canvas/motion-canvas/commit/053b2a6c22c4e726e3962fdaf0a2e8d149889a9b))

# [2.3.0](https://github.com/motion-canvas/motion-canvas/compare/v2.2.0...v2.3.0) (2023-02-11)

### Features

- **core:** add `debug` helper function
  ([#293](https://github.com/motion-canvas/motion-canvas/issues/293))
  ([b870873](https://github.com/motion-canvas/motion-canvas/commit/b8708732af0fc08d9ff9eeecbbb77d65f1b36eb8))
- **core:** additional easing functions
  ([#274](https://github.com/motion-canvas/motion-canvas/issues/274))
  ([f81ce43](https://github.com/motion-canvas/motion-canvas/commit/f81ce43019fe253e99f4ab6311c2251b40e2eae3))
- **core:** disallow tweening to/from undefined values
  ([#257](https://github.com/motion-canvas/motion-canvas/issues/257))
  ([d4bb791](https://github.com/motion-canvas/motion-canvas/commit/d4bb79145300b52c4b4d101df2afaff5ea11a9e9))

# [2.2.0](https://github.com/motion-canvas/motion-canvas/compare/v2.1.0...v2.2.0) (2023-02-09)

### Features

- project variables
  ([#255](https://github.com/motion-canvas/motion-canvas/issues/255))
  ([4883295](https://github.com/motion-canvas/motion-canvas/commit/488329525939928af52b4a4d8488f1e1cd4cf6f7))

# [2.1.0](https://github.com/motion-canvas/motion-canvas/compare/v2.0.0...v2.1.0) (2023-02-07)

### Bug Fixes

- **core:** fix looping
  ([#217](https://github.com/motion-canvas/motion-canvas/issues/217))
  ([a38e1a7](https://github.com/motion-canvas/motion-canvas/commit/a38e1a7c8fc21384cc17f3f982802071b8cd0cbf)),
  closes [#178](https://github.com/motion-canvas/motion-canvas/issues/178)
- fix compound property setter
  ([#218](https://github.com/motion-canvas/motion-canvas/issues/218))
  ([6cd1b95](https://github.com/motion-canvas/motion-canvas/commit/6cd1b952df950554eb637c9f8e82947c415d00c5)),
  closes [#208](https://github.com/motion-canvas/motion-canvas/issues/208)
  [#210](https://github.com/motion-canvas/motion-canvas/issues/210)

### Features

- add `useDuration` helper
  ([#226](https://github.com/motion-canvas/motion-canvas/issues/226))
  ([fa97d6c](https://github.com/motion-canvas/motion-canvas/commit/fa97d6c7f076f287c9b86d2f8852341bd368ef1c)),
  closes [#171](https://github.com/motion-canvas/motion-canvas/issues/171)

# 2.0.0 (2023-02-04)

### Bug Fixes

- **core:** add missing type references
  ([#41](https://github.com/motion-canvas/motion-canvas/issues/41))
  ([325c244](https://github.com/motion-canvas/motion-canvas/commit/325c2442814ca19407fe0060a819aded4456f90e))
- **core:** keep falsy values with deepTween
  ([#45](https://github.com/motion-canvas/motion-canvas/issues/45))
  ([93c934f](https://github.com/motion-canvas/motion-canvas/commit/93c934f9b59462581267cca5033bf132b831ce54))
- empty time events crashing
  ([a1c53de](https://github.com/motion-canvas/motion-canvas/commit/a1c53deba7c405ddf1a3b4874f22b63e0b085af9))
- fix scaffolding
  ([#93](https://github.com/motion-canvas/motion-canvas/issues/93))
  ([95c55ed](https://github.com/motion-canvas/motion-canvas/commit/95c55ed338127dad22f42b24c8f6b101b8863be7))
- fix tsdoc comments
  ([#21](https://github.com/motion-canvas/motion-canvas/issues/21))
  ([4b6cb66](https://github.com/motion-canvas/motion-canvas/commit/4b6cb660ad82befcfd41188c7a8f9c8c0cba93ed)),
  closes [#18](https://github.com/motion-canvas/motion-canvas/issues/18)
- previous scene being rendered twice
  ([#97](https://github.com/motion-canvas/motion-canvas/issues/97))
  ([90205bd](https://github.com/motion-canvas/motion-canvas/commit/90205bdc1a086abe5f73b04cb4616c6af5ec4377))
- support hmr when navigating
  ([370ea16](https://github.com/motion-canvas/motion-canvas/commit/370ea1676a1c34313c0fb917c0f0691538f72016))
- use correct scene sizes
  ([#146](https://github.com/motion-canvas/motion-canvas/issues/146))
  ([f279638](https://github.com/motion-canvas/motion-canvas/commit/f279638f9ad7ed1f4c44900d48c10c2d6560946e))

### Features

- **2d:** improve property declarations
  ([27e7d26](https://github.com/motion-canvas/motion-canvas/commit/27e7d267ee91bf1e8ca79686b6ec31347f9f4d41))
- **2d:** improve Rect corner radius
  ([#120](https://github.com/motion-canvas/motion-canvas/issues/120))
  ([b471fe0](https://github.com/motion-canvas/motion-canvas/commit/b471fe0e37c0a426d3af8299c9c3c22539e7df05))
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
- add deprecation support
  ([#130](https://github.com/motion-canvas/motion-canvas/issues/130))
  ([da0e104](https://github.com/motion-canvas/motion-canvas/commit/da0e104451af72eedb3eedd998f60b305fffdb0e))
- add docs to monorepo
  ([#22](https://github.com/motion-canvas/motion-canvas/issues/22))
  ([129d557](https://github.com/motion-canvas/motion-canvas/commit/129d557004c63df7a4ed514d0503709f03cf6e6b))
- add E2E testing
  ([#101](https://github.com/motion-canvas/motion-canvas/issues/101))
  ([6398c54](https://github.com/motion-canvas/motion-canvas/commit/6398c54e4c4d6667ce9f45b9bbef6ea110ea2215)),
  closes [#42](https://github.com/motion-canvas/motion-canvas/issues/42)
- add Grid node
  ([e1f83da](https://github.com/motion-canvas/motion-canvas/commit/e1f83da1f43d20d392df4acb11e3df9cc457585d))
- add inspection
  ([#82](https://github.com/motion-canvas/motion-canvas/issues/82))
  ([4d7f2ae](https://github.com/motion-canvas/motion-canvas/commit/4d7f2aee6daeda1a2146b632dfdc28b455295776))
- add markdown logs
  ([#138](https://github.com/motion-canvas/motion-canvas/issues/138))
  ([e42447a](https://github.com/motion-canvas/motion-canvas/commit/e42447a0c07a8192c06d21c5f1801f0266279075))
- add node spawners
  ([#149](https://github.com/motion-canvas/motion-canvas/issues/149))
  ([da18a4e](https://github.com/motion-canvas/motion-canvas/commit/da18a4e24104022a84ecd6cec1666b520186058f))
- add polyline ([#84](https://github.com/motion-canvas/motion-canvas/issues/84))
  ([4ceaf84](https://github.com/motion-canvas/motion-canvas/commit/4ceaf842915ac43d81f292c58a4dc73a8d1bb8e9))
- add random number generator
  ([#116](https://github.com/motion-canvas/motion-canvas/issues/116))
  ([d505312](https://github.com/motion-canvas/motion-canvas/commit/d5053123eef308c7a2a61d92b6e76c637f4ed0b8)),
  closes [#14](https://github.com/motion-canvas/motion-canvas/issues/14)
- add rendering again
  ([#43](https://github.com/motion-canvas/motion-canvas/issues/43))
  ([c10d3db](https://github.com/motion-canvas/motion-canvas/commit/c10d3dbb63f6248eda04128ef0aa9d72c1edfcf7))
- add reparent helper
  ([80b95a9](https://github.com/motion-canvas/motion-canvas/commit/80b95a9ce89d4a2eeea7e467257486e961602d69))
- add scaffolding package
  ([#36](https://github.com/motion-canvas/motion-canvas/issues/36))
  ([266a561](https://github.com/motion-canvas/motion-canvas/commit/266a561c619b57b403ec9c64185985b48bff29da)),
  closes [#30](https://github.com/motion-canvas/motion-canvas/issues/30)
- add Text and Image components
  ([#70](https://github.com/motion-canvas/motion-canvas/issues/70))
  ([85c7dcd](https://github.com/motion-canvas/motion-canvas/commit/85c7dcdb4f8ca2f0bfb03950c85a8d6f6652fcdf))
- add video node
  ([#86](https://github.com/motion-canvas/motion-canvas/issues/86))
  ([f4aa654](https://github.com/motion-canvas/motion-canvas/commit/f4aa65437a18cc85b00199f80cd5e04654c00c4b))
- added file type and quality options to rendering panel
  ([#50](https://github.com/motion-canvas/motion-canvas/issues/50))
  ([bee71ef](https://github.com/motion-canvas/motion-canvas/commit/bee71ef2673c269db47a4433831720b7ad0fb4e8)),
  closes [#24](https://github.com/motion-canvas/motion-canvas/issues/24)
- better naming conventions
  ([#62](https://github.com/motion-canvas/motion-canvas/issues/62))
  ([a9d764f](https://github.com/motion-canvas/motion-canvas/commit/a9d764fbceb639497ef45f44c90f9b6e408213d3))
- **core:** add configurable line numbers
  ([#44](https://github.com/motion-canvas/motion-canvas/issues/44))
  ([831334c](https://github.com/motion-canvas/motion-canvas/commit/831334ca32a504991e875af37446fef4f055c285)),
  closes [#12](https://github.com/motion-canvas/motion-canvas/issues/12)
- **core:** switch to vitest
  ([#99](https://github.com/motion-canvas/motion-canvas/issues/99))
  ([762eeb0](https://github.com/motion-canvas/motion-canvas/commit/762eeb0a99c2f378d20dbd147f815ba6736099d9)),
  closes [#48](https://github.com/motion-canvas/motion-canvas/issues/48)
- detect circular signal dependencies
  ([#129](https://github.com/motion-canvas/motion-canvas/issues/129))
  ([6fcdb41](https://github.com/motion-canvas/motion-canvas/commit/6fcdb41df90dca1c39537a4f6d4960ab551f4d6e))
- editor improvements
  ([#121](https://github.com/motion-canvas/motion-canvas/issues/121))
  ([e8b32ce](https://github.com/motion-canvas/motion-canvas/commit/e8b32ceff1b8216282c4b5713508ce1172645e20))
- extract konva to separate package
  ([#60](https://github.com/motion-canvas/motion-canvas/issues/60))
  ([4ecad3c](https://github.com/motion-canvas/motion-canvas/commit/4ecad3ca2732bd5147af670c230f8f959129a707))
- implement absolute scale setter
  ([842079a](https://github.com/motion-canvas/motion-canvas/commit/842079a6547af4032719c85837df3db7c1c6d30a))
- improve async signals
  ([#156](https://github.com/motion-canvas/motion-canvas/issues/156))
  ([db27b9d](https://github.com/motion-canvas/motion-canvas/commit/db27b9d5fb69a88f42afd98c86c4a1cdceb88ea1))
- introduce basic caching
  ([#68](https://github.com/motion-canvas/motion-canvas/issues/68))
  ([6420d36](https://github.com/motion-canvas/motion-canvas/commit/6420d362d0e4ae058f55b6ff6bb2a3a32dec559b))
- make exporting concurrent
  ([4f9ef8d](https://github.com/motion-canvas/motion-canvas/commit/4f9ef8d40d9d9c1147e2edfc0766c5ea5cc4297c))
- make scenes independent of names
  ([#53](https://github.com/motion-canvas/motion-canvas/issues/53))
  ([417617e](https://github.com/motion-canvas/motion-canvas/commit/417617eb5f0af771e7413c9ce4c7e9b998e3e490)),
  closes [#25](https://github.com/motion-canvas/motion-canvas/issues/25)
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
- open time events in editor
  ([#87](https://github.com/motion-canvas/motion-canvas/issues/87))
  ([74b781d](https://github.com/motion-canvas/motion-canvas/commit/74b781d57fca7ef1d10904673276f2a7354c01b8))
- signal error handling
  ([#89](https://github.com/motion-canvas/motion-canvas/issues/89))
  ([472ac65](https://github.com/motion-canvas/motion-canvas/commit/472ac65938b804a6b698c8522ec0c3b6bdbcf1b1))
- simplify size access further
  ([#66](https://github.com/motion-canvas/motion-canvas/issues/66))
  ([9091a5e](https://github.com/motion-canvas/motion-canvas/commit/9091a5e05d8fadf72c50832c7c4467ac4424b72c))
- support for multiple projects
  ([#57](https://github.com/motion-canvas/motion-canvas/issues/57))
  ([573752d](https://github.com/motion-canvas/motion-canvas/commit/573752dd4d79d62a1a30958f1ed550d2cf22c344)),
  closes [#141414](https://github.com/motion-canvas/motion-canvas/issues/141414)
- support multiple players
  ([#128](https://github.com/motion-canvas/motion-canvas/issues/128))
  ([24f75cf](https://github.com/motion-canvas/motion-canvas/commit/24f75cf7cdaf38f890e3936edf175afbfd340210))
- switch to monorepo
  ([6c8d190](https://github.com/motion-canvas/motion-canvas/commit/6c8d190c7d3d24bb4eac29eeb4b6d1abf370e160)),
  closes [#23](https://github.com/motion-canvas/motion-canvas/issues/23)
  [#86](https://github.com/motion-canvas/motion-canvas/issues/86)
  [#49](https://github.com/motion-canvas/motion-canvas/issues/49)
- switch to signals
  ([#64](https://github.com/motion-canvas/motion-canvas/issues/64))
  ([d22d237](https://github.com/motion-canvas/motion-canvas/commit/d22d23728597e6fa82ea5c5a99a6c0a56819bded))
- switch to Vite
  ([#28](https://github.com/motion-canvas/motion-canvas/issues/28))
  ([65b9133](https://github.com/motion-canvas/motion-canvas/commit/65b91337dbc47fe51cecc83657f79fab15343a0d)),
  closes [#141414](https://github.com/motion-canvas/motion-canvas/issues/141414)
  [#13](https://github.com/motion-canvas/motion-canvas/issues/13)
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

- "ci(release): 9.1.3 [skip ci]"
  ([62953a6](https://github.com/motion-canvas/motion-canvas/commit/62953a6a8a1b1da3eb2e5f51c9fe60c716d6b94b))
- ci(release): 1.0.1 [skip ci]
  ([#175](https://github.com/motion-canvas/motion-canvas/issues/175))
  ([161a046](https://github.com/motion-canvas/motion-canvas/commit/161a04647ecdc8203daf2d887a6a44c79a92ee20))
- ci(release): 2.0.0 [skip ci]
  ([#176](https://github.com/motion-canvas/motion-canvas/issues/176))
  ([551096b](https://github.com/motion-canvas/motion-canvas/commit/551096bf636a791ea7c7c1d38d8e03c360433008))

### BREAKING CHANGES

- change names of timing and interpolation functions

`TweenFunction` is now called `InterpolationFunction`. Individual functions are
now called `[type]Lerp` instead of `[type]Tween`. For instance: `colorTween` is
now `colorLerp`.

`InterpolationFunction` is now called `TimingFunction`. This name is better
aligned with the CSS spec.

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
