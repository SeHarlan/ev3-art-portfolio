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
// uniform sampler2D u_grid;
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

float randomNegNeutralPos(vec2 st) {
  float r = random(st);
  if (r < 0.33) {
    return -1.0;
  } else if (r < 0.66) {
    return 0.0;
  } else {
    return 1.0;
  }
}

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

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

float snoise(vec2 v) { //simplex

    // Precompute values for skewed triangular grid
    const vec4 C = vec4(0.211324865405187,
                        // (3.0-sqrt(3.0))/6.0
                        0.366025403784439,
                        // 0.5*(sqrt(3.0)-1.0)
                        -0.577350269189626,
                        // -1.0 + 2.0 * C.x
                        0.024390243902439);
                        // 1.0 / 41.0

    // First corner (x0)
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);

    // Other two corners (x1, x2)
    vec2 i1 = vec2(0.0);
    i1 = (x0.x > x0.y)? vec2(1.0, 0.0):vec2(0.0, 1.0);
    vec2 x1 = x0.xy + C.xx - i1;
    vec2 x2 = x0.xy + C.zz;

    // Do some permutations to avoid
    // truncation effects in permutation
    i = mod289(i);
    vec3 p = permute(
            permute( i.y + vec3(0.0, i1.y, 1.0))
                + i.x + vec3(0.0, i1.x, 1.0 ));

    vec3 m = max(0.5 - vec3(
                        dot(x0,x0),
                        dot(x1,x1),
                        dot(x2,x2)
                        ), 0.0);

    m = m*m ;
    m = m*m ;

    // Gradients:
    //  41 pts uniformly over a line, mapped onto a diamond
    //  The ring size 17*17 = 289 is close to a multiple
    //      of 41 (41*7 = 287)

    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;

    // Normalise gradients implicitly by scaling m
    // Approximation of: m *= inversesqrt(a0*a0 + h*h);
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0+h*h);

    // Compute final noise value at P
    vec3 g = vec3(0.0);
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * vec2(x1.x,x2.x) + h.yz * vec2(x1.y,x2.y);
    return 130.0 * dot(m, g);

}

//drawing helpers

float rect(in vec2 st, in vec2 size){
	size = 0.25-size*0.25;
    vec2 uv = smoothstep(size,size+size*vec2(0.002),st*(1.0-st));
	return uv.x*uv.y;
}

float circle(in vec2 _st, vec2 pos, in float _radius){
    vec2 dist = _st-pos;
	return 1.-smoothstep(_radius-(_radius*0.01),
                         _radius+(_radius*0.01),
                         dot(dist,dist)*4.0);
}


//Modulation Functions

float waves(vec2 st, float time, float amplitude, float frequency, float start, float noiseOff) {
    float t = time;

    start = start - snoise(st*2. + t / 10. + noiseOff) * 0.12;

    frequency = frequency + snoise(vec2(st.y * 3. + t/20.,st.x) + noiseOff) * 2.;

    float n = snoise(st*4. + t / 4. + noiseOff);

    float offset = start + amplitude - 0.5;//(start + amplitude)/2.;

    float wave = sin(st.y * frequency + n + t) * amplitude;

    float normX = st.x * 1.0 + offset;

    float waveDiff = (st.x - 0.5 - wave - offset);
   
    bool cuttoff = st.x > start;

    float norm = map(st.x, start, start + amplitude * 2., 0., amplitude); 

    if (!cuttoff) return 0.0;

    return mix(norm, 0.0, waveDiff * 5.0);
    
    if ( waveDiff < 0.0) {
      return norm;
    }
    return .0;
}

vec4 generateWavesHorizontal(vec4 _col, vec2 _st, float t, float intensity) {
  float wavesAgr = 0.0;
  vec2 st = vec2(_st.y, _st.x);
  t = -t;

  float ranOff = mix(random(vec2(st.x*0.1, 1.0 - st.y * 0.05) - t*0.01), random(st), 0.);

  //CENTER MAIN
  float wave1 = waves(st, t, 0.05, 20.0, .7, 0.0);
  float wave1x = 1.0- st.x + (wave1 * ranOff) ;
  wavesAgr = max(wave1x, wavesAgr);

  float wave1B = waves(st, t, 0.03, 20.0, .7, 5.5) * 0.25;
  float wave1Bx = 1.0-st.x + (wave1B);
  wavesAgr = max(wave1Bx, wavesAgr);



  vec2 wavesSt = vec2(st.y, 1.0-wavesAgr);

  vec4 waveColor = texture2D(u_texture, wavesSt);

  return mix(_col, waveColor, intensity);

}

