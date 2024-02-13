#version 300 es
precision highp float;

uniform highp isampler2D accTex;
uniform sampler2D addendTex;
uniform int canvasHeight;

out ivec4 outColor;

void main(){
  ivec2 texelCoord = ivec2(gl_FragCoord);
  texelCoord.y = canvasHeight - 1 - texelCoord.y;
  ivec4 prevVal = texelFetch(accTex, ivec2(gl_FragCoord), 0);
  vec4 newVal = texelFetch(addendTex, texelCoord, 0);
  outColor = prevVal + ivec4(newVal * 255.0);
}