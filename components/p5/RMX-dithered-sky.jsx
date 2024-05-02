import p5 from "p5"
import { FC, memo, useRef, useState } from "react"
import debounce from "lodash.debounce";
import dynamic from "next/dynamic";
const P5Wrapper = dynamic(() => import('./P5Wrapper'), { ssr: false });

const RMX_dithered_sky = ({ className, menuOpen, seed, isActive }) => { 
  const containerRef = useRef(null);

  const sketch = (p5sketch, initSeed) => {
    if (typeof window === "undefined") return;

    let seed, img;
    let fxShader, feedbackShader;
    let currentBuffer, previousBuffer, fxBuffer, gridBuffer, textBuffer;
    let FR = 30;
    let timeCounter = 0;
    let clearGlitch = false;
    let font

    const EV3binary = '01000101 01010110 00110011'

    const imageUrl = "https://arweave.net/RIWEFemW90nlHEc0kqfImQCGl7-Blh12tapOonzUB2E?ext=png"
    // const imageUrl = "https://arweave.net/uy98BPJn7Ezew4XU31yAvDLrl8J7O437olAIdZBj3tc?ext=jpg"

    p5sketch.preload = () => {
      try {
        document.getElementById("RMX-dithered-sky-loadingBorder").style.display = "block";

        fxShader = new p5.Shader(p5sketch._renderer, vertex, fxFrag);
        feedbackShader = new p5.Shader(p5sketch._renderer, vertex, feedbackFrag);
        img = p5sketch.loadImage(imageUrl)
        font = '"Kode Mono", monospace'

      } catch (error) {
        console.error(error)
      }
    }

    p5sketch.setup = () => {
      document.getElementById("RMX-dithered-sky-loadingBorder").style.display = "none";
      const windowWidth = containerRef.current.clientWidth;
      const windowHeight = containerRef.current.clientHeight
      let windowRatio = windowWidth / windowHeight;
      let imgRatio = img.width / img.height;
      let canvWidth, canvHeight;

      if (windowRatio > imgRatio) {
        // Window is wider than image needs
        canvHeight = windowHeight;
        canvWidth = canvHeight * imgRatio;
      } else {
        // Window is taller than image needs
        canvWidth = windowWidth;
        canvHeight = canvWidth / imgRatio;
      }

      img.resize(canvWidth, canvHeight)

      p5sketch.createCanvas(canvWidth, canvHeight);
      p5sketch.pixelDensity(1);
      p5sketch.frameRate(FR);
      p5sketch.colorMode(p5sketch.HSL)

      currentBuffer = p5sketch.createGraphics(canvWidth, canvHeight, p5sketch.WEBGL);
      previousBuffer = p5sketch.createGraphics(canvWidth, canvHeight, p5sketch.WEBGL);
      fxBuffer = p5sketch.createGraphics(canvWidth, canvHeight, p5sketch.WEBGL);
      gridBuffer = p5sketch.createGraphics(canvWidth, canvHeight);
      textBuffer = p5sketch.createGraphics(canvWidth, canvHeight);
      currentBuffer.noStroke();
      previousBuffer.noStroke();
      fxBuffer.noStroke();
      gridBuffer.noStroke();
      textBuffer.noStroke();



      currentBuffer.colorMode(p5sketch.HSL);
      previousBuffer.colorMode(p5sketch.HSL);
      fxBuffer.colorMode(p5sketch.HSL);
      gridBuffer.colorMode(p5sketch.HSL);
      textBuffer.colorMode(p5sketch.HSL);

      textBuffer.textFont(font);


      seed = p5sketch.random() * 1000;
      p5sketch.randomSeed(seed);
      p5sketch.noiseSeed(seed);

      currentBuffer.image(img, -p5sketch.width / 2, -p5sketch.height / 2, p5sketch.width, p5sketch.height);
    }

    p5sketch.draw = () => {
      const spacer = p5sketch.height / 60;
      const margin = spacer * 4


      //DOT GRID
      currentBuffer.fill(65, 80, 93, 0.2);
      currentBuffer.noStroke()


      textBuffer.fill(65, 80, 93, 0.2);
      textBuffer.textSize(spacer * 0.6);

      if ((timeCounter * 2) % 3 < 0.1) {
        for (let y = margin; y < p5sketch.height - margin; y += spacer * 2) {
          for (let x = margin; x < p5sketch.width - margin; x += spacer * 2) {
            const xOff = x - p5sketch.width / 2;
            const yOff = y - p5sketch.height / 2;
            currentBuffer.circle(xOff, yOff, spacer / 8)
          }
        }
        textBuffer.text(EV3binary, margin, p5sketch.height - margin);
      }


      currentBuffer.image(textBuffer, -p5sketch.width / 2, -p5sketch.height / 2, p5sketch.width, p5sketch.height);

      [fxShader, feedbackShader].forEach(shdr => {
        shdr.setUniform('u_texture', currentBuffer);
        shdr.setUniform('u_originalImage', img);
        shdr.setUniform('u_grid', gridBuffer);
        shdr.setUniform('u_resolution', [p5sketch.width, p5sketch.height]);
        shdr.setUniform('u_imageResolution', [img.width, img.height])
        shdr.setUniform('u_time', timeCounter);
        shdr.setUniform('u_seed', seed);
        shdr.setUniform('u_mouse', [p5sketch.mouseX, p5sketch.mouseY]);
        shdr.setUniform('u_clear', clearGlitch);
      })

      previousBuffer.shader(feedbackShader);
      previousBuffer.rect(-p5sketch.width / 2, -p5sketch.height / 2, p5sketch.width, p5sketch.height);

      // Display the result on the main canvas
      fxBuffer.shader(fxShader);
      fxBuffer.rect(-p5sketch.width / 2, -p5sketch.height / 2, p5sketch.width, p5sketch.height);
      p5sketch.image(fxBuffer, 0, 0, p5sketch.width, p5sketch.height);

      // Swap buffers
      currentBuffer.image(previousBuffer, -p5sketch.width / 2, -p5sketch.height / 2, p5sketch.width, p5sketch.height);
      previousBuffer.clear();

      timeCounter += 1 / FR;
    }

    p5sketch.keyPressed = () => {
      if (menuOpen.current || !isActive.current) return
      if (p5sketch.key == "c") {
        clearGlitch = !clearGlitch;
        return false
      }
    }
    const vertex = `
    #ifdef GL_ES
precision mediump float;
#endif

attribute vec3 aPosition;
attribute vec2 aTexCoord;

varying vec2 vTexCoord;

void main() {
  vTexCoord = aTexCoord;
  vTexCoord.y = 1.0 - vTexCoord.y;

  vec4 positionVec4 = vec4(aPosition, 1.0);
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;

  gl_Position = positionVec4;
}
    `
    const feedbackFrag = `
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

#define pixel (1.0 / u_resolution.x)


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


//Shaping functions
// smooth n to threshold m, linear to 1
float almostIdentity( float x, float m, float n ) {
  if( x>m ) return x;
  float a = 2.0*n - m;
  float b = 2.0*m - 3.0*n;
  float t = x/m;
  return (a*t + b)*t*t + n;
}

//smooth 0..1
float almostUnitIdentity( float x ) {
  return x*x*(2.0-x);
}

//smooth ramp from 0 to T, then linear after that
float integralSmoothstep( float x, float T ) {
  if( x>T ) return x - T/2.0;
  return x*x*x*(1.0-x*0.5/T)/T/T;
}

//fast attack, then long decay
// k: stretch factor (8.0)
float expImpulse( float x, float k ) {
  float h = k*x;
  return h*exp(1.0-h);
}

//bump
// c: center (0.5)
// w: width  - start to center (0.5)
float cubicPulse( float x, float c, float w ) {
  x = abs(x - c);
  if( x>w ) return 0.0;
  x /= w;
  return 1.0 - x*x*(3.0-2.0*x);
}

//0..1 comproessed middle (s shape)
// k: compression factor (0.5 inverse < 1.0 linear < 1.5 s shape)
float gain( float x, float k ) {
  float a = 0.5*pow(2.0*((x<0.5)?x:1.0-x), k);
  return (x<0.5)?a:1.0-a;
}

//k: arc - width (0.5 perfect dome, 1+ more lip, less width)
float parabola( float x, float k ) {
  return pow( 4.0*x*(1.0-x), k );
}

//moveable parabola
//a: arc - width
//b: relativecenter (0.5)
float pcurve( float x, float a, float b ) {
  float k = pow(a+b,a+b)/(pow(a,a)*pow(b,b)); //"k" can be avoided if scaling
  return k*pow(x,a)*pow(1.0-x,b);
}



//easing either way
// a: easing direction and power, (ease out < 0.5 linear < ease in)
float exponentialEasing(float x, float a){
  a = max(min_param_a, min(max_param_a, a));

  if (a < 0.5){
    // emphasis
    a = 2.0*(a);
    float y = pow(x, a);
    return y;
  } else {
    // de-emphasis
    a = 2.0 * ( a - 0.5);
    float y = pow(x, 1.0/(1.0-a));
    return y;
  }
}

float easeOutBounce(float x){
  float n1 = 7.5625;
  float d1 = 2.75;

  if (x < 1. / d1) {
      return n1 * x * x;
  } else if (x < 2. / d1) {
      return n1 * (x -= 1.5 / d1) * x + 0.75;
  } else if (x < 2.5 / d1) {
      return n1 * (x -= 2.25 / d1) * x + 0.9375;
  } else {
      return n1 * (x -= 2.625 / d1) * x + 0.984375;
  }
}

float easeInBounce(float x){
  return 1.0 - easeOutBounce(1.0 - x);
}



//a: control point
float quadraticBezier (float x, vec2 a){
  float om2a = 1.0 - 2.0 * a.x;
  float t = (sqrt(a.x*a.x + om2a*x) - a.x)/om2a;
  float y = (1.0-2.0*a.y)*(t*t) + (2.0*a.y)*t;
  return y;
}


// Bezier Helper functions:
float slopeFromT (float t, float A, float B, float C){
  float dtdx = 1.0/(3.0*A*t*t + 2.0*B*t + C);
  return dtdx;
}

float xFromT (float t, float A, float B, float C, float D){
  float x = A*(t*t*t) + B*(t*t) + C*t + D;
  return x;
}

float yFromT (float t, float E, float F, float G, float H){
  float y = E*(t*t*t) + F*(t*t) + G*t + H;
  return y;
}
//a: control point1
//b: control point2
float cubicBezier(float x, vec2 a, vec2 b){
  //https://www.flong.com/archive/texts/code/shapers_bez/
  float y0a = 0.0; // initial y
  float x0a = 0.0; // initial x
  float y1a = a.y; // 1st influence y
  float x1a = a.x; // 1st influence x
  float y2a = b.y; // 2nd influence y
  float x2a = b.x; // 2nd influence x
  float y3a = 1.0; // final y
  float x3a = 1.0; // final x

  float A = x3a - 3.0*x2a + 3.0*x1a - x0a;
  float B = 3.0*x2a - 6.0*x1a + 3.0*x0a;
  float C = 3.0*x1a - 3.0*x0a;
  float D = x0a;

  float E = y3a - 3.0*y2a + 3.0*y1a - y0a;
  float F = 3.0*y2a - 6.0*y1a + 3.0*y0a;
  float G = 3.0*y1a - 3.0*y0a;
  float H = y0a;

  float currentt = x;
  for (int i=0; i < 5; i++){
    float currentx = xFromT (currentt, A,B,C,D);
    float currentslope = slopeFromT (currentt, A,B,C);
    currentt -= (currentx - x)*(currentslope);
  	currentt = clamp(currentt,0.0,1.0);
  }

  float y = yFromT (currentt,  E,F,G,H);
  return y;
}

//==============================================================================
//COLOR FUNCTIONS
vec3 rgb2hsb( in vec3 c ){
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz),
                 vec4(c.gb, K.xy),
                 step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r),
                 vec4(c.r, p.yzx),
                 step(p.x, c.r));
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)),
                d / (q.x + e),
                q.x);
}

//  Function from Iñigo Quiles
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
}

vec3 hue2rgb(float hue) {
  vec3 rgb = abs(hue * 6. - vec3(3, 2, 4)) * vec3(1, -1, -1) + vec3(-1, 2, 2);
  return clamp(rgb, 0., 1.);
}

vec3 hsl2rgb(vec3 hsl) {
  // Hue-Saturation-Lightness [0..1] to RGB [0..1]
  hsl = clamp(hsl, 0., 1.);

  vec3 rgb = hue2rgb(hsl.x);
  float c = (1. - abs(2. * hsl.z - 1.)) * hsl.y;
  return (rgb - 0.5) * c + hsl.z;
}

vec3 rgb2hsl(vec3 rgb){
    rgb = clamp(rgb, 0., 1.);
    float r = rgb.r;
    float g = rgb.g;
    float b = rgb.b;

    float max = (r > g && r > b) ? r : (g > b) ? g : b;
    float min = (r < g && r < b) ? r : (g < b) ? g : b;

    float h, s, l;
    h = s = l = (max + min) / 2.0;

    if (max == min) {
      h = s = 0.0;
    } else {
      float d = max - min;
      s = (l > 0.5) ? d / (2.0 - max - min) : d / (max + min);
      if (r > g && r > b)
        h = (g - b) / d + (g < b ? 6.0 : 0.0);
      else if (g > b)
        h = (b - r) / d + 2.0;
      else
        h = (r - g) / d + 4.0;
      h /= 6.0;
    }
    return vec3(h, s, l);
}


//drawing helpers
float plotX(vec2 st, float pct){
  return  smoothstep( pct-0.008, pct, st.y) -
          smoothstep( pct, pct+0.008, st.y);
}
float plotY(vec2 st, float pct){
  return  smoothstep( pct-0.008, pct, st.x) -
          smoothstep( pct, pct+0.008, st.x);
}

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

vec3 radial(vec2 st, vec2 pos, float rad) {
  vec3 color = vec3(0.0);
  pos = pos-st;
  pos /= rad;

  float r = length(pos)*2.0;
  float a = atan(pos.y,pos.x);

  float f = cos(a*3.);
  f = abs(cos(a*3.));
  f = abs(cos(a*2.5))*.5+.3;
  // f = abs(cos(a*12.)*sin(a*3.))*.8+.2;
  // f = smoothstep(-.5,1., cos(a*10.))*0.2+0.5;

  color = vec3( 1.-smoothstep(f,f+0.005,r) );
  return color;
}

vec3 polygon(vec2 st, vec2 pos, float rad) {
  float d = 0.0;
  st = st-pos;
  // Number of sides of your shape
  int N = 5;

  // Angle and radius from the current pixel
  float a = atan(st.x,st.y)+PI;
  float r = TWO_PI/float(N);

  // Shaping function that modulate the distance
  d = cos(floor(.5+a/r)*r-a)*length(st);
  d/=rad;

  vec3 color = vec3(1.0-smoothstep(.4,.405,d));
  // vec3 color = vec3(d);

  return color;
}


//Feedback Functions

  //flow river
vec4 riverFlow(vec2 st, float timeBlock) {
  vec2 rSt= st;
  bool riverTime = true;random(timeBlock) < 0.5;
  float riverRate = 1.25;
  bool riverSpaceX = rSt.x > 0.9;

  bool riverRan = noise(rSt * 13. + u_time) < .5;

  if (riverSpaceX && riverRan && riverTime) {
    st.y = fract(st.y + pixel * riverRate);
  }

  vec4 color = texture2D(u_texture, st);
  return color;
}






//MAIN =========================================================
void main() {
  vec2 st = vTexCoord;
  vec2 orgSt = st;

  if (u_time < 1.5) {
    gl_FragColor = texture2D(u_originalImage, orgSt);
    return;
  }


  float timeLoop = sin(u_time) * 2.0 * PI; // A full loop in the input space
  vec2 loopedST = st + vec2(cos(timeLoop), sin(timeLoop)) * 0.5;
  // Get noise value at these coordinates
  // float loopingTimeNoise = cnoise(loopedST * 10.0); // Scale for more detail


  float chunk = u_resolution.x/10.;
  vec2 blockSize = vec2(chunk / u_resolution.x, chunk / u_resolution.y);

  float timeBlock = floor(u_time * .3);
  float timeFract = fract(u_time * .3);

  vec2 posBlockFloor = floor(st / blockSize) ;
  vec2 posBlockOffset = fract(st / blockSize) ;

  // vec4 color = texture2D(u_texture, st);
  vec4 color = riverFlow(st, timeBlock);



  //block paint/sweep
  vec2 noiseBlock = posBlockFloor * 0.2;


  bool useSweep = snoise(noiseBlock + timeBlock) < (1.0 - posBlockFloor.y * blockSize.y) * 0.4;
  bool useReset = snoise(noiseBlock + timeBlock + 100.0) < 0.33;

  float rate = u_resolution.x * .00001;
  if(useSweep) {
    float xOff = rate;
    float yOff = rate * noiseNegNeutralPos(noiseBlock + timeBlock + 200.);

    // float cosX = cos(posBlockOffset.y * PI * 3.);
    // float sinY = sin(posBlockOffset.x * PI * 3.);
    // xOff += cos(cosX) * rate ;
    // yOff += sin(sinY) * rate;
    posBlockOffset.x -= xOff;
    posBlockOffset.y += yOff;

    vec2 blockSt = (posBlockFloor + posBlockOffset) * blockSize;

    if (blockSt.x < 0.0 || blockSt.x > 1.0 || blockSt.y < 0.0 || blockSt.y > 1.0) {
      blockSt = st;
    }

    color = texture2D(u_texture, blockSt);
  } else if (useReset) {

    float downReveal = posBlockOffset.y;
    float rightReveal = posBlockOffset.x;
    float upReveal = 1.0 - posBlockOffset.y;

    float reveal = rightReveal;

    float revealRan = random(noiseBlock + timeBlock + 200.);

    if (revealRan < 0.3) {
      // reveal = downReveal;
    } else if (revealRan < 0.6) {
      reveal = upReveal;
    }

    if (reveal < timeFract + 0.01) {
      color = texture2D(u_originalImage, orgSt);
    }
  }



  gl_FragColor = color;
}
    `
    const fxFrag = `
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


//Shaping functions
// smooth n to threshold m, linear to 1
float almostIdentity( float x, float m, float n ) {
  if( x>m ) return x;
  float a = 2.0*n - m;
  float b = 2.0*m - 3.0*n;
  float t = x/m;
  return (a*t + b)*t*t + n;
}

//smooth 0..1
float almostUnitIdentity( float x ) {
  return x*x*(2.0-x);
}

//smooth ramp from 0 to T, then linear after that
float integralSmoothstep( float x, float T ) {
  if( x>T ) return x - T/2.0;
  return x*x*x*(1.0-x*0.5/T)/T/T;
}

//fast attack, then long decay
// k: stretch factor (8.0)
float expImpulse( float x, float k ) {
  float h = k*x;
  return h*exp(1.0-h);
}

//bump
// c: center (0.5)
// w: width  - start to center (0.5)
float cubicPulse( float x, float c, float w ) {
  x = abs(x - c);
  if( x>w ) return 0.0;
  x /= w;
  return 1.0 - x*x*(3.0-2.0*x);
}

//0..1 comproessed middle (s shape)
// k: compression factor (0.5 inverse < 1.0 linear < 1.5 s shape)
float gain( float x, float k ) {
  float a = 0.5*pow(2.0*((x<0.5)?x:1.0-x), k);
  return (x<0.5)?a:1.0-a;
}

//k: arc - width (0.5 perfect dome, 1+ more lip, less width)
float parabola( float x, float k ) {
  return pow( 4.0*x*(1.0-x), k );
}

//moveable parabola
//a: arc - width
//b: relativecenter (0.5)
float pcurve( float x, float a, float b ) {
  float k = pow(a+b,a+b)/(pow(a,a)*pow(b,b)); //"k" can be avoided if scaling
  return k*pow(x,a)*pow(1.0-x,b);
}



//easing either way
// a: easing direction and power, (ease out < 0.5 linear < ease in)
float exponentialEasing(float x, float a){
  a = max(min_param_a, min(max_param_a, a));

  if (a < 0.5){
    // emphasis
    a = 2.0*(a);
    float y = pow(x, a);
    return y;
  } else {
    // de-emphasis
    a = 2.0 * ( a - 0.5);
    float y = pow(x, 1.0/(1.0-a));
    return y;
  }
}

float easeOutBounce(float x){
  float n1 = 7.5625;
  float d1 = 2.75;

  if (x < 1. / d1) {
      return n1 * x * x;
  } else if (x < 2. / d1) {
      return n1 * (x -= 1.5 / d1) * x + 0.75;
  } else if (x < 2.5 / d1) {
      return n1 * (x -= 2.25 / d1) * x + 0.9375;
  } else {
      return n1 * (x -= 2.625 / d1) * x + 0.984375;
  }
}

float easeInBounce(float x){
  return 1.0 - easeOutBounce(1.0 - x);
}



//a: control point
float quadraticBezier (float x, vec2 a){
  float om2a = 1.0 - 2.0 * a.x;
  float t = (sqrt(a.x*a.x + om2a*x) - a.x)/om2a;
  float y = (1.0-2.0*a.y)*(t*t) + (2.0*a.y)*t;
  return y;
}


// Bezier Helper functions:
float slopeFromT (float t, float A, float B, float C){
  float dtdx = 1.0/(3.0*A*t*t + 2.0*B*t + C);
  return dtdx;
}

float xFromT (float t, float A, float B, float C, float D){
  float x = A*(t*t*t) + B*(t*t) + C*t + D;
  return x;
}

float yFromT (float t, float E, float F, float G, float H){
  float y = E*(t*t*t) + F*(t*t) + G*t + H;
  return y;
}
//a: control point1
//b: control point2
float cubicBezier(float x, vec2 a, vec2 b){
  //https://www.flong.com/archive/texts/code/shapers_bez/
  float y0a = 0.0; // initial y
  float x0a = 0.0; // initial x
  float y1a = a.y; // 1st influence y
  float x1a = a.x; // 1st influence x
  float y2a = b.y; // 2nd influence y
  float x2a = b.x; // 2nd influence x
  float y3a = 1.0; // final y
  float x3a = 1.0; // final x

  float A = x3a - 3.0*x2a + 3.0*x1a - x0a;
  float B = 3.0*x2a - 6.0*x1a + 3.0*x0a;
  float C = 3.0*x1a - 3.0*x0a;
  float D = x0a;

  float E = y3a - 3.0*y2a + 3.0*y1a - y0a;
  float F = 3.0*y2a - 6.0*y1a + 3.0*y0a;
  float G = 3.0*y1a - 3.0*y0a;
  float H = y0a;

  float currentt = x;
  for (int i=0; i < 5; i++){
    float currentx = xFromT (currentt, A,B,C,D);
    float currentslope = slopeFromT (currentt, A,B,C);
    currentt -= (currentx - x)*(currentslope);
  	currentt = clamp(currentt,0.0,1.0);
  }

  float y = yFromT (currentt,  E,F,G,H);
  return y;
}

//==============================================================================
//COLOR FUNCTIONS
vec3 rgb2hsb( in vec3 c ){
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz),
                 vec4(c.gb, K.xy),
                 step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r),
                 vec4(c.r, p.yzx),
                 step(p.x, c.r));
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)),
                d / (q.x + e),
                q.x);
}

//  Function from Iñigo Quiles
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
}

vec3 hue2rgb(float hue) {
  vec3 rgb = abs(hue * 6. - vec3(3, 2, 4)) * vec3(1, -1, -1) + vec3(-1, 2, 2);
  return clamp(rgb, 0., 1.);
}

vec3 hsl2rgb(vec3 hsl) {
  // Hue-Saturation-Lightness [0..1] to RGB [0..1]
  hsl = clamp(hsl, 0., 1.);

  vec3 rgb = hue2rgb(hsl.x);
  float c = (1. - abs(2. * hsl.z - 1.)) * hsl.y;
  return (rgb - 0.5) * c + hsl.z;
}

vec3 rgb2hsl(vec3 rgb){
    rgb = clamp(rgb, 0., 1.);
    float r = rgb.r;
    float g = rgb.g;
    float b = rgb.b;

    float max = (r > g && r > b) ? r : (g > b) ? g : b;
    float min = (r < g && r < b) ? r : (g < b) ? g : b;

    float h, s, l;
    h = s = l = (max + min) / 2.0;

    if (max == min) {
      h = s = 0.0;
    } else {
      float d = max - min;
      s = (l > 0.5) ? d / (2.0 - max - min) : d / (max + min);
      if (r > g && r > b)
        h = (g - b) / d + (g < b ? 6.0 : 0.0);
      else if (g > b)
        h = (b - r) / d + 2.0;
      else
        h = (r - g) / d + 4.0;
      h /= 6.0;
    }
    return vec3(h, s, l);
}


//drawing helpers
float plotX(vec2 st, float pct){
  return  smoothstep( pct-0.008, pct, st.y) -
          smoothstep( pct, pct+0.008, st.y);
}
float plotY(vec2 st, float pct){
  return  smoothstep( pct-0.008, pct, st.x) -
          smoothstep( pct, pct+0.008, st.x);
}

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

vec3 radial(vec2 st, vec2 pos, float rad) {
  vec3 color = vec3(0.0);
  pos = pos-st;
  pos /= rad;

  float r = length(pos)*2.0;
  float a = atan(pos.y,pos.x);

  float f = cos(a*3.);
  f = abs(cos(a*3.));
  f = abs(cos(a*2.5))*.5+.3;
  // f = abs(cos(a*12.)*sin(a*3.))*.8+.2;
  // f = smoothstep(-.5,1., cos(a*10.))*0.2+0.5;

  color = vec3( 1.-smoothstep(f,f+0.005,r) );
  return color;
}

vec3 polygon(vec2 st, vec2 pos, float rad) {
  float d = 0.0;
  st = st-pos;
  // Number of sides of your shape
  int N = 5;

  // Angle and radius from the current pixel
  float a = atan(st.x,st.y)+PI;
  float r = TWO_PI/float(N);

  // Shaping function that modulate the distance
  d = cos(floor(.5+a/r)*r-a)*length(st);
  d/=rad;

  vec3 color = vec3(1.0-smoothstep(.4,.405,d));
  // vec3 color = vec3(d);

  return color;
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

vec4 generateWaves(vec4 _col, vec2 _st, float t, float intensity) {
  float wavesAgr = 0.0;
  vec2 st = _st;

  float ranOff = mix(random(vec2(st.x*0.1, 1.0 - st.y * 0.05) - t*0.5), random(st), 0.15);

  //CENTER MAIN
  float wave1 = waves(st, t, 0.14, 75., 0.45, 0.0);
  float wave1x = 1.0- st.x + (wave1 * ranOff) ;
  wavesAgr = max(wave1x, wavesAgr);

  float wave1B = waves(st, t, 0.14, 75., 0.45, 5.5) * 0.25;
  float wave1Bx = 1.0-st.x + (wave1B);
  wavesAgr = max(wave1Bx, wavesAgr);

  // //LEFT
  float wave2 = waves(st, t, 0.1, 50., 0., 10.0);
  float wave2x = 1.0-st.x + (wave2 * ranOff) ;
  wavesAgr = max(wave2x, wavesAgr);


  vec2 wavesSt = vec2(1.0-wavesAgr, st.y);

  vec4 waveColor = texture2D(u_texture, wavesSt);

  return mix(_col, waveColor, intensity);

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
vec4 rainPattern(vec4 _col, vec2 _st, float t, float intensity, vec2 _size) {
  vec2 grid = vec2(_size.x, _size.y*0.025);
  _st *= grid;

  vec2 ipos = floor(_st);  // integer
  vec2 fpos = fract(_st);  // fraction

  float time = t;

  vec2 vel = vec2(0.,500. + time * min(grid.y,grid.x)); // time
  vel *= random(1.0+ipos.x) * randomNegPos(vec2(floor(ipos.x/5.))); // direction

  vec2 offset = vec2(1.0,0.);

  vec2 p = floor(_st + offset + vel);//floor

  float pattern = step(0.5, random(100. + p * .000001)+random(p.y)*0.5 );

  vec3 color = vec3(pattern);
  color *= -step(0.2, fpos.x);

  vec4 col = vec4(_col.rgb  - (color.x * 0.175), 1.0); //filter


  return mix(_col, col, intensity);
}

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

  float timeLoop = sin(u_time) * 2.0 * PI; // A full loop in the input space
  vec2 loopedST = st + vec2(cos(timeLoop), sin(timeLoop)) * 0.5;
  // Get noise value at these coordinates
  // float loopingTimeNoise = cnoise(loopedST * 10.0); // Scale for more detail

  vec4 originalColor = texture2D(u_originalImage, st);

    float staticLineTime = fract(u_time * 0.01);
  float staticFuzzTime = fract(u_time * .0004);
  vec2 staticSt = floor(orgSt*u_resolution);
  vec2 staticLines = vec2(staticSt.x * .0000045 - staticLineTime, staticSt.y * 0.00005);
  vec2 staticFuzz = floor(st * u_resolution * 0.66) - staticFuzzTime;
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
  // wavesColor = generateWaves(wavesColor, orgSt, u_time, waveIntensity);
  wavesColor = generateWavesHorizontal(wavesColor, orgSt, u_time, waveIntensity);

  vec4 color = wavesColor;

  color = fragment(color, orgSt, 0.5);

  color = pixelGlitch(color, orgSt, 0.5 - st.y * 0.2, u_resolution * 0.6);

  //rays
  float xTimeMult = 0.00007;
  vec2 rayRandom = orgSt * u_resolution * vec2(xTimeMult - fract(u_time*0.1) * xTimeMult*-0.4, 0.00005); //+ sin(u_time*0.0002)*0.01) ;
  float rayMult = 0.3 * (st.x - 0.3);
  color.r *= 1.0 - random(rayRandom) * rayMult;
  color.g *= 1.0 - random(rayRandom + 100.) * rayMult;
  color.b *= 1.0 - random(rayRandom + 200.) * rayMult;


  // //outline
  // float floorTime = floor(u_time * 4.0 + 10.);
  // if (random(floorTime) < 0.05 && mod(u_time * 8., 2.) < 0.3) {
  //   vec2 zoomedSt = zoomCoords(orgSt, 1.0 - fract(u_time) * 0.05);
  //   color = edgeDetection(color, zoomedSt, 1.0);
  // }

  //rct noise
  color.rgb += (tvRan * 0.12) ;

  float distFromCenter = distance(orgSt, vec2(0.5));
  color.rgb *= 1.0-smoothstep(0.5, .8, distFromCenter);


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




    `
  }
  return (
    <div ref={containerRef} className={className} id="RMX-dithered-sky-Sketch">   
      <P5Wrapper sketch={sketch} seed={seed} className="overflow-hidden h-full" transformOrigin="top center"/>
      <div id="RMX-dithered-sky-loadingBorder">
        <div id="RMX-dithered-sky-loadingBg">
          <div id="RMX-dithered-sky-loading">
            R3MIX
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(RMX_dithered_sky)