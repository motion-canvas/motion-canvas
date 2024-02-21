#version 300 es
precision highp float;

uniform highp sampler3D srcTex;
uniform int canvasHeight;
uniform int samples;

out vec4 outColor;

void main(){
  ivec2 texelCoord = ivec2(gl_FragCoord);
  texelCoord.y = canvasHeight - 1 - texelCoord.y;
  vec4 total = vec4(0.0);
  for (int i = 0; i < samples; i++){
    total += texelFetch(srcTex, ivec3(texelCoord, i), 0);
  }
  outColor = total / float(samples);
}