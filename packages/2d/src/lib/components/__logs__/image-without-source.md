The image won't be visible unless you specify a source:

```tsx
import myImage from './example.png';
// ...
<Img src={myImage} />;
```

If you did this intentionally, and don't want to see this warning, set the `src`
property to `null`:

```tsx
<Img src={null} />
```

[Learn more](https://motioncanvas.io/docs/media#images) about working with
images.
