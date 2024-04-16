function cubicBezier(n0, n1, n2, n3, t) {
  return (
    Math.pow(1 - t, 3) * n0 +
    3 * Math.pow(1 - t, 2) * t * n1 +
    3 * (1 - t) * Math.pow(t, 2) * n2 +
    Math.pow(t, 3) * n3
  );
}

function createLinearBezierCurve(from = 0, to = 1, p1x, p1y, p2x, p2y, value) {
  let x = cubicBezier(0, p1x, p2x, 1, value);
  let y = cubicBezier(0, p1y, p2y, 1, value);
}

function generateTest(n, x1, y1, x2, y2) {
  let x = [];
  let y = [];
  let steps = [];

  for (let i = 0; i <= n; i++) {
    let step = i / n;
    steps.push(step);

    x.push(cubicBezier(0, x1, x2, 1, step));
    y.push(cubicBezier(0, y1, y2, 1, step));
  }
  console.log('x : [' + x + '],');
  console.log('x : [' + steps + '],');
  console.log('y : [' + y + '],');
}

generateTest(100, 1, -0.5, 0, 1.6);
