The `#include` directive requires the use of a preprocessor.

Make sure to import the shader from a file:

```ts
import shader from './shader.glsl';
```

Do **NOT** use the raw loader:

```ts
import shader from './shader.glsl?raw';
```

Do **NOT** use `#include` in an inline string:

```ts
const shader = `\
#include "example.glsl"
`;
```

[Learn more](https://motioncanvas.io/docs/shaders) about working with shaders.
