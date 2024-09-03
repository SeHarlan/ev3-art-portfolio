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

  float moveMult = u_centerTime * .25 + sin(u_centerTime * .25) * .1;

  st.x -= sin(moveMult * 2.) * 0.06;
  st.y -= cos(moveMult) * 0.02;
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

  float chunk = 40.0;
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

  float leftPoint = marginMin;
  float topPoint = marginMin;
  float bottomPoint = marginMax;
  float rightPoint = marginMax;

  
  bool topBlock = st.y <= topPoint && st.x > leftPoint && st.x <= rightPoint;
  bool leftBlock = st.x <= leftPoint && st.y <= bottomPoint && st.y > topPoint;
  bool rightBlock = st.x > rightPoint && st.y > topPoint && st.y <= bottomPoint;
  bool bottomBlock = st.y > bottomPoint && st.x <= rightPoint;
  
  bool tlBlock = st.x <= leftPoint && st.y <= topPoint;
  bool trBlock = st.x > rightPoint && st.y <= topPoint;
  bool brBlock = st.x > rightPoint && st.y > bottomPoint;


  bool center = !leftBlock && !rightBlock && !bottomBlock && !topBlock && !tlBlock && !trBlock && !brBlock;

  float timeMult = 1.;
  float timeBlock = floor(u_time * timeMult);
  float timeBlockOffset = floor(u_time * 10.);

  bool blockOn = false; 

  if(u_stage ==2) {
    //always on
    float blockOnRan = random((floor(u_time * 2.)/2.) * 10000.);

    if(blockOnRan < 1./8.) blockOn = tlBlock;
    else if(blockOnRan < 3./8.) blockOn = trBlock;
    else if(blockOnRan < 4./8.) blockOn = brBlock;
    else if(blockOnRan < 5./8.) blockOn = topBlock;
    else if(blockOnRan < 6./8.) blockOn = leftBlock ;
    else if(blockOnRan < 7./8.) blockOn = rightBlock;
    else blockOn = bottomBlock;
  } else {
    //one third
    float blockOnRan = random(floor(u_centerTime * .1));
    if(blockOnRan < 1./14.) blockOn = tlBlock;
    else if(blockOnRan < 2./14.) blockOn = trBlock;
    else if(blockOnRan < 3./14.) blockOn = brBlock;
    else if(blockOnRan < 4./14.) blockOn = topBlock;
    else if(blockOnRan < 5./14.) blockOn = leftBlock;
    else if(blockOnRan < 6./14.) blockOn = rightBlock;
    else if (blockOnRan < 7./14.) blockOn = bottomBlock;
  }

  bool useSplit = u_stage == 3 || (u_stage == 2 && blockOn);

  bool splitHappened = false;

  if(useSplit && random(st * u_imageResolution * 5. + fract(.5+timeBlockOffset* 1.5)) < 0.93) {
    float centerHor = 0.42;
    float centerVer = 0.4;
    float centerDiagTR = .4;
    float centerDiagTL = .49;
    float timeFactor = fract(u_time * timeMult) * (0.2 + random(timeBlockOffset) * 0.075 * randomNegPos(vec2(timeBlockOffset) + 100.)) * 0.75;


    float timeBlockRan = random(timeBlock);

    

    if(timeBlockRan < random(timeBlock + 200.)) {
      if (st.x < centerHor) {
        st.x = clamp(st.x + timeFactor, marginMin, centerHor);
      } else {
        st.x = clamp(st.x - timeFactor, centerHor, marginMax);
      }
      splitHappened = true;
    } 
    if(timeBlockRan <  random(timeBlock + 300.)) {
      if(st.y < centerVer) {
        st.y = clamp(st.y +  timeFactor, marginMin, centerVer);
      } else {
        st.y = clamp(st.y - timeFactor, centerVer, marginMax);
      }
      splitHappened = true;
    } 
    if (timeBlockRan < random(timeBlock + 400.)) {
      float distanceToDiagTR = (orgSt.y + orgSt.x) * 0.5;

      if (distanceToDiagTR < centerDiagTR) {
          st.x = clamp(st.x + timeFactor * 0.5, 0., abs(centerDiagTR * 2. - (orgSt.y - orgSt.x)) * 0.5);
          st.y = clamp(st.y + timeFactor * 0.5, 0., abs(centerDiagTR * 2. - (orgSt.x - orgSt.y)) * 0.5);
      } else {
          st.x = clamp(st.x - timeFactor * 0.5, abs(centerDiagTR * 2. - (orgSt.y - orgSt.x)) * 0.5, 1.);
          st.y = clamp(st.y - timeFactor * 0.5, abs(centerDiagTR * 2. - (orgSt.x - orgSt.y)) * 0.5, 1.);
      }
      splitHappened = true;
    }

    if (timeBlockRan < random(timeBlock + 500.)) {

      float distanceToDiagTL = .5 + (orgSt.y - orgSt.x);

      if (distanceToDiagTL < centerDiagTL) {
        st.x = clamp(st.x - timeFactor * 0.5 , orgSt.y * centerDiagTL + orgSt.x * 0.5, 1.);
        st.y = clamp(st.y + timeFactor * 0.5, 0., orgSt.x * centerDiagTL + orgSt.y * 0.5);
      
      } else {
        st.x = clamp(st.x + timeFactor * 0.5 , 0., orgSt.y * centerDiagTL + orgSt.x * 0.5);
        st.y = clamp(st.y - timeFactor * 0.5, orgSt.x * centerDiagTL + orgSt.y * 0.5, 1.); 
      }
      splitHappened = true;
    }  

    if(!splitHappened && !center && random(posBlockFloor + u_time + 0.) < 0.5) {
      st.x += random(posBlockFloor + u_time + 200.) * 0.05;
      st.y -= random(posBlockFloor + u_time +100.) * 0.05;
    }
  }


  //bubbles
  float bubbleThresh = 0.5 + sin(PI * u_seed + u_centerTime * .15) * 0.15;
  float wValue = whirls(st);
  bool useBubbleBlocks = blockOn;
  bool useBubbles = (center  || useBubbleBlocks) && wValue + random(st) * 0.05 > bubbleThresh;

  if(useBubbles) {    
    vec2 noiseMult = vec2(50. + sin(PI * u_seed + u_centerTime*.01) * 25.);
 
    vec2 noiseSt = st * noiseMult + vec2(u_centerTime* 0.5, -u_centerTime * 0.5);



    vec2 negPosSt = st * 5. + vec2((sin(PI * u_seed + u_centerTime * .1)) * 0.3, u_centerTime * -0.05);

    float ranBuffer = random(st * u_imageResolution + fract(u_centerTime* 0.001)) * 0.1;
    float negPosX = noiseNegPos(negPosSt + 50. + ranBuffer);
    float negPosY = noiseNegPos(negPosSt + 150. + ranBuffer);

    float range = 0.01 + (wValue - bubbleThresh) * bubbleThresh;
    // range *= 1.2 + sin(u_centerTime * .5) * 0.1 + cos(-u_centerTime * .11) * 0.1;

    st.x -= noise(noiseSt) * range * negPosX;
    st.y += noise(noiseSt+ 100.) * range * negPosY;

    if(center) {
      if(st.x < leftPoint) st.x = leftPoint;
      if(st.x > rightPoint) st.x = rightPoint;
      if(st.y < topPoint) st.y = topPoint;
      if(st.y > bottomPoint) st.y = bottomPoint;
    }
  }

  vec4 color = texture2D(u_texture, st);


  topBlock = st.y <= topPoint && st.x > leftPoint && st.x <= rightPoint;
  leftBlock = st.x <= leftPoint && st.y <= bottomPoint && st.y > topPoint;
  rightBlock = st.x > rightPoint && st.y > topPoint && st.y <= bottomPoint;
  bottomBlock = st.y > bottomPoint && st.x <= rightPoint;
  
  tlBlock = st.x <= leftPoint && st.y <= topPoint;
  trBlock = st.x > rightPoint && st.y <= topPoint;
  brBlock = st.x > rightPoint && st.y > bottomPoint;


  center = !leftBlock && !rightBlock && !bottomBlock && !topBlock && !tlBlock && !trBlock && !brBlock;



  bool flicker = u_stage == 1 && random(u_time) < 0.75 + sin(u_time * 3.) * 0.1;


  if (!center && !flicker) {
    // float gray = dot(color.rgb, vec3(0.333, 0.333, 0.333));
    // color.rgb = vec3(floor(gray * 2.0) / 2.0);

    float edgeInsensity = 0.5;
    color = edgeDetection(color, st, edgeInsensity);
  }



  float clipRan = random(u_time * 20.) * 0.5;
  if (u_stage==1 && !center && flicker) {
    float centerDist = distance(st, vec2(0.42, 0.4)) + noise(st * vec2(50., 10.) +u_time * 0.5) * 0.3;
    // float centerDist = (1.0-orgSt.y + orgSt.x) * 0.5;

    float clipT = map(abs(sin(u_time * 4. + centerDist * 10. + clipRan)), 0., 1., 0.4, .9);
    color.r = step(clipT, color.r);
    color.g = step(clipT, color.g);
    color.b = step(clipT, color.b);
  }


  vec3 bgTint = vec3(35./255., 40./255., 70./255.); //blue
  // vec3 bgTint = vec3(18./255., 20./255., 70./255.); //darkblue

  vec3 fxTint = vec3(75./255., 75./255., 90./255.);
  bool isDark = color.r < 0.1 && color.g < 0.1 && color.b < 0.1;

  if((!center || isDark) ) {
    //static
    vec2 stMult = vec2(.99998, 1.);
    stMult *= u_resolution;
    float range = st.y * .25 + 0.3;
    color.rgb += map(random(stMult * st + fract(u_time * u_resolution.x * 0.0000008)), 0., 1., -range, range);

    // tint
    float tintAmount = .4 + (st.y + sin(u_centerTime * 0.5) * 0.5) * 0.15; 

    if(u_stage == 1 && flicker) tintAmount *= .5;

    color.rgb = mix(color.rgb, bgTint, tintAmount);

    //SHINY stage 3 //electric
    if(u_stage == 3 || (u_stage == 2 && blockOn)) {
      float centerDist = distance(st, vec2(0.5, 0.5)) + noise(st * vec2(3., 10.) +u_time * 10.5) * 0.3;
      float clipT = map(abs(sin(u_time * 4. - centerDist * 20.)), 0., 1., 0.3, .9);
      color.rgb = step(clipT, color.rgb);



      color.rgb = mix(color.rgb, fxTint + 0.1, .35);

    }

    

  } 

  bool alternateStatic = u_stage == 3 || blockOn || (u_stage == 0);
  if(center || alternateStatic) {
    float staticMult = 0.15;
    vec2 stMult = vec2(.1, -0.1);
    stMult *= u_resolution;

    color.r += (random((st - fract(u_centerTime * u_resolution.x * 0.0000005)) * stMult) * staticMult) - staticMult * .5;
    color.g += (random((st - fract(u_centerTime * u_resolution.x * 0.0000005)) * stMult + 100.) * staticMult)  - staticMult * .5;
    color.b += (random((st - fract(u_centerTime * u_resolution.x * 0.0000005)) * stMult + 200.) * staticMult)  - staticMult * .5;

    color.rgb *= 1.05;
  } 

  if(u_stage == 3 || (u_stage == 2 && blockOn)) {
    float direction = st.y * 20.;
    color.r *= 1. + sin(direction - u_centerTime * 40.) * .6;
    color.b *= 1. - sin(direction - u_centerTime * 40.) * .4;
  }

  if(center && u_stage == 1 && flicker) {
    vec4 edg = edgeDetection(color, st, 0.5) * .5;
    color = max(edg, color);
  }


  //vignette effect
  if(center && !isDark) {
    float distFromCenter = distance(orgSt, vec2(0.5, 0.5));
    color.rgb *= 1.0-smoothstep(0.35, .7, distFromCenter);
  }

  gl_FragColor = color;
}



