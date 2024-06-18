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
uniform int u_stage;
uniform float u_stageCounter;

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

float randomNegPos(vec2 st) {
  float r = random(st);
  if (r < 0.5) {
    return -1.0;
  } else {
    return 1.0;
  }
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

    return n;
    // return 0.5 + 0.5 * n;
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


vec4 paintBrush(vec2 st, float timeBlock) {
  vec2 tSt = vec2(st.x*20., st.y*2.);
  bool riverTime = noise(tSt - u_time*.5) < 0.;

  vec2 rSt = vec2(st.x * 5000., st.y * 4.);
  bool riverNoise = noise(rSt - u_time*.05) < 0.;

  if (riverTime && riverNoise) {
    st.y = st.y - 0.002;

    st.x += noise(st * 20.0) * 0.003;
  }

  vec4 color = texture2D(u_texture, st);
  return color;
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

  float timeBlock = floor(u_time);
  float timeFract = fract(u_time);

  float largeTimeBlock = floor(timeBlock * .25);


  float largeChunk = 600.0;
  vec2 largeBlockSize = vec2(largeChunk / u_resolution.x, largeChunk / u_resolution.y);
  vec2 largeBlock = floor(st / largeBlockSize) * largeBlockSize;

  float chunkDiv = pow(2., 1.0+ floor(random(largeTimeBlock + largeBlock + 300.) * 6.));
  float chunk = largeChunk / chunkDiv;

  vec2 blockSize = vec2(chunk / u_resolution.x * 4., chunk / u_resolution.y);

  vec2 posBlockFloor = floor(st / blockSize) ;
  vec2 posBlockOffset = fract(st / blockSize) ;
  vec2 block = posBlockFloor * blockSize;


  bool skipShuffle = 1.0-timeFract < random(largeBlock + largeTimeBlock + 500.0) * 1.5;
  bool useShuffle = random(u_time + block) < 0.05 && !skipShuffle && u_stage == 0;
  bool useReset = random(largeTimeBlock + block * 2. + 100.0) < 0.4;

  vec4 color = texture2D(u_texture, st);

  if(useReset) {
     float reveal = 1.0 - posBlockOffset.x;
    if (reveal < timeFract + 0.03) {
      color = texture2D(u_originalImage, orgSt);
    }
  } else if(useShuffle) {
    float spacer = 1.;//+ random(largeBlock + largeTimeBlock + 1000.) * 4.;
     if(random(block + largeTimeBlock ) < 0.5) {
      posBlockFloor.x += randomNegPos(posBlockFloor + timeBlock + 100.) * spacer;
    } else {
      posBlockFloor.y -= randomNegPos(posBlockFloor +  timeBlock + 200.) * spacer;
    }

    vec2 shuffleSt = ((posBlockOffset + posBlockFloor) * blockSize);

    color = texture2D(u_texture, shuffleSt);
  } 

  gl_FragColor = color;
}



