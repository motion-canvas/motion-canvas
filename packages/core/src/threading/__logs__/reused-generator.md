This usually happens when you mistakenly reuse a generator that is already
running.

For example, using `yield` here will run the opacity generator concurrently and
store it in the `task` variable (in case you want to cancel or await it later):

```ts
const task = yield rect().opacity(1, 1);
```

Trying to `yield` this task again will cause the current error:

```ts
yield task;
```

Passing it to other flow functions will also cause the error:

```ts
// prettier-ignore
yield* all(task);
```

Try to investigate your code looking for `yield` statements whose return value
is reused in this way. Here's an example of a common mistake:

```ts wrong
// prettier-ignore
yield* all(
  yield rect().opacity(1, 1), 
  yield rect().x(200, 1),
);
```

```ts correct
// prettier-ignore
yield* all(
  rect().opacity(1, 1), 
  rect().x(200, 1),
);
```
