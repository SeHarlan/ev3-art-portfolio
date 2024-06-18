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
uniform int u_stage;
uniform float u_stageCounter;

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

vec4 edgeDetection(vec4 _col, vec2 _st, float intensity) {
   vec2 onePixel = vec2(1.0) / u_resolution * 0.25; //0.5 is just to scale the line width down

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

  return mix(_col, edgeColor, intensity);
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

  float timeBlock = floor(u_time * .5);
  float timeFract = fract(u_time * .25);

  float largeTimeBlock = floor(timeBlock * .25);
  
  //sstatic
  float staticLineTime = fract(1.0 + u_time * 0.2) * 0.06;
  vec2 staticSt = floor(orgSt*u_resolution);
  vec2 staticLines = vec2(staticSt.x * .00001 - staticLineTime, staticSt.y * 0.00001 );

  float staticFuzzTime = fract(u_time * .001);
  vec2 staticFuzz = floor(st * u_resolution) + staticFuzzTime;

  float tvRan = mix(random(staticLines) * randomNegPos(staticLines) , random(staticFuzz),0.2);

  //Mouse radius effect  
  float radius = 0.15; // Size of the circle radius
  float fadeWidth = 0.025; // Width of the fade effect at the edges
  float mouseDist = norm_mouse == vec2(0) ? 1. : distance(correctedMousePos, correctedUV);
  float displaceIntensity = smoothstep(radius + fadeWidth, radius - fadeWidth, mouseDist);
  bool mouseInView = u_mouse.x >  u_resolution.x * 0.01 && u_mouse.y > u_resolution.y * 0.01 && u_mouse.x < u_resolution.x*0.99 && u_mouse.y < u_resolution.y*0.99;
  if(!mouseInView) {
    displaceIntensity = 0.0;
  }
  st.x += random(staticLines) * randomNegPos(staticLines) * 0.015 * displaceIntensity;

  bool useGlitchy = u_stage == 1 && u_stageCounter > 2.0;

  //static displacment glitch
  float floorTime = floor(u_time * 4.0 + 10.);
  if (random(floorTime) < 0.33 && useGlitchy) {
    st.x -= random(staticLines) * randomNegPos(staticLines) * 0.004;
  }

  vec4 color = texture2D(u_texture, st);

  vec2 pixel = 1.0 / u_resolution;





  

  //edge detect pulse
  float stageMult = u_stage == 1 ? 1.0 : -1.0;
  float pulseTime = u_stageCounter * 3.;
  vec2 center = vec2(0.47, 0.25);
  center.x+=random(floor(st * 50.))*0.1;
  center.y+=random(floor(st * 50.) + 100.)*0.1;
  float pulseDist = smoothstep(0.25,.75,.5 + (pulseTime - distance(orgSt, center) * PI * 2.) * 0.5 * stageMult);
  
  if(random(st) < pulseDist) {
    color = edgeDetection(color, st, 1.0);
  }

  //glitch color
  if (random(floorTime) < .33 && color.r > 0.65 && useGlitchy) {
    color.r -= random(staticLines) * randomNegPos(staticLines);
    color.g -= random(staticLines + 100.) * randomNegPos(staticLines + 100.);
    color.b -= random(staticLines + 200.) * randomNegPos(staticLines + 200.);
  }
  

  //noise
  color.rgb += tvRan * .15;

  //vignette effect
  float distFromCenter = distance(orgSt, vec2(0.5));
  color.rgb *= 1.0-smoothstep(0.5, .75, distFromCenter);

  //clear effects
  float intensity = 1.0;
  if(u_clear) {
    intensity = 0.0;
  }

  gl_FragColor = mix(originalColor, color, intensity );
}



