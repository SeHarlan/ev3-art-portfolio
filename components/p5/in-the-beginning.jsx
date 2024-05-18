import p5 from "p5"
import { FC, memo, useRef, useState } from "react"
import dynamic from "next/dynamic";
const P5Wrapper = dynamic(() => import('./P5Wrapper'), { ssr: false });


const InTheBeginning = ({ className, menuOpen, seed, isActive }) => { 
  const containerRef = useRef(null);

  const sketch = (p5sketch, initSeed) => {
    if (typeof window === "undefined") return;

   
    let reactionShader, renderShader;
    let currentBuffer, previousBuffer;
    let renderBuffer

    let seed;

    let uTime = 0
    let kill = false
    let eraseMode = false
    let FR = 30

    let reactionParams = {
      dA_1: 1.01,
      dB_1: .9,
      feed_1: 0.125,
      k_1: 0.012,
      t_1: 1.0,

      dA_2: 0.45,
      dB_2: 1.295,
      feed_2: 0.21,
      k_2: 0.01,
      t_2: 1
    }

    const SHAPES = {
      circular: 0,
      square: 1,
      noise: 2,
      stripes: 3,
      dots: 4,
      boxes: 5,
      waves: 6,
    }
    let shape


    p5sketch.preload = () => {
      reactionShader = new p5.Shader(p5sketch._renderer, vertex, reaction);
      renderShader = new p5.Shader(p5sketch._renderer, vertex, render);
    }

    p5sketch.setup = () => {

      const windowWidth = containerRef.current.clientWidth;
      const windowHeight = containerRef.current.clientHeight
      const canvWidth = windowWidth;
      const canvHeight = windowHeight;

      p5sketch.createCanvas(canvWidth, canvHeight);
      p5sketch.pixelDensity(1);
      p5sketch.frameRate(FR)



      renderBuffer = p5sketch.createGraphics(canvWidth, canvHeight, p5sketch.WEBGL);
      currentBuffer = p5sketch.createGraphics(canvWidth, canvHeight, p5sketch.WEBGL);
      previousBuffer = p5sketch.createGraphics(canvWidth, canvHeight, p5sketch.WEBGL);
      renderBuffer.noStroke();
      currentBuffer.noStroke();
      previousBuffer.noStroke();

      seed = initSeed || Math.random() * 2000;

      p5sketch.noiseSeed(seed);
      p5sketch.randomSeed(seed);

      shape = (() => {
        const chance = p5sketch.random();
        if (chance < 0.3) return SHAPES.circular
        if (chance < 0.6) return SHAPES.noise
        return p5sketch.random(Object.values(SHAPES))
      })();
    }


    p5sketch.keyPressed = () => {
      if (menuOpen.current || !isActive.current) return

      if (p5sketch.key == 'e') {
        eraseMode = true
      }
      if (p5sketch.key == 'k') {
        kill = !kill
      }
    }

    p5sketch.keyReleased = () => {
      if (p5sketch.key == 'e') {
        eraseMode = false
      }
    }

    p5sketch.mousePressed = () => {
      drawCircle()
    }
    
    p5sketch.mouseDragged = () => {
      drawCircle()
    }
    p5sketch.touchStarted = () => {
      eraseMode = !eraseMode;
      drawCircle()
    }
    p5sketch.touchMoved = () => {
      drawCircle()
    }


    function drawCircle() {
      const posX = p5sketch.mouseX || p5sketch.touches[0]?.x;
      const posY = p5sketch.mouseY || p5sketch.touches[0]?.y;

      if (eraseMode) {
        currentBuffer.fill(255, 255, 0)
        currentBuffer.circle(posX - p5sketch.width / 2, posY - p5sketch.height / 2, 60)
      } else {
        circleFade()
      }
    }

    function circleFade(col = p5sketch.color(0, 0, 255)) {
      const posX = p5sketch.mouseX || p5sketch.touches[0]?.x;
      const posY = p5sketch.mouseY || p5sketch.touches[0]?.y;
      for (let i = 0; i < 10; i++) {
        col.setAlpha(255 - i * 25.5)
        currentBuffer.fill(col)
        currentBuffer.circle(posX - p5sketch.width / 2, posY - p5sketch.height / 2, 30 + i * 5)
      }
    }

    p5sketch.draw = () => {
      // Bind the current buffer's texture to the shader
      reactionShader.setUniform('u_seed', seed);
      reactionShader.setUniform("kill", kill)
      reactionShader.setUniform('u_texture', currentBuffer);
      reactionShader.setUniform('u_resolution', [p5sketch.width, p5sketch.height])
      reactionShader.setUniform('u_time', uTime);

      reactionShader.setUniform('u_shape', shape)

      reactionShader.setUniform('dA_1', reactionParams.dA_1);
      reactionShader.setUniform('dB_1', reactionParams.dB_1);
      reactionShader.setUniform('feed_1', reactionParams.feed_1);
      reactionShader.setUniform('k_1', reactionParams.k_1);
      reactionShader.setUniform('t_1', reactionParams.t_1);

      reactionShader.setUniform('dA_2', reactionParams.dA_2);
      reactionShader.setUniform('dB_2', reactionParams.dB_2);
      reactionShader.setUniform('feed_2', reactionParams.feed_2);
      reactionShader.setUniform('k_2', reactionParams.k_2);
      reactionShader.setUniform('t_2', reactionParams.t_2);

      previousBuffer.shader(reactionShader);
      previousBuffer.rect(-p5sketch.width / 2, -p5sketch.height / 2, p5sketch.width, p5sketch.height);

      // Display the result on the main canvas
      renderShader.setUniform('u_texture', previousBuffer);
      renderShader.setUniform('u_resolution', [p5sketch.width, p5sketch.height])
      renderShader.setUniform('u_time', uTime);
      renderShader.setUniform('u_mouse', [p5sketch.mouseX, p5sketch.mouseY])
      renderBuffer.shader(renderShader);
      renderBuffer.rect(-p5sketch.width / 2, -p5sketch.height / 2, p5sketch.width, p5sketch.height);

      p5sketch.image(renderBuffer, 0, 0, p5sketch.width, p5sketch.height);

      // Swap buffers
      currentBuffer.image(previousBuffer, -p5sketch.width / 2, -p5sketch.height / 2, p5sketch.width, p5sketch.height);
      previousBuffer.clear();

      uTime += 1 / FR;
    }

    // p5sketch.windowResized = () => {
    //   p5sketch.resizeCanvas(windowWidth, windowHeight);
    //   renderBuffer.resizeCanvas(windowWidth, windowHeight);
    //   currentBuffer.resizeCanvas(windowWidth, windowHeight);
    //   previousBuffer.resizeCanvas(windowWidth, windowHeight);

    //   uTime = 0
    // }

    const vertex = `
    #ifdef GL_ES
    precision mediump float;
    #endif

    attribute vec3 aPosition;
    attribute vec2 aTexCoord;

    varying vec2 vTexCoord;

    attribute vec4 a_position;

    void main() {
      vTexCoord = aTexCoord;
      vTexCoord.y = 1.0 - vTexCoord.y;

      vec4 positionVec4 = vec4(aPosition, 1.0);
      positionVec4.xy = positionVec4.xy * 2.0 - 1.0;

      gl_Position = positionVec4;
    }
    `
    const reaction = `
    #ifdef GL_ES
    precision mediump float;
    #endif

    uniform sampler2D u_texture; // input image texture
    uniform float u_time;       // for animations if you want
    uniform vec2 u_resolution;  // size of the canvas
    uniform float u_seed;
    uniform int u_shape;
    uniform bool kill;

    uniform float dA_1;
    uniform float dB_1;
    uniform float feed_1;
    uniform float k_1;
    uniform float t_1;

    uniform float dA_2;
    uniform float dB_2;
    uniform float feed_2;
    uniform float k_2;
    uniform float t_2;



    varying vec2 vTexCoord;

    #define PI 3.14159265359
    #define TWO_PI 6.28318530718
    #define EPSILON 0.00001

    float random(in vec2 st) {
      return fract(sin(dot(st.xy + vec2(u_seed), vec2(12.9898, 78.233))) * 43758.5453);
    }
    float random(in float x){
        return fract(sin(x + u_seed)*43758.5453);
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

    vec2 random2(vec2 st){
        st = vec2( dot(st,vec2(127.1,311.7)),
                  dot(st,vec2(269.5,183.3)) );
        return -1.0 + 2.0*fract(sin(st)*43758.5453123);
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

        // return n;
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

    float map(float value, float inputMin, float inputMax, float outputMin, float outputMax) {
        return outputMin + ((value - inputMin) / (inputMax - inputMin) * (outputMax - outputMin));
    }

    float gain( float x, float k ) {
      float a = 0.5*pow(2.0*((x<0.5)?x:1.0-x), k);
      return (x<0.5)?a:1.0-a;
    }

    vec2 getOffset(vec2 st, vec2 offset) {
      return clamp(st + (offset / u_resolution), 0., 1.);
    }

    vec4 lap(vec2 st) {
      vec4 v = vec4(0.0);

      float m = 1.;
      v += texture2D(u_texture, getOffset(st, vec2(0.0, 0.0))) * -1.0 ;

      v += texture2D(u_texture, getOffset(st, vec2(1.0, 0.0))) * 0.2 * m;
      v += texture2D(u_texture, getOffset(st, vec2(-1.0, 0.0))) * 0.2 * m;
      v += texture2D(u_texture, getOffset(st, vec2(0.0, 1.0))) * 0.2 * m;
      v += texture2D(u_texture, getOffset(st, vec2(0.0, -1.0))) * 0.2 * m;

      v += texture2D(u_texture, getOffset(st, vec2(1.0, 1.0))) * 0.05 * m;
      v += texture2D(u_texture, getOffset(st, vec2(-1.0, -1.0))) * 0.05 * m;
      v += texture2D(u_texture, getOffset(st, vec2(-1.0, 1.0))) * 0.05 * m;
      v += texture2D(u_texture, getOffset(st, vec2(1.0, -1.0))) * 0.05 * m;

      return v;
    }

    float rect(in vec2 st, in vec2 size){
      size = 0.25-size*0.25;
        vec2 uv = smoothstep(size,size+size*vec2(0.002),st*(1.0-st));
      return uv.x*uv.y;
    }

    float circle(in vec2 _st){
        vec2 uv = _st;
        vec2 center = vec2(0.5, 0.5);
        if (u_resolution.x > u_resolution.y) {
        float ratio = u_resolution.x / u_resolution.y;
          uv.x *= ratio;
          center.x *= ratio;
        } else {
          float ratio = u_resolution.y / u_resolution.x;
          uv.y *= ratio;
          center.y *= ratio;

        }
        float dist = distance(uv, center);
        float piMult = floor(40. * random(1.0));
        dist-= (cos(_st.x*PI*piMult) + sin(_st.y*PI*piMult)) * 0.01;
        return dist;
    }
    void main() {
      vec2 st = vTexCoord;

      float chunk = 20.0;
      vec2 blockSize = vec2(chunk / u_resolution.x, chunk / u_resolution.y);
      vec2 blockPos = floor(st / blockSize);

      vec4 image = texture2D(u_texture, st);



      if (u_time < .1) {
        vec4 color = vec4(0.0, 0.0, 0.0, 1.0);

        //MAIN SHAPE

        if (u_shape == 0) {
          // circular
          float threshold = 0.2;
          float dist = circle(st);
          if (dist > threshold) {
            color.r = 1.0;
          } else {
            color.b = 1.0;
          }
        }
        if (u_shape == 1) {
          // rect
          if(rect(st, blockSize*10.0) < 1.0) {
            color.r = 1.0;
          } else {
            color.b = 1.0;
          }
        }
        if (u_shape == 2) {
          // noise field
          float noiseMult = floor(2.0 + random(vec2(u_seed)) * 8.);
          if(noise(st * noiseMult + u_seed) < 0.6) {
            color.r = 1.0;
          } else {
            color.b = 1.0;
          }
        }
        if (u_shape == 3) {
          // stripes
          float numStripes = floor(4.0 + random(vec2(u_seed)) * 6.);
          float directionMult = randomNegPos(vec2(u_seed));
          if(mod((st.y + st.x * directionMult) * numStripes, 2.0) < 1.5) {
            color.r = 1.0;
          } else {
            color.b = 1.0;
          }
        }
        if (u_shape == 4) {
          // dots
          float numDots = floor(2.0 + random(vec2(u_seed)) * 8.);
          vec2 dotSt = fract(st * numDots);
          float threshold = 0.25;

          float dist = circle(dotSt);

          if (dist > threshold) {
            color.r = 1.0;
          } else {
            color.b = 1.0;
          }
        }
        if (u_shape == 5) {
          // boxes
          float numBoxes = floor(2.0 + random(vec2(u_seed)) * 8.);
          vec2 boxSt = fract(st * numBoxes);

          if (rect(boxSt, blockSize*10.0) < 1.0) {
            color.r = 1.0;
          } else {
            color.b = 1.0;
          }
        }
        if (u_shape == 6) {
          // waves
          float xMult = floor(2.0 + random(vec2(u_seed)) * 6.);
          float yMult = floor(2.0 + random(vec2(u_seed+100.)) * 6.);
          float xCurve = st.y*yMult*5. + cos(st.x * PI * xMult);
          float yCurve = st.x*xMult*5. + sin(st.y * PI * yMult);
          if(mod((xCurve + yCurve) * .5, 2.0) < 1.5) {
            color.r = 1.0;
          } else {
            color.b = 1.0;
          }
        }





        //add outline
        vec2 margin = u_resolution * 0.00001;
        bool inOutline = st.x < margin.y || st.x > 1.0-margin.y || st.y < margin.x || st.y > 1.0-margin.x;
        if(inOutline) {
          color.b = 1.0;
        }

        //SUB reaction SPLIT

        //  sine wave split
        // float amp = 4.0;
        // float sineX = (amp + sin(st.x*TWO_PI*2.))/(amp*2.);
        // float base = (sineX+st.y)/2.;

        //random sun reaction split
        float base;
        bool noReaction = color.b ==0.;
        if( noReaction && random(blockPos + u_seed + 100.) > 0.5){
          base = 1.0;
        } else {
          base = 0.0;
        }

        color.g = base;

        gl_FragColor = color;
        return;
      }

      float interp = gain(image.g, 5.);

      if(kill) {
        interp = 1.0 - interp;
      }

      float dA = mix(dA_1, dA_2,interp);
      float dB = mix(dB_1, dB_2,interp);
      float feed = mix(feed_1, feed_2,interp);
      float k = mix(k_1, k_2,interp);
      float t  = mix(t_1, t_2,interp);

      float a = image.r;
      float b = image.b;


      vec4 lapVec = lap(st);

      a = a + (dA * lapVec.r - a*b*b + feed*(1.0-a)) * t;
      b = b + (dB * lapVec.b + a*b*b - (k+feed)*b) * t;


      // float cA = 1.25; //keep this
      float cA = 1.3;
      float g = interp;

      // float cFeed = k * .99;
      // float cK = feed * 1.01;
      float cFeed = k * 1.1;
      float cK = feed * .99;
      float bK = b*a*a;

      float fd = cFeed*(1.0-b);
      float kl = (cK+cFeed)*a;

      // g = g + (cA * lapVec.g - bK + kl - fd); //distrubute the interpolation value
      g = g + (cA * lapVec.g - bK + kl - fd);

      vec4 color = vec4(a, g, b, 1.0);

      gl_FragColor = color;
    }

    `


    const render = `
    #ifdef GL_ES
    precision mediump float;
    #endif

    uniform sampler2D u_texture; // input image texture
    uniform float u_time;       // for animations if you want
    uniform vec2 u_resolution;  // size of the canvas
    uniform float u_seed;
    uniform vec2 u_mouse;       // mouse position in screen coordinates

    varying vec2 vTexCoord;

    #define EPSILON 0.00001
    #define min_param_a 0.0 + EPSILON
    #define max_param_a 1.0 - EPSILON

    float random(in vec2 st) {
      return fract(sin(dot(st.xy + vec2(u_seed), vec2(12.9898, 78.233))) * 43758.5453);
    }
    float random(in float x){
        return fract(sin(x + u_seed)*43758.5453);
    }

    float randomNegPos(vec2 st) {
      return random(st) < 0.5 ? -1.0 : 1.0;
    }

    float map(float value, float inputMin, float inputMax, float outputMin, float outputMax) {
        return outputMin + ((value - inputMin) / (inputMax - inputMin) * (outputMax - outputMin));
    }
    float gain( float x, float k ) {
      float a = 0.5*pow(2.0*((x<0.5)?x:1.0-x), k);
      return (x<0.5)?a:1.0-a;
    }
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
    void main() {
      vec2 st = vTexCoord;

      vec2 norm_mouse = u_mouse / u_resolution;
      float screenAspectRatio = u_resolution.x / u_resolution.y;

      vec2 correctedMousePos = vec2(norm_mouse.x * screenAspectRatio, norm_mouse.y );
      vec2 correctedUV = vec2(st.x * screenAspectRatio, st.y );

      float chunk = 3.0;
      vec2 blockSize = vec2(chunk / u_resolution.x, chunk / u_resolution.y);
      vec2 blockPos = floor(st / blockSize);


      vec4 image = texture2D(u_texture, st);

      vec3 val = vec3(gain(image.b ,2.)*1.2);
      // if (val.r > .9) val-= val.r * 0.25;
      if (val.r > .8) val-= map(val.r, 0.8, 1.0, 0.0, 0.2);
      val+=0.06;

      if(u_time < 1.){
        val -= 1.0-u_time;
      }

      vec4 color = vec4(val, 1.0);
    //tv static
      float staticLineTime = fract(u_time * 0.01);
      float staticFuzzTime = fract(u_time * .0001);
      vec2 staticSt = floor(st*u_resolution);
      vec2 staticLines = vec2(staticSt.x * .00005 - staticLineTime, 1.0-staticSt.y * 0.00005);
      vec2 staticFuzz = floor(st * u_resolution * 0.33) - staticFuzzTime;
      float tvRan = mix(random(staticLines) * randomNegPos(staticLines) , random(staticFuzz),0.4);

      //tv static
      color.rgb += (tvRan * 0.15) ;

      //vignette
      float distFromCenter = distance(st, vec2(0.5));
      color.rgb *= 1.0-smoothstep(0.5, .75, distFromCenter);



      gl_FragColor = color;
    }

    `
    
  }
  return (
    <div ref={containerRef} className={className} id="in-the-beginning-Sketch">   
      <P5Wrapper sketch={sketch} seed={seed} />
    </div>
  )
}

export default memo(InTheBeginning)