//Glitch functions

vec4 fragment(vec4 _col, vec2 _st, float intensity) {
  intensity = clamp(intensity, 0.0, 1.0);
  vec4 col = _col;
  float t = fract(u_time * 0.0000001);
  vec2 blockSt = floor(_st * 500.0) / 500.0;
  vec2 edgeOff = vec2(0.004, 0.001);

  if(random(blockSt + t) < .2) {
    col = texture2D(u_texture, _st + edgeOff * randomNegPos(_st));
  }

  return mix(_col, col, intensity);
}

vec4 pixelGlitch(vec4 _col, vec2 _st, float intensity, vec2 _size) {
  vec2 stInt = floor(_st * _size) / _size;
  vec2 stFract = fract(_st * _size) / _size;
  float t = fract(u_time * 0.0000001);

  float range = 1.5;

  if (random(stInt + t) < 0.35) {
    stInt.x += range * floor(random(stInt) * 4.0) * randomNegPos(stInt) / _size.x;
    stInt.y += range * floor(random(stInt + 500.) * 4.0) * randomNegPos(stInt + 500.) / _size.y;
  }

  vec2 st = stInt + stFract;
  vec4 col = texture2D(u_texture, st);
  return mix(_col, col, intensity);
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

  float staticLineTime = fract(u_time * 0.01);
  float staticFuzzTime = fract(u_time * .0004);
  vec2 staticSt = floor(orgSt*u_resolution);
  vec2 staticLines = vec2(staticSt.x * .0000045 - staticLineTime, staticSt.y * 0.00005);
  vec2 staticFuzz = floor(st * u_resolution * 1.) - staticFuzzTime;
  float tvRan = mix(random(staticLines) * randomNegPos(staticLines) , random(staticFuzz),0.5);

  //Mouse clear effect
  float radius = 0.15; // Size of the circle radius
  float fadeWidth = 0.025; // Width of the fade effect at the edges
  float mouseDist = norm_mouse == vec2(0) ? 1. : distance(correctedMousePos, correctedUV);
  float displaceIntensity = smoothstep(radius + fadeWidth, radius - fadeWidth, mouseDist);
  bool mouseInView = u_mouse.x >  u_resolution.x * 0.01 && u_mouse.y > u_resolution.y * 0.01 && u_mouse.x < u_resolution.x*0.99 && u_mouse.y < u_resolution.y*0.99;
  if(!mouseInView) {
    displaceIntensity = 0.0;
  }
  orgSt.x += random(staticLines) * randomNegPos(staticLines) * 0.015 * displaceIntensity;

  float floorTime = floor(u_time * 4.0 + 10.);
  if (random(floorTime) < 0.03) {
    orgSt.x += random(staticLines) * randomNegPos(staticLines) * 0.004;
  }
  vec4 wavesColor = texture2D(u_texture, orgSt);

  float waveIntensity = 0.66 + orgSt.y * 0.33;

  wavesColor = generateWavesHorizontal(wavesColor, orgSt, u_time, waveIntensity);

  vec4 color = wavesColor;

  color = fragment(color, orgSt, 0.5);

  color = pixelGlitch(color, orgSt, 0.5 - st.y * 0.2, u_resolution * 0.6);

  //rays
  float xTimeMult = 0.00007;
  vec2 rayRandom = orgSt * u_resolution * vec2(xTimeMult - fract(u_time*0.1) * xTimeMult*-0.4, 0.00005);
  float rayMult = 0.2 * (st.x - 0.4);
  color.r *= 1.0 - random(rayRandom) * rayMult;
  color.g *= 1.0 - random(rayRandom + 100.) * rayMult;
  color.b *= 1.0 - random(rayRandom + 200.) * rayMult;

  //rct noise
  color.rgb += (tvRan * 0.08) ;

  float distFromCenter = distance(orgSt, vec2(0.5));
  color.rgb *= 1.0-smoothstep(0.5, .8, distFromCenter);

  float intensity = 1.0;
  if(u_clear) {
    intensity = 0.0;
  }

  gl_FragColor = mix(originalColor, color, intensity );
}



