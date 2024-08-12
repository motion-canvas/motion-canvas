import {Rect, makeScene2D} from '@motion-canvas/2d';
import {waitFor} from '@motion-canvas/core';

// Original shader created by ufffd
// https://www.shadertoy.com/view/lcfXD8
const Shader = `\
#version 300 es
precision highp float;

in vec2 screenUV;
out vec4 outColor;

uniform float time;
uniform vec2 resolution;

#define g(p) dot(sin(p),cos(p.zxy)) //

float m(vec3 p){
  return (1.0 + 0.2 * sin(p.y * 6e2))
    * g(0.8 * g(8.0 * p) + 10.0 * p)
    * (1.0 + sin(time + length(p.xy) / 0.1))
    + 0.3 * sin(time * 0.15 + p.z * 5.0 + p.y)
    * (2.0 + g((sin(time * 0.2 + p.z * 3.0) * 350.0 + 250.0) * p));
}

void main() {
  vec3 r = normalize(vec3((screenUV - 0.5) * resolution, resolution.y));
  vec3 p;
  vec3 f;
  float e = 50.0;
  float d;
  float i;

  for (p.z = time / 4.0; i++ < 90.0 && e > 0.05; e = m(p += r * d)) {
    d += 0.02 * e;
  }

  f.x = 0.06 + 0.06 * sin(p.z);
  outColor = vec4(2.0 * m(p) - m(p - f) - m(p - f.yxy))
    * smoothstep(0.75, 1.05, 1.0 / d);
}
`;

export default makeScene2D(function* (view) {
  view.add(<Rect shaders={Shader} size={view.size} />);

  yield* waitFor(10);
});
