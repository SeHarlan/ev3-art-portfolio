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
uniform float u_centerTime;
uniform float u_seed;
uniform vec2 u_mouse;
uniform vec2 u_aspectRatio;
uniform int u_stage;

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

    return 0.5 + 0.5 * n;
}

float noiseNegNeutralPos(vec2 st) {
  float r = noise(st);
  if (r < 0.45) {
    return -1.0;
  } else if (r < 0.55) {
    return 0.0;
  } else {
    return 1.0;
  }
}

float randomNegNeutralPos(vec2 st) {
  float r = random(st);
  if (r < 0.33) {
    return -1.0;
  } else if (r < 0.66) {
    return .0;
  } else {
    return 1.0;
  }
}

float noiseOnOff(vec2 st) {
  return floor(noise(st) + 0.5);
}
float randomOnOff(vec2 st) {
  return floor(random(st) + .5);
}

//MAIN =========================================================
void main() {
  vec2 st = vTexCoord;
  vec2 orgSt = st;

  vec4 orgColor = texture2D(u_originalImage, orgSt);

  if (u_time < .1) {
    gl_FragColor = orgColor;
    return;
  }

  float timeBlock = floor(u_time * .3);
  float timeFract = fract(u_time * .3);

  float centerTimeBlock = floor(u_centerTime * .15);

  float chunk = floor(6.0 + sin(PI * u_seed + u_centerTime * 0.075) * 5.);
  vec2 blockSize = vec2(chunk / u_resolution.x, chunk / u_resolution.y);

  vec2 posBlockFloor = floor(st / blockSize) ;
  vec2 posBlockOffset = fract(st / blockSize) ;

  vec4 color = texture2D(u_texture, st);

  #define marginMin 0.1
  #define marginMax 0.9

  float leftPoint = marginMin;
  float topPoint = marginMin;
  float bottomPoint = marginMax;
  float rightPoint = marginMax;

  
  
  bool topBlock = st.y <= topPoint && st.x > leftPoint;
  bool leftBlock = st.x <= leftPoint && st.y <= bottomPoint;
  bool rightBlock = st.x > rightPoint && st.y > topPoint && st.y <= bottomPoint;
  bool bottomBlock = st.y > bottomPoint && st.x <= rightPoint;
  bool bottomRightBlock = st.y > bottomPoint && st.x > rightPoint;

  bool center = !leftBlock && !rightBlock && !bottomBlock && !topBlock && !bottomRightBlock;


  bool useBlock = false;

  float topRan = random(centerTimeBlock);
  if(topRan < 1./15.) {
    useBlock = topBlock;
  } else if(topRan < 2./15.) {
    useBlock = leftBlock;
  } else  if(topRan < 3./15.) {
    useBlock = rightBlock;
  } else if(topRan < 4./15.) {
    useBlock = bottomBlock;
  } else if(topRan < 5./15.) {
    useBlock = bottomRightBlock;
  } 




  vec2 noiseSt = posBlockFloor;
  noiseSt.x -= sin(u_centerTime * 0.75) * 4.;
  noiseSt.y += cos(u_centerTime * 0.75) * 8.;

  float noiseTime = u_centerTime * .2 ;

  float chunkBuffer = ( chunk);
  

  vec2 noiseMult = vec2(.01, 0.005) * chunkBuffer;

  float waveMultAmp = (20. - (noise(chunkBuffer * posBlockFloor * .005 + noiseTime + 100.) * 10.)) / chunkBuffer;
  float waveMultFreq = (0.2 - (noise(chunkBuffer * posBlockFloor * .001 - noiseTime * 0.5) * 0.2));
  float wave = sin(chunkBuffer*posBlockFloor.x * waveMultFreq) * waveMultAmp;


  float resetThresh = 0.425 + sin(PI * u_seed + u_centerTime* 1.75) * 0.05 - cos(u_centerTime * 1.15) * 0.15;

  vec2 noiseResetTime = vec2(-noiseTime , noiseTime);
  bool randomReset = random(noiseSt + noiseResetTime) < .2;
  bool reset = noise(noiseMult * (noiseSt + wave) + noiseResetTime) < resetThresh && randomReset;

  vec2 flowMult = vec2(.1, 0.05) * chunkBuffer;
  bool useFlow = random((posBlockFloor * flowMult) + noiseTime) < 0.5 && (center || useBlock);

  if(reset) {
    color = orgColor;
  } else if(useFlow && randomReset) {
    posBlockFloor.x += noiseNegNeutralPos(noiseMult  * ( .25 * posBlockFloor   - (u_centerTime * 25.) / chunkBuffer ) + 100.);
    posBlockFloor.y += noiseOnOff(noiseMult   * (.5 * posBlockFloor+ (u_centerTime * 50.) / chunkBuffer ) + 200.);

    
    color = texture2D(u_texture, (posBlockFloor + posBlockOffset) * blockSize);
    // color = vec4(1.0);
  }
  



  gl_FragColor = color;
}



