uniform vec3 diffuse;
uniform float opacity;
uniform vec4 highlightDiffuse;

varying float vHighlight;
varying vec3 vCenter;
#ifndef FLAT_SHADED
    varying vec3 vNormal;
#endif


#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <uv2_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

void main() {
    #include <clipping_planes_fragment>
    vec4 diffuseColor = vec4( diffuse, opacity );
    #include <logdepthbuf_fragment>
    #include <map_fragment>
    #include <color_fragment>
    #include <alphamap_fragment>
    #include <alphatest_fragment>
    #include <specularmap_fragment>
    ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
    #ifdef USE_LIGHTMAP
        vec4 lightMapTexel= texture2D( lightMap, vUv2 );
        reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity;
    #else
        reflectedLight.indirectDiffuse += vec3( 1.0 );
    #endif
    #include <aomap_fragment>
    reflectedLight.indirectDiffuse *= diffuseColor.rgb;
    vec3 outgoingLight = reflectedLight.indirectDiffuse;
    #include <envmap_fragment>
    #include <output_fragment>
    #include <tonemapping_fragment>
    #include <encodings_fragment>
    #include <fog_fragment>
    #include <premultiplied_alpha_fragment>
    #include <dithering_fragment>

    #ifdef USE_WIREFRAME
        float thickness = 1.0;
        vec3 afwidth = fwidth( vCenter.xyz );
        vec3 edge3 = smoothstep( ( thickness - 1.0 ) * afwidth, thickness * afwidth, vCenter.xyz );
        float edge = 1.0 - min( min( edge3.x, edge3.y ), edge3.z );

        gl_FragColor = mix(
            gl_FragColor,
            mix(vec4(0.0, 0.0, 0.0, 1.0), highlightDiffuse, vHighlight),
            edge
        );
    #else
        gl_FragColor.rgb = mix(
            gl_FragColor.rgb,
            highlightDiffuse.rgb * mix((gl_FragColor.r + gl_FragColor.b + gl_FragColor.g) / 3.0, 1.0, 0.7),
            vHighlight
        );

        gl_FragColor.a = mix(
            mix(gl_FragColor.a, highlightDiffuse.a, vHighlight),
            gl_FragColor.a,
            step(gl_FragColor.a, 0.3)
        );
    #endif
}