Make sure to use `yield` or `spawn()` to execute the loop concurrently in a
separate thread:

```ts
// wrong ✗
// prettier-ignore
yield* loop(() => rect().opacity(0).opacity(1, 1));
// correct ✓
yield loop(() => rect().opacity(0).opacity(1, 1));
// correct ✓
spawn(loop(() => rect().opacity(0).opacity(1, 1)));
```

If you want to execute the loop a finite number of times, specify the iteration
count as the first argument:

```ts
// prettier-ignore
yield* loop(10, () => rect().opacity(0).opacity(1, 1));
//          ^ iteration count
```
