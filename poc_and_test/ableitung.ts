// function ableitungCubicBezier(x: number, n0: number, n1: number, n2: number, n3: number): number {
// 	let a = n0 * Math.pow((1 - x), 2)
// 	let b = n1 * (-3 * Math.pow(x, 2) + (4 * x) - 1)
// 	let c = x * ((3 * n2 * x) - 2 * n2 * -n3 * x)
// 	console.log("A: " + a + " B: " + b + " C: " + c)
// 	return -3 * (a + b + c);
// }
//
// function tangentCubicBezier(derivative: number, x: number, b: number): number {
// 	return derivative * x + b;
// }
//
