import p5 from "p5"
import { FC, memo, useRef, useState } from "react"
import dynamic from "next/dynamic";
const P5Wrapper = dynamic(() => import('../../P5Wrapper'), { ssr: false });
import { bindMethods, loadLargeImage } from "../../utils";
import vertex from "../../vertex.glsl";
import fxFrag from "./fxFrag.glsl";
import feedbackFrag from "./feedbackFrag.glsl";

p5.prototype.loadImage = loadLargeImage;

const CSS_RMX_PREFIX = "RMX-7years-"

const RMX_7Years = ({ className, menuOpen, seed, isActive }) => {
  const containerRef = useRef(null);
  const [lowframeRate, setLowframeRate] = useState(false)

  const sketch = (p5sketch, initSeed) => {
    if (typeof window === "undefined") return;
    if (!containerRef.current) return;

    const methodsToBind = ['createCanvas', 'createGraphics', 'colorMode', 'frameRate', 'random', 'randomSeed', 'noiseSeed', 'image', 'pixelDensity'];
    const { createCanvas, createGraphics, colorMode, frameRate, random, randomSeed, noiseSeed, image, pixelDensity } = bindMethods(p5sketch, methodsToBind);
    //p5 vars
    let { HSL, WEBGL } = p5sketch;
    const EV3binary = '01000101 01010110 00110011'
    const imageUrl =
      "https://arweave.net/DbHzwgExyOiV0NJ8BXsf1hIsoi0bdwyYq_gpPooV1fI?ext=png";

    let FR = 30;
    const checkInterval = FR;
    const threshold = FR * 0.66;
    let resetting = false
    let hasBeenReset = false
    let timeCounter = 0;

    let seed, img;
    let fxShader, feedbackShader;
    let currentBuffer, previousBuffer, fxBuffer, gridBuffer, textBuffer;
    let clearGlitch = false;
    let font;

    function preload() {
      try {

        document.documentElement.style.setProperty(
          "--rmx-bg-color",
          "hsl(97, 60%, 6%)"
        );
        document.documentElement.style.setProperty(
          "--rmx-color1",
          "hsl(39,64%,73%)"
        );
        document.documentElement.style.setProperty(
          "--rmx-color2",
          "hsl(10,100%,39%)"
        );

       

        fxShader = new p5.Shader(p5sketch._renderer, vertex, fxFrag);
        feedbackShader = new p5.Shader(p5sketch._renderer, vertex, feedbackFrag);
        img = p5sketch.loadImage(imageUrl)
        font = '"Kode Mono", monospace'

      } catch (error) {
        console.error(error)
      }
    }
    p5sketch.preload = preload

    function setup() {
      const loadingBorder = document.getElementById(CSS_RMX_PREFIX + "loadingBorder")
      if (loadingBorder) loadingBorder.style.display = "none";
  
      const resetText = document.getElementById(CSS_RMX_PREFIX + "resetText");
      if (resetText) resetText.style.display = "none";

      const { mouseX, mouseY, width, height } = p5sketch;


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

      canvWidth = Math.floor(canvWidth / 2) * 2;
      canvHeight = Math.floor(canvHeight / 2) * 2;

      img.resize(canvWidth, canvHeight)
      createCanvas(canvWidth, canvHeight);
      frameRate(FR);
      colorMode(HSL)

      if (lowframeRate) pixelDensity(1)

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



    p5sketch.draw = () => {
      const { mouseX, mouseY, width, height } = p5sketch;

      const goodFrameRate = checkFrameRate();
      if (!goodFrameRate) return;

      [fxShader, feedbackShader].forEach((shdr) => {
        shdr.setUniform("u_texture", currentBuffer);
        shdr.setUniform("u_originalImage", img);
        shdr.setUniform("u_grid", gridBuffer);
        shdr.setUniform("u_resolution", [width, height]);
        shdr.setUniform("u_imageResolution", [img.width, img.height]);
        shdr.setUniform("u_time", timeCounter);
        shdr.setUniform("u_seed", seed);
        shdr.setUniform("u_mouse", [mouseX, mouseY]);
        shdr.setUniform("u_clear", clearGlitch);
      });

      previousBuffer.shader(feedbackShader);
      previousBuffer.rect(-width / 2, -height / 2, width, height);

      // Display the result on the main canvas
      fxBuffer.shader(fxShader);
      fxBuffer.rect(-width / 2, -height / 2, width, height);

      image(fxBuffer, 0, 0, width, height);

      // Swap buffers
      currentBuffer.image(
        previousBuffer,
        -width / 2,
        -height / 2,
        width,
        height
      );
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

    function resetThings() {
      const resetText = document.getElementById(CSS_RMX_PREFIX + "resetText");
      if (resetText) resetText.style.display = "block";

      const loadingBorder = document.getElementById(CSS_RMX_PREFIX + "loadingBorder")
      if (loadingBorder) loadingBorder.style.display = "block";

      setLowframeRate(true);
    }

    function checkFrameRate() {
      if (resetting) return false;
      const frameCount = Math.floor(timeCounter * FR);
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

  }
  
  return (
    <div ref={containerRef} className={className + " RMX-Sketch"}>
      <P5Wrapper
        sketch={sketch}
        seed={seed}
        className="h-full"
        transformOrigin="top center"
      />
      <div id={CSS_RMX_PREFIX + "loadingBorder"} className="RMX-loadingBorder">
        <div className="RMX-loadingBg">
          <div className="RMX-loading">R3MIX</div>
        </div>
      </div>
      <p id={CSS_RMX_PREFIX + "resetText"} className="RMX-resetText">
        Low framerate detected. Resetting with lower image quality...
      </p>
    </div>
  );
}

export default memo(RMX_7Years)

