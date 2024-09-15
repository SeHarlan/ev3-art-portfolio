import p5 from "p5"
import { FC, memo, useRef, useState } from "react"
import dynamic from "next/dynamic";
const P5Wrapper = dynamic(() => import('../../P5Wrapper'), { ssr: false });
import { bindMethods, loadLargeImage } from "../../utils";
import vertex from "../../vertex.glsl";
import fxFrag from "./fxFrag.glsl";

p5.prototype.loadImage = loadLargeImage;

const CSS_RMX_PREFIX = "STEV3-2-"

function scaleToFraction(x) {
  let numberOfDigits = Math.floor(Math.log10(x)) + 1;
  let scale = Math.pow(10, numberOfDigits - 1);
  return x / scale;
}

const STEV3_2 = ({ className, menuOpen, seed, isActive }) => {
  const containerRef = useRef(null);
  const [lowframeRate, setLowframeRate] = useState(false)

  const sketch = (p5sketch, initSeed) => {
    if (typeof window === "undefined") return;
    if (!containerRef.current) return;

    const methodsToBind = [
      "createCanvas",
      "createGraphics",
      "colorMode",
      "frameRate",
      "random",
      "randomSeed",
      "noiseSeed",
      "image",
      "pixelDensity",
    ];
    const {
      createCanvas,
      createGraphics,
      colorMode,
      frameRate,
      random,
      randomSeed,
      noiseSeed,
      image,
      pixelDensity,
    } = bindMethods(p5sketch, methodsToBind);
    //p5 vars
    let { HSL, WEBGL } = p5sketch;
    const EV3binary = "01000101 01010110 00110011";
    const imageUrl =
      "https://arweave.net/WTRmY3fZ2ofM2_g-OPTXpiCXhg7Ppm3kZcLymvfhdO8"; //minted image

    let FR = 30;
    const checkInterval = FR;
    const threshold = FR * 0.5;
    let resetting = false;
    let hasBeenReset = false;
    let timeCounter = 0;
    let aspectRatio;
    let stage = 0;
    let centerCounter = 0;
    let stageCounter = 0;

    let seed, img;
    let fxShader, feedbackShader;
    let currentBuffer, previousBuffer, fxBuffer, gridBuffer, textBuffer;
    let clearGlitch = false;
    let font;
    const margin = 0.1;
    let imgRatio;

    function preload() {
      try {
        document.documentElement.style.setProperty(
          "--rmx-bg-color",
          "rgb(0, 0, 0)"
        );
        document.documentElement.style.setProperty(
          "--rmx-color1",
          "rgb(195,64,59)"
        );
        document.documentElement.style.setProperty(
          "--rmx-color2",
          "rgb(113,162,205)"
        );

        fxShader = new p5.Shader(p5sketch._renderer, vertex, fxFrag);
        img = p5sketch.loadImage(imageUrl);
        font = '"Kode Mono", monospace';
      } catch (error) {
        console.error(error);
      }
    }
    p5sketch.preload = preload;

    function setup() {
      const loadingBorder = document.getElementById(
        CSS_RMX_PREFIX + "loadingBorder"
      );
      if (loadingBorder) loadingBorder.style.display = "none";

      const resetText = document.getElementById(CSS_RMX_PREFIX + "resetText");
      if (resetText) resetText.style.display = "none";

      const {} = p5sketch;

      const windowWidth = containerRef.current.clientWidth;
      const windowHeight = containerRef.current.clientHeight;

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

      img.resize(canvWidth, canvHeight);
      createCanvas(canvWidth, canvHeight);
      frameRate(FR);
      colorMode(HSL);

      if (lowframeRate) pixelDensity(1);

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

      seed = scaleToFraction(new Date().getTime()) + Math.random() * 10;

      console.log("seed:", seed);
      randomSeed(seed);
      noiseSeed(seed);

      if (canvWidth > canvHeight) {
        aspectRatio = [canvWidth / canvHeight, 1];
      } else {
        aspectRatio = [1, canvHeight / canvWidth];
      }

      makeGridImage();
    }
    p5sketch.setup = setup;

    p5sketch.draw = () => {
      const { mouseX, mouseY, width, height } = p5sketch;

      const goodFrameRate = checkFrameRate();
      if (!goodFrameRate) return;

      [fxShader].forEach((shdr) => {
        shdr.setUniform("u_texture", gridBuffer);
        shdr.setUniform("u_originalImage", gridBuffer);
        shdr.setUniform("u_resolution", [width, height]);
        shdr.setUniform("u_imageResolution", [img.width, img.height]);
        shdr.setUniform("u_time", timeCounter);
        shdr.setUniform("u_centerTime", centerCounter);
        shdr.setUniform("u_seed", seed);
        shdr.setUniform("u_mouse", [mouseX, mouseY]);
        shdr.setUniform("u_clear", clearGlitch);
        shdr.setUniform("u_aspectRatio", aspectRatio);
        shdr.setUniform("u_stage", stage);
      });

      // Display the result on the main canvas
      fxBuffer.shader(fxShader);
      fxBuffer.rect(-width / 2, -height / 2, width, height);

      image(fxBuffer, 0, 0, width, height);

      timeCounter += 1 / FR;
      stageCounter += 1;

      if (stage != 1 || random() < 0.25) {
        centerCounter += 1 / FR;
      }

      const switchStage = random() < (stageCounter * 0.00005) % 1;
      if (switchStage) {
        switch (stage) {
          case 2:
            stage = 0;
            break;
          case 0:
            const ran = random();
            if (ran < 0.55) stage = 2;
            else stage = 1;
            stageCounter *= 0.8;
            break;
          case 1:
            if (random() < 0.45) {
              stage = 3;
              stageCounter = 0;
              break;
            }
          //else go to default
          default:
            stage = 0;
            stageCounter = 0;
            break;
        }
      }

      if (timeCounter < 1.5) {
        stage = 1;
      } else if (timeCounter < 4) {
        stage = 3;
      } else if (timeCounter < 6) {
        stage = 0;
        stageCounter = 0;
      }
      // stage = 2
    };

    p5sketch.keyPressed = () => {
      if (menuOpen.current || !isActive.current) return;
      if (p5sketch.key == "c") {
        clearGlitch = !clearGlitch;
        return false;
      }
    };

    function resetThings() {
      const resetText = document.getElementById(CSS_RMX_PREFIX + "resetText");
      if (resetText) resetText.style.display = "block";

      const loadingBorder = document.getElementById(
        CSS_RMX_PREFIX + "loadingBorder"
      );
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
          console.log(
            "Warning: Frame rate has significantly dropped to " +
              currentFrameRate +
              " fps"
          );
          resetThings();
          return false;
        } else {
          console.log("Frame rate is stable at " + currentFrameRate + " fps");
        }
      }
      return true;
    }

    function makeGridImage() {
      const { mouseX, mouseY, width, height, radians, SQUARE } = p5sketch;
      gridBuffer.noStroke();

      const lilH = height * margin;
      const lilW = width * margin;

      gridBuffer.image(img, lilW, lilH, width - lilW * 2, height - lilH * 2);

      //top right
      gridBuffer.image(img, width - lilW, 0, lilW, lilH * 1.5);

      //bottom left
      // gridBuffer.image(img, 0, height - lilH, lilW, lilH);

      // top left
      gridBuffer.image(img, 0, -lilH, lilW, lilH * 2);

      //br
      gridBuffer.image(img, width - lilW, height - lilH * 2, lilW, lilH * 2);

      //top
      gridBuffer.push();
      gridBuffer.translate(width - lilW, 0);
      gridBuffer.rotate(radians(90));
      gridBuffer.image(img, 0, 0, lilH, width - lilW * 2);
      gridBuffer.pop();

      //bottom
      gridBuffer.push();
      gridBuffer.translate(0, height);
      gridBuffer.rotate(radians(270));
      gridBuffer.image(img, 0, 0, lilH, width - lilW);
      gridBuffer.pop();

      //left
      gridBuffer.push();
      gridBuffer.image(img, 0, lilH, lilW, height - lilH * 2);
      gridBuffer.pop();

      //right
      gridBuffer.push();
      gridBuffer.translate(width, height - lilH);
      gridBuffer.rotate(radians(180));
      gridBuffer.image(img, 0, 0, lilW, height - lilH * 2);
      gridBuffer.pop();

      gridBuffer.stroke("black");
      gridBuffer.strokeWeight(width * 0.01);
      gridBuffer.strokeCap(SQUARE);

      //main borders
      gridBuffer.line(lilW, 0, lilW, height - lilH);
      gridBuffer.line(lilW, lilH, width, lilH);
      gridBuffer.line(width - lilW, lilH, width - lilW, height); //right
      gridBuffer.line(0, height - lilH, width - lilW, height - lilH); //bottom

      //top right
      gridBuffer.line(width - lilW, 0, width - lilW, lilH);

      // bottom left
      // gridBuffer.line(lilW, height - lilH, lilW, height);

      // top left
      gridBuffer.line(0, lilH, lilW, lilH);

      //right
      gridBuffer.line(width - lilW, height - lilH, width, height - lilH);
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
          <div className="RMX-loading">Loading</div>
        </div>
      </div>
      <p id={CSS_RMX_PREFIX + "resetText"} className="RMX-resetText" >
        Low framerate detected. Resetting with lower image quality.
      </p>
    </div>
  );
}

export default memo(STEV3_2)

