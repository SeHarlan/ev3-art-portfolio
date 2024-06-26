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
uniform vec2 u_aspectRatio;
uniform int u_stage;
uniform float u_centerTime;

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
  float r = noise(st);
  if (r < 0.33) {
    return -1.0;
  } else if (r < 0.66) {
    return 0.0;
  } else {
    return 1.0;
  }
}

float randomNegPos(vec2 st) {
  return floor(random(st) * 3.0) - 1.0;
}

float noiseOnOff(vec2 st) {
  return floor(noise(st) + 0.5);
}
float randomOnOff(vec2 st) {
  return floor(random(st) + 0.5);
}

vec4 edgeDetection(vec4 _col, vec2 _st, float intensity) {
   vec2 onePixel = vec2(1.0) / u_resolution * intensity; //intensity is just to scale the line width down

  float kernel[9];
  vec3 sampleTex[9];

  for (int i = 0; i < 3; ++i) {
    for (int j = 0; j < 3; ++j) {
      sampleTex[i * 3 + j] = texture2D(u_texture, _st + onePixel * vec2(i-1, j-1)).rgb;
    }
  }

  // Sobel filter kernels for horizontal and vertical edge detection
  float Gx[9];
  Gx[0] = -1.0; Gx[1] = 0.0; Gx[2] = 1.0;
  Gx[3] = -2.0; Gx[4] = 0.0; Gx[5] = 2.0;
  Gx[6] = -1.0; Gx[7] = 0.0; Gx[8] = 1.0;

  float Gy[9];
  Gy[0] = -1.0; Gy[1] = -2.0; Gy[2] = -1.0;
  Gy[3] = 0.0; Gy[4] = 0.0; Gy[5] = 0.0;
  Gy[6] = 1.0; Gy[7] = 2.0; Gy[8] = 1.0;


  vec3 edge = vec3(0.0);
  for (int k = 0; k < 9; k++) {
    edge.x += dot(sampleTex[k], vec3(0.299, 0.587, 0.114)) * Gx[k];
    edge.y += dot(sampleTex[k], vec3(0.299, 0.587, 0.114)) * Gy[k];
  }

  float edgeStrength = length(edge);

  vec4 edgeColor = vec4(vec3(edgeStrength), 1.0);

  return edgeColor;
}





