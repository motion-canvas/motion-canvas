The `playbackRate` of a `Video` cannot be reactive.

Make sure to use a concrete value and not a function:

```ts wrong
video.playbackRate(() => 7);
```

```ts correct
video.playbackRate(7);
```

If you're using a signal, extract its value before passing it to the property:

```ts wrong
video.playbackRate(mySignal);
```

```ts correct
video.playbackRate(mySignal());
```
