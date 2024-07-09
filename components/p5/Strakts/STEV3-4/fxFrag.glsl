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
  vec2 st = _st; + fract(u_seed);
  
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453);
}
float random(in float _x){
    float x = _x + fract(u_seed);

    return fract(sin(x)*1e4);
}

vec2 random2(vec2 _st){
    vec2 st = _st + fract(u_seed);

    st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float noise(vec2 _st) {
  vec2 st = _st + fract(u_seed);

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

float noiseNegNeutralPos(vec2 st) {
  float r = noise(st);
  if (r < 0.4) {
    return -1.0;
  } else if (r < 0.6) {
    return 0.0;
  } else {
    return 1.0;
  }
}

float noiseNegPos(vec2 st) {
  return noise(st) < 0.5 ? -1.0 : 1.0;
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

mat2 rotate2d(float angle){
    return mat2(cos(angle),-sin(angle),
                sin(angle),cos(angle));
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


float lines(in vec2 pos, float b){
    float scale = 10.0;
    pos *= scale;
    return smoothstep(0.0,
                    .5+b*.5,
                    abs((sin(pos.x*3.1415)+b*2.0))*.5);
}


float whirls(vec2 _st) {
  vec2 st = 1000. - _st ;
  st.x *= u_resolution.x/u_resolution.y;

  float noiseMod = 2. + (sin(u_centerTime*.2)*.5);

  float moveMult = u_centerTime * 0.05;

  st.x -= sin(moveMult * 2.) * 0.08;
  st.y -= cos(moveMult) * 0.04;
  st += vec2(-moveMult * .05, moveMult * .05);

  st += noise(st*3.) * noiseMod;
  st.x -= u_centerTime * 0.02;//axtra/morph

  float splat = noise(st * 4. + 50.); 


  return splat;
}


//MAIN =========================================================
void main() {
  vec2 st = vTexCoord;
  vec2 orgSt = st;

  float chunk = 10.0;
  vec2 blockSize = vec2(chunk / u_resolution.x, chunk / u_resolution.y);

  vec2 posBlockFloor = floor(st / blockSize) ;
  vec2 posBlockOffset = fract(st / blockSize) ;

  vec2 norm_mouse = u_mouse / u_resolution;
  vec2 correctedMousePos = vec2(norm_mouse.x, norm_mouse.y ) * u_aspectRatio;
  vec2 correctedUV = vec2(st.x, st.y ) * u_aspectRatio;
 
  vec4 originalColor = texture2D(u_originalImage, st);

  if(u_clear) {
    gl_FragColor = originalColor;
    return;
  }

  #define marginMin 0.1
  #define marginMax 0.9

  float leftPoint = marginMin * u_aspectRatio.y/u_aspectRatio.x;
  float topPoint = marginMin;
  float bottomPoint = marginMax - marginMin;
  float rightPoint = 1.0 - (marginMin * u_aspectRatio.y/u_aspectRatio.x);


  bool topBlock = orgSt.y <= topPoint && orgSt.x <= rightPoint;
  bool leftBlock = orgSt.x <= leftPoint && orgSt.y > topPoint;
  bool rightBlock = orgSt.x > rightPoint && orgSt.y <= bottomPoint;
  bool bottomBlock = orgSt.y > bottomPoint && orgSt.x > leftPoint;

  float bottomW = rightPoint / 6.;

  bool bottomBlock1 = bottomBlock && orgSt.x <= bottomW * 2.;
  bool bottomBlock2 = bottomBlock && orgSt.x > bottomW * 2. && orgSt.x <= bottomW * 3.;
  bool bottomBlock3 = bottomBlock && orgSt.x > bottomW * 3. && orgSt.x <= bottomW * 4.;
  bool bottomBlock4 = bottomBlock && orgSt.x > bottomW * 4. && orgSt.x <= bottomW * 5.;
  bool bottomBlock5 = bottomBlock && orgSt.x > bottomW * 5. && orgSt.x <= bottomW * 6.;
  bool bottomBlock6 = bottomBlock && orgSt.x > bottomW * 6.;

  bool center = !leftBlock && !rightBlock && !bottomBlock && !topBlock;

  float timeMult = 1.;
  float timeBlock = floor(u_time * timeMult);
  float timeBlockOffset = floor(u_time * 10.);

  bool blockOn = false;
  float blockOnRan = random(timeBlock);

  if(blockOnRan < 1./18.) blockOn = bottomBlock1;
  else if(blockOnRan < 2./18.) blockOn = bottomBlock2;
  else if(blockOnRan < 3./18.) blockOn = bottomBlock3;
  else if(blockOnRan < 4./18.) blockOn = bottomBlock4;
  else if(blockOnRan < 5./18.) blockOn = bottomBlock5;
  else if(blockOnRan < 6./18.) blockOn = bottomBlock6;
  else if(blockOnRan < 8./18.) blockOn = topBlock;
  else if(blockOnRan < 10./18.) blockOn = leftBlock;
  else if(blockOnRan < 12./18.) blockOn = rightBlock;

  bool useSplit = u_stage == 3 || (u_stage == 2 && blockOn);

  if(useSplit && random(st * u_imageResolution + fract(.5+timeBlockOffset* 1.5)) < 0.92) {
    float centerHor = 0.42;
    float centerVer = 0.4;
    float centerDiagTR = .4;
    float centerDiagTL = .49;
    float timeFactor = fract(u_time * timeMult) * (0.2 + random(timeBlockOffset) * 0.075 * randomNegPos(vec2(timeBlockOffset) + 100.));


    float timeBlockRan = random(timeBlock);

    if(timeBlockRan < random(timeBlock* 200.)) {
      if (st.x < centerHor) {
        st.x = clamp(st.x + timeFactor, marginMin, centerHor);
      } else {
        st.x = clamp(st.x - timeFactor, centerHor, marginMax);
      }
    } 
    if(timeBlockRan <  random(timeBlock* 300.)) {
      if(st.y < centerVer) {
        st.y = clamp(st.y +  timeFactor, marginMin, centerVer);
      } else {
        st.y = clamp(st.y - timeFactor, centerVer, marginMax);
      }
    } 
    if (timeBlockRan < random(timeBlock* 400.)) {
      float distanceToDiagTR = (orgSt.y + orgSt.x) * 0.5;

      if (distanceToDiagTR < centerDiagTR) {
          st.x = clamp(st.x + timeFactor * 0.5, 0., abs(centerDiagTR * 2. - (orgSt.y - orgSt.x)) * 0.5);
          st.y = clamp(st.y + timeFactor * 0.5, 0., abs(centerDiagTR * 2. - (orgSt.x - orgSt.y)) * 0.5);
      } else {
          st.x = clamp(st.x - timeFactor * 0.5, abs(centerDiagTR * 2. - (orgSt.y - orgSt.x)) * 0.5, 1.);
          st.y = clamp(st.y - timeFactor * 0.5, abs(centerDiagTR * 2. - (orgSt.x - orgSt.y)) * 0.5, 1.);
      }
    }

    if (timeBlockRan < random(timeBlock* 500.)) {

      float distanceToDiagTL = .5 + (orgSt.y - orgSt.x);

      if (distanceToDiagTL < centerDiagTL) {
        st.x = clamp(st.x - timeFactor * 0.5 , orgSt.y * centerDiagTL + orgSt.x * 0.5, 1.);
        st.y = clamp(st.y + timeFactor * 0.5, 0., orgSt.x * centerDiagTL + orgSt.y * 0.5);
      
      } else {
        st.x = clamp(st.x + timeFactor * 0.5 , 0., orgSt.y * centerDiagTL + orgSt.x * 0.5);
        st.y = clamp(st.y - timeFactor * 0.5, orgSt.x * centerDiagTL + orgSt.y * 0.5, 1.); 
      }
    }  
  }


  //bubbles
  float bubbleThresh = 0.55 + sin(u_centerTime * .1) * 0.12;
  float wValue = whirls(st);
  bool useBubbles = center && wValue + random(st) * 0.05 > bubbleThresh;
  if(useBubbles) {

    //  gl_FragColor = vec4(1.);
    // return;
    
    vec2 noiseMult = vec2(50. + sin(u_centerTime*.01) * 25.);
 
    vec2 noiseSt = st * noiseMult + vec2(u_centerTime* 0.5, -u_centerTime * 0.5);



    vec2 negPosSt = st * 5. + vec2((sin(u_centerTime * .1)) * 0.3, u_centerTime * -0.05);

    float ranBuffer = random(st * u_imageResolution + fract(u_centerTime* 0.001)) * 0.15;
    float negPosX = noiseNegPos(negPosSt + 50. + ranBuffer);
    float negPosY = noiseNegPos(negPosSt + 150. + ranBuffer);

    float range = 0.01 + (wValue - bubbleThresh) * bubbleThresh;
    // range *= 1.2 + sin(u_centerTime * .5) * 0.1 + cos(-u_centerTime * .11) * 0.1;

    st.x -= noise(noiseSt) * range * negPosX;
    st.y += noise(noiseSt+ 100.) * range * negPosY;

    if(st.x < leftPoint) st.x = leftPoint;
    if(st.x > rightPoint) st.x = rightPoint;
    if(st.y < topPoint) st.y = topPoint;
    if(st.y > bottomPoint) st.y = bottomPoint;
  }

  vec4 color = texture2D(u_texture, st);

 


  if (!center && u_stage != 1) {
    // float gray = dot(color.rgb, vec3(0.333, 0.333, 0.333));
    // color.rgb = vec3(floor(gray * 2.0) / 2.0);

    float edgeInsensity = 0.5;
    color = edgeDetection(color, st, edgeInsensity);
  }

  if (u_stage==1 && !center) {

    float centerDist = distance(st, vec2(0.42, 0.4)) + noise(st * vec2(30., 10.) +u_time * 0.5) * 0.3;
    // float centerDist = (1.0-orgSt.y + orgSt.x) * 0.5;
    float clipRan = random(u_time * 2.) * 0.5;

    float clipT = map(abs(sin(u_time * 4. + centerDist * 10. + clipRan)), 0., 1., 0.4, .9);
    color.r = step(clipT, color.r);
    color.g = step(clipT, color.g);
    color.b = step(clipT, color.b);
  }


  vec3 bgTint = vec3(15./255., 30./255., 100./255.); //dark blue
  // vec3 bgTint = vec3(87./255., 129./255., 158./255.); //sky blue
  bool isDark = color.r < 0.1 && color.g < 0.1 && color.b < 0.1;

  if((!center || isDark) ) {

    vec2 stMult = vec2(0.0005) * 2000.;
    stMult *= u_resolution;

    //static
    color.rgb += (random(stMult * st + fract(u_time * u_resolution.x * 0.0000009)) * .5) - 0.25;

    // tint
    float tintAmount = .3 + (1.-st.y) * 0.15;

    if(u_stage == 1) tintAmount*=.35;

    color.rgb = mix(color.rgb, bgTint, tintAmount);
  } 


  if(center) {
    float staticMult = 0.15;
    float stMult = 10.1 * u_resolution.x * 0.001;
    color.r += (random((st + fract(u_centerTime)) * stMult) * staticMult) - staticMult * .5;
    color.g += (random((st + fract(u_centerTime)) * stMult + 100.) * staticMult)  - staticMult * .5;
    color.b += (random((st + fract(u_centerTime)) * stMult + 200.) * staticMult)  - staticMult * .5;

    color.rgb *= 1.15;
  } 

  //vignette effect
  if(center) {  
    float distFromCenter = distance(orgSt, vec2(0.5, 0.46));
    color.rgb *= 1.0-smoothstep(0.3, .65, distFromCenter);
  } 

  gl_FragColor = color;
}



