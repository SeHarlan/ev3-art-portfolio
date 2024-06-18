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
float random(in vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453);
}
float random(in float x){
    // return fract(sin(x + seed)*43758.5453);
    return fract(sin(x)*1e4);
}

float randomNegPos(vec2 st) {
  return random(st) < 0.5 ? -1.0 : 1.0;
}


//Modulation Functions
vec2 zoomCoords(vec2 st, float zoomLevel) {
  float aspectRatio = u_resolution.x / u_resolution.y;
   vec2 coords = st - 0.5; // Shift origin to center
  coords.x *= aspectRatio; // Correct for aspect ratio
  coords *= zoomLevel; // Apply zoom
  coords.x /= aspectRatio; // Correct back the aspect ratio
  coords += 0.5; // Shift origin back to bottom-left corner
  return coords;
}

//Glitch functions

vec4 pixelGlitch(vec4 _col, vec2 _st, float intensity, vec2 _size, sampler2D text) {
  vec2 stInt = floor(_st * _size) / _size;
  vec2 stFract = fract(_st * _size) / _size;
  float t = fract(u_time * 0.0000001);

  float range = 1.5;

  if (random(stInt + t) < 0.5) {
    stInt.x += range * floor(random(stInt) * 4.0) * randomNegPos(stInt) / _size.x;
    stInt.y += range * floor(random(stInt + 500.) * 4.0) * randomNegPos(stInt + 500.) / _size.y;
  }

  vec2 st = stInt + stFract;
  vec4 col = texture2D(text, st);
  return mix(_col, col, intensity);
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

  float staticLineTime = fract(u_time * 0.01);
  float staticFuzzTime = fract(u_time * .0004);
  vec2 staticSt = floor(orgSt*u_resolution);
  vec2 staticLines = 20000.+vec2(staticSt.x * 0.0001 , (staticSt.y * 200.) ) - staticLineTime;
  vec2 staticFuzz = floor(st * u_resolution * 0.66) - staticFuzzTime;
  float tvRan = mix(-random(staticLines) , random(staticFuzz),.4);

  //Mouse clear effect
  float radius = 0.25; // Size of the circle radius
  float fadeWidth = 0.025; // Width of the fade effect at the edges
  float mouseDist = norm_mouse == vec2(0) ? 1. : distance(correctedMousePos, correctedUV);
  float displaceIntensity = smoothstep(radius + fadeWidth, radius - fadeWidth, mouseDist);
  bool mouseInView = u_mouse.x >  u_resolution.x * 0.01 && u_mouse.y > u_resolution.y * 0.01 && u_mouse.x < u_resolution.x*0.99 && u_mouse.y < u_resolution.y*0.99;
  if(!mouseInView) {
    displaceIntensity = 0.0;
  }
  orgSt.x += random(staticLines) * randomNegPos(staticLines) * 0.015 * displaceIntensity;

  float floorTime = floor(u_time * 3.0 + 10.);

  if (random(floorTime) < 0.2) {
    orgSt.x += random(staticLines) * randomNegPos(staticLines) * 0.004;
  }

  vec4 color =  texture2D(u_texture, orgSt);

  color = pixelGlitch(color, orgSt, 0.5 , u_resolution * 0.6, u_texture);

  vec2 pixel = 1.0 / u_resolution;

  // //outline
  if (random(floor(floorTime/3.)) < 0.1) {
    vec2 zoomedSt = zoomCoords(orgSt, 1.0 + fract(u_time) * 0.03);
    color = edgeDetection(color, zoomedSt, 1.0);
    // color = texture2D(u_texture, zoomedSt);
    // color.rgb = 1.0- color.rgb;
  }

  //rct noise
  color.rgb += (tvRan * 0.25) ;

  float distFromCenter = distance(orgSt, vec2(0.5));
  color.rgb *= 1.0-smoothstep(0.5, .75, distFromCenter);


  // //Mouse clear effect
  // float radius = 0.2; // Size of the circle radius
  // float fadeWidth = 0.025; // Width of the fade effect at the edges
  // float mouseDist = norm_mouse == vec2(0) ? 1. : distance(correctedMousePos, correctedUV);
  // float intensity = 1.0 - smoothstep(radius + fadeWidth, radius - fadeWidth, mouseDist);

  // bool mouseInView = u_mouse.x >  u_resolution.x * 0.01 && u_mouse.y > u_resolution.y * 0.01 && u_mouse.x < u_resolution.x*0.99 && u_mouse.y < u_resolution.y*0.99;
  // if(!mouseInView) {
  //   intensity = 1.0;
  // }
  float intensity = 1.0;
  if(u_clear) {
    intensity = 0.0;
  }

  gl_FragColor = mix(originalColor, color, intensity );
}



