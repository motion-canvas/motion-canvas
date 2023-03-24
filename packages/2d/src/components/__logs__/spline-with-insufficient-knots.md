The spline won't be visible unless you specify at least two knots:

```tsx
<Spline
  stroke="#fff"
  lineWidth={8}
  points={[
    [100, 0],
    [0, 0],
    [0, 100],
  ]}
/>
```

For more control over the knot handles, you can alternatively provide the knots
as children to the spline using the `Knot` component:

```tsx
<Spline stroke="#fff" lineWidth={8}>
  <Knot x={100} endHandle={[-50, 0]} />
  <Knot />
  <Knot y={100} startHandle={[-100, 50]} />
</Spline>
```
