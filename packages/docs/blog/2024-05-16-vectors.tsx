// Before
// prettier-ignore
yield* node().position(node().position().add([200, 100]), 2);

// Now
// prettier-ignore
yield* node().position.add([200, 100], 2);
