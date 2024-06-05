import p5 from "p5"
import { FC, memo, useRef, useState } from "react"
import dynamic from "next/dynamic";
const P5Wrapper = dynamic(() => import('../P5Wrapper'), { ssr: false });
import { bindMethods, loadLargeImage } from "../utils";
// import vertex from "../vertex.glsl";
// import fxFrag from "./fxFrag.glsl";
// import feedbackFrag from "./feedbackFrag.glsl";

p5.prototype.loadImage = loadLargeImage;

const CSS_RMX_PREFIX = "RMX-...-"

const RMX_dithered_sky = ({ className, menuOpen, seed, isActive }) => {
  const containerRef = useRef(null);
  const [lowframeRate, setLowframeRate] = useState(false)

  const sketch = (p5sketch, initSeed) => {
    if (typeof window === "undefined") return;

    const methodsToBind = ['createCanvas', 'createGraphics', 'colorMode', 'frameRate', 'random', 'randomSeed', 'noiseSeed', 'image', 'pixelDensity'];
    const { createCanvas, createGraphics, colorMode, frameRate, random, randomSeed, noiseSeed, image, pixelDensity } = bindMethods(p5sketch, methodsToBind);
    //p5 vars
    let { HSL, WEBGL } = p5sketch;
    const EV3binary = '01000101 01010110 00110011'
    const imageUrl = ""

    let FR = 30;
    const checkInterval = FR;
    const threshold = FR * 0.66;
    let resetting = false
    let hasBeenReset = false
    let timeCounter = 0;

    function preload() {
      try {

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
        );

        document.getElementById(CSS_RMX_PREFIX + "loadingBorder").style.display = "block";

        // fxShader = new p5.Shader(p5sketch._renderer, vertex, fxFrag);
        // feedbackShader = new p5.Shader(p5sketch._renderer, vertex, feedbackFrag);
        img = p5sketch.loadImage(imageUrl)
        font = '"Kode Mono", monospace'

      } catch (error) {
        console.error(error)
      }
    }
    p5sketch.preload = preload

    function setup() {
      const { mouseX, mouseY, width, height } = p5sketch;

      document.getElementById(CSS_RMX_PREFIX + "loadingBorder").style.display = "none";
      document.getElementById(CSS_RMX_PREFIX + "resetText").style.display = "none";

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

    
    }
    p5sketch.setup = setup



    p5sketch.draw = () => {
      const { mouseX, mouseY, width, height } = p5sketch;

      const goodFrameRate = checkFrameRate()
      if (!goodFrameRate) return;

    }

    p5sketch.keyPressed = () => {
      if (menuOpen.current || !isActive.current) return
      if (p5sketch.key == "c") {
        clearGlitch = !clearGlitch;
        return false
      }
    }

    function resetThings() {
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
    <div ref={containerRef} className={className} id={"RMX-Sketch"}>
      <P5Wrapper
        sketch={sketch}
        seed={seed}
        className="h-full"
        transformOrigin="top center"
      />
      <div id={CSS_RMX_PREFIX + "loadingBorder"} className="RMX-loadingBoarder">
        <div className="RMX-loadingBg">
          <div className="RMX-loading">R3MIX</div>
        </div>
      </div>
      <p
        id={CSS_RMX_PREFIX + "resetText"}
        className="RMX-resetText"
        style={{
          display: lowframeRate ? "block" : "none",
          position: "absolute",
          bottom: "30%",
        }}
      >
        Low framerate detected. Resetting with lower image quality...
      </p>
    </div>
  );
}

export default memo(RMX_dithered_sky)

