The line won't be visible unless you specify at least two points:

```tsx
<Line
  stroke="#fff"
  lineWidth={8}
  points={[
    [100, 0],
    [0, 0],
    [0, 100],
  ]}
/>
```

Alternatively, you can define the points using the children:

```tsx
<Line stroke="#fff" lineWidth={8}>
  <Node x={100} />
  <Node />
  <Node y={100} />
</Line>
```

If you did this intentionally, and want to disable this message, set the
`points` property to `null`:

```tsx
<Line stroke="#fff" lineWidth={8} points={null} />
```
