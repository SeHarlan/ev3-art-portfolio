import p5 from "p5"
import { FC, memo, useRef, useState } from "react"
import dynamic from "next/dynamic";
const P5Wrapper = dynamic(() => import('../P5Wrapper'), { ssr: false });
import { bindMethods, loadLargeImage } from "../utils";
import vertex from "../vertex.glsl";
import fxFrag from "./fxFrag.glsl";
import feedbackFrag from "./feedbackFrag.glsl";

p5.prototype.loadImage = loadLargeImage;

const RMX_dithered_sky = ({ className, menuOpen, seed, isActive }) => {
  const containerRef = useRef(null);
  const [lowframeRate, setLowframeRate] = useState(false)

  const sketch = (p5sketch, initSeed) => {
    
    
    if (typeof window === "undefined") return;

    const methodsToBind = [ 'createCanvas', 'createGraphics', 'colorMode', 'frameRate', 'random', 'randomSeed', 'noiseSeed', 'image', 'pixelDensity' ];
    const {createCanvas, createGraphics, colorMode, frameRate, random, randomSeed, noiseSeed, image, pixelDensity} = bindMethods(p5sketch, methodsToBind);
    //p5 vars
    let { HSL, WEBGL } = p5sketch;

    let seed, img;
    let fxShader, feedbackShader;
    let currentBuffer, previousBuffer, fxBuffer, gridBuffer, textBuffer;
    let FR = 30;
    let timeCounter = 0;
    let clearGlitch = false;
    let font
    let canv;

    let frameCount = 0
    const checkInterval = FR;
    const threshold = FR *0.66;
    let resetting = false
    let hasBeenReset = false

    const EV3binary = '01000101 01010110 00110011'

    const imageUrl = "https://arweave.net/RIWEFemW90nlHEc0kqfImQCGl7-Blh12tapOonzUB2E?ext=png"

    const folderPath = "components/p5/RMX-dithered-sky/"

    function preload() {
      try {
        document.getElementById(
          "RMX-dithered-sky-loadingBorder"
        ).style.display = "block";

        document.documentElement.style.setProperty(
          "--rmx-bg-color",
          "rgb(22, 9, 43)"
        );
        document.documentElement.style.setProperty(
          "--rmx-color1",
          "rgb(86,29,144)"
        );
        document.documentElement.style.setProperty(
          "--rmx-color2",
          "rgb(245,66,111)"
        )

        if (resetting)
          document.getElementById("RMX-dithered-sky-resetText").style.display =
            "block";

        fxShader = new p5.Shader(p5sketch._renderer, vertex, fxFrag);
        feedbackShader = new p5.Shader(
          p5sketch._renderer,
          vertex,
          feedbackFrag
        );
        img = p5sketch.loadImage(imageUrl);
        font = '"Kode Mono", monospace';
      } catch (error) {
        console.error(error)
      }
    }
    p5sketch.preload = preload

    function setup() {
      const { mouseX, mouseY, width, height } = p5sketch;

      document.getElementById("RMX-dithered-sky-loadingBorder").style.display = "none";
      document.getElementById("RMX-dithered-sky-resetText").style.display = "none";

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


      canv = createCanvas(canvWidth, canvHeight);
      frameRate(FR);
      colorMode(HSL)

      if(lowframeRate) pixelDensity(1)

      currentBuffer = createGraphics(canvWidth, canvHeight, WEBGL);
      previousBuffer = createGraphics(canvWidth, canvHeight, WEBGL);
      fxBuffer = createGraphics(canvWidth, canvHeight, WEBGL);
      gridBuffer = createGraphics(canvWidth, canvHeight);
      textBuffer = createGraphics(canvWidth, canvHeight);
      currentBuffer.noStroke();
      previousBuffer.noStroke();
      fxBuffer.noStroke();
      gridBuffer.noStroke();
      textBuffer.noStroke();

      currentBuffer.colorMode(HSL);
      previousBuffer.colorMode(HSL);
      fxBuffer.colorMode(HSL);
      gridBuffer.colorMode(HSL);
      textBuffer.colorMode(HSL);

      textBuffer.textFont(font);


      seed = random() * 1000;
      randomSeed(seed);
      noiseSeed(seed);

      currentBuffer.image(img, -width / 2, -height / 2, width, height);
    }
    p5sketch.setup = setup

    function resetThings() {
      setLowframeRate(true);
    }

    function checkFrameRate() {
      if (resetting) return false;
      frameCount++;
      const frameCheckPeriod = frameCount % checkInterval === 0;
      const frameCheckWindow = frameCount <= checkInterval * 4;
      if (!hasBeenReset && frameCount && frameCheckPeriod && frameCheckWindow) {
        let currentFrameRate = frameRate();
        if (currentFrameRate < threshold) {
          console.log('Warning: Frame rate has significantly dropped to ' + currentFrameRate + ' fps');
          resetThings()
          return false;
        } else {
          console.log('Frame rate is stable at ' + currentFrameRate + ' fps');
        }
      }
      return true;
    }

    p5sketch.draw = () => {
      const { mouseX, mouseY, width, height } = p5sketch;

      const goodFrameRate = checkFrameRate()
      if (!goodFrameRate) return;

      const spacer = height / 60;
      const margin = spacer * 4


      //DOT GRID
      currentBuffer.fill(65, 80, 93, 0.1);
      currentBuffer.noStroke()


      textBuffer.fill(65, 80, 93, 0.2);
      textBuffer.textSize(spacer * 0.6);

      if ((timeCounter * 2) % 4 < 0.1) {
        for (let y = margin; y < height - margin; y += spacer * 2) {
          for (let x = margin; x < width - margin; x += spacer * 2) {
            const xOff = x -  width / 2;
            const yOff = y - height / 2;
            currentBuffer.circle(xOff, yOff, spacer / 8)
          }
        }
        textBuffer.text(EV3binary, margin, height - margin);
      }
      currentBuffer.image(textBuffer, -width / 2, -height / 2, width, height);



      [fxShader, feedbackShader].forEach(shdr => {
        shdr.setUniform('u_texture', currentBuffer);
        shdr.setUniform('u_originalImage', img);
        shdr.setUniform('u_grid', gridBuffer);
        shdr.setUniform('u_resolution', [width, height]);
        shdr.setUniform('u_imageResolution', [img.width, img.height])
        shdr.setUniform('u_time', timeCounter);
        shdr.setUniform('u_seed', seed);
        shdr.setUniform('u_mouse', [mouseX, mouseY]);
        shdr.setUniform('u_clear', clearGlitch);
      })


      previousBuffer.shader(feedbackShader);
      previousBuffer.rect(-width / 2, -height / 2, width, height);

      // Display the result on the main canvas
      fxBuffer.shader(fxShader);
      fxBuffer.rect(-width / 2, -height / 2, width, height);
      image(fxBuffer, 0, 0, width, height);

      // Swap buffers
      currentBuffer.image(previousBuffer, -width / 2, -height / 2, width, height);
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

  }
  return (
    <div ref={containerRef} className={className + " RMX-Sketch"} >
      <P5Wrapper sketch={sketch} seed={seed} className="h-full" transformOrigin="top center" />
      <div id="RMX-dithered-sky-loadingBorder" className="RMX-loadingBorder">
        <div className="RMX-loadingBg">
          <div className="RMX-loading">
            R3MIX
          </div>
        </div>
      </div>
      <p id="RMX-dithered-sky-resetText" className="RMX-resetText"
      style={{
        display: lowframeRate ? "block" : "none",
        position: "absolute",
        bottom: "30%",
      }}>
        Low framerate detected. Resetting with lower image quality...
      </p>
    </div>
  )
}

export default memo(RMX_dithered_sky)