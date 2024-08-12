# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.16.0](https://github.com/motion-canvas/motion-canvas/compare/v3.15.2...v3.16.0) (2024-05-16)


### Bug Fixes

* **2d:** fix Code size calculation ([#1025](https://github.com/motion-canvas/motion-canvas/issues/1025)) ([696fbad](https://github.com/motion-canvas/motion-canvas/commit/696fbade129af50f23b0a65ca0ba0f625c3ca9f1)), closes [#1024](https://github.com/motion-canvas/motion-canvas/issues/1024)
* **2d:** fix layout gap prop type ([#1039](https://github.com/motion-canvas/motion-canvas/issues/1039)) ([944b48f](https://github.com/motion-canvas/motion-canvas/commit/944b48fff891c2cbbcc89ccb141ec197ecda4752)), closes [#1032](https://github.com/motion-canvas/motion-canvas/issues/1032)
* **2d:** fix shader destination uv ([#1026](https://github.com/motion-canvas/motion-canvas/issues/1026)) ([b591c41](https://github.com/motion-canvas/motion-canvas/commit/b591c4103e7fe83773ed9a6e43fbe3f00404bea0)), closes [#1013](https://github.com/motion-canvas/motion-canvas/issues/1013)
* **core:** handle invalid time event values ([#1044](https://github.com/motion-canvas/motion-canvas/issues/1044)) ([4638a36](https://github.com/motion-canvas/motion-canvas/commit/4638a36c14714ada201d91ddfaff05c39455595f)), closes [#1036](https://github.com/motion-canvas/motion-canvas/issues/1036)


### Features

* **2d:** access vertex data of Polygons ([#1045](https://github.com/motion-canvas/motion-canvas/issues/1045)) ([6bfc25f](https://github.com/motion-canvas/motion-canvas/commit/6bfc25f84523e6640572bec38b3f5b5ff1e211c3)), closes [#1041](https://github.com/motion-canvas/motion-canvas/issues/1041)
* **2d:** add camera node ([#1019](https://github.com/motion-canvas/motion-canvas/issues/1019)) ([4ca346b](https://github.com/motion-canvas/motion-canvas/commit/4ca346bcb80e8aba1d83ba407a483d60eb942c6c))
* **docs:** add Code node documentation ([#1023](https://github.com/motion-canvas/motion-canvas/issues/1023)) ([faa9508](https://github.com/motion-canvas/motion-canvas/commit/faa95089161f820ac8231d85f766666fe84898ad))
* mathematical operations for vector signals ([#1030](https://github.com/motion-canvas/motion-canvas/issues/1030)) ([c5b02d1](https://github.com/motion-canvas/motion-canvas/commit/c5b02d18c984c5def49e723d733f9c03c69d45d1)), closes [#967](https://github.com/motion-canvas/motion-canvas/issues/967)
* signal effects ([#1043](https://github.com/motion-canvas/motion-canvas/issues/1043)) ([00fa967](https://github.com/motion-canvas/motion-canvas/commit/00fa96772a36ac8c2f1431073aeb78571becb6f7)), closes [#945](https://github.com/motion-canvas/motion-canvas/issues/945)





## [3.15.2](https://github.com/motion-canvas/motion-canvas/compare/v3.15.1...v3.15.2) (2024-04-02)


### Bug Fixes

* **2d:** fix transition scaling ([#1017](https://github.com/motion-canvas/motion-canvas/issues/1017)) ([bccf8a9](https://github.com/motion-canvas/motion-canvas/commit/bccf8a9ab157c56e7599b4bb508c612137983ca3))
* **core:** reset playback state on presentation abort ([#1016](https://github.com/motion-canvas/motion-canvas/issues/1016)) ([511231b](https://github.com/motion-canvas/motion-canvas/commit/511231b9f6c34da3b4fc938024613bcf1d281920))





## [3.15.1](https://github.com/motion-canvas/motion-canvas/compare/v3.15.0...v3.15.1) (2024-03-21)


### Bug Fixes

* optimize saving frames to disk ([#1007](https://github.com/motion-canvas/motion-canvas/issues/1007)) ([d79af91](https://github.com/motion-canvas/motion-canvas/commit/d79af91a4caa5bcf3ca98ec3a4b6d892c29c7fd9))
* **ui:** fix color picker ([#1008](https://github.com/motion-canvas/motion-canvas/issues/1008)) ([dfc2dae](https://github.com/motion-canvas/motion-canvas/commit/dfc2dae047339cc3796b8ee3594ad14de60aba5a))





# [3.15.0](https://github.com/motion-canvas/motion-canvas/compare/v3.14.2...v3.15.0) (2024-03-21)


### Bug Fixes

* **2d:** fix code animations ([#998](https://github.com/motion-canvas/motion-canvas/issues/998)) ([d4e1c9a](https://github.com/motion-canvas/motion-canvas/commit/d4e1c9a96fd69cb71937ad7034f86da18421e738))
* **2d:** fix spline warning for reactive points ([#981](https://github.com/motion-canvas/motion-canvas/issues/981)) ([d426508](https://github.com/motion-canvas/motion-canvas/commit/d42650876b8be8e79a5bfd35519d937679610dcc)), closes [#979](https://github.com/motion-canvas/motion-canvas/issues/979)
* **2d:** respect offset in absolute positions ([#987](https://github.com/motion-canvas/motion-canvas/issues/987)) ([491080d](https://github.com/motion-canvas/motion-canvas/commit/491080d3d05bd8ae97374577c7013471c1e4b787))
* account for italic fonts in cache ([#968](https://github.com/motion-canvas/motion-canvas/issues/968)) ([abb0906](https://github.com/motion-canvas/motion-canvas/commit/abb090695c4257d9877d0cb11954093c49149ddc)), closes [#934](https://github.com/motion-canvas/motion-canvas/issues/934)
* **docs:** fix typo in quickstart.mdx ([#974](https://github.com/motion-canvas/motion-canvas/issues/974)) ([978ab83](https://github.com/motion-canvas/motion-canvas/commit/978ab83df172f3c5165d4738969a4e74efef77b5))


### Features

* **2d:** add withDefaults helper ([#982](https://github.com/motion-canvas/motion-canvas/issues/982)) ([6bd072a](https://github.com/motion-canvas/motion-canvas/commit/6bd072ad22751930161969a15f568d93fedee67b))
* **2d:** code bounding box helpers ([#948](https://github.com/motion-canvas/motion-canvas/issues/948)) ([0ffd56f](https://github.com/motion-canvas/motion-canvas/commit/0ffd56f5f8076913e687e5b908311aa7832d8b7b))
* **2d:** code range helpers ([#947](https://github.com/motion-canvas/motion-canvas/issues/947)) ([044c9ac](https://github.com/motion-canvas/motion-canvas/commit/044c9acd6ee7e4e337fb4d51286126f583a8da6f))
* **2d:** improve Code node ([#989](https://github.com/motion-canvas/motion-canvas/issues/989)) ([6e7aaf0](https://github.com/motion-canvas/motion-canvas/commit/6e7aaf0a28ade6ab6eeeb537c1c06ab38c4858cb))
* **2d:** make Code not experimental ([#1000](https://github.com/motion-canvas/motion-canvas/issues/1000)) ([aa871a1](https://github.com/motion-canvas/motion-canvas/commit/aa871a11e8690bf08a47c5c582779dbe6aca1a16))
* **2d:** make Polygon extend Curve ([#961](https://github.com/motion-canvas/motion-canvas/issues/961)) ([739c9fc](https://github.com/motion-canvas/motion-canvas/commit/739c9fccbc101f8b2eed680a11c00f317fdc4dd3))
* **2d:** respect view's cache padding ([#986](https://github.com/motion-canvas/motion-canvas/issues/986)) ([6b2dab3](https://github.com/motion-canvas/motion-canvas/commit/6b2dab3ef53fb62cd49c4ba794f75cd7f733351a))
* **2d:** retain reactivity in code transitions ([#990](https://github.com/motion-canvas/motion-canvas/issues/990)) ([7ccc1c3](https://github.com/motion-canvas/motion-canvas/commit/7ccc1c375ea5cd3591d136e6bbbe9a6b8c51ba65))
* **2d:** simplify highlighters ([#1002](https://github.com/motion-canvas/motion-canvas/issues/1002)) ([8656336](https://github.com/motion-canvas/motion-canvas/commit/8656336ea992f8557c5523500b4ddc3441d120cb))
* **2d:** support letter spacing in Code ([#955](https://github.com/motion-canvas/motion-canvas/issues/955)) ([2a87c37](https://github.com/motion-canvas/motion-canvas/commit/2a87c37c832de86c4b524b33fd68806627daec8b))
* **2d:** universal getter for cardinal points ([#988](https://github.com/motion-canvas/motion-canvas/issues/988)) ([f7e53ec](https://github.com/motion-canvas/motion-canvas/commit/f7e53ecbb3acc3659a8259b8d4d6b8b36fd820a8))
* **core:** add waitTransition ([#983](https://github.com/motion-canvas/motion-canvas/issues/983)) ([27f24e1](https://github.com/motion-canvas/motion-canvas/commit/27f24e1ad9445f165f520138230789dc694f49af))
* **core:** improve loop function ([#952](https://github.com/motion-canvas/motion-canvas/issues/952)) ([66c18bb](https://github.com/motion-canvas/motion-canvas/commit/66c18bb41617a4fbe9e3be5253b3ced02caf0cae))
* **core:** improve matrix to opengl conversion ([#984](https://github.com/motion-canvas/motion-canvas/issues/984)) ([2fadc88](https://github.com/motion-canvas/motion-canvas/commit/2fadc880124d4b6af6c8fb4a1d8b9fe7cf14f34a))
* **core:** improve Vector2 class ([#985](https://github.com/motion-canvas/motion-canvas/issues/985)) ([11ef7ea](https://github.com/motion-canvas/motion-canvas/commit/11ef7ea20c40a5a4cc9b9955d18d9a68146e24ad))
* **core:** spawn function ([#951](https://github.com/motion-canvas/motion-canvas/issues/951)) ([51d8cf0](https://github.com/motion-canvas/motion-canvas/commit/51d8cf0b64592fe56a0e31b5c3acc155226a9b2e))
* **docs:** autoplay visible fiddles ([#1001](https://github.com/motion-canvas/motion-canvas/issues/1001)) ([109d84e](https://github.com/motion-canvas/motion-canvas/commit/109d84edc9cb95910536198a536dd5af6ed38fc1))
* expose parts of player to outside of shadow root ([#956](https://github.com/motion-canvas/motion-canvas/issues/956)) ([c996d39](https://github.com/motion-canvas/motion-canvas/commit/c996d394dda9ba8c6a32f0360bf09e722ec15b0e)), closes [#950](https://github.com/motion-canvas/motion-canvas/issues/950)
* improve error logs ([#953](https://github.com/motion-canvas/motion-canvas/issues/953)) ([3b528cc](https://github.com/motion-canvas/motion-canvas/commit/3b528cce13a3440c97641d1095ce09e737e89960))
* new Code node ([#946](https://github.com/motion-canvas/motion-canvas/issues/946)) ([26e55a3](https://github.com/motion-canvas/motion-canvas/commit/26e55a37c416fb1313c8aadf40eed2824b45d330))
* **ui:** add color picker popover to color input ([#962](https://github.com/motion-canvas/motion-canvas/issues/962)) ([5ed7669](https://github.com/motion-canvas/motion-canvas/commit/5ed76691411da5672bc9c0c7b8ef2ff4c42b60cc))
* **ui:** support for PowerPoint shortcuts in presentation mode ([#993](https://github.com/motion-canvas/motion-canvas/issues/993)) ([570f729](https://github.com/motion-canvas/motion-canvas/commit/570f729f172d3831e20a1dfb7cd07b5d7cb2d27f))





## [3.14.2](https://github.com/motion-canvas/motion-canvas/compare/v3.14.1...v3.14.2) (2024-02-08)


### Bug Fixes

* **ui:** fix out of range warning ([#939](https://github.com/motion-canvas/motion-canvas/issues/939)) ([c9f466f](https://github.com/motion-canvas/motion-canvas/commit/c9f466f20ff1a3e2cb77aa5575823947ef9beeee))





## [3.14.1](https://github.com/motion-canvas/motion-canvas/compare/v3.14.0...v3.14.1) (2024-02-06)


### Bug Fixes

* **2d:** account for spawners in scene graph ([#935](https://github.com/motion-canvas/motion-canvas/issues/935)) ([ca325f5](https://github.com/motion-canvas/motion-canvas/commit/ca325f5ad0ae987e76106f5e65fef3ed7b3ca08d))
* fix project selection screen ([#938](https://github.com/motion-canvas/motion-canvas/issues/938)) ([3b3f287](https://github.com/motion-canvas/motion-canvas/commit/3b3f2871d9884c67f7d46215dd12fc02e27f8054))
* improper cloning of custom fields ([#925](https://github.com/motion-canvas/motion-canvas/issues/925)) ([4981da7](https://github.com/motion-canvas/motion-canvas/commit/4981da74e7b2b0e106fa14f1af2eac62d2bf82f4))
* limit fps to positive numbers ([#937](https://github.com/motion-canvas/motion-canvas/issues/937)) ([c7c0c67](https://github.com/motion-canvas/motion-canvas/commit/c7c0c6730e1a00e6b23077188bfc2d389e98cff2)), closes [#936](https://github.com/motion-canvas/motion-canvas/issues/936)





# [3.14.0](https://github.com/motion-canvas/motion-canvas/compare/v3.13.0...v3.14.0) (2024-02-04)


### Bug Fixes

* correctly await re-renders ([#918](https://github.com/motion-canvas/motion-canvas/issues/918)) ([873a9a3](https://github.com/motion-canvas/motion-canvas/commit/873a9a3eed2676de4cc7f31fbd5ea58817a80aff))


### Features

* convert built-in types to webgl ([#929](https://github.com/motion-canvas/motion-canvas/issues/929)) ([a0f0b7d](https://github.com/motion-canvas/motion-canvas/commit/a0f0b7d8996547e1a316097422ec02bddeeccec6))
* **create:** include simple animation ([#931](https://github.com/motion-canvas/motion-canvas/issues/931)) ([925f63f](https://github.com/motion-canvas/motion-canvas/commit/925f63f3588922224511b1687ac44ba7b9920d83))
* **ui:** add number input dragging ([#917](https://github.com/motion-canvas/motion-canvas/issues/917)) ([1b5c232](https://github.com/motion-canvas/motion-canvas/commit/1b5c23260c3015608f202a103b4c0aebd1860e36)), closes [#799](https://github.com/motion-canvas/motion-canvas/issues/799)
* **ui:** make inspector toggleable ([#921](https://github.com/motion-canvas/motion-canvas/issues/921)) ([a365951](https://github.com/motion-canvas/motion-canvas/commit/a365951e69c01cac1ea23d173034ad83f988c8eb))
* webgl shaders ([#920](https://github.com/motion-canvas/motion-canvas/issues/920)) ([849216e](https://github.com/motion-canvas/motion-canvas/commit/849216ed34c4d29742c621b43a95ec4d99f8c755))





# [3.13.0](https://github.com/motion-canvas/motion-canvas/compare/v3.12.4...v3.13.0) (2024-01-10)


### Bug Fixes

* **2d:** minor fixes ([#915](https://github.com/motion-canvas/motion-canvas/issues/915)) ([63cfc9e](https://github.com/motion-canvas/motion-canvas/commit/63cfc9e033f2c2ac6d6ed2a0d8f615fcf642ab59))
* **ui:** correctly drag time events ([#912](https://github.com/motion-canvas/motion-canvas/issues/912)) ([81f6dd6](https://github.com/motion-canvas/motion-canvas/commit/81f6dd6e485be451a50a695a146ed6b69e30bbc2))


### Features

* **ui:** add direct range selection & playhead shortcuts ([#907](https://github.com/motion-canvas/motion-canvas/issues/907)) ([39264fc](https://github.com/motion-canvas/motion-canvas/commit/39264fc074da739efddf24ef080f6c5f279f8014))
* **ui:** custom inspectors ([#913](https://github.com/motion-canvas/motion-canvas/issues/913)) ([6c54424](https://github.com/motion-canvas/motion-canvas/commit/6c544248a2bd733f2d42676a0ed60c93b79ee574))
* **ui:** scene graph ([#909](https://github.com/motion-canvas/motion-canvas/issues/909)) ([bf85c5b](https://github.com/motion-canvas/motion-canvas/commit/bf85c5b4a339719e79da1b87b1aed4492166ce79))
* **ui:** scene graph icons ([#914](https://github.com/motion-canvas/motion-canvas/issues/914)) ([e92ddef](https://github.com/motion-canvas/motion-canvas/commit/e92ddef34860f5e710ff0f1a310758ec0ca95bcb))





## [3.12.4](https://github.com/motion-canvas/motion-canvas/compare/v3.12.3...v3.12.4) (2024-01-05)


### Bug Fixes

* **2d:** fix height when tweening text ([#905](https://github.com/motion-canvas/motion-canvas/issues/905)) ([1c6a796](https://github.com/motion-canvas/motion-canvas/commit/1c6a7965be137c1ab69741cdd1e9aaa6df4208c4))
* **ui:** use signals correctly ([#906](https://github.com/motion-canvas/motion-canvas/issues/906)) ([f67d691](https://github.com/motion-canvas/motion-canvas/commit/f67d691b5f2f6358120e9582a1839ef3d49c77b8))


### Reverts

* ci(release): 3.12.4 [skip ci] ([#908](https://github.com/motion-canvas/motion-canvas/issues/908)) ([86c5170](https://github.com/motion-canvas/motion-canvas/commit/86c517067c7225f827aa05b47e2397e0d90fe622))





## [3.12.3](https://github.com/motion-canvas/motion-canvas/compare/v3.12.2...v3.12.3) (2024-01-04)


### Bug Fixes

* **2d:** prevent src warnings in Icon and Latex ([#899](https://github.com/motion-canvas/motion-canvas/issues/899)) ([5eebab7](https://github.com/motion-canvas/motion-canvas/commit/5eebab71d8061e233872e049e77b847f9fd077a1))
* **2d:** stop mutating children ([#903](https://github.com/motion-canvas/motion-canvas/issues/903)) ([f9552a8](https://github.com/motion-canvas/motion-canvas/commit/f9552a8658ccde6c7b2466ad40b12cf28c6ec805))
* **ui:** remember state of custom tabs ([#900](https://github.com/motion-canvas/motion-canvas/issues/900)) ([eac45b8](https://github.com/motion-canvas/motion-canvas/commit/eac45b88ed09fc7cddc3336e46d8697de5775b1f))





## [3.12.2](https://github.com/motion-canvas/motion-canvas/compare/v3.12.1...v3.12.2) (2023-12-31)


### Bug Fixes

* fix dependency bundling again ([#898](https://github.com/motion-canvas/motion-canvas/issues/898)) ([d6e0f48](https://github.com/motion-canvas/motion-canvas/commit/d6e0f48e67cf6baee710b8d5b185e620e67ceda5))





## [3.12.1](https://github.com/motion-canvas/motion-canvas/compare/v3.12.0...v3.12.1) (2023-12-31)


### Bug Fixes

* fix dependency bundling ([#897](https://github.com/motion-canvas/motion-canvas/issues/897)) ([5376012](https://github.com/motion-canvas/motion-canvas/commit/5376012cd02b8bca5abc2d3cf5a724662244c449))





# [3.12.0](https://github.com/motion-canvas/motion-canvas/compare/v3.11.0...v3.12.0) (2023-12-31)


### Bug Fixes

* **2d:** account for offset in cardinal points ([#883](https://github.com/motion-canvas/motion-canvas/issues/883)) ([24da258](https://github.com/motion-canvas/motion-canvas/commit/24da258f5937087b363eeb9146a9d22747b02e70)), closes [#882](https://github.com/motion-canvas/motion-canvas/issues/882)
* **2d:** add missing middle property ([#891](https://github.com/motion-canvas/motion-canvas/issues/891)) ([61e2e96](https://github.com/motion-canvas/motion-canvas/commit/61e2e96e3b8f37a68ebdddb432baba04858fd4f3))
* **2d:** calculate Txt cache bbox from contents ([#836](https://github.com/motion-canvas/motion-canvas/issues/836)) ([33e1a12](https://github.com/motion-canvas/motion-canvas/commit/33e1a1296f21d26e9ed45ae92132825dca17054d)), closes [#465](https://github.com/motion-canvas/motion-canvas/issues/465)
* **2d:** fix line jitter under certain conditions ([#863](https://github.com/motion-canvas/motion-canvas/issues/863)) ([fb110a2](https://github.com/motion-canvas/motion-canvas/commit/fb110a2f3583fc040bf2c39560934162bd146d9b))
* **2d:** fix tweening cardinal points ([#829](https://github.com/motion-canvas/motion-canvas/issues/829)) ([cc16737](https://github.com/motion-canvas/motion-canvas/commit/cc16737cd59081582fbb488a880e8d3c11c14918))
* exclude preact from optimizations ([#894](https://github.com/motion-canvas/motion-canvas/issues/894)) ([15687cc](https://github.com/motion-canvas/motion-canvas/commit/15687cc975abcf4538a5ce51402d2308057d42e5))
* support legacy imports again ([#868](https://github.com/motion-canvas/motion-canvas/issues/868)) ([77c4e2e](https://github.com/motion-canvas/motion-canvas/commit/77c4e2eeb8b0f73bdef1f72e3d81f34c79748929))
* **ui:** fix "go to source" ([#895](https://github.com/motion-canvas/motion-canvas/issues/895)) ([ec729de](https://github.com/motion-canvas/motion-canvas/commit/ec729dea0d65bc69aefc0abd601f365af1c4ed68))
* **ui:** fix transparent background ([#886](https://github.com/motion-canvas/motion-canvas/issues/886)) ([83f652f](https://github.com/motion-canvas/motion-canvas/commit/83f652fdcfa075f5de24186ffdffd1b7db1d8fc9))
* **vite-plugin:** create empty output directory if not exist ([#787](https://github.com/motion-canvas/motion-canvas/issues/787)) ([20cceef](https://github.com/motion-canvas/motion-canvas/commit/20cceef8525e809bff9706fcd7082d7e103a085b))
* **vite-plugin:** handle unusual characters in file names ([#821](https://github.com/motion-canvas/motion-canvas/issues/821)) ([1e57497](https://github.com/motion-canvas/motion-canvas/commit/1e5749785d55a41605a5438eee08672ef01f3914)), closes [#764](https://github.com/motion-canvas/motion-canvas/issues/764)


### Features

* **2d:** add playbackRate signal to Video component ([#831](https://github.com/motion-canvas/motion-canvas/issues/831)) ([5902b82](https://github.com/motion-canvas/motion-canvas/commit/5902b824b36400876be0ee970e2c6211299faf21)), closes [#711](https://github.com/motion-canvas/motion-canvas/issues/711)
* **2d:** add querying helpers ([#852](https://github.com/motion-canvas/motion-canvas/issues/852)) ([614de6b](https://github.com/motion-canvas/motion-canvas/commit/614de6bd8542322d1db4b123b875f6fad85cc4eb))
* **2d:** clamp opacity value between 0 and 1 ([#835](https://github.com/motion-canvas/motion-canvas/issues/835)) ([c54b2f8](https://github.com/motion-canvas/motion-canvas/commit/c54b2f837a8e8b872df3610f4cc6caa94a728500)), closes [#830](https://github.com/motion-canvas/motion-canvas/issues/830)
* **2d:** nested Txt nodes ([#861](https://github.com/motion-canvas/motion-canvas/issues/861)) ([f2786d0](https://github.com/motion-canvas/motion-canvas/commit/f2786d0cd0d06065ca1e9eb9f6b4c11a74b6c283)), closes [#540](https://github.com/motion-canvas/motion-canvas/issues/540)
* **2d:** support tweening in applyState ([#859](https://github.com/motion-canvas/motion-canvas/issues/859)) ([b7ed2e2](https://github.com/motion-canvas/motion-canvas/commit/b7ed2e24773227e5b576ff056eb23de9b9ff1676))
* **2d:** support tweening Line points ([#853](https://github.com/motion-canvas/motion-canvas/issues/853)) ([4bf37d7](https://github.com/motion-canvas/motion-canvas/commit/4bf37d74d2e4bb9d9cc034aff121a32da9a6d146))
* add audio volume control through arrow keys ([#856](https://github.com/motion-canvas/motion-canvas/issues/856)) ([8b86fd4](https://github.com/motion-canvas/motion-canvas/commit/8b86fd4e70f91a0d5b1150d760427ca355666341))
* add experimental features ([#876](https://github.com/motion-canvas/motion-canvas/issues/876)) ([498d387](https://github.com/motion-canvas/motion-canvas/commit/498d3871d05d4dcc83453654bec7762d2ab32e7e))
* better children and spawners ([#858](https://github.com/motion-canvas/motion-canvas/issues/858)) ([9b5c23d](https://github.com/motion-canvas/motion-canvas/commit/9b5c23d2076180cf710656c817369a07b253e3ec))
* **core:** add static properties to Vector2 corresponding to Origins ([#855](https://github.com/motion-canvas/motion-canvas/issues/855)) ([9bbd249](https://github.com/motion-canvas/motion-canvas/commit/9bbd249e1f7864a49ff2da49bc18d9309888f902)), closes [#844](https://github.com/motion-canvas/motion-canvas/issues/844)
* **core:** allow getting real size of scenes ([#889](https://github.com/motion-canvas/motion-canvas/issues/889)) ([3a6a672](https://github.com/motion-canvas/motion-canvas/commit/3a6a672bed9098bec81d9c5347459317cbbf4c2a))
* **core:** allow ordering of scenes during transition ([#832](https://github.com/motion-canvas/motion-canvas/issues/832)) ([7a62b59](https://github.com/motion-canvas/motion-canvas/commit/7a62b59c377dca8bf1f56bb551b47b9a75a6afba)), closes [#369](https://github.com/motion-canvas/motion-canvas/issues/369)
* **core:** seek to beginning of timeline in disable loop mode ([#823](https://github.com/motion-canvas/motion-canvas/issues/823)) ([3595646](https://github.com/motion-canvas/motion-canvas/commit/359564645575c6f20870f4bf9642e72404717f14)), closes [#822](https://github.com/motion-canvas/motion-canvas/issues/822)
* improve image error handling ([#847](https://github.com/motion-canvas/motion-canvas/issues/847)) ([db09d53](https://github.com/motion-canvas/motion-canvas/commit/db09d5305a3c0507b035e3cd347eaa65b23d7d2e))
* introduce editor plugins ([#879](https://github.com/motion-canvas/motion-canvas/issues/879)) ([2b72007](https://github.com/motion-canvas/motion-canvas/commit/2b720074d45fc254dc40b534785b591ae44a3f37))
* **ui:** add custom presentation overlays ([#884](https://github.com/motion-canvas/motion-canvas/issues/884)) ([4696d3c](https://github.com/motion-canvas/motion-canvas/commit/4696d3c8cb8b68e3475406359f9cf6b875b1c838)), closes [#825](https://github.com/motion-canvas/motion-canvas/issues/825)
* **ui:** add volume slider ([#872](https://github.com/motion-canvas/motion-canvas/issues/872)) ([5ac3069](https://github.com/motion-canvas/motion-canvas/commit/5ac3069f027ee123c212217dcf8d26a78a3aa106))
* **ui:** small improvements ([#833](https://github.com/motion-canvas/motion-canvas/issues/833)) ([f44400c](https://github.com/motion-canvas/motion-canvas/commit/f44400c458a1d7f49520494f01efb9936f4df83e))
* **ui:** timeline scrubbing ([#862](https://github.com/motion-canvas/motion-canvas/issues/862)) ([211b9a4](https://github.com/motion-canvas/motion-canvas/commit/211b9a4327720afd1ce0ff93868a501c2fd745aa)), closes [#286](https://github.com/motion-canvas/motion-canvas/issues/286)
* **vite-plugin:** support glob for project files ([#834](https://github.com/motion-canvas/motion-canvas/issues/834)) ([67029c4](https://github.com/motion-canvas/motion-canvas/commit/67029c4c2cf756cbe2b7ed59dc55cb895de81d52)), closes [#324](https://github.com/motion-canvas/motion-canvas/issues/324)





# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.11.0](https://github.com/motion-canvas/motion-canvas/compare/v3.10.1...v3.11.0) (2023-10-13)

### Bug Fixes

- **2d:** add missing Curve properties to Circle
  ([#805](https://github.com/motion-canvas/motion-canvas/issues/805))
  ([38c7900](https://github.com/motion-canvas/motion-canvas/commit/38c79000403d7c3c99dde9e4c825a448d5f55054))
- **2d:** point arrow heads in correct direction
  ([#792](https://github.com/motion-canvas/motion-canvas/issues/792))
  ([52ed52e](https://github.com/motion-canvas/motion-canvas/commit/52ed52e963cc69a066a0353680acaca35b9c937a)),
  closes [#783](https://github.com/motion-canvas/motion-canvas/issues/783)
- **core:** handle malicious event names
  ([#819](https://github.com/motion-canvas/motion-canvas/issues/819))
  ([aba8eba](https://github.com/motion-canvas/motion-canvas/commit/aba8ebaf347ac3cbf6a9446c1aa60f629c7c18bd))

### Features

- **2d:** add line counter for CodeBlock
  ([#802](https://github.com/motion-canvas/motion-canvas/issues/802))
  ([c3f9676](https://github.com/motion-canvas/motion-canvas/commit/c3f9676b6984731a09a44ab0b1fcfc226975fa08))
- **2d:** add skew property
  ([#803](https://github.com/motion-canvas/motion-canvas/issues/803))
  ([eff7c7b](https://github.com/motion-canvas/motion-canvas/commit/eff7c7be0c013139140b398350242457736d48c7))
- **2d:** add SVG component
  ([#763](https://github.com/motion-canvas/motion-canvas/issues/763))
  ([8eadc11](https://github.com/motion-canvas/motion-canvas/commit/8eadc11937d4201545894f2f5b204d477a3f9094))
- **2d:** warn about missing image source
  ([#817](https://github.com/motion-canvas/motion-canvas/issues/817))
  ([6dcdb5f](https://github.com/motion-canvas/motion-canvas/commit/6dcdb5f3b83d4860b1557e4745972e0af68f92f3))
- **core:** hot module replacement for audio
  ([#793](https://github.com/motion-canvas/motion-canvas/issues/793))
  ([d40c1a8](https://github.com/motion-canvas/motion-canvas/commit/d40c1a83c645c8984cca1ebc6fe687b445a0550c))
- **core:** support Origin in slideTransition
  ([#801](https://github.com/motion-canvas/motion-canvas/issues/801))
  ([0a3df28](https://github.com/motion-canvas/motion-canvas/commit/0a3df2829fd7b308604eda3d005e90daf032e284))
- **ui:** add goto start and goto end buttons
  ([#814](https://github.com/motion-canvas/motion-canvas/issues/814))
  ([449f194](https://github.com/motion-canvas/motion-canvas/commit/449f1946474af9886135571c14c83b8440bdf28c))
- **ui:** estimate remaining rendering time
  ([#795](https://github.com/motion-canvas/motion-canvas/issues/795))
  ([1a46148](https://github.com/motion-canvas/motion-canvas/commit/1a4614801869ab36827ca857d66eed8de9cffd09)),
  closes [#784](https://github.com/motion-canvas/motion-canvas/issues/784)
- **ui:** timeline dragging
  ([#794](https://github.com/motion-canvas/motion-canvas/issues/794))
  ([248e454](https://github.com/motion-canvas/motion-canvas/commit/248e4546367f9d99221f64b811a07d54a9988e48)),
  closes [#699](https://github.com/motion-canvas/motion-canvas/issues/699)
- **ui:** vertical line on time event
  ([#808](https://github.com/motion-canvas/motion-canvas/issues/808))
  ([18015d6](https://github.com/motion-canvas/motion-canvas/commit/18015d6714ffe2a6255f26895aa9a7c1908a4f7a)),
  closes [#804](https://github.com/motion-canvas/motion-canvas/issues/804)

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.10.1](https://github.com/motion-canvas/motion-canvas/compare/v3.10.0...v3.10.1) (2023-07-25)

### Bug Fixes

- **2d:** improve Curve hitbox
  ([#778](https://github.com/motion-canvas/motion-canvas/issues/778))
  ([8af723c](https://github.com/motion-canvas/motion-canvas/commit/8af723c0322de39d2defe0363bba03f4f9542f08))
- **2d:** remove circular dependencies
  ([#780](https://github.com/motion-canvas/motion-canvas/issues/780))
  ([cdf3af5](https://github.com/motion-canvas/motion-canvas/commit/cdf3af500a58151ee3549c6e728751aab3e6f75c))

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.10.0](https://github.com/motion-canvas/motion-canvas/compare/v3.9.0...v3.10.0) (2023-07-23)

### Bug Fixes

- **docs:** fix last updated footer
  ([#776](https://github.com/motion-canvas/motion-canvas/issues/776))
  ([09c0085](https://github.com/motion-canvas/motion-canvas/commit/09c008587fcd4b52edbc5e7599ee378482f4230b)),
  closes [#767](https://github.com/motion-canvas/motion-canvas/issues/767)
- **ui:** prevent spawning multiple color pickers
  ([#747](https://github.com/motion-canvas/motion-canvas/issues/747))
  ([48ffd1f](https://github.com/motion-canvas/motion-canvas/commit/48ffd1f2eec21f9880e172632a2310f5676e3c19)),
  closes [#744](https://github.com/motion-canvas/motion-canvas/issues/744)
- **ui:** support small ranges
  ([#739](https://github.com/motion-canvas/motion-canvas/issues/739))
  ([cf32d8b](https://github.com/motion-canvas/motion-canvas/commit/cf32d8b08b94f5044987eb554cd250fc79fbc99d)),
  closes [#738](https://github.com/motion-canvas/motion-canvas/issues/738)

### Features

- **2d:** add Path component
  ([#700](https://github.com/motion-canvas/motion-canvas/issues/700))
  ([2128b6b](https://github.com/motion-canvas/motion-canvas/commit/2128b6bf871cabe19e1abc749f18945c78c01f84))
- **2d:** add start and end signals to Grid node
  ([#761](https://github.com/motion-canvas/motion-canvas/issues/761))
  ([e37ea80](https://github.com/motion-canvas/motion-canvas/commit/e37ea806b94e93c6324d8e1b502468925b731e8e))
- **2d:** always clip images and videos
  ([#773](https://github.com/motion-canvas/motion-canvas/issues/773))
  ([3938c59](https://github.com/motion-canvas/motion-canvas/commit/3938c59394bfc42e5562504687d783ff306d7d32))
- **2d:** immediate restore
  ([#736](https://github.com/motion-canvas/motion-canvas/issues/736))
  ([634d51d](https://github.com/motion-canvas/motion-canvas/commit/634d51d2afe8a536673c364874f8f3d1a450b846))
- **2d:** make Circle extend Curve
  ([#771](https://github.com/motion-canvas/motion-canvas/issues/771))
  ([4c8cf19](https://github.com/motion-canvas/motion-canvas/commit/4c8cf1954093958eac507921dc18f67dd64b2052))
- **2d:** make Rect extend Curve
  ([#759](https://github.com/motion-canvas/motion-canvas/issues/759))
  ([9810212](https://github.com/motion-canvas/motion-canvas/commit/9810212648824b9a2fa2ecd6b597e3319d20b325))
- add coordinates to preview
  ([#737](https://github.com/motion-canvas/motion-canvas/issues/737))
  ([330c1f9](https://github.com/motion-canvas/motion-canvas/commit/330c1f962fb920269301e7ee8a2c49cbfc723d85))
- add middle cardinal point
  ([#758](https://github.com/motion-canvas/motion-canvas/issues/758))
  ([b036eaf](https://github.com/motion-canvas/motion-canvas/commit/b036eafc00381831c08267a78cf9d74973f4025a))
- **core:** accept PossibleMatrix2D when transforming bbox
  ([#770](https://github.com/motion-canvas/motion-canvas/issues/770))
  ([ae05282](https://github.com/motion-canvas/motion-canvas/commit/ae0528266f5794aa0517f32b897c5fe6ff092a58))
- **core:** add rotate and polarLerp methods to vector
  ([#756](https://github.com/motion-canvas/motion-canvas/issues/756))
  ([a18bac3](https://github.com/motion-canvas/motion-canvas/commit/a18bac3c1755fa3e3240b5469ac7bc1f08b4fd24))
- **core:** helper methods for references
  ([#775](https://github.com/motion-canvas/motion-canvas/issues/775))
  ([3255add](https://github.com/motion-canvas/motion-canvas/commit/3255add1b05a37017d60c2eaccf4368ab4f7f568))

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.9.0](https://github.com/motion-canvas/motion-canvas/compare/v3.8.0...v3.9.0) (2023-05-29)

### Bug Fixes

- **2d:** fix package.json entry
  ([#720](https://github.com/motion-canvas/motion-canvas/issues/720))
  ([12e9bf6](https://github.com/motion-canvas/motion-canvas/commit/12e9bf6f40ab7afc02e2f55260544f3864920ded))
- **core:** project `variables`
  ([#690](https://github.com/motion-canvas/motion-canvas/issues/690))
  ([149f39c](https://github.com/motion-canvas/motion-canvas/commit/149f39c3219aa74115be80490bd6c5f236779b0e)),
  closes [#689](https://github.com/motion-canvas/motion-canvas/issues/689)
- **ui:** fix collapse
  ([#698](https://github.com/motion-canvas/motion-canvas/issues/698))
  ([6bd8703](https://github.com/motion-canvas/motion-canvas/commit/6bd8703ec9b16f55b3817f6a1f9130f17b66c69a))

### Features

- application settings
  ([#697](https://github.com/motion-canvas/motion-canvas/issues/697))
  ([54016f5](https://github.com/motion-canvas/motion-canvas/commit/54016f5cf3500abe13a217537307a3735d60f536)),
  closes [#167](https://github.com/motion-canvas/motion-canvas/issues/167)
- **core:** add `gauss` function to `Random`
  ([#709](https://github.com/motion-canvas/motion-canvas/issues/709))
  ([d7de3d5](https://github.com/motion-canvas/motion-canvas/commit/d7de3d56d05dc88c7cbd557a73a25d083abb54e4))
- **docs:** fiddle error highlighting
  ([#713](https://github.com/motion-canvas/motion-canvas/issues/713))
  ([f281aff](https://github.com/motion-canvas/motion-canvas/commit/f281aff27e31c7e06a415cdbfc44157b1d13a2f1))
- **docs:** import folding
  ([#706](https://github.com/motion-canvas/motion-canvas/issues/706))
  ([bdb035f](https://github.com/motion-canvas/motion-canvas/commit/bdb035f045f96e58cadbe7f9e6e3d25e2ffb04b2))
- export everything from entry points
  ([#710](https://github.com/motion-canvas/motion-canvas/issues/710))
  ([3c885d9](https://github.com/motion-canvas/motion-canvas/commit/3c885d9083b52fbbaccf1e2560ae50817949bc52))
- new plugin hooks
  ([#723](https://github.com/motion-canvas/motion-canvas/issues/723))
  ([9a2b5ab](https://github.com/motion-canvas/motion-canvas/commit/9a2b5ab8be0d001414fd00da3053d408e00fd1cd))
- **ui:** add color picker
  ([#691](https://github.com/motion-canvas/motion-canvas/issues/691))
  ([a33059c](https://github.com/motion-canvas/motion-canvas/commit/a33059c0f455814919db31bc9e5e932907c797e4))
- **ui:** include function names in stack traces
  ([#693](https://github.com/motion-canvas/motion-canvas/issues/693))
  ([835c0fa](https://github.com/motion-canvas/motion-canvas/commit/835c0fa4b70429db6fe96be96d6d9e44949f7f6c))
- **ui:** new sidebar
  ([#692](https://github.com/motion-canvas/motion-canvas/issues/692))
  ([b555ee1](https://github.com/motion-canvas/motion-canvas/commit/b555ee1d10f8a6e1b380c043dff2717ffa01a068)),
  closes [#492](https://github.com/motion-canvas/motion-canvas/issues/492)
- use ES modules in fiddles
  ([#712](https://github.com/motion-canvas/motion-canvas/issues/712))
  ([dbe2ad5](https://github.com/motion-canvas/motion-canvas/commit/dbe2ad5644219c5a98d38c6557abfb66d793c821))
- **vite-plugin:** add entry point
  ([#721](https://github.com/motion-canvas/motion-canvas/issues/721))
  ([e634b6c](https://github.com/motion-canvas/motion-canvas/commit/e634b6cb67b3c569d21d424661708ca946ea4cc3))

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.8.0](https://github.com/motion-canvas/motion-canvas/compare/v3.7.0...v3.8.0) (2023-05-13)

### Bug Fixes

- **2d:** correctly support external image urls
  ([#678](https://github.com/motion-canvas/motion-canvas/issues/678))
  ([a08556b](https://github.com/motion-canvas/motion-canvas/commit/a08556b6e2822a55db593f610ea4dd6cb8494adb)),
  closes [#677](https://github.com/motion-canvas/motion-canvas/issues/677)
- **2d:** fix audio offset editing
  ([#674](https://github.com/motion-canvas/motion-canvas/issues/674))
  ([58d6ef7](https://github.com/motion-canvas/motion-canvas/commit/58d6ef79fa06e377e0c1821efe73585586d124a6))
- **2d:** ignore children with disabled layout
  ([#669](https://github.com/motion-canvas/motion-canvas/issues/669))
  ([b98c462](https://github.com/motion-canvas/motion-canvas/commit/b98c4625c3634495e86ca23d19355035e457db06)),
  closes [#580](https://github.com/motion-canvas/motion-canvas/issues/580)
- remove dependency pre-bundling warning
  ([#676](https://github.com/motion-canvas/motion-canvas/issues/676))
  ([38c81ff](https://github.com/motion-canvas/motion-canvas/commit/38c81ffa5ea0ef2d2beec9d015896f5873629d74))

### Features

- **2d:** expand animations and reduced motion
  ([#671](https://github.com/motion-canvas/motion-canvas/issues/671))
  ([b8e9d03](https://github.com/motion-canvas/motion-canvas/commit/b8e9d03488f8ca7085b3e7e1b095a52f39f2bc89))
- **2d:** visual feedback about rendering process
  ([#681](https://github.com/motion-canvas/motion-canvas/issues/681))
  ([d0495f5](https://github.com/motion-canvas/motion-canvas/commit/d0495f5c6396c05454a5323e4486ab4829adbc9e))
- add new hooks for plugins
  ([#679](https://github.com/motion-canvas/motion-canvas/issues/679))
  ([74e18bc](https://github.com/motion-canvas/motion-canvas/commit/74e18bce71abd7e26a6415240603241b48cb36c2))
- **create:** add exporter selection
  ([#673](https://github.com/motion-canvas/motion-canvas/issues/673))
  ([82fd47d](https://github.com/motion-canvas/motion-canvas/commit/82fd47d93ffad6125a685880a132ce0d3a388693))
- **create:** support command-line arguments
  ([#668](https://github.com/motion-canvas/motion-canvas/issues/668))
  ([fa62a98](https://github.com/motion-canvas/motion-canvas/commit/fa62a9868d5cd33f1cb6ac5f147cca81917457dc))
- display array values in inspector
  ([#670](https://github.com/motion-canvas/motion-canvas/issues/670))
  ([e71d74c](https://github.com/motion-canvas/motion-canvas/commit/e71d74c9c04995393ad8ee942b8e6e5baa6f982f))

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.7.0](https://github.com/motion-canvas/motion-canvas/compare/v3.6.2...v3.7.0) (2023-05-10)

### Bug Fixes

- prevent Color tree shaking
  ([#666](https://github.com/motion-canvas/motion-canvas/issues/666))
  ([e5028e3](https://github.com/motion-canvas/motion-canvas/commit/e5028e3c176d5ba74dd3f28c2f25672390c76936)),
  closes [#577](https://github.com/motion-canvas/motion-canvas/issues/577)

### Features

- button for opening the output directory
  ([#663](https://github.com/motion-canvas/motion-canvas/issues/663))
  ([79f320c](https://github.com/motion-canvas/motion-canvas/commit/79f320c07c422ca927b34bf339094fe0e70ffd0d))
- finalize custom exporters
  ([#660](https://github.com/motion-canvas/motion-canvas/issues/660))
  ([6a50430](https://github.com/motion-canvas/motion-canvas/commit/6a50430cdf9928992ca078eba39c484a5253da2b))
- meta field descriptions
  ([#664](https://github.com/motion-canvas/motion-canvas/issues/664))
  ([80c9d07](https://github.com/motion-canvas/motion-canvas/commit/80c9d07f88f4a3df0f99e5741b31313f891a5d51))
- **ui:** improve rendering button
  ([#662](https://github.com/motion-canvas/motion-canvas/issues/662))
  ([2b4ae70](https://github.com/motion-canvas/motion-canvas/commit/2b4ae70ea0b0305fbb2596e95bbc70440718bbe2))

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
- **core:** clear DependencyContext promises once resolved
  ([#617](https://github.com/motion-canvas/motion-canvas/issues/617))
  ([97b68da](https://github.com/motion-canvas/motion-canvas/commit/97b68dabfdf86c0e0a188212308b8aba0fb35cab))
- **core:** fix snapshots
  ([#638](https://github.com/motion-canvas/motion-canvas/issues/638))
  ([437cc5e](https://github.com/motion-canvas/motion-canvas/commit/437cc5efddbb242b10f7902e18fe15162a45d7bd))
- **docs:** fix fiddle accessibility
  ([#647](https://github.com/motion-canvas/motion-canvas/issues/647))
  ([3037f65](https://github.com/motion-canvas/motion-canvas/commit/3037f657bec44a54f9e5c3d4802e77a7b06ee261))
- **docs:** fix typo in logging.mdx
  ([#652](https://github.com/motion-canvas/motion-canvas/issues/652))
  ([5d04494](https://github.com/motion-canvas/motion-canvas/commit/5d044945ae126ea3fa4e5c14a1062ddcec39e0c3))
- **ui:** fix snapshot
  ([#643](https://github.com/motion-canvas/motion-canvas/issues/643))
  ([590216a](https://github.com/motion-canvas/motion-canvas/commit/590216ac094d6b6ef3e9c773499bc52063f617b1))
- **ui:** fix typo in viewport ID
  ([#620](https://github.com/motion-canvas/motion-canvas/issues/620))
  ([3a83f20](https://github.com/motion-canvas/motion-canvas/commit/3a83f20cb1b8ddc7b95a8e36bf6f3d0cd036693b))

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
- **2d:** add fromDegrees method to Vector2
  ([#622](https://github.com/motion-canvas/motion-canvas/issues/622))
  ([e78b9d5](https://github.com/motion-canvas/motion-canvas/commit/e78b9d51674269ab82e0c2fe4c475b5799b94975))
- **2d:** add Ray node
  ([#628](https://github.com/motion-canvas/motion-canvas/issues/628))
  ([649447c](https://github.com/motion-canvas/motion-canvas/commit/649447cd5f2089afc64cc7bd4b0276e69d1e9a30))
- **2d:** support HMR for images
  ([#641](https://github.com/motion-canvas/motion-canvas/issues/641))
  ([cf17520](https://github.com/motion-canvas/motion-canvas/commit/cf17520aa8ddf19dcfc419c63cf7255892d45b71))
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
- **docs:** improve Fiddle functionality
  ([#642](https://github.com/motion-canvas/motion-canvas/issues/642))
  ([fd3d6b3](https://github.com/motion-canvas/motion-canvas/commit/fd3d6b38c04b7350c8337556801b8c54b4439033)),
  closes [#637](https://github.com/motion-canvas/motion-canvas/issues/637)

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
- **2d:** fix version link
  ([#608](https://github.com/motion-canvas/motion-canvas/issues/608))
  ([4fe5b7a](https://github.com/motion-canvas/motion-canvas/commit/4fe5b7a5150fbdf43ea50ecf3dc8b4690c0e2e34))
- **2d:** smoothly play videos when presenting
  ([#600](https://github.com/motion-canvas/motion-canvas/issues/600))
  ([294fe6a](https://github.com/motion-canvas/motion-canvas/commit/294fe6ac056ab074c77214fcf9035f53fac9258c)),
  closes [#578](https://github.com/motion-canvas/motion-canvas/issues/578)
- **2d:** wait for reused async resources
  ([#599](https://github.com/motion-canvas/motion-canvas/issues/599))
  ([280e065](https://github.com/motion-canvas/motion-canvas/commit/280e065fe69e9a744b7b12eb4609e7d87f76bb63)),
  closes [#593](https://github.com/motion-canvas/motion-canvas/issues/593)
- **docs:** fix the showcase editor
  ([#589](https://github.com/motion-canvas/motion-canvas/issues/589))
  ([4964e77](https://github.com/motion-canvas/motion-canvas/commit/4964e7742dea46975dba911fe382737c8508535c))

### Features

- **2d:** add Bézier nodes
  ([#603](https://github.com/motion-canvas/motion-canvas/issues/603))
  ([9841cfd](https://github.com/motion-canvas/motion-canvas/commit/9841cfdc3947ca4e6d6e42ed21eae88e855f855d))
- **2d:** improve Video node
  ([#601](https://github.com/motion-canvas/motion-canvas/issues/601))
  ([3801d83](https://github.com/motion-canvas/motion-canvas/commit/3801d83415bbdeeee5d6d53d0c18e5d9e78fba56))
- **docs:** add snippet toggle for fiddles
  ([#598](https://github.com/motion-canvas/motion-canvas/issues/598))
  ([d8b4e7c](https://github.com/motion-canvas/motion-canvas/commit/d8b4e7cb8726dc8622e6fecfe1321c7c4c396cae))

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
- **docs:** support multiple fiddles
  ([#572](https://github.com/motion-canvas/motion-canvas/issues/572))
  ([899f133](https://github.com/motion-canvas/motion-canvas/commit/899f133dd6632e0ffa559bf3f258f94cf75891a7))
- **docs:** support multiple fiddles again
  ([#574](https://github.com/motion-canvas/motion-canvas/issues/574))
  ([d1867e9](https://github.com/motion-canvas/motion-canvas/commit/d1867e90998f5e36f819779bb5473a43ca4b3d7e))
- **ui:** fix zoom to fit
  ([#561](https://github.com/motion-canvas/motion-canvas/issues/561))
  ([1c947b4](https://github.com/motion-canvas/motion-canvas/commit/1c947b417e218809f33928d6cbb89d463bdc2e66))

### Features

- **2d:** add spline node
  ([#514](https://github.com/motion-canvas/motion-canvas/issues/514))
  ([3ce2111](https://github.com/motion-canvas/motion-canvas/commit/3ce2111309e698450dc4c6e2ad47024995863e73))
- auto meta fields
  ([#565](https://github.com/motion-canvas/motion-canvas/issues/565))
  ([645af6d](https://github.com/motion-canvas/motion-canvas/commit/645af6d2b7e8d9332b6f08419c318ee9434d7f3f))
- **core:** expand Vector2 type
  ([#579](https://github.com/motion-canvas/motion-canvas/issues/579))
  ([010bba5](https://github.com/motion-canvas/motion-canvas/commit/010bba593e1c3ce368ab409dce09dbde8f999958))
- get name from meta file
  ([#552](https://github.com/motion-canvas/motion-canvas/issues/552))
  ([ae2ed8a](https://github.com/motion-canvas/motion-canvas/commit/ae2ed8a5998768f160ec340d8b63d600d27bc15c))
- plugin architecture
  ([#564](https://github.com/motion-canvas/motion-canvas/issues/564))
  ([1c375b8](https://github.com/motion-canvas/motion-canvas/commit/1c375b81e0af8a76467d42dd46a7031adb9d71d3))

# Change Log

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.3.4](https://github.com/motion-canvas/motion-canvas/compare/v3.3.3...v3.3.4) (2023-03-19)

### Bug Fixes

- **2d:** fix circle segment
  ([#557](https://github.com/motion-canvas/motion-canvas/issues/557))
  ([adebff4](https://github.com/motion-canvas/motion-canvas/commit/adebff492b76a512d79151b00adf1b383d25c5b5))
- **core:** fix tree shaking
  ([#555](https://github.com/motion-canvas/motion-canvas/issues/555))
  ([8de199e](https://github.com/motion-canvas/motion-canvas/commit/8de199eaf833622a96ad746c984fb7f3a77df4b8))

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
- **e2e:** update snapshot names
  ([#536](https://github.com/motion-canvas/motion-canvas/issues/536))
  ([b150f08](https://github.com/motion-canvas/motion-canvas/commit/b150f080807e33cfe8ded302951411e4c14741db))
- restrict size of cache canvas
  ([#544](https://github.com/motion-canvas/motion-canvas/issues/544))
  ([49ec554](https://github.com/motion-canvas/motion-canvas/commit/49ec55490718e503d9a39437ae13c189dc4fe9ea))
- **ui:** fix onChange handlers
  ([#515](https://github.com/motion-canvas/motion-canvas/issues/515))
  ([a23d06c](https://github.com/motion-canvas/motion-canvas/commit/a23d06cbf6e29f37a9259e50fe71c482640b83fb))
- **ui:** ignore shortcuts when typing
  ([#521](https://github.com/motion-canvas/motion-canvas/issues/521))
  ([4d3e1a1](https://github.com/motion-canvas/motion-canvas/commit/4d3e1a13caee2ddd03857961a44dd10a7e1cb32a)),
  closes [#518](https://github.com/motion-canvas/motion-canvas/issues/518)
- **ui:** version comparison issue
  ([#520](https://github.com/motion-canvas/motion-canvas/issues/520))
  ([93b5e08](https://github.com/motion-canvas/motion-canvas/commit/93b5e088b4a4fda0d2177cb2cc6680c34fa72d30)),
  closes [#519](https://github.com/motion-canvas/motion-canvas/issues/519)
- **vite-plugin:** can't assign port
  ([#538](https://github.com/motion-canvas/motion-canvas/issues/538))
  ([61b692b](https://github.com/motion-canvas/motion-canvas/commit/61b692bf97bb7e15d31469ada2e3dda84c2b99f8))

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
- **ui:** add shortcuts to button titles
  ([#532](https://github.com/motion-canvas/motion-canvas/issues/532))
  ([3549dd3](https://github.com/motion-canvas/motion-canvas/commit/3549dd3fd7ef47376a5a2dd516609499d3985ac3))
- **ui:** custom checkbox style
  ([#529](https://github.com/motion-canvas/motion-canvas/issues/529))
  ([af98db1](https://github.com/motion-canvas/motion-canvas/commit/af98db103d66e8af059dc483d49984b9adb9b95c))
- **ui:** zoom controls
  ([#531](https://github.com/motion-canvas/motion-canvas/issues/531))
  ([752350d](https://github.com/motion-canvas/motion-canvas/commit/752350d0c547e21806f1b70a5c68025012e5ec11))
- update vite from v3 to v4
  ([#495](https://github.com/motion-canvas/motion-canvas/issues/495))
  ([c409eee](https://github.com/motion-canvas/motion-canvas/commit/c409eee0e61b67e43afed240c5ae279714681246)),
  closes [#197](https://github.com/motion-canvas/motion-canvas/issues/197)

## [3.2.1](https://github.com/motion-canvas/motion-canvas/compare/v3.2.0...v3.2.1) (2023-03-10)

### Bug Fixes

- **ui:** fix new version link
  ([#505](https://github.com/motion-canvas/motion-canvas/issues/505))
  ([7459e7f](https://github.com/motion-canvas/motion-canvas/commit/7459e7f8355163f3cb6a3ed791fc41a2962a186e))

# [3.2.0](https://github.com/motion-canvas/motion-canvas/compare/v3.1.0...v3.2.0) (2023-03-10)

### Bug Fixes

- **2d:** fix line arc length
  ([#503](https://github.com/motion-canvas/motion-canvas/issues/503))
  ([4f1cd59](https://github.com/motion-canvas/motion-canvas/commit/4f1cd59e6bcba0b16b36be88b28a60ae46d4d9ab)),
  closes [#497](https://github.com/motion-canvas/motion-canvas/issues/497)
- **docs:** invalid source code link
  ([#502](https://github.com/motion-canvas/motion-canvas/issues/502))
  ([3588d53](https://github.com/motion-canvas/motion-canvas/commit/3588d53d45f9bc9b57aad10353d207cccdfb0dba)),
  closes [#499](https://github.com/motion-canvas/motion-canvas/issues/499)

### Features

- **2d:** add Polygon component
  ([#463](https://github.com/motion-canvas/motion-canvas/issues/463))
  ([15adb3e](https://github.com/motion-canvas/motion-canvas/commit/15adb3e312a4998b44c0b9c5fe5b5236f51c71c9)),
  closes [#455](https://github.com/motion-canvas/motion-canvas/issues/455)
- display current package versions
  ([#501](https://github.com/motion-canvas/motion-canvas/issues/501))
  ([2972f67](https://github.com/motion-canvas/motion-canvas/commit/2972f673e201310e69688ab6f2c1adf1cddf2bf3))
- **ui:** list available shortcuts
  ([#444](https://github.com/motion-canvas/motion-canvas/issues/444))
  ([443fcc9](https://github.com/motion-canvas/motion-canvas/commit/443fcc9feb1a1ca69aecbc4db2e194ce4f50f72e))
- use PossibleVector2 in Vector2 methods
  ([#478](https://github.com/motion-canvas/motion-canvas/issues/478))
  ([8ccb44a](https://github.com/motion-canvas/motion-canvas/commit/8ccb44a265016e25b2b177a65d44f801c9d861f9))
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

- **2d:** add textAlign property
  ([#451](https://github.com/motion-canvas/motion-canvas/issues/451))
  ([3d15825](https://github.com/motion-canvas/motion-canvas/commit/3d15825f3cc5a35ba081a31510741b824f3bc6ab)),
  closes [#303](https://github.com/motion-canvas/motion-canvas/issues/303)
- **core:** add intersects method to BBox
  ([#485](https://github.com/motion-canvas/motion-canvas/issues/485))
  ([604b0e7](https://github.com/motion-canvas/motion-canvas/commit/604b0e7c22b4e5d196310e650f7c764526a80712))
- **core:** presentation mode
  ([#486](https://github.com/motion-canvas/motion-canvas/issues/486))
  ([c4f2e48](https://github.com/motion-canvas/motion-canvas/commit/c4f2e48ae6c65804ae46edd88c29125b7f983d5c))
- navigate to slide source
  ([#490](https://github.com/motion-canvas/motion-canvas/issues/490))
  ([b5ae4bf](https://github.com/motion-canvas/motion-canvas/commit/b5ae4bf37076b262a20949cca030db3902186c8d))
- **ui:** presentation interface
  ([#487](https://github.com/motion-canvas/motion-canvas/issues/487))
  ([1899f02](https://github.com/motion-canvas/motion-canvas/commit/1899f020fb1c0b2136de4401e6fc068bcf5e0cc4))

## [3.0.2](https://github.com/motion-canvas/motion-canvas/compare/v3.0.1...v3.0.2) (2023-02-27)

### Bug Fixes

- **2d:** correct layout defaults
  ([#442](https://github.com/motion-canvas/motion-canvas/issues/442))
  ([c116c35](https://github.com/motion-canvas/motion-canvas/commit/c116c355179ba3b2487634fb82b9a5bc2ea266bf))

## [3.0.1](https://github.com/motion-canvas/motion-canvas/compare/v3.0.0...v3.0.1) (2023-02-27)

### Bug Fixes

- **create:** update templates
  ([#439](https://github.com/motion-canvas/motion-canvas/issues/439))
  ([8483557](https://github.com/motion-canvas/motion-canvas/commit/8483557f0a3ca7914aafacceab5d466abba59df0))

# [3.0.0](https://github.com/motion-canvas/motion-canvas/compare/v2.6.0...v3.0.0) (2023-02-27)

### Bug Fixes

- **2d:** fix initial value of endOffset
  ([#433](https://github.com/motion-canvas/motion-canvas/issues/433))
  ([9fe82b3](https://github.com/motion-canvas/motion-canvas/commit/9fe82b3d21ba0150a2378e541a4652ca707c2d15))
- **2d:** fix performance issue with audio track
  ([#427](https://github.com/motion-canvas/motion-canvas/issues/427))
  ([c993770](https://github.com/motion-canvas/motion-canvas/commit/c993770937ddfdf0ac39b144a1f79f1a300f7899))
- **2d:** textDirection property for RTL/LTR text
  ([#404](https://github.com/motion-canvas/motion-canvas/issues/404))
  ([f240b1b](https://github.com/motion-canvas/motion-canvas/commit/f240b1bd140a884f6901b7cfcb97ce3e9ce4b48d))
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
- **ui:** correctly reset zoom
  ([#432](https://github.com/motion-canvas/motion-canvas/issues/432))
  ([a33ee14](https://github.com/motion-canvas/motion-canvas/commit/a33ee14dfac3e1fe24c89d76631e23fe4cb625a6))

### Code Refactoring

- introduce improved names
  ([#425](https://github.com/motion-canvas/motion-canvas/issues/425))
  ([4a2188d](https://github.com/motion-canvas/motion-canvas/commit/4a2188d339587fa658b2134befc3fe63c835c5d7))

### Features

- new playback architecture
  ([#402](https://github.com/motion-canvas/motion-canvas/issues/402))
  ([bbe3e2a](https://github.com/motion-canvas/motion-canvas/commit/bbe3e2a24de068a88f49ed7a2f13e9717039733b)),
  closes [#166](https://github.com/motion-canvas/motion-canvas/issues/166)
- **ui:** add quarter resolution
  ([#421](https://github.com/motion-canvas/motion-canvas/issues/421))
  ([d0160d0](https://github.com/motion-canvas/motion-canvas/commit/d0160d0d5ef76ffb0d3591566891b5efa4061744))

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
- **docs:** improve the release blog
  ([#410](https://github.com/motion-canvas/motion-canvas/issues/410))
  ([f56bbdb](https://github.com/motion-canvas/motion-canvas/commit/f56bbdb4a95e62035f277737ea5fba675e591270))
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
- **core:** playback speed is reset after saving with faulty code
  ([#204](https://github.com/motion-canvas/motion-canvas/issues/204)).
  ([#339](https://github.com/motion-canvas/motion-canvas/issues/339))
  ([6771e5e](https://github.com/motion-canvas/motion-canvas/commit/6771e5e17edcdc4cce074d7da0962cf71ba6c228))
- **docs:** fix search
  ([#336](https://github.com/motion-canvas/motion-canvas/issues/336))
  ([e44ec02](https://github.com/motion-canvas/motion-canvas/commit/e44ec02539a67f099471a6aa84f673a236494687))
- typo on codeblock remove comments
  ([#368](https://github.com/motion-canvas/motion-canvas/issues/368))
  ([2025adc](https://github.com/motion-canvas/motion-canvas/commit/2025adc6e7aa11d81b6f5f6989e8eae18cf86cb7))
- **ui:** fix inspector tab
  ([#374](https://github.com/motion-canvas/motion-canvas/issues/374))
  ([c4cb378](https://github.com/motion-canvas/motion-canvas/commit/c4cb378c2f9d972bb41542bbe3b3aa314fa1f3ad))
- **vite-plugin:** fix js template
  ([#337](https://github.com/motion-canvas/motion-canvas/issues/337))
  ([3b33d73](https://github.com/motion-canvas/motion-canvas/commit/3b33d73416541d491b633bada29f085f5489f6c2))
- **vite-plugin:** ignore query param in devserver
  ([#351](https://github.com/motion-canvas/motion-canvas/issues/351))
  ([5644d72](https://github.com/motion-canvas/motion-canvas/commit/5644d72d36adcdc817f0856aaff0be5507338cb8))

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
- **core:** add Matrix2D type
  ([#340](https://github.com/motion-canvas/motion-canvas/issues/340))
  ([66b41e6](https://github.com/motion-canvas/motion-canvas/commit/66b41e6beaca5c2ba4b6bd1a7e68ca16d183b0e9))
- **core:** error double event name
  ([#341](https://github.com/motion-canvas/motion-canvas/issues/341))
  ([053b2a6](https://github.com/motion-canvas/motion-canvas/commit/053b2a6c22c4e726e3962fdaf0a2e8d149889a9b))
- **docs:** add search
  ([#335](https://github.com/motion-canvas/motion-canvas/issues/335))
  ([48f74a6](https://github.com/motion-canvas/motion-canvas/commit/48f74a60d54cc52c7f069a9ec39071c99163bd19))
- **docs:** added CodeBlock documentation
  ([#302](https://github.com/motion-canvas/motion-canvas/issues/302))
  ([73f7221](https://github.com/motion-canvas/motion-canvas/commit/73f7221536e09d5cf77f75ca173d1a7637d5b98f))
- **ui:** add external link to docs
  ([#346](https://github.com/motion-canvas/motion-canvas/issues/346))
  ([fc4ee5d](https://github.com/motion-canvas/motion-canvas/commit/fc4ee5d028312904ed9e11c5341ac00f36e7242b))
- **ui:** shift + right arrow moves to last frame
  ([#354](https://github.com/motion-canvas/motion-canvas/issues/354))
  ([4b81709](https://github.com/motion-canvas/motion-canvas/commit/4b8170971400c5bf4fe690a58d3f44c3e1d00b94)),
  closes [#353](https://github.com/motion-canvas/motion-canvas/issues/353)

# [2.3.0](https://github.com/motion-canvas/motion-canvas/compare/v2.2.0...v2.3.0) (2023-02-11)

### Bug Fixes

- **2d:** make Text respect textWrap=pre
  ([#287](https://github.com/motion-canvas/motion-canvas/issues/287))
  ([cb07f4b](https://github.com/motion-canvas/motion-canvas/commit/cb07f4bdf07edc8a086b934ca5ab769682b9a010))
- **ui:** fix play-pause button
  ([#299](https://github.com/motion-canvas/motion-canvas/issues/299))
  ([191f54a](https://github.com/motion-canvas/motion-canvas/commit/191f54a0a5a9de2fd2dc27bffc6d21d692ce6f72))
- **ui:** remove glossy <select> effect in Safari
  ([#292](https://github.com/motion-canvas/motion-canvas/issues/292))
  ([9c062b2](https://github.com/motion-canvas/motion-canvas/commit/9c062b26e48fbdb1905daae25a3fb34df82307d3))

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
- **core:** add `debug` helper function
  ([#293](https://github.com/motion-canvas/motion-canvas/issues/293))
  ([b870873](https://github.com/motion-canvas/motion-canvas/commit/b8708732af0fc08d9ff9eeecbbb77d65f1b36eb8))
- **core:** additional easing functions
  ([#274](https://github.com/motion-canvas/motion-canvas/issues/274))
  ([f81ce43](https://github.com/motion-canvas/motion-canvas/commit/f81ce43019fe253e99f4ab6311c2251b40e2eae3))
- **core:** disallow tweening to/from undefined values
  ([#257](https://github.com/motion-canvas/motion-canvas/issues/257))
  ([d4bb791](https://github.com/motion-canvas/motion-canvas/commit/d4bb79145300b52c4b4d101df2afaff5ea11a9e9))
- **docs:** always re-build api references in `build` mode
  ([#298](https://github.com/motion-canvas/motion-canvas/issues/298))
  ([27a4d96](https://github.com/motion-canvas/motion-canvas/commit/27a4d96593d8e925385252b0d6f62646cd9fa6d5)),
  closes [#294](https://github.com/motion-canvas/motion-canvas/issues/294)

# [2.2.0](https://github.com/motion-canvas/motion-canvas/compare/v2.1.0...v2.2.0) (2023-02-09)

### Features

- **2d:** add video component property getter
  ([#240](https://github.com/motion-canvas/motion-canvas/issues/240))
  ([59de5ab](https://github.com/motion-canvas/motion-canvas/commit/59de5ab2c089589773a2f9ad7588eda7d72693a7))
- project variables
  ([#255](https://github.com/motion-canvas/motion-canvas/issues/255))
  ([4883295](https://github.com/motion-canvas/motion-canvas/commit/488329525939928af52b4a4d8488f1e1cd4cf6f7))

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
- **core:** fix looping
  ([#217](https://github.com/motion-canvas/motion-canvas/issues/217))
  ([a38e1a7](https://github.com/motion-canvas/motion-canvas/commit/a38e1a7c8fc21384cc17f3f982802071b8cd0cbf)),
  closes [#178](https://github.com/motion-canvas/motion-canvas/issues/178)
- **docs:** fix typo in configuration.mdx
  ([#185](https://github.com/motion-canvas/motion-canvas/issues/185))
  ([ca67529](https://github.com/motion-canvas/motion-canvas/commit/ca67529925d3483cb84a36e852e5bad79c3861eb))
- fix compound property setter
  ([#218](https://github.com/motion-canvas/motion-canvas/issues/218))
  ([6cd1b95](https://github.com/motion-canvas/motion-canvas/commit/6cd1b952df950554eb637c9f8e82947c415d00c5)),
  closes [#208](https://github.com/motion-canvas/motion-canvas/issues/208)
  [#210](https://github.com/motion-canvas/motion-canvas/issues/210)
- **vite-plugin:** add missing headers to html
  ([#219](https://github.com/motion-canvas/motion-canvas/issues/219))
  ([2552bcf](https://github.com/motion-canvas/motion-canvas/commit/2552bcfbe2e90f3d4b86810d39f8cee24349e405)),
  closes [#201](https://github.com/motion-canvas/motion-canvas/issues/201)

### Features

- add `useDuration` helper
  ([#226](https://github.com/motion-canvas/motion-canvas/issues/226))
  ([fa97d6c](https://github.com/motion-canvas/motion-canvas/commit/fa97d6c7f076f287c9b86d2f8852341bd368ef1c)),
  closes [#171](https://github.com/motion-canvas/motion-canvas/issues/171)

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
- add missing Arrow setters
  ([#82](https://github.com/motion-canvas/motion-canvas/issues/82))
  ([49843c9](https://github.com/motion-canvas/motion-canvas/commit/49843c9d38ee75de50ffc241d2a615be78f9e1f5))
- add missing canvas package
  ([26c8f4f](https://github.com/motion-canvas/motion-canvas/commit/26c8f4ff9947841b38f123466b7efd7f43706ffb))
- add missing public path
  ([#40](https://github.com/motion-canvas/motion-canvas/issues/40))
  ([48213de](https://github.com/motion-canvas/motion-canvas/commit/48213de087d6bb35f29919f5588e3a4517e080b6))
- add monospace font fallback in case JetBrains Mono is missing
  ([#24](https://github.com/motion-canvas/motion-canvas/issues/24))
  ([276a310](https://github.com/motion-canvas/motion-canvas/commit/276a310d63a4ea128a3640d6e0871045514c1c01)),
  closes [#16](https://github.com/motion-canvas/motion-canvas/issues/16)
- bug with createEaseInOutBack in interpolationFunctions.ts
  ([#69](https://github.com/motion-canvas/motion-canvas/issues/69))
  ([2b95876](https://github.com/motion-canvas/motion-canvas/commit/2b958768a6d01f81e4fde51a018209e0fe800f8f))
- change executable file permissions
  ([#38](https://github.com/motion-canvas/motion-canvas/issues/38))
  ([23025a2](https://github.com/motion-canvas/motion-canvas/commit/23025a2caefd993f7e4751b1efced3a25ed497a6))
- code will trigger PrismJS such that JSX is correctly highlighted
  ([#20](https://github.com/motion-canvas/motion-canvas/issues/20))
  ([b323231](https://github.com/motion-canvas/motion-canvas/commit/b32323184b5f479bc09950fdf9c570b5276ea600)),
  closes [#17](https://github.com/motion-canvas/motion-canvas/issues/17)
- **core:** add missing type references
  ([#41](https://github.com/motion-canvas/motion-canvas/issues/41))
  ([325c244](https://github.com/motion-canvas/motion-canvas/commit/325c2442814ca19407fe0060a819aded4456f90e))
- **core:** keep falsy values with deepTween
  ([#45](https://github.com/motion-canvas/motion-canvas/issues/45))
  ([93c934f](https://github.com/motion-canvas/motion-canvas/commit/93c934f9b59462581267cca5033bf132b831ce54))
- create missing output directories
  ([#13](https://github.com/motion-canvas/motion-canvas/issues/13))
  ([17f1e3f](https://github.com/motion-canvas/motion-canvas/commit/17f1e3fd37ec89998d67b22bd6762fc85b4778a2)),
  closes [#4](https://github.com/motion-canvas/motion-canvas/issues/4)
- **create:** fix package type
  ([#40](https://github.com/motion-canvas/motion-canvas/issues/40))
  ([f07aa5d](https://github.com/motion-canvas/motion-canvas/commit/f07aa5d8f6c3485464ed3158187340c7db7d5af7))
- detect missing meta files
  ([#83](https://github.com/motion-canvas/motion-canvas/issues/83))
  ([d1e2193](https://github.com/motion-canvas/motion-canvas/commit/d1e219361c7f61673073b377917c88d82f0e5d9e)),
  closes [#79](https://github.com/motion-canvas/motion-canvas/issues/79)
- display newlines in Code correctly
  ([#38](https://github.com/motion-canvas/motion-canvas/issues/38))
  ([df8f390](https://github.com/motion-canvas/motion-canvas/commit/df8f390848d7a8e03193d64e460142e00ed95031))
- **docs:** fix a typo
  ([#55](https://github.com/motion-canvas/motion-canvas/issues/55))
  ([2691148](https://github.com/motion-canvas/motion-canvas/commit/26911481fa5f3d1f76ecd550ba6f61f44bac6124))
- **docs:** fix broken links
  ([#105](https://github.com/motion-canvas/motion-canvas/issues/105))
  ([f79427d](https://github.com/motion-canvas/motion-canvas/commit/f79427d588190908ba4015b7820d529f25e64e6a))
- **docs:** fix links to examples
  ([#106](https://github.com/motion-canvas/motion-canvas/issues/106))
  ([d445b56](https://github.com/motion-canvas/motion-canvas/commit/d445b564746bb5e8cbabcddaa9857ffec80a8755))
- **docs:** fix small typo
  ([#107](https://github.com/motion-canvas/motion-canvas/issues/107))
  ([fe6cbb0](https://github.com/motion-canvas/motion-canvas/commit/fe6cbb0083407f3de4594c76692a417bf4f616ee))
- **docs:** improve predicate type
  ([#148](https://github.com/motion-canvas/motion-canvas/issues/148))
  ([3abee4f](https://github.com/motion-canvas/motion-canvas/commit/3abee4f89ef467a48eb68382ac6d46d443ad28d9))
- **docs:** name collisions between members
  ([#117](https://github.com/motion-canvas/motion-canvas/issues/117))
  ([1e52b94](https://github.com/motion-canvas/motion-canvas/commit/1e52b945cac15dc7da2d9db8fbcf5d88ba293c6f))
- **docs:** small corrections
  ([#108](https://github.com/motion-canvas/motion-canvas/issues/108))
  ([9212343](https://github.com/motion-canvas/motion-canvas/commit/921234377bad7bb0f334c5dda04498cce26f7891))
- empty time events crashing
  ([a1c53de](https://github.com/motion-canvas/motion-canvas/commit/a1c53deba7c405ddf1a3b4874f22b63e0b085af9))
- fix docs workflow
  ([#102](https://github.com/motion-canvas/motion-canvas/issues/102))
  ([f591169](https://github.com/motion-canvas/motion-canvas/commit/f5911699a7ae6b970ee4c0de891383a9c0cd5d0d))
- fix docs workflow
  ([#103](https://github.com/motion-canvas/motion-canvas/issues/103))
  ([b9e2006](https://github.com/motion-canvas/motion-canvas/commit/b9e20063be6aab75471d2a91cf862ac5bdc70e12))
- fix docs workflow
  ([#104](https://github.com/motion-canvas/motion-canvas/issues/104))
  ([7e59a1a](https://github.com/motion-canvas/motion-canvas/commit/7e59a1a5f77f4be65e599f539e16f6cf58785d9c))
- fix hot reload
  ([#26](https://github.com/motion-canvas/motion-canvas/issues/26))
  ([2ad746e](https://github.com/motion-canvas/motion-canvas/commit/2ad746e1eff705c2eb29ea9c83ad9810eeb54b05))
- fix meta file version and timing
  ([#32](https://github.com/motion-canvas/motion-canvas/issues/32))
  ([a369610](https://github.com/motion-canvas/motion-canvas/commit/a36961007eb7ac238b87ade3a03da101a1940800))
- fix player state not being saved
  ([#85](https://github.com/motion-canvas/motion-canvas/issues/85))
  ([74b54b9](https://github.com/motion-canvas/motion-canvas/commit/74b54b970d1287e80fe2334a034844ad6a80c23b))
- fix scaffolding
  ([#93](https://github.com/motion-canvas/motion-canvas/issues/93))
  ([95c55ed](https://github.com/motion-canvas/motion-canvas/commit/95c55ed338127dad22f42b24c8f6b101b8863be7))
- fix tsdoc comments
  ([#21](https://github.com/motion-canvas/motion-canvas/issues/21))
  ([4b6cb66](https://github.com/motion-canvas/motion-canvas/commit/4b6cb660ad82befcfd41188c7a8f9c8c0cba93ed)),
  closes [#18](https://github.com/motion-canvas/motion-canvas/issues/18)
- **legacy:** add missing files
  ([#61](https://github.com/motion-canvas/motion-canvas/issues/61))
  ([fad87d5](https://github.com/motion-canvas/motion-canvas/commit/fad87d5aa5500e7c63cb914fc51044db6225502e))
- load project state correctly
  ([#27](https://github.com/motion-canvas/motion-canvas/issues/27))
  ([8ae0233](https://github.com/motion-canvas/motion-canvas/commit/8ae02335d71858413bffb265573bd83a1e38d89e))
- make panes scrollable
  ([#14](https://github.com/motion-canvas/motion-canvas/issues/14))
  ([dc9fd38](https://github.com/motion-canvas/motion-canvas/commit/dc9fd380285c9dfcc6d8503cca87c32e01f11381))
- marked index.mjs as executable such that the cli will run on linux
  ([#47](https://github.com/motion-canvas/motion-canvas/issues/47))
  ([722d5eb](https://github.com/motion-canvas/motion-canvas/commit/722d5eb72b8f4659ff93f57737d70f2650b91f81)),
  closes [#46](https://github.com/motion-canvas/motion-canvas/issues/46)
- MeshBoneMaterial opacity
  ([24db561](https://github.com/motion-canvas/motion-canvas/commit/24db5613aca19e5de2672aaf31f422e51aee19c8))
- pre-commit hook will now work on linux and mac
  ([#51](https://github.com/motion-canvas/motion-canvas/issues/51))
  ([ef80035](https://github.com/motion-canvas/motion-canvas/commit/ef80035ff7f67f48339049e9f0ded60c79180cb6))
- prevent scrolling timeline with arrow keys
  ([#4](https://github.com/motion-canvas/motion-canvas/issues/4))
  ([dfc8108](https://github.com/motion-canvas/motion-canvas/commit/dfc8108976f5c20a4b4a44bee788ee71011769c6))
- previous scene being rendered twice
  ([#97](https://github.com/motion-canvas/motion-canvas/issues/97))
  ([90205bd](https://github.com/motion-canvas/motion-canvas/commit/90205bdc1a086abe5f73b04cb4616c6af5ec4377))
- previous scene invisible when seeking
  ([65e32f0](https://github.com/motion-canvas/motion-canvas/commit/65e32f03b79af730064c935eaf1645019c303399))
- previous scenes not getting disposed
  ([bf3a1fc](https://github.com/motion-canvas/motion-canvas/commit/bf3a1fcf5fc22758893b5b742ca00a5741a5d560))
- range middle-click expansion
  ([1c0b724](https://github.com/motion-canvas/motion-canvas/commit/1c0b7243cffa3e33779b736ecce2dad19880f796))
- re-render the scene when canvas changes
  ([#55](https://github.com/motion-canvas/motion-canvas/issues/55))
  ([191f96d](https://github.com/motion-canvas/motion-canvas/commit/191f96da1441bc37d6e61e1acdcfde6994a7f9f3))
- remove inconsistency in playhead controls
  ([#1](https://github.com/motion-canvas/motion-canvas/issues/1))
  ([58cdb4a](https://github.com/motion-canvas/motion-canvas/commit/58cdb4a26144f9933dba64d687fa63d442f115bd))
- respect child origins in LinearLayout
  ([5ee114d](https://github.com/motion-canvas/motion-canvas/commit/5ee114ddd9e48d6cea5360ea090c17f1dbc8c641))
- restrict the corner radius of a rectangle
  ([#9](https://github.com/motion-canvas/motion-canvas/issues/9))
  ([cc86a4a](https://github.com/motion-canvas/motion-canvas/commit/cc86a4a6d5b44e75ed02a1bdf90b588450a663b2)),
  closes [#8](https://github.com/motion-canvas/motion-canvas/issues/8)
- save time events only if they're actively used
  ([#35](https://github.com/motion-canvas/motion-canvas/issues/35))
  ([bd78c89](https://github.com/motion-canvas/motion-canvas/commit/bd78c8967ba395beeb352006b5f33768b4a4c498)),
  closes [#33](https://github.com/motion-canvas/motion-canvas/issues/33)
  [#34](https://github.com/motion-canvas/motion-canvas/issues/34)
- save timeline state
  ([9d57b8a](https://github.com/motion-canvas/motion-canvas/commit/9d57b8ae1f7cfd6ec468d3348aa0fda4afd88a84))
- support hmr when navigating
  ([370ea16](https://github.com/motion-canvas/motion-canvas/commit/370ea1676a1c34313c0fb917c0f0691538f72016))
- support nested threads
  ([#84](https://github.com/motion-canvas/motion-canvas/issues/84))
  ([4a4a95f](https://github.com/motion-canvas/motion-canvas/commit/4a4a95f5891b5ec674f67f6b889abe4e855509ac))
- the resolution fields in Rendering no longer reset each other
  ([#73](https://github.com/motion-canvas/motion-canvas/issues/73))
  ([ddabec5](https://github.com/motion-canvas/motion-canvas/commit/ddabec549be3cecec27cf9f5643b036e12a83472))
- timeline will no longer seek when scrolling using the scrollbar
  ([#19](https://github.com/motion-canvas/motion-canvas/issues/19))
  ([c1b1680](https://github.com/motion-canvas/motion-canvas/commit/c1b168065814edfe7dc4283366a98826c7d93d88))
- **ui:** don't seek when editing time events
  ([#26](https://github.com/motion-canvas/motion-canvas/issues/26))
  ([524c200](https://github.com/motion-canvas/motion-canvas/commit/524c200ef1bd6a6f52096d04c2aeed24a24cda6f))
- **ui:** downgrade preact
  ([#1](https://github.com/motion-canvas/motion-canvas/issues/1))
  ([5f7456f](https://github.com/motion-canvas/motion-canvas/commit/5f7456fe4c5a1cc76ccd8fed5a6f9a8a4e846d27))
- **ui:** misaligned overlay
  ([#127](https://github.com/motion-canvas/motion-canvas/issues/127))
  ([0379730](https://github.com/motion-canvas/motion-canvas/commit/03797302a302e28caf9f2428cfce4a122f827775))
- **ui:** prevent context menu in viewport
  ([#123](https://github.com/motion-canvas/motion-canvas/issues/123))
  ([0fdd85e](https://github.com/motion-canvas/motion-canvas/commit/0fdd85ecf5b61907ce1e16f5fb9253540528a8b0))
- **ui:** prevent timeline scroll when zooming
  ([#162](https://github.com/motion-canvas/motion-canvas/issues/162))
  ([b8278ae](https://github.com/motion-canvas/motion-canvas/commit/b8278aeb7b92f215bccbd1aa57de17c9233cff01))
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
- add basic documentation structure
  ([#10](https://github.com/motion-canvas/motion-canvas/issues/10))
  ([1e46433](https://github.com/motion-canvas/motion-canvas/commit/1e46433af37e8fec18dec6efc7dc1e3b70d9a869)),
  closes [#2](https://github.com/motion-canvas/motion-canvas/issues/2)
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
- add ease back interp functions
  ([#30](https://github.com/motion-canvas/motion-canvas/issues/30))
  ([c11046d](https://github.com/motion-canvas/motion-canvas/commit/c11046d939bf5a29e28bda0ef97feabe2f985a0f))
- add eslint
  ([658f468](https://github.com/motion-canvas/motion-canvas/commit/658f468318c8ad88088bd5230172fb4d0bc2af00))
- add Grid node
  ([e1f83da](https://github.com/motion-canvas/motion-canvas/commit/e1f83da1f43d20d392df4acb11e3df9cc457585d))
- add inspection
  ([#82](https://github.com/motion-canvas/motion-canvas/issues/82))
  ([4d7f2ae](https://github.com/motion-canvas/motion-canvas/commit/4d7f2aee6daeda1a2146b632dfdc28b455295776))
- add layered layout
  ([381b2c0](https://github.com/motion-canvas/motion-canvas/commit/381b2c083d90aa4fe815370afd0138dde114bf4a))
- add LayoutText
  ([328b7b7](https://github.com/motion-canvas/motion-canvas/commit/328b7b7f193b60223269002812f29922bc78132e))
- add markdown logs
  ([#138](https://github.com/motion-canvas/motion-canvas/issues/138))
  ([e42447a](https://github.com/motion-canvas/motion-canvas/commit/e42447a0c07a8192c06d21c5f1801f0266279075))
- add meta files
  ([#28](https://github.com/motion-canvas/motion-canvas/issues/28))
  ([e29f7d0](https://github.com/motion-canvas/motion-canvas/commit/e29f7d0ed01c7fb84f0931be5485fdde1aa0a5c2)),
  closes [#7](https://github.com/motion-canvas/motion-canvas/issues/7)
- add missing layout props
  ([#72](https://github.com/motion-canvas/motion-canvas/issues/72))
  ([f808a56](https://github.com/motion-canvas/motion-canvas/commit/f808a562b192fd03dba4b0d353284db344d6a80b))
- add node spawners
  ([#149](https://github.com/motion-canvas/motion-canvas/issues/149))
  ([da18a4e](https://github.com/motion-canvas/motion-canvas/commit/da18a4e24104022a84ecd6cec1666b520186058f))
- add polyline ([#84](https://github.com/motion-canvas/motion-canvas/issues/84))
  ([4ceaf84](https://github.com/motion-canvas/motion-canvas/commit/4ceaf842915ac43d81f292c58a4dc73a8d1bb8e9))
- add pull request verification
  ([d91bab5](https://github.com/motion-canvas/motion-canvas/commit/d91bab55832fed3e494842e9e17eed5281efecbb))
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
- add support for meta files
  ([#11](https://github.com/motion-canvas/motion-canvas/issues/11))
  ([456790a](https://github.com/motion-canvas/motion-canvas/commit/456790ab8c88bf28baa4843078013ff881c1a439))
- add support for npm workspaces
  ([741567f](https://github.com/motion-canvas/motion-canvas/commit/741567f8af4185a2b1bc5284064514d96e75f5f2))
- add Text and Image components
  ([#70](https://github.com/motion-canvas/motion-canvas/issues/70))
  ([85c7dcd](https://github.com/motion-canvas/motion-canvas/commit/85c7dcdb4f8ca2f0bfb03950c85a8d6f6652fcdf))
- add video node
  ([#86](https://github.com/motion-canvas/motion-canvas/issues/86))
  ([f4aa654](https://github.com/motion-canvas/motion-canvas/commit/f4aa65437a18cc85b00199f80cd5e04654c00c4b))
- added color space option to Project and Player
  ([#89](https://github.com/motion-canvas/motion-canvas/issues/89))
  ([e1e2ac4](https://github.com/motion-canvas/motion-canvas/commit/e1e2ac44ea35a9280b31e57fb365a227c7d2bba0)),
  closes [#80](https://github.com/motion-canvas/motion-canvas/issues/80)
- added Color Space option to Rendering panel
  ([#24](https://github.com/motion-canvas/motion-canvas/issues/24))
  ([33f691d](https://github.com/motion-canvas/motion-canvas/commit/33f691de086dbdb40841ba04a0ba5446a06056bb))
- added custom resolution inputs to the rendering pane
  ([#20](https://github.com/motion-canvas/motion-canvas/issues/20))
  ([1f799b6](https://github.com/motion-canvas/motion-canvas/commit/1f799b695e54f6cf3a16ede61a82a53be2e0c803))
- added deepTween function and rewrote colorTween to use colorjs.io
  ([#88](https://github.com/motion-canvas/motion-canvas/issues/88))
  ([eb7ca3c](https://github.com/motion-canvas/motion-canvas/commit/eb7ca3c8974ab2b2c905338a01e900c8938805b5)),
  closes [#73](https://github.com/motion-canvas/motion-canvas/issues/73)
  [#78](https://github.com/motion-canvas/motion-canvas/issues/78)
- added file type and quality options to rendering panel
  ([#50](https://github.com/motion-canvas/motion-canvas/issues/50))
  ([bee71ef](https://github.com/motion-canvas/motion-canvas/commit/bee71ef2673c269db47a4433831720b7ad0fb4e8)),
  closes [#24](https://github.com/motion-canvas/motion-canvas/issues/24)
- added useContext and useContextAfter hooks
  ([#63](https://github.com/motion-canvas/motion-canvas/issues/63))
  ([352e131](https://github.com/motion-canvas/motion-canvas/commit/352e13104361389e81d96eadeb41a680eaafafdb)),
  closes [#58](https://github.com/motion-canvas/motion-canvas/issues/58)
- animation player
  ([#92](https://github.com/motion-canvas/motion-canvas/issues/92))
  ([8155118](https://github.com/motion-canvas/motion-canvas/commit/8155118eb13dc2a8b422b81aabacc923ce2f919b))
- AnimationClip
  ([681146a](https://github.com/motion-canvas/motion-canvas/commit/681146a8e92a4360975472939eb2494b89f02eff))
- arc tween ratio
  ([27dbb0b](https://github.com/motion-canvas/motion-canvas/commit/27dbb0bd2749600cdee6944a469ee10870989a28))
- audio offset
  ([88f40aa](https://github.com/motion-canvas/motion-canvas/commit/88f40aa93bb23090058965bd7d76b81106804c05))
- audio playback
  ([e9a6fdb](https://github.com/motion-canvas/motion-canvas/commit/e9a6fdb51e62dd8e7a0ca43e7ae6908ff7d92c53))
- audio toggle control
  ([300f18e](https://github.com/motion-canvas/motion-canvas/commit/300f18e9c9c0ad559edb14bbfce889a717ab15c2))
- audio waveform track
  ([9aff955](https://github.com/motion-canvas/motion-canvas/commit/9aff955ef472644834d1232b90a93b935127fffd))
- better dependencies between packages
  ([#152](https://github.com/motion-canvas/motion-canvas/issues/152))
  ([a0a37b3](https://github.com/motion-canvas/motion-canvas/commit/a0a37b3645fcb91206e65fd0a95b2f486b308c75))
- better dependencies between packages
  ([#153](https://github.com/motion-canvas/motion-canvas/issues/153))
  ([59a73d4](https://github.com/motion-canvas/motion-canvas/commit/59a73d49a7b92c416e1f836a0f53bb676e9f924b))
- better naming conventions
  ([#62](https://github.com/motion-canvas/motion-canvas/issues/62))
  ([a9d764f](https://github.com/motion-canvas/motion-canvas/commit/a9d764fbceb639497ef45f44c90f9b6e408213d3))
- better playback controls
  ([796ae33](https://github.com/motion-canvas/motion-canvas/commit/796ae3356c4853a38e1e6471cb62e73b47f02fd2))
- better time events
  ([8c2bf27](https://github.com/motion-canvas/motion-canvas/commit/8c2bf27ac7bac9d6f77a15ec99d433baa4329c0e))
- better time events
  ([1acd71b](https://github.com/motion-canvas/motion-canvas/commit/1acd71bb4d13d927040b42a8f77faf87ee185a3b))
- blob rendering
  ([4dff949](https://github.com/motion-canvas/motion-canvas/commit/4dff949de9a7cfa781e9738c625c5c46d63e1da5))
- browser based renderer
  ([13dc24c](https://github.com/motion-canvas/motion-canvas/commit/13dc24ca69e31dab911cc1211b56684c28425e85))
- circular mask for surfaces
  ([4db62d8](https://github.com/motion-canvas/motion-canvas/commit/4db62d8a6572dda0931e0826f2fab359ee9accad))
- clamp function
  ([94543d1](https://github.com/motion-canvas/motion-canvas/commit/94543d1079a46d9a8c8d26b87bd91dc2c5e17aea))
- color picker
  ([ac48055](https://github.com/motion-canvas/motion-canvas/commit/ac48055b4ffd833fb1fca6fcd0b2fd7d38a57aab))
- configurable framerate and resolution
  ([a715f5c](https://github.com/motion-canvas/motion-canvas/commit/a715f5c1acd28e2e1dd5496ea8cb4b23b4cea7be))
- configurable framerate and resolution
  ([a591683](https://github.com/motion-canvas/motion-canvas/commit/a591683f93e92f1f41ad89fd7d23eea67d32e3ac))
- connections
  ([49254fc](https://github.com/motion-canvas/motion-canvas/commit/49254fc36cc03c8f8557c14ff86ab38f56229b04))
- **core:** add configurable line numbers
  ([#44](https://github.com/motion-canvas/motion-canvas/issues/44))
  ([831334c](https://github.com/motion-canvas/motion-canvas/commit/831334ca32a504991e875af37446fef4f055c285)),
  closes [#12](https://github.com/motion-canvas/motion-canvas/issues/12)
- **core:** switch to vitest
  ([#99](https://github.com/motion-canvas/motion-canvas/issues/99))
  ([762eeb0](https://github.com/motion-canvas/motion-canvas/commit/762eeb0a99c2f378d20dbd147f815ba6736099d9)),
  closes [#48](https://github.com/motion-canvas/motion-canvas/issues/48)
- create new release
  ([20282e9](https://github.com/motion-canvas/motion-canvas/commit/20282e9745a42c5bf62d104afe65fa71fbd973a2))
- custom loaders
  ([5a3ab9a](https://github.com/motion-canvas/motion-canvas/commit/5a3ab9ad4d2d332d99d594c8812adc32a8d4b04c))
- decouple Konva from core
  ([#54](https://github.com/motion-canvas/motion-canvas/issues/54))
  ([02b5c75](https://github.com/motion-canvas/motion-canvas/commit/02b5c75dba482dcf90a626142c8952f29009e299)),
  closes [#49](https://github.com/motion-canvas/motion-canvas/issues/49)
  [#31](https://github.com/motion-canvas/motion-canvas/issues/31)
- detect circular signal dependencies
  ([#129](https://github.com/motion-canvas/motion-canvas/issues/129))
  ([6fcdb41](https://github.com/motion-canvas/motion-canvas/commit/6fcdb41df90dca1c39537a4f6d4960ab551f4d6e))
- directional padding and margin
  ([441d121](https://github.com/motion-canvas/motion-canvas/commit/441d1210adbd85406d7dbe2edc21da044724a1ee))
- display time in seconds
  ([0290a9c](https://github.com/motion-canvas/motion-canvas/commit/0290a9cb0775693a4cde7d1fa3bee90c9329dcfb))
- **docs:** add logo
  ([#23](https://github.com/motion-canvas/motion-canvas/issues/23))
  ([78698e4](https://github.com/motion-canvas/motion-canvas/commit/78698e40a428d5a1aa469fbdad9c7c88e82230bc))
- **docs:** add migration guide for v10
  ([#37](https://github.com/motion-canvas/motion-canvas/issues/37))
  ([0905daa](https://github.com/motion-canvas/motion-canvas/commit/0905daa60f42943554555834339d3ab70fe9b9c3))
- **docs:** visual changes
  ([be83edf](https://github.com/motion-canvas/motion-canvas/commit/be83edf847fb35cc77590ff5720f9eca79e9b787))
- editor improvements
  ([#121](https://github.com/motion-canvas/motion-canvas/issues/121))
  ([e8b32ce](https://github.com/motion-canvas/motion-canvas/commit/e8b32ceff1b8216282c4b5713508ce1172645e20))
- extract konva to separate package
  ([#60](https://github.com/motion-canvas/motion-canvas/issues/60))
  ([4ecad3c](https://github.com/motion-canvas/motion-canvas/commit/4ecad3ca2732bd5147af670c230f8f959129a707))
- filter reordering
  ([#119](https://github.com/motion-canvas/motion-canvas/issues/119))
  ([2398d0f](https://github.com/motion-canvas/motion-canvas/commit/2398d0f9d57f36b47c9c66a988ca5607e9a3a30e))
- follow utility
  ([fddfc67](https://github.com/motion-canvas/motion-canvas/commit/fddfc67a42fc0f8e2a6f76d00a30c813592caf9e))
- force rendering to restart seek time
  ([#14](https://github.com/motion-canvas/motion-canvas/issues/14))
  ([e94027a](https://github.com/motion-canvas/motion-canvas/commit/e94027a36fe2a0b11f3aa42bb3fa869c10fbe1ea)),
  closes [#6](https://github.com/motion-canvas/motion-canvas/issues/6)
- framerate-independent timing
  ([#64](https://github.com/motion-canvas/motion-canvas/issues/64))
  ([6891f59](https://github.com/motion-canvas/motion-canvas/commit/6891f5974145878bc18f200e70cff5117ac32bd3)),
  closes [#57](https://github.com/motion-canvas/motion-canvas/issues/57)
- function components
  ([178db3d](https://github.com/motion-canvas/motion-canvas/commit/178db3d95c091e9abdf79e67548836332f40dc89))
- general improvements
  ([320cced](https://github.com/motion-canvas/motion-canvas/commit/320ccede3d764b8aabbcea2d92ee808efa36708a))
- general improvements
  ([dbff3cc](https://github.com/motion-canvas/motion-canvas/commit/dbff3cce379fb18eec5900ef9d90ba752ab826b4))
- grid
  ([d201a4d](https://github.com/motion-canvas/motion-canvas/commit/d201a4d09393001f7106c2f33b17b49434f047e7))
- grid and debug overlays
  ([895a53a](https://github.com/motion-canvas/motion-canvas/commit/895a53ab4222c8d57a3e0d924181ee370b1356d7))
- grid overlay
  ([f7aca18](https://github.com/motion-canvas/motion-canvas/commit/f7aca1854c390c90bea3614180eb73b1f91375b8))
- implement absolute scale setter
  ([842079a](https://github.com/motion-canvas/motion-canvas/commit/842079a6547af4032719c85837df3db7c1c6d30a))
- implement properties tab
  ([#10](https://github.com/motion-canvas/motion-canvas/issues/10))
  ([e882a7f](https://github.com/motion-canvas/motion-canvas/commit/e882a7f52315a63508035899037cbab3278c1553))
- improve async signals
  ([#156](https://github.com/motion-canvas/motion-canvas/issues/156))
  ([db27b9d](https://github.com/motion-canvas/motion-canvas/commit/db27b9d5fb69a88f42afd98c86c4a1cdceb88ea1))
- improve layouts
  ([9a1fb5c](https://github.com/motion-canvas/motion-canvas/commit/9a1fb5c7cd740a6f696c907a8f1d8ed900995985))
- improve surface clipping
  ([#41](https://github.com/motion-canvas/motion-canvas/issues/41))
  ([003b7d5](https://github.com/motion-canvas/motion-canvas/commit/003b7d58d6490170cea81b2d1b37cf59b4d698cf))
- introduce basic caching
  ([#68](https://github.com/motion-canvas/motion-canvas/issues/68))
  ([6420d36](https://github.com/motion-canvas/motion-canvas/commit/6420d362d0e4ae058f55b6ff6bb2a3a32dec559b))
- jsx
  ([3a633e8](https://github.com/motion-canvas/motion-canvas/commit/3a633e882714c85043c014f98cad2d5d30b40607))
- keyboard shortcuts
  ([4a3a7b5](https://github.com/motion-canvas/motion-canvas/commit/4a3a7b53bccd89bd1dd93207e3e1b9640bdf6102))
- layouts
  ([749f929](https://github.com/motion-canvas/motion-canvas/commit/749f9297beae67bfa61cfcdf45806329574b75d1))
- loading indication
  ([93638d5](https://github.com/motion-canvas/motion-canvas/commit/93638d5e056711fa0f0473d20d16074d9c6f3fd5))
- make exporting concurrent
  ([4f9ef8d](https://github.com/motion-canvas/motion-canvas/commit/4f9ef8d40d9d9c1147e2edfc0766c5ea5cc4297c))
- make scenes independent of names
  ([#53](https://github.com/motion-canvas/motion-canvas/issues/53))
  ([417617e](https://github.com/motion-canvas/motion-canvas/commit/417617eb5f0af771e7413c9ce4c7e9b998e3e490)),
  closes [#25](https://github.com/motion-canvas/motion-canvas/issues/25)
- make surfaces transparent by default
  ([#42](https://github.com/motion-canvas/motion-canvas/issues/42))
  ([cd71285](https://github.com/motion-canvas/motion-canvas/commit/cd712857579ec45b3e6f40d0e48fce80fefed5b9)),
  closes [#25](https://github.com/motion-canvas/motion-canvas/issues/25)
- mask animation
  ([5771963](https://github.com/motion-canvas/motion-canvas/commit/57719638cbca8f93c0e36f9380bfbe557a8633cd))
- merge properties and signals
  ([#124](https://github.com/motion-canvas/motion-canvas/issues/124))
  ([da3ba83](https://github.com/motion-canvas/motion-canvas/commit/da3ba83d82ee74f5a5c3631b07597f08cdf9e8e4))
- minor console improvements
  ([#145](https://github.com/motion-canvas/motion-canvas/issues/145))
  ([3e32e73](https://github.com/motion-canvas/motion-canvas/commit/3e32e73434ad872049af9e3f1f711bc0185410f4))
- minor improvements
  ([403c7c2](https://github.com/motion-canvas/motion-canvas/commit/403c7c27ad969880a14c498ec6cefb9e7e7b7544))
- minor improvements
  ([#77](https://github.com/motion-canvas/motion-canvas/issues/77))
  ([7c6e584](https://github.com/motion-canvas/motion-canvas/commit/7c6e584aca353c9af55f0acb61b32b5f99727dba))
- move back playhead by a frame
  ([#18](https://github.com/motion-canvas/motion-canvas/issues/18))
  ([b944cd7](https://github.com/motion-canvas/motion-canvas/commit/b944cd71c075e10622bd7bc81de90024c73438b7))
- navigate to scene and node source
  ([#144](https://github.com/motion-canvas/motion-canvas/issues/144))
  ([86d495d](https://github.com/motion-canvas/motion-canvas/commit/86d495d01a9f8f0a58e676fedb6df9c12a14d14a))
- new animator ([#91](https://github.com/motion-canvas/motion-canvas/issues/91))
  ([d85f2f8](https://github.com/motion-canvas/motion-canvas/commit/d85f2f8a54c0f8bbfbc451884385f30e5b3ec206))
- open time events in editor
  ([#87](https://github.com/motion-canvas/motion-canvas/issues/87))
  ([74b781d](https://github.com/motion-canvas/motion-canvas/commit/74b781d57fca7ef1d10904673276f2a7354c01b8))
- package separation
  ([e69a566](https://github.com/motion-canvas/motion-canvas/commit/e69a56635fbc073766018c8e53139a2135dbca10))
- pan with shift and left click
  ([#7](https://github.com/motion-canvas/motion-canvas/issues/7))
  ([4ff8241](https://github.com/motion-canvas/motion-canvas/commit/4ff82419bd0066c8efa2675b196c273b7105a7ca)),
  closes [#5](https://github.com/motion-canvas/motion-canvas/issues/5)
- playback controls
  ([94dab5d](https://github.com/motion-canvas/motion-canvas/commit/94dab5dc1b8deaa4eaab561454699b3c22393618))
- **player:** add auto mode
  ([c107259](https://github.com/motion-canvas/motion-canvas/commit/c107259f7c2a3886ccfe4ca0140d13064aed238f))
- **player:** improve accessibility
  ([0fc9235](https://github.com/motion-canvas/motion-canvas/commit/0fc923576e7b12f9bc799f3a4e861861d49a2406))
- Promise support
  ([711f793](https://github.com/motion-canvas/motion-canvas/commit/711f7937d86a9a0b2b7011b25799499d786e056d))
- remove strongly-typed-events
  ([#48](https://github.com/motion-canvas/motion-canvas/issues/48))
  ([41947b5](https://github.com/motion-canvas/motion-canvas/commit/41947b5ab6a2ec69d963f3445d1ea65d835c73ff))
- remove ui elements
  ([8e5c288](https://github.com/motion-canvas/motion-canvas/commit/8e5c288750dfe9f697939abac03678b7885df428))
- renderer ui
  ([8a4e5d3](https://github.com/motion-canvas/motion-canvas/commit/8a4e5d32b1e55f054bf3e98ef54c49f66655c034))
- rendering
  ([60ccda7](https://github.com/motion-canvas/motion-canvas/commit/60ccda723361751f28bc1144de314388551c95a2))
- replaced `scene.transition` with `useTransition`
  ([#68](https://github.com/motion-canvas/motion-canvas/issues/68))
  ([f521115](https://github.com/motion-canvas/motion-canvas/commit/f521115889a7f341e03b4e7ee7530a70f37760d8)),
  closes [#56](https://github.com/motion-canvas/motion-canvas/issues/56)
- scene transitions
  ([d45f1d3](https://github.com/motion-canvas/motion-canvas/commit/d45f1d36bd23fbb5d07c6865ae31e624cba11bd2))
- sidebar
  ([d5345ba](https://github.com/motion-canvas/motion-canvas/commit/d5345ba444296b1648fab17274e241d879054833))
- signal error handling
  ([#89](https://github.com/motion-canvas/motion-canvas/issues/89))
  ([472ac65](https://github.com/motion-canvas/motion-canvas/commit/472ac65938b804a6b698c8522ec0c3b6bdbcf1b1))
- simplify size access
  ([#65](https://github.com/motion-canvas/motion-canvas/issues/65))
  ([3315e64](https://github.com/motion-canvas/motion-canvas/commit/3315e64641e9778bc48ea3fb707e3c0eeb581dfe))
- simplify size access further
  ([#66](https://github.com/motion-canvas/motion-canvas/issues/66))
  ([9091a5e](https://github.com/motion-canvas/motion-canvas/commit/9091a5e05d8fadf72c50832c7c4467ac4424b72c))
- simplify the process of importing images
  ([#39](https://github.com/motion-canvas/motion-canvas/issues/39))
  ([0c2341f](https://github.com/motion-canvas/motion-canvas/commit/0c2341fe255ee1702181e04f4cd2024a9eeabce5)),
  closes [#19](https://github.com/motion-canvas/motion-canvas/issues/19)
- sprites and threading
  ([a541682](https://github.com/motion-canvas/motion-canvas/commit/a5416828bfb5d40f92c695b8a9a6df7b2d6686ca))
- support for multiple projects
  ([#57](https://github.com/motion-canvas/motion-canvas/issues/57))
  ([573752d](https://github.com/motion-canvas/motion-canvas/commit/573752dd4d79d62a1a30958f1ed550d2cf22c344)),
  closes [#141414](https://github.com/motion-canvas/motion-canvas/issues/141414)
- support lower framerate
  ([3c81086](https://github.com/motion-canvas/motion-canvas/commit/3c81086829ad12dda805c355649cce7c0f156d2e))
- support multiple players
  ([#128](https://github.com/motion-canvas/motion-canvas/issues/128))
  ([24f75cf](https://github.com/motion-canvas/motion-canvas/commit/24f75cf7cdaf38f890e3936edf175afbfd340210))
- surfaceFrom animation
  ([77bb69e](https://github.com/motion-canvas/motion-canvas/commit/77bb69e6a6481d412f800f65b6303c4c5f33cc94))
- surfaces
  ([99f9e96](https://github.com/motion-canvas/motion-canvas/commit/99f9e96a108bbd2a08a1931fd042a5969354da60))
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
- threading
  ([e9f6b2a](https://github.com/motion-canvas/motion-canvas/commit/e9f6b2ad0838f0240e8bbd196061ba6ce23eac27))
- three.js integration
  ([79cc975](https://github.com/motion-canvas/motion-canvas/commit/79cc975ecaa35d54f0e530f9b732d6472d965c3a))
- time events
  ([f47cc66](https://github.com/motion-canvas/motion-canvas/commit/f47cc666f64ee5733ebe200503bd94a1a48a9c02))
- time events
  ([026a284](https://github.com/motion-canvas/motion-canvas/commit/026a2840a3625172431fb073a513fea4499164d4))
- time parameter for tweens
  ([3fe90ed](https://github.com/motion-canvas/motion-canvas/commit/3fe90edc49abb910522c75d4df3c56b40c29731f))
- timeline range
  ([ed2d78d](https://github.com/motion-canvas/motion-canvas/commit/ed2d78dbba4211aac5317035f7ce0931db90a59a))
- timeline tracks
  ([93a89cd](https://github.com/motion-canvas/motion-canvas/commit/93a89cd6edf055ac7847b508ee4364eb42a6bcd4))
- turn Layout into node
  ([#75](https://github.com/motion-canvas/motion-canvas/issues/75))
  ([cdf8dc0](https://github.com/motion-canvas/motion-canvas/commit/cdf8dc0a35522482dee2dd78a69606b79f52246e))
- **ui:** timeline overhaul
  ([#47](https://github.com/motion-canvas/motion-canvas/issues/47))
  ([4232a60](https://github.com/motion-canvas/motion-canvas/commit/4232a6072540b54451e99e18c1001db0175bb93f)),
  closes [#20](https://github.com/motion-canvas/motion-canvas/issues/20)
- **ui:** visual changes
  ([#96](https://github.com/motion-canvas/motion-canvas/issues/96))
  ([3d599f4](https://github.com/motion-canvas/motion-canvas/commit/3d599f4e1788fbd15e996be8bf95679f1c6787bd))
- unify core types
  ([#71](https://github.com/motion-canvas/motion-canvas/issues/71))
  ([9c5853d](https://github.com/motion-canvas/motion-canvas/commit/9c5853d8bc65204693c38109a25d1fefd44241b7))
- unify references and signals
  ([#137](https://github.com/motion-canvas/motion-canvas/issues/137))
  ([063aede](https://github.com/motion-canvas/motion-canvas/commit/063aede0842f948d2c6704c6edd426e954bb4668))
- update core to 6.0.0
  ([#17](https://github.com/motion-canvas/motion-canvas/issues/17))
  ([f8d453b](https://github.com/motion-canvas/motion-canvas/commit/f8d453b22beb5250ea822d274ed2ab6bfea5c39c))
- use Web Audio API for waveform generation
  ([817e244](https://github.com/motion-canvas/motion-canvas/commit/817e244bb2187532df7142199917412ccfe8d218))
- use Web Audio API for waveform generation
  ([ba3e16f](https://github.com/motion-canvas/motion-canvas/commit/ba3e16f04a12de87408ca68df5acacf5610ed617))
- useAnimator utility
  ([ad32e8a](https://github.com/motion-canvas/motion-canvas/commit/ad32e8a0add494021d4c5c9fe5b3915189f00a08))
- viewport, playback, and timeline
  ([c5f9636](https://github.com/motion-canvas/motion-canvas/commit/c5f96360258a8dca5faa66c79451969da7eebabc))
- **vite-plugin:** improve audio handling
  ([#154](https://github.com/motion-canvas/motion-canvas/issues/154))
  ([482f144](https://github.com/motion-canvas/motion-canvas/commit/482f14447ae54543346fab0f9e5b94631c5cfd4d))
- waveform data
  ([400a756](https://github.com/motion-canvas/motion-canvas/commit/400a756ebf7ee174d8cbaf03f1f74eddd1b75925))

### Reverts

- "ci(release): 9.1.3 [skip ci]"
  ([62953a6](https://github.com/motion-canvas/motion-canvas/commit/62953a6a8a1b1da3eb2e5f51c9fe60c716d6b94b))
- chore(release): 1.4.0 [skip ci]
  ([d6121ae](https://github.com/motion-canvas/motion-canvas/commit/d6121ae946e9e79e1e6ddee4b8b0dd839d122c55))
- ci(release): 1.0.1 [skip ci]
  ([#175](https://github.com/motion-canvas/motion-canvas/issues/175))
  ([161a046](https://github.com/motion-canvas/motion-canvas/commit/161a04647ecdc8203daf2d887a6a44c79a92ee20))
- ci(release): 2.0.0 [skip ci]
  ([#176](https://github.com/motion-canvas/motion-canvas/issues/176))
  ([551096b](https://github.com/motion-canvas/motion-canvas/commit/551096bf636a791ea7c7c1d38d8e03c360433008))

### BREAKING CHANGES

- remove legacy package
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

````ts
import {Project} from '@motion-canvas/core/lib';

import example from './scenes/example.scene';

export default new Project({
  name: 'project',
  scenes: [example],
  // same options as in bootstrap() are available:
* Animator.inferTweenFunction now returns deepTween,
which does not work exactly as before, though should be a viable
replacement in most cases.
* `scene.transition()` has been replaced by `useTransition`

Any use of slide transition must be updated from
```ts
yield* scene.transition(slideTransition());
````

to

```ts
yield * slideTranstion();
```

Any transitions must be rewritten to utilize `useTransition`.

- Konva patches are not imported by default

Projects using `KonvaScene`s should import the patches manually at the very top
of the file project:

```ts
import '@motion-canvas/core/lib/patches'
// ...
bootstrap(...);
```

`getset` import path has changed:

```ts
import {getset} from '@motion-canvas/core/lib/decorators/getset';
```

- change the type exported by scene files

Scene files need to export a special `SceneDescription` object instead of a
simple generator function.

- change event naming convention

The names of all public events now use the following pattern:
"on[WhatHappened]". Example: "onValueChanged".

- change how images are imported

By default, importing images will now return their urls instead of a SpriteData
object. This behavior can be adjusted using the `?img` and `?anim` queries.

- change time events API
- `waitFor` and `waitUntil` were moved

They should be imported from `@motion-canvas/core/lib/flow`.
