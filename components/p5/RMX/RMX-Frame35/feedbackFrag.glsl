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

varying vec2 vTexCoord;

//UTIL
float map(float value, float inputMin, float inputMax, float outputMin, float outputMax) {
    return outputMin + ((value - inputMin) / (inputMax - inputMin) * (outputMax - outputMin));
}

float random(in vec2 _st) {
  vec2 st = _st + u_seed;
  
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453);
}
float random(in float _x){
    float x = _x + u_seed;

    return fract(sin(x)*1e4);
}

vec2 random2(vec2 _st){
    vec2 st = _st + u_seed;

    st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float noise(vec2 _st) {
  vec2 st = _st + u_seed;

    vec2 i = floor(st);
    vec2 f = fract(st);

    // vec2 u = f*f*(3.0-2.0*f);
    vec2 u = f*f*f*(f*(f*6.-15.)+10.); //improved smoothstep

    float n = mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                     dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                     dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);

    // return n;
    return 0.5 + 0.5 * n;
}

float snoise(vec2 _v) { //simplex

    vec2 v = _v + u_seed;
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
    float n =  130.0 * dot(m, g);
    return 0.5 + 0.5 * n;
}

float noiseNegNeutralPos(vec2 st) {
  float r = snoise(st);
  if (r < 0.33) {
    return -1.0;
  } else if (r < 0.66) {
    return 0.0;
  } else {
    return 1.0;
  }
}






//MAIN =========================================================
void main() {
  vec2 st = vTexCoord;
  vec2 orgSt = st;

  //pause before feedback starts;
  if (u_time < .5) {
    gl_FragColor = texture2D(u_originalImage, orgSt);
    return;
  }

  float timeBlock = floor(u_time * .3);
  float timeFract = fract(u_time * .3);
  
  float chunk = u_resolution.x/10.;
  vec2 blockSize = vec2(chunk / u_resolution.x, chunk / u_resolution.y);

  vec2 posBlockFloor = floor(st / blockSize) ;
  vec2 posBlockOffset = fract(st / blockSize) ;

  vec4 color = texture2D(u_texture, st);

  //block paint/sweep
  vec2 noiseBlock = posBlockFloor * 0.2;

  bool useSweep = snoise(noiseBlock + timeBlock) < 0.25;//< (1.0 - posBlockFloor.y * blockSize.y) * 0.4;
  bool useReset = snoise(noiseBlock + timeBlock + 100.0) < 0.5;

  float rate = .01;
  if(useSweep ) {
    float xOff = rate * step(0.5, random(noiseBlock + timeBlock + 200.));
    float yOff = rate  * step(0.5, random(noiseBlock + timeBlock + 500.));

    posBlockOffset.x += xOff;
    posBlockOffset.y -= yOff;
    
    vec2 blockSt = (posBlockFloor + posBlockOffset) * blockSize;

    if (blockSt.x < 0.0 || blockSt.x > 1.0 || blockSt.y < 0.0 || blockSt.y > 1.0) {
      blockSt = st;
    }

    color = texture2D(u_texture, blockSt);
  } else if (useReset) {

    float downReveal = posBlockOffset.y;
    float rightReveal = posBlockOffset.x;
    float upReveal = 1.0 - posBlockOffset.y;
    float leftReveal = 1.0 - posBlockOffset.x;

    float reveal = downReveal;

    // float revealRan = random(noiseBlock + timeBlock + 200.);

    // if (revealRan < 0.3) {
    //   reveal = leftReveal;
    // } else if (revealRan < 0.6) {
    //   reveal = rightReveal;
    // } 

    if (reveal < timeFract + 0.01) {
      color = texture2D(u_originalImage, orgSt);
    }
  }

  

  gl_FragColor = color;
}



