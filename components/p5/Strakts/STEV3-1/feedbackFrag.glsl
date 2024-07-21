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

  if (u_time < .25) {
    gl_FragColor = orgColor;
    return;
  }
  float timeBlock = floor(u_time * .3);
  float timeFract = fract(u_time * .3);

  float centerTimeBlock = floor(u_centerTime * .1);

  //1 - 10
  float chunk = 1. + 2. * floor((0.5 + sin(PI * 1.33 + u_centerTime * .1) * 0.5) * 6.);
  vec2 blockSize = vec2(chunk / u_resolution.x, chunk / u_resolution.y);

  vec2 posBlockFloor = floor(st / blockSize) ;
  vec2 posBlockOffset = fract(st / blockSize) ;

  vec2 pixelSize = vec2(1.0 / u_resolution.x, 1.0 / u_resolution.y);

  ///even border
  #define marginMin 0.1
  #define marginMax 0.9

  float leftPoint = marginMin;
  float topPoint = marginMin;
  float bottomPoint = marginMax;
  float rightPoint = marginMax;

  bool topBlock = orgSt.y <= topPoint && orgSt.x <= rightPoint;
  bool leftBlock = orgSt.x <= leftPoint && orgSt.y > topPoint;
  bool rightBlock = orgSt.x > rightPoint && orgSt.y <= bottomPoint;
  bool bottomBlock = orgSt.y > bottomPoint && orgSt.x > leftPoint;

  float topW = 1. / 6.;

  bool topBlock1 = topBlock && orgSt.x <= topW * 2.;
  bool topBlock2 = topBlock && orgSt.x > topW * 2. && orgSt.x <= topW * 3.;
  bool topBlock3 = topBlock && orgSt.x > topW * 3. && orgSt.x <= topW * 4.;
  bool topBlock4 = topBlock && orgSt.x > topW * 4. && orgSt.x <= topW * 5.;
  bool topBlock5 = topBlock && orgSt.x > topW * 5. && orgSt.x <= topW * 6.;
  bool topBlock6 = topBlock && orgSt.x > topW * 6.;

  bool center = !leftBlock && !rightBlock && !bottomBlock && !topBlock;


  vec4 color = texture2D(u_texture, st);

  bool useBlock = false;
  float blockOnRan = random(timeBlock);

  // if(blockOnRan < 1./48.) useBlock = topBlock1;
  // else if(blockOnRan < 2./48.) useBlock = topBlock2;
  // else if(blockOnRan < 3./48.) useBlock = topBlock3;
  // else if(blockOnRan < 4./48.) useBlock = topBlock4;
  // else if(blockOnRan < 5./48.) useBlock = topBlock5;
  // else if(blockOnRan < 6./48.) useBlock = topBlock6;
  // // else if(blockOnRan < 8./48.) useBlock = topBlock;
  // else if(blockOnRan < 10./48.) useBlock = leftBlock;
  // // else if(blockOnRan < 12./48.) useBlock = rightBlock;



  float sections = map(random(centerTimeBlock), 0., 1., .02, .5) ; // .5- 0.02
  sections *= chunk / 10.;
 
  if(center && noise(floor(posBlockFloor * sections) * 0.1 + u_centerTime*0.05) < 0.45) {

    vec2 belowBlock = posBlockFloor + vec2(1.0, -1.0);
    vec4 belowCheck = texture2D(u_texture, belowBlock * blockSize);
    float belowBrightness = (belowCheck.r + belowCheck.g + belowCheck.b) / 3.0;\

    if(belowBrightness < 0.2) {
      // posBlockFloor.y += 1.0;
    } else if(belowBrightness < 0.5) {
      posBlockFloor.y += 1.0;
    } else if(belowBrightness < 0.8) {
      posBlockFloor.x += 1.0;
    } else if(belowBrightness < 0.9) {
      posBlockFloor.x -= 1.0;
    } else {
      posBlockFloor.y -= 1.0;
    }


    vec2 blockSt = (posBlockFloor + posBlockOffset) * blockSize;
    color = texture2D(u_texture, blockSt);
  } else {
    if(random(posBlockFloor * 10. + u_time) < 0.1) {
      color = orgColor;
    }
  }





  gl_FragColor = color;
  }



