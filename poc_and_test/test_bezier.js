function cubicBezier(t, n0, n1, n2, n3) {
  return (
    Math.pow(1 - t, 3) * n0 +
    3 * Math.pow(1 - t, 2) * t * n1 +
    3 * (1 - t) * Math.pow(t, 2) * n2 +
    Math.pow(t, 3) * n3
  );
}
let NEWTON = 10;

function ableitungCubicBezier(x, n0, n1, n2, n3) {
  let a = n0 * Math.pow(1 - x, 2);
  let b = n1 * (-3 * Math.pow(x, 2) + 4 * x - 1);
  let c = x * (3 * n2 * x - 2 * n2 - n3 * x);
  return -3 * (a + b + c);
}
// A derivative is described as either the rate of change of a function, or the slope of the tangent line at a particular point on a function.

//Tangente formel: f(x0) + f'(x0)*(x - x0)
function tangentCubicBezier(derivative, x, b) {
  return derivative * x + b;
}

let EPSILON = 0.001;

function stepNewton(x0, n0, n1, n2, n3) {
  //newton's method
  let result = x0;
  for (let i = 0; i < NEWTON; i++) {
    let sample = cubicBezier(result, n0, n1, n2, n3);
    if (Math.abs(sample - x0) < EPSILON) {
      console.log('RETURNING RESULT: ' + result + ' sample: ' + sample);
      return result;
    }
    let derivative = ableitungCubicBezier(result, n0, n1, n2, n3);
    if (Math.abs(derivative) < 0.00001) {
      console.log('newtone failed');
      break;
    }
    result -= (sample - x0) / derivative;
  }
  //use standard [backup method]
  // Bisection: something like binary search
  let low = 0.0;
  let high = 1.0;
  let t = x0;
  if (t < low) {
    return low;
  }
  if (t > high) {
    return high;
  }

  while (low < high) {
    // sample is a true value of a point on a quadratic curve
    let sample = cubicBezier(t, n0, n1, n2, n3);
    // sample - x0 = check if result if close enough
    if (Math.abs(sample - x0) < EPSILON) {
      return t;
    }
    //
    if (x0 > sample) {
      low = t;
    } else {
      high = t;
    }
    t = (high - low) / 2 + low;
  }
  return t;
}

function generateTest(n, x1, y1, x2, y2) {
  let x = [];
  let y = [];
  let steps = [];
  let newtons = [];
  let end = [];

  for (let i = 0; i <= n; i++) {
    let step = i / n;
    console.log(step);

    steps.push(step);

    let newton = stepNewton(step, 0, x1, x2, 1);

    end.push(cubicBezier(newton, 0, y1, y2, 1));
    newtons.push(newton);
    x.push(cubicBezier(step, 0, x1, x2, 1));
    y.push(cubicBezier(step, 0, y1, y2, 1));
  }
  console.log('x : [' + x + '],');
  console.log('y : [' + y + '],');

  console.log('miejsce zerowe ' + stepNewton(1, 0, y1, y2, 1));
  console.log('y : [' + end + '],');
  console.log('x : [' + steps + '],');
  console.log(newtons);
}

generateTest(100, 1, -0.5, 0, 1.6);
