#version 300 es
precision highp float;

#include "./common.glsl"

void main() {
    outColor = textureLod(sourceTexture, sourceUV, 0.0);
}