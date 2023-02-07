# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.1.0](https://github.com/motion-canvas/motion-canvas/compare/v2.0.0...v2.1.0) (2023-02-07)


### Bug Fixes

* **2d:** fix font ligatures in CodeBlock ([#231](https://github.com/motion-canvas/motion-canvas/issues/231)) ([11ee3fe](https://github.com/motion-canvas/motion-canvas/commit/11ee3fef5ad878313cf19833df6881333ced4dac))
* **2d:** fix Line cache ([#232](https://github.com/motion-canvas/motion-canvas/issues/232)) ([a953b64](https://github.com/motion-canvas/motion-canvas/commit/a953b64540c020657845efc84d4179142a7a0974)), closes [#205](https://github.com/motion-canvas/motion-canvas/issues/205)
* **2d:** handle lines with no points ([#233](https://github.com/motion-canvas/motion-canvas/issues/233)) ([8108474](https://github.com/motion-canvas/motion-canvas/commit/81084743dfad7b6419760796fda825047909d4d4)), closes [#212](https://github.com/motion-canvas/motion-canvas/issues/212)
* **2d:** improve Rect radius ([#221](https://github.com/motion-canvas/motion-canvas/issues/221)) ([3437e42](https://github.com/motion-canvas/motion-canvas/commit/3437e42713a3f4a8d44d246ee01e2eb23b61e06a)), closes [#207](https://github.com/motion-canvas/motion-canvas/issues/207)
* **2d:** stop code highlighting from jumping ([#230](https://github.com/motion-canvas/motion-canvas/issues/230)) ([67ef1c4](https://github.com/motion-canvas/motion-canvas/commit/67ef1c497056dd1f8f9e20d1d7fc1af03ec3849e))
* fix compound property setter ([#218](https://github.com/motion-canvas/motion-canvas/issues/218)) ([6cd1b95](https://github.com/motion-canvas/motion-canvas/commit/6cd1b952df950554eb637c9f8e82947c415d00c5)), closes [#208](https://github.com/motion-canvas/motion-canvas/issues/208) [#210](https://github.com/motion-canvas/motion-canvas/issues/210)





# 2.0.0 (2023-02-04)


### Bug Fixes

* **2d:** add missing shape export ([#111](https://github.com/motion-canvas/motion-canvas/issues/111)) ([02a1fa7](https://github.com/motion-canvas/motion-canvas/commit/02a1fa7ea62155e498809f2e57ff29a18c82ac12))
* **2d:** fix import order ([#94](https://github.com/motion-canvas/motion-canvas/issues/94)) ([bcc0bcf](https://github.com/motion-canvas/motion-canvas/commit/bcc0bcffae47855bd8f7ab06454aaebe93c4aa24)), closes [#76](https://github.com/motion-canvas/motion-canvas/issues/76)
* **2d:** fix Line overview crashing ([#142](https://github.com/motion-canvas/motion-canvas/issues/142)) ([6bd5fd9](https://github.com/motion-canvas/motion-canvas/commit/6bd5fd941e583e44f5d920ecd20215efb1eed58a))
* **2d:** some signal setters not returning owners ([#143](https://github.com/motion-canvas/motion-canvas/issues/143)) ([09ab7f9](https://github.com/motion-canvas/motion-canvas/commit/09ab7f96afcaae608399a653c0b4878ba9b467d4))
* **2d:** switch iframes to ShadowDOM ([#90](https://github.com/motion-canvas/motion-canvas/issues/90)) ([86176be](https://github.com/motion-canvas/motion-canvas/commit/86176be055c08aba59272afcda00ed586f6c7ad6))
* fix scaffolding ([#93](https://github.com/motion-canvas/motion-canvas/issues/93)) ([95c55ed](https://github.com/motion-canvas/motion-canvas/commit/95c55ed338127dad22f42b24c8f6b101b8863be7))
* previous scene being rendered twice ([#97](https://github.com/motion-canvas/motion-canvas/issues/97)) ([90205bd](https://github.com/motion-canvas/motion-canvas/commit/90205bdc1a086abe5f73b04cb4616c6af5ec4377))
* use correct scene sizes ([#146](https://github.com/motion-canvas/motion-canvas/issues/146)) ([f279638](https://github.com/motion-canvas/motion-canvas/commit/f279638f9ad7ed1f4c44900d48c10c2d6560946e))


### Code Refactoring

* remove legacy package ([6a84120](https://github.com/motion-canvas/motion-canvas/commit/6a84120d949a32dff0ad413a9f359510ff109af1))


### Features

* **2d:** add methods for rearranging children ([#81](https://github.com/motion-canvas/motion-canvas/issues/81)) ([63f6c1a](https://github.com/motion-canvas/motion-canvas/commit/63f6c1aa51ac4ecd093151c8cd30910f2e72bcac))
* **2d:** add option for preformatted text ([#147](https://github.com/motion-canvas/motion-canvas/issues/147)) ([989be53](https://github.com/motion-canvas/motion-canvas/commit/989be532d86642e1125bb7fa62a801b09c1b8f26))
* **2d:** code selection and modification ([#163](https://github.com/motion-canvas/motion-canvas/issues/163)) ([e8e884a](https://github.com/motion-canvas/motion-canvas/commit/e8e884a1a5574425dbf15272718911c12cfa2327))
* **2d:** construct lines using signals ([#133](https://github.com/motion-canvas/motion-canvas/issues/133)) ([2968a24](https://github.com/motion-canvas/motion-canvas/commit/2968a2426564469fb4f4343fe71a6d30e95361f2))
* **2d:** improve property declarations ([27e7d26](https://github.com/motion-canvas/motion-canvas/commit/27e7d267ee91bf1e8ca79686b6ec31347f9f4d41))
* **2d:** improve Rect corner radius ([#120](https://github.com/motion-canvas/motion-canvas/issues/120)) ([b471fe0](https://github.com/motion-canvas/motion-canvas/commit/b471fe0e37c0a426d3af8299c9c3c22539e7df05))
* **2d:** simplify layout prop ([c24cb12](https://github.com/motion-canvas/motion-canvas/commit/c24cb12a22b7c85fdfb051917fa9ee1e0911717c))
* **2d:** unify desired sizes ([#118](https://github.com/motion-canvas/motion-canvas/issues/118)) ([401a799](https://github.com/motion-canvas/motion-canvas/commit/401a79946b034a96b9abff2f3fb5efd6cc9080f3))
* add advanced caching ([#69](https://github.com/motion-canvas/motion-canvas/issues/69)) ([2a644c9](https://github.com/motion-canvas/motion-canvas/commit/2a644c9315acfcc5280a5eacc9904df140a61e4f))
* add base class for shapes ([#67](https://github.com/motion-canvas/motion-canvas/issues/67)) ([d38c172](https://github.com/motion-canvas/motion-canvas/commit/d38c1724e129c553739cbfc27c4e5cd8f737f067))
* add basic logger ([#88](https://github.com/motion-canvas/motion-canvas/issues/88)) ([3d82e86](https://github.com/motion-canvas/motion-canvas/commit/3d82e863af3dc88b3709adbcd0b84e790d05c3b8)), closes [#17](https://github.com/motion-canvas/motion-canvas/issues/17)
* add basic transform to Node class ([#83](https://github.com/motion-canvas/motion-canvas/issues/83)) ([9e114c8](https://github.com/motion-canvas/motion-canvas/commit/9e114c8830a99c78e6a4fd9265b0e7552758af14))
* add cloning ([#80](https://github.com/motion-canvas/motion-canvas/issues/80)) ([47d7a0f](https://github.com/motion-canvas/motion-canvas/commit/47d7a0fa5da9a03d8ed91557db651f6f960e28b1))
* add CodeBlock component based on code-fns to 2D ([#78](https://github.com/motion-canvas/motion-canvas/issues/78)) ([ad346f1](https://github.com/motion-canvas/motion-canvas/commit/ad346f118d63b1e321ec315e1c70b925670124a1))
* add default renderer ([#63](https://github.com/motion-canvas/motion-canvas/issues/63)) ([9255490](https://github.com/motion-canvas/motion-canvas/commit/92554900965fe088538f5e703dbab2fd84f904d7)), closes [#56](https://github.com/motion-canvas/motion-canvas/issues/56) [#58](https://github.com/motion-canvas/motion-canvas/issues/58)
* add Grid node ([e1f83da](https://github.com/motion-canvas/motion-canvas/commit/e1f83da1f43d20d392df4acb11e3df9cc457585d))
* add inspection ([#82](https://github.com/motion-canvas/motion-canvas/issues/82)) ([4d7f2ae](https://github.com/motion-canvas/motion-canvas/commit/4d7f2aee6daeda1a2146b632dfdc28b455295776))
* add markdown logs ([#138](https://github.com/motion-canvas/motion-canvas/issues/138)) ([e42447a](https://github.com/motion-canvas/motion-canvas/commit/e42447a0c07a8192c06d21c5f1801f0266279075))
* add missing layout props ([#72](https://github.com/motion-canvas/motion-canvas/issues/72)) ([f808a56](https://github.com/motion-canvas/motion-canvas/commit/f808a562b192fd03dba4b0d353284db344d6a80b))
* add node spawners ([#149](https://github.com/motion-canvas/motion-canvas/issues/149)) ([da18a4e](https://github.com/motion-canvas/motion-canvas/commit/da18a4e24104022a84ecd6cec1666b520186058f))
* add polyline ([#84](https://github.com/motion-canvas/motion-canvas/issues/84)) ([4ceaf84](https://github.com/motion-canvas/motion-canvas/commit/4ceaf842915ac43d81f292c58a4dc73a8d1bb8e9))
* add random number generator ([#116](https://github.com/motion-canvas/motion-canvas/issues/116)) ([d505312](https://github.com/motion-canvas/motion-canvas/commit/d5053123eef308c7a2a61d92b6e76c637f4ed0b8)), closes [#14](https://github.com/motion-canvas/motion-canvas/issues/14)
* add reparent helper ([80b95a9](https://github.com/motion-canvas/motion-canvas/commit/80b95a9ce89d4a2eeea7e467257486e961602d69))
* add Text and Image components ([#70](https://github.com/motion-canvas/motion-canvas/issues/70)) ([85c7dcd](https://github.com/motion-canvas/motion-canvas/commit/85c7dcdb4f8ca2f0bfb03950c85a8d6f6652fcdf))
* add video node ([#86](https://github.com/motion-canvas/motion-canvas/issues/86)) ([f4aa654](https://github.com/motion-canvas/motion-canvas/commit/f4aa65437a18cc85b00199f80cd5e04654c00c4b))
* better dependencies between packages ([#152](https://github.com/motion-canvas/motion-canvas/issues/152)) ([a0a37b3](https://github.com/motion-canvas/motion-canvas/commit/a0a37b3645fcb91206e65fd0a95b2f486b308c75))
* better dependencies between packages ([#153](https://github.com/motion-canvas/motion-canvas/issues/153)) ([59a73d4](https://github.com/motion-canvas/motion-canvas/commit/59a73d49a7b92c416e1f836a0f53bb676e9f924b))
* **core:** switch to vitest ([#99](https://github.com/motion-canvas/motion-canvas/issues/99)) ([762eeb0](https://github.com/motion-canvas/motion-canvas/commit/762eeb0a99c2f378d20dbd147f815ba6736099d9)), closes [#48](https://github.com/motion-canvas/motion-canvas/issues/48)
* filter reordering ([#119](https://github.com/motion-canvas/motion-canvas/issues/119)) ([2398d0f](https://github.com/motion-canvas/motion-canvas/commit/2398d0f9d57f36b47c9c66a988ca5607e9a3a30e))
* implement absolute scale setter ([842079a](https://github.com/motion-canvas/motion-canvas/commit/842079a6547af4032719c85837df3db7c1c6d30a))
* improve async signals ([#156](https://github.com/motion-canvas/motion-canvas/issues/156)) ([db27b9d](https://github.com/motion-canvas/motion-canvas/commit/db27b9d5fb69a88f42afd98c86c4a1cdceb88ea1))
* introduce basic caching ([#68](https://github.com/motion-canvas/motion-canvas/issues/68)) ([6420d36](https://github.com/motion-canvas/motion-canvas/commit/6420d362d0e4ae058f55b6ff6bb2a3a32dec559b))
* merge properties and signals ([#124](https://github.com/motion-canvas/motion-canvas/issues/124)) ([da3ba83](https://github.com/motion-canvas/motion-canvas/commit/da3ba83d82ee74f5a5c3631b07597f08cdf9e8e4))
* minor improvements ([403c7c2](https://github.com/motion-canvas/motion-canvas/commit/403c7c27ad969880a14c498ec6cefb9e7e7b7544))
* minor improvements ([#77](https://github.com/motion-canvas/motion-canvas/issues/77)) ([7c6e584](https://github.com/motion-canvas/motion-canvas/commit/7c6e584aca353c9af55f0acb61b32b5f99727dba))
* navigate to scene and node source ([#144](https://github.com/motion-canvas/motion-canvas/issues/144)) ([86d495d](https://github.com/motion-canvas/motion-canvas/commit/86d495d01a9f8f0a58e676fedb6df9c12a14d14a))
* new animator ([#91](https://github.com/motion-canvas/motion-canvas/issues/91)) ([d85f2f8](https://github.com/motion-canvas/motion-canvas/commit/d85f2f8a54c0f8bbfbc451884385f30e5b3ec206))
* signal error handling ([#89](https://github.com/motion-canvas/motion-canvas/issues/89)) ([472ac65](https://github.com/motion-canvas/motion-canvas/commit/472ac65938b804a6b698c8522ec0c3b6bdbcf1b1))
* simplify size access ([#65](https://github.com/motion-canvas/motion-canvas/issues/65)) ([3315e64](https://github.com/motion-canvas/motion-canvas/commit/3315e64641e9778bc48ea3fb707e3c0eeb581dfe))
* simplify size access further ([#66](https://github.com/motion-canvas/motion-canvas/issues/66)) ([9091a5e](https://github.com/motion-canvas/motion-canvas/commit/9091a5e05d8fadf72c50832c7c4467ac4424b72c))
* switch to signals ([#64](https://github.com/motion-canvas/motion-canvas/issues/64)) ([d22d237](https://github.com/motion-canvas/motion-canvas/commit/d22d23728597e6fa82ea5c5a99a6c0a56819bded))
* turn Layout into node ([#75](https://github.com/motion-canvas/motion-canvas/issues/75)) ([cdf8dc0](https://github.com/motion-canvas/motion-canvas/commit/cdf8dc0a35522482dee2dd78a69606b79f52246e))
* unify core types ([#71](https://github.com/motion-canvas/motion-canvas/issues/71)) ([9c5853d](https://github.com/motion-canvas/motion-canvas/commit/9c5853d8bc65204693c38109a25d1fefd44241b7))
* unify references and signals ([#137](https://github.com/motion-canvas/motion-canvas/issues/137)) ([063aede](https://github.com/motion-canvas/motion-canvas/commit/063aede0842f948d2c6704c6edd426e954bb4668))


### Reverts

* ci(release): 1.0.1 [skip ci] ([#175](https://github.com/motion-canvas/motion-canvas/issues/175)) ([161a046](https://github.com/motion-canvas/motion-canvas/commit/161a04647ecdc8203daf2d887a6a44c79a92ee20))
* ci(release): 2.0.0 [skip ci] ([#176](https://github.com/motion-canvas/motion-canvas/issues/176)) ([551096b](https://github.com/motion-canvas/motion-canvas/commit/551096bf636a791ea7c7c1d38d8e03c360433008))


### BREAKING CHANGES

* remove legacy package
