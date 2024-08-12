view.add(
  // before
  <Node spawner={() => range(count()).map(() => <Node />)} />,
);

view.add(
  // after
  <Node>{() => range(count()).map(() => <Node />)}</Node>,
);
