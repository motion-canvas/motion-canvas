// These two are equivalent:
// prettier-ignore
yield* loop(() => { /* animation */ });
// prettier-ignore
yield* loop(Infinity, () => { /* animation */ });
