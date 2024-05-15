#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359
#define TWO_PI 6.28318530718
#define EPSILON 0.00001
#define min_param_a 0.0 + EPSILON
#define max_param_a 1.0 - EPSILON

uniform sampler2D u_texture;
uniform sampler2D u_originalImage;
uniform sampler2D u_grid;
uniform vec2 u_resolution;
uniform vec2 u_imageResolution;
uniform float u_time;
uniform float u_seed;
uniform vec2 u_mouse;
uniform bool u_clear;

varying vec2 vTexCoord;


//UTIL
float map(float value, float inputMin, float inputMax, float outputMin, float outputMax) {
    return outputMin + ((value - inputMin) / (inputMax - inputMin) * (outputMax - outputMin));
}

float random(in vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453);
}
float random(in float x){
    // return fract(sin(x + seed)*43758.5453);
    return fract(sin(x)*1e4);
}

vec2 random2(vec2 st){
    st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}

float randomNegPos(vec2 st) {
  return random(st) < 0.5 ? -1.0 : 1.0;
}

mat2 rotate2d(float angle){
    return mat2(cos(angle),-sin(angle),
                sin(angle),cos(angle));
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    // vec2 u = f*f*(3.0-2.0*f);
    vec2 u = f*f*f*(f*(f*6.-15.)+10.); //improved smoothstep

    float n = mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                     dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                     dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);

    return n;
    // return 0.5 + 0.5 * n;
}

float lines(in vec2 pos, float b){
    float scale = 10.0;
    pos *= scale;
    return smoothstep(0.0,
                    .5+b*.5,
                    abs((sin(pos.x*3.1415)+b*2.0))*.5);
}

vec4 pixelGlitch(vec4 _col, vec2 _st, float intensity, vec2 _size, sampler2D text) {
  vec2 stInt = floor(_st * _size) / _size;
  vec2 stFract = fract(_st * _size) / _size;
  float t = fract(u_time * 0.0000001);

  float range = 1.5;

  if (random(stInt + t) < 0.35) {
    stInt.x += range * floor(random(stInt) * 4.0) * randomNegPos(stInt) / _size.x;
    stInt.y += range * floor(random(stInt + 500.) * 4.0) * randomNegPos(stInt + 500.) / _size.y;
  }

  vec2 st = stInt + stFract;
  vec4 col = texture2D(text, st);
  return mix(_col, col, intensity);
}
float woodPattern(vec2 _st) {
  // if(isBg(_col)) return _col;

  vec2 st = _st;
  st.x *= u_resolution.y/u_resolution.x;

  vec2 pos = st.yx*vec2(.2,.33);

  float pattern = pos.x;

  float t = u_time * 0.1;

    // Add noise
  pos = rotate2d( noise(pos + t) ) * pos;

    // Draw lines
  pattern = lines(pos,.5);

  // vec4 col = vec4(0.1 + _col.rgb  - pattern * .35, 1.0);
  // return mix(_col, col, intensity);
  return pattern;
}

//MAIN =========================================================
void main() {
  vec2 st = vTexCoord;
  vec2 orgSt = st;

  vec2 norm_mouse = u_mouse / u_resolution;
  float screenAspectRatio = u_resolution.x / u_resolution.y;

  vec2 correctedMousePos = vec2(norm_mouse.x * screenAspectRatio, norm_mouse.y );
  vec2 correctedUV = vec2(st.x * screenAspectRatio, st.y );
 
  vec4 originalColor = texture2D(u_originalImage, st);
  

  float staticLineTime = fract(u_time * 0.2) * 0.5;
  float staticFuzzTime = fract(u_time * .003);
  vec2 staticSt = floor(orgSt*u_resolution);
  vec2 staticLines = vec2(1.0-staticSt.x * .005 - staticLineTime, staticSt.y * 0.000001 );
  vec2 staticFuzz = floor(st * u_resolution * 0.66) + staticFuzzTime;
  float tvRan = mix(random(staticLines) * randomNegPos(staticLines) , random(staticFuzz),0.2);

  //Mouse clear effect
  float radius = 0.15; // Size of the circle radius
  float fadeWidth = 0.025; // Width of the fade effect at the edges
  float mouseDist = norm_mouse == vec2(0) ? 1. : distance(correctedMousePos, correctedUV);
  float displaceIntensity = smoothstep(radius + fadeWidth, radius - fadeWidth, mouseDist);
  bool mouseInView = u_mouse.x >  u_resolution.x * 0.01 && u_mouse.y > u_resolution.y * 0.01 && u_mouse.x < u_resolution.x*0.99 && u_mouse.y < u_resolution.y*0.99;
  if(!mouseInView) {
    displaceIntensity = 0.0;
  }
  orgSt.y += random(staticLines) * randomNegPos(staticLines) * 0.015 * displaceIntensity;

  float floorTime = floor(u_time * 4.0 + 10.);
  if (random(floorTime) < 0.03) {
    orgSt.y += random(staticLines) * randomNegPos(staticLines) * 0.004;
  }

  vec4 color = texture2D(u_texture, orgSt);


  color = pixelGlitch(color, orgSt, 0.5 - st.y * 0.2, u_resolution * 0.6, u_texture);

  vec2 pixel = 1.0 / u_resolution;

  vec2 gridSt = st;
  float wood = woodPattern(gridSt);
  if(random(gridSt) > wood) {

    gridSt.y += random(staticLines) * randomNegPos(staticLines) * 0.015 * displaceIntensity;

    vec4 gridColor = texture2D(u_grid, gridSt);
    gridColor = pixelGlitch(gridColor, gridSt, 0.5 - gridSt.y * 0.2, u_resolution * 0.6, u_grid);
    vec4 exes = vec4(gridColor.rgb, .1);


    color = max(color, exes);
  }

  float colorRanMult = 0.2;
  color.r += (tvRan * colorRanMult) *random(orgSt);
  color.g += (tvRan * colorRanMult) *random(orgSt +100.);
  color.b += (tvRan * colorRanMult) *random(orgSt+200.);

  float distFromCenter = distance(orgSt, vec2(0.5));
  color.rgb *= 1.0-smoothstep(0.5, .8, distFromCenter);

  float intensity = 1.0;
  if(u_clear) {
    intensity = 0.0;
  }

  gl_FragColor = mix(originalColor, color, intensity );
}



