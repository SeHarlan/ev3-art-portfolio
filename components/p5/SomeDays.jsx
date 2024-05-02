import * as HME from "h264-mp4-encoder";
import { memo, useRef } from "react";
import dynamic from "next/dynamic";
import { WINDOWS } from "@/context/WindowsProvider";
const P5Wrapper = dynamic(() => import('./P5Wrapper'), { ssr: false });

const Drifting = ({ className, menuOpen, seed, isActive }) => {
  const containerRef = useRef(null);

  const sketch = (p5sketch, initSeed) => { 
    let video
    const prevVideoArray = []
    let seed
    let scl
    let shdr
    let currentBuffer, videoBuffer;
    let cameraAccess = false
    let startButton, containerDiv, redDot


    //global rec stuff
    let ctx, drawingGraphics;
    let encoder
    let canvas;
    let recording = false;
    let filename = "Drifting.mp4"
    let recCounter = 0
    let timeCounter = 0
    let recSecLength = 12
    const FR = 12

    const roundToEven = (num) => {
      return Math.round(num / 2) * 2;
    }

    p5sketch.setup = () => {
      const windowWidth = containerRef.current.clientWidth
      const windowHeight = containerRef.current.clientHeight

      // const minDim = p5sketch.min(windowHeight, windowWidth)
      // p5sketch.createCanvas(roundToEven(minDim * 0.6), roundToEven(minDim * 0.9));
      p5sketch.createCanvas(roundToEven(windowWidth), roundToEven(windowHeight))
      p5sketch.pixelDensity(1);
      p5sketch.colorMode(p5sketch.HSL)
      p5sketch.frameRate(FR)

      const seed = initSeed || new Date().getTime()
      console.log("seed", seed)
      p5sketch.randomSeed(seed)
      p5sketch.noiseSeed(seed)

      video = p5sketch.createCapture(p5sketch.VIDEO);
      video.size(windowWidth/10, windowWidth/10);
      video.hide()

      // checkCameraPermission();

      currentBuffer = p5sketch.createGraphics(p5sketch.width, p5sketch.height, p5sketch.WEBGL);
      currentBuffer.noStroke();

      videoBuffer = p5sketch.createGraphics(p5sketch.width, p5sketch.height, p5sketch.WEBGL);
      videoBuffer.noStroke();

      shdr = currentBuffer.createShader(vert, frag);


      // startButton = document.getElementById('startButton')
      // startButton.addEventListener('click', () => {
      //   video = p5sketch.createCapture(p5sketch.VIDEO);
      //   video.size(60, 90);
      //   video.hide()
      // })

      // containerDiv = document.getElementById('containerDiv')
      redDot = document.getElementById('redDot')

    }

    p5sketch.draw = () => {


      //Mouse angle
      const centerX = p5sketch.width / 2
      const centerY = p5sketch.height / 2

      let deltaX = p5sketch.mouseX - centerX;
      let deltaY = p5sketch.mouseY - centerY;

      // Calculate the angle in radians
      const mouseAngle = p5sketch.atan2(deltaY, deltaX)

      videoBuffer.image(video, -p5sketch.height / 2, -p5sketch.height / 2, p5sketch.height, p5sketch.height);

      shdr.setUniform('seed', seed);
      shdr.setUniform('texture', videoBuffer);
      shdr.setUniform('resolution', [p5sketch.width, p5sketch.height]);
      shdr.setUniform('video_resolution', [video.width, video.height])
      shdr.setUniform('time', timeCounter * 1000)//millis());

      timeCounter += 1 / FR

      currentBuffer.shader(shdr);
      currentBuffer.rect(0, 0, p5sketch.width, p5sketch.height);


      p5sketch.image(currentBuffer, 0, 0, p5sketch.width, p5sketch.height);

      if (recording) {
        const ctx = p5sketch.drawingContext
        encoder.addFrameRgba(ctx.getImageData(0, 0, p5sketch.width, p5sketch.height).data);

        // renderingDiv.style.width = `${ (recCounter / recSecLength) * 100 }%`
        recCounter += 1 / FR
        if (recCounter >= recSecLength) {
          stopRecording()
        }
      }

    }


    p5sketch.keyPressed = () => {
      if (menuOpen.current || !isActive.current) return
      if (p5sketch.key == "s" || p5sketch.key == "S") {
        p5sketch.save("drifting")
      }
      if (p5sketch.key == "r" || p5sketch.key == "R") {
        if (!recording) {
          startRecording()
        }
      }
    }

    async function checkCameraPermission() {
      try {
        // Check for the camera permission status
        const permissionStatus = await navigator.permissions.query({ name: 'camera' });

        const handle = () => {
          // Check the permission state
          if (permissionStatus.state === 'granted') {
            handleAccessGranted();
          } else if (permissionStatus.state === 'prompt') {
            console.log('Camera access has not been granted yet.');
          } else if (permissionStatus.state === 'denied') {
            handleAccessDenied();
          }
        }

        handle()

        // Optionally listen for changes on the permission status
        permissionStatus.onchange = () => {
          handle();
        };

      } catch (error) {
        console.error('Error checking camera permission:', error);
      }
    }

    function handleAccessDenied() {
      console.log('Camera access has been denied.');
      containerDiv.style.opacity = 100;
    }
    function handleAccessGranted() {
      console.log('Camera access has been granted.');
      containerDiv.style.opacity = 0;
    }

    const download = (url, filename) => {
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename || "download";
      anchor.click();
    };
    async function stopRecording() {

      encoder.finalize();
      const uint8Array = encoder.FS.readFile(encoder.outputFilename);
      download(URL.createObjectURL(new Blob([uint8Array], { type: "video/mp4" })))
      encoder.delete();


      recording = false
      console.log("ended")
      // renderingDivContainer.style.opacity = 0
      redDot.style.opacity = 0;
    }
    async function startRecording() {
      redDot.style.opacity = 1;
      console.log("started")
      // renderingDivContainer.style.opacity = 1


      encoder = await HME.createH264MP4Encoder()
      encoder.frameRate = FR
      encoder.width = p5sketch.width;
      encoder.height = p5sketch.height;
      encoder.quantizationParameter = 10;
      encoder.outputFilename = filename
      encoder.initialize();


      recording = true
      recCounter = 0
    }
    const vert = `#ifdef GL_ES
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
                      }`
    const frag = `
          #ifdef GL_ES
          precision mediump float;
          #endif

          uniform float seed;
          uniform sampler2D texture; // input image texture
          uniform vec2 resolution;  // size of the canvas
          uniform vec2 video_resolution;
          uniform float time;       // for animations if you want

          #define PI 3.14159265359
          #define TWO_PI 6.28318530718
          #define EPSILON 0.00001
          #define min_param_a 0.0 + EPSILON
          #define max_param_a 1.0 - EPSILON

          varying vec2 vTexCoord;

          vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

          float random(in vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453);
          }
          float random(in float x){
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

          float map(float value, float inputMin, float inputMax, float outputMin, float outputMax) {
              return outputMin + ((value - inputMin) / (inputMax - inputMin) * (outputMax - outputMin));
          }

          float easeInOutCubic(float x) {
            return x < 0.5 ? 4. * x * x * x : 1. - pow(-2. * x + 2., 3.) / 2.;
          }


          float waves(vec2 st, float amplitude, float frequency, float start, float noiseOff) {
              float t = time * -0.002;

              start = start - snoise(st*2. + t / 10. + noiseOff) * 0.12;

              frequency = frequency + snoise(vec2(st.y * 3. + t/20.,st.x) + noiseOff) * 20.;

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


          void main() {
            vec2 st = vTexCoord;
            vec2 orgSt = st;

            float t = (time * 0.00001);//fract

            vec2 stRev = vec2(1.0-st.x, st.y);
            vec4 color = texture2D(texture, stRev);

            float gray = (color.r + color.g + color.b) / 3.0;

            // Drifting WAVES
            float wavesAgr = 0.0;

            float ranOff = mix(random(vec2(st.x*0.1, 1.0 - st.y * 0.05) - t), random(st), 0.25);

          //CENTER MAIN
            float wave1 = waves(st, 0.15, 75., 0.45, 0.0);
            float wave1x = 1.0 - st.x + (wave1 * ranOff) ;
            wavesAgr = max(wave1x, wavesAgr);
            // wavesAgr = max(wave1, wavesAgr);

            float wave1B = waves(st, 0.13, 75., 0.45, 5.5) * 0.5;
            float wave1Bx = 1.0 - st.x + (wave1B * ranOff);
            wavesAgr = max(wave1Bx, wavesAgr);
            // wavesAgr = max(wave1B, wavesAgr);


          //LEFT
            float wave2 = waves(st, 0.1, 50., 0., 10.0) *0.45;
            float wave2x = 1.0 - st.x + (wave2 * ranOff) ;
            wavesAgr = max(wave2x, wavesAgr);
            // wavesAgr = max(wave2, wavesAgr);


            //Middle small
            float wave3 = waves(st, 0.1, 30., 0.4, 20.0) * .5;
            float wave3x = 1.0 - st.x + (wave3 * ranOff) ;
            wavesAgr = max(wave3x, wavesAgr);

            vec2 wavesSt = vec2(wavesAgr, st.y);

            vec4 waveColor = texture2D(texture, wavesSt);

            color = mix( color, waveColor, 1.25);


            //Block noise
            // vec2 block = floor(wavesSt * resolution * 0.2);
            // float tBlock = floor(time * 0.005);
            // if(random(block - tBlock * randomNegNeutralPos(block)) < 0.35) {
            //   wavesSt.x += random(block + 10.) * 0.05;
            //   wavesSt.y -= random(block + 20.) * 0.05;
            // }


            vec4 blockColor = texture2D(texture, wavesSt);

            color = mix( color, blockColor, .3);

            // GRAY
            gray = (color.r + color.g + color.b) / 3.0;
            vec4 grayImage = vec4(vec3(gray), 1.0);



            // //Block noise Colored
            vec2 block = floor(wavesSt * resolution * 0.5);
            float tBlock = floor(time * 0.005);
            if(random(block - tBlock * randomNegNeutralPos(block)) < 0.35) {
              wavesSt.x += random(block + 10.) * 0.05;
              wavesSt.y -= random(block + 20.) * 0.05;
              vec4 blockColor = texture2D(texture, wavesSt);

              grayImage = mix(blockColor, grayImage, 0.5);
            }


            //gritty/sparkle
            float gritMult = .07;
            float grayMult = map(gray, 0., 1., 2.0, -0.5);
            vec2 gritBlock = floor(st * resolution * .25);
            gritBlock.x-=t*0.3;
            gritBlock.y-=t*0.01;
            grayImage.r += random(gritBlock + 10.) * gritMult * grayMult;
            grayImage.g += random(gritBlock + 20.) * gritMult * grayMult;


            //TV static
            float tvRan = random(vec2(st.x * 0.001 - t*2., st.y * 0.15));
            grayImage.rgb += tvRan * 0.15;


            // grayImage.rgb+=0.05;
            grayImage.rgb*=1.1;
            float distFromCenter = distance(orgSt, vec2(0.5));
            grayImage.rgb *= 1.0-smoothstep(0.5, .75, distFromCenter);


            gl_FragColor = grayImage;
          }

        ` 
  }

  return (
    <div ref={containerRef} className={className} id="DriftingSketch">
      <P5Wrapper sketch={sketch} seed={seed} windowKey={WINDOWS.DRIFTING} />
      <div id="redDot"></div>
      {/* <div class="classic-border" id="containerDiv">
        <p>Please grant camera access to begin drifting</p>
        <button id="startButton" class="classic-button">Grant access</button>
      </div> */}
    </div>
    )
}

export default memo(Drifting);
