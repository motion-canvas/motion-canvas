#version 300 es
precision highp float;

uniform highp isampler2D srcTex;
uniform int samples;

out vec4 outColor;

void main(){
  ivec2 texelCoord = ivec2(gl_FragCoord);
  vec4 prevVal = vec4(texelFetch(srcTex, texelCoord, 0)) / 255.0;
  outColor = prevVal / float(samples);
}