//MAIN =========================================================
void main() {
  vec2 st = vTexCoord;
  vec2 orgSt = st;

  float chunk = 3.0;
  vec2 blockSize = vec2(chunk / u_resolution.x, chunk / u_resolution.y);

  vec2 posBlockFloor = floor(st / blockSize) ;
  vec2 posBlockOffset = fract(st / blockSize) ;

  vec2 norm_mouse = u_mouse / u_resolution;
  vec2 correctedMousePos = vec2(norm_mouse.x, norm_mouse.y ) * u_aspectRatio;
  vec2 correctedUV = vec2(st.x, st.y ) * u_aspectRatio;
 
  vec4 originalColor = texture2D(u_originalImage, st);

  vec4 color = texture2D(u_texture, orgSt);

  if(u_clear) {
    gl_FragColor = originalColor;
    return;
  }

  float leftPoint = 0.2;
  float centerPoint = 0.2 + .8 * 0.3333 ;
  float centerRightPoint = 0.2 + .8 * 0.6666;
  float rightPoint = 0.8;
  float topPoint = 0.4 * u_aspectRatio.x/u_aspectRatio.y;
  float bottomPoint = 1.0 - 0.2 * u_aspectRatio.x/u_aspectRatio.y;

  bool topCenterLeftBlock = orgSt.x > leftPoint && orgSt.x <= centerPoint && orgSt.y <= topPoint;
  bool topCenterBlock = orgSt.x > centerPoint && orgSt.x <= centerRightPoint && orgSt.y <= topPoint;
  bool topCenterRightBlock = orgSt.x > centerRightPoint && orgSt.y <= topPoint;
  bool topBlock = topCenterLeftBlock || topCenterBlock || topCenterRightBlock;

  bool leftBlock = orgSt.x <= leftPoint && orgSt.y <= bottomPoint;
  bool rightBlock = orgSt.x > rightPoint && orgSt.y > topPoint;
  bool bottomBlock = orgSt.x <= rightPoint && orgSt.y > bottomPoint;

  bool center = !leftBlock && !rightBlock && !bottomBlock && !topCenterBlock && !topCenterLeftBlock && !topCenterRightBlock;

  bool blockOn = false;
  float blockOnRan = random((floor(u_time * 2.)/2.) * 10000.);
  if(blockOnRan < 1./6.) blockOn = topCenterLeftBlock;
  else if(blockOnRan < 2./6.) blockOn = topCenterBlock;
  else if(blockOnRan < 3./6.) blockOn = topCenterRightBlock;
  else if(blockOnRan < 4./6.) blockOn = leftBlock;
  else if(blockOnRan < 5./6.) blockOn = rightBlock;
  else blockOn = bottomBlock;

  blockOn = blockOn && u_stage == 2;

  if(u_stage == 1 && !center) {
    st -= random(posBlockFloor + u_centerTime) * 0.002;
  }

  //Clip
  if(blockOn) {
    float clipBuffer = .5;

    float direction = st.y;
    if(topBlock) direction = -st.x;
    if(rightBlock) direction = -st.y;
    if(bottomBlock) direction = st.x;


    float clipT = sin(u_time * 100. + direction * PI * 5.) * clipBuffer + clipBuffer + 0.5;

    color.r = step(clipT, color.r);
    color.b = step(clipT, color.b);
    color.g = step(clipT, color.g);
  }

  if((!center) && (u_stage != 2 || !blockOn)) { 
    float edgeInsensity = 0.5;
    color = edgeDetection(color, st, edgeInsensity);
  }

  if(center) {
    float staticMult = 0.15;
    float stMult = 10.1;
    color.r += (random((st + fract(u_centerTime)) * stMult) * staticMult) - staticMult * .5;
    color.g += (random((st + fract(u_centerTime)) * stMult + 100.) * staticMult)  - staticMult * .5;
    color.b += (random((st + fract(u_centerTime)) * stMult + 200.) * staticMult)  - staticMult * .5;

    color.rgb *= 1.1;
  }

  // vec3 bgTint = vec3(46./255., 37./255., 65./255.); //dark blue
  vec3 bgTint = vec3(117./255., 77./255., 61./255.); //brown
  bool isDark = color.r < 0.1 && color.g < 0.1 && color.b < 0.1;

  if(!center || isDark) {
    float stMult = 0.1;

    if(leftBlock) stMult = 0.5;
    if(topCenterLeftBlock) stMult = 10000.1;
    if(topCenterBlock) stMult = 500.;
    if(topCenterRightBlock) stMult = 1000.1;
    if(rightBlock) stMult = 5000.5;

    //static
    color.rgb -= (random(stMult * st + fract(u_time)) * 0.5) - .31;

    //tint
    float tintAmount = .2 + (st.y) * 0.25;
    color.rgb = mix(color.rgb, bgTint, tintAmount);
  } 


  if(center && u_stage == 1) {
    vec4  edg = edgeDetection(color, st, 0.5) * 0.66;
    color = max(edg, color);
  }



  bool flicker = random(st * 10. + fract(u_time)) < 0.75 && !center  && random(u_time) < 0.9 && u_stage == 1;
  if(flicker) {
    vec2 offset = vec2(-0.01, 0.005);


    float offsetMult = 0.5;
    if(topCenterLeftBlock) offsetMult = 1.;
    if(topCenterBlock) offsetMult = 2.;
    if(topCenterRightBlock) offsetMult = 3.;

    offset *= offsetMult;

    color.r = texture2D(u_originalImage, st + offset).r;
    color.g = texture2D(u_originalImage, st - offset).g;
  }


  gl_FragColor = color;
}



