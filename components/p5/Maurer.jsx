import p5 from "p5"
import { FC, memo, useRef } from "react"
import debounce from "lodash.debounce";
import dynamic from "next/dynamic";
const P5Wrapper = dynamic(() => import('./P5Wrapper'), { ssr: false });

const Maurer = ({ className }) => { 
  const containerRef = useRef(null);

  const sketch = (p5sketch) => {
    if (typeof window === "undefined") return;

    let scl, initD, initN, depth, initDepth;
    let initScl
    let currD, currN;
    let loading = false;
    let displayMode = "animation"
    let prevDisplayMode = "static";
    let prevScl

    const PALETTES = {
      VOID: "VOID",
      INK: "INK",
      NEON: "NEON"
    }
    let palette;

    let points;
    let counter;
    let counterMax, counterInc;
    let rows, cols;
    let mx, my;


    let instructionContainer, closeButton,
      scaleNumberInput, depthNumberInput,
      horizontalStep, verticalStep, leftButton, rightButton, downButton, upButton,
      animationCheckbox, constellationCheckbox, danceCheckbox,
      saveButton, cancelButton, randomizeButton, staticCheckbox;

    let tabs = ["guide", "shortcuts", "controls", "about"]
    let tabRadioButtons
    let paintShader;

    let instructionWindowHidden = true;

    let mainColor, bgColor;

    let graphics;
    let useShader = true;

    p5sketch.setup = () => {

      useShader = p5sketch.isWebGLSupported()

      const mode = useShader ? p5sketch.WEBGL : p5sketch.P2D
      const windowWidth = containerRef.current.clientWidth
      const windowHeight = containerRef.current.clientHeight
      p5sketch.createCanvas(windowWidth, windowHeight, mode)
      p5sketch.colorMode(p5sketch.HSL);

      if (useShader) {
        paintShader = new p5.Shader(p5sketch._renderer, vertexShader, fragmentShader);
        p5sketch.shader(paintShader)
      }

      graphics = p5sketch.createGraphics(p5sketch.width, p5sketch.height);
      graphics.colorMode(p5sketch.HSL)

      // const urlParams = new URLSearchParams(window.location.search);
      const existingSeed = null//urlParams.get('maurerExpanseSeed');
      const seed = existingSeed ? existingSeed : p5sketch.floor(p5sketch.random() * 1000000000)
      p5sketch.noiseSeed(seed)
      p5sketch.randomSeed(seed)

      // urlParams.set('maurerExpanseSeed', seed)
      // window.history.replaceState({}, '', `${ location.pathname }?${ urlParams }`);


      palette = (Object.values(PALETTES).sort(() => p5sketch.random() - 0.35))[0]

      switch (palette) {
        case PALETTES.VOID: {
          mainColor = p5sketch.color(60, 100, 99);
          bgColor = p5sketch.color(260, 100, 1);
          break;
        }
        case PALETTES.INK: {
          mainColor = p5sketch.color(260, 90, 3);
          bgColor = p5sketch.color(60, 50, 99);
          break;
        }
        case PALETTES.NEON: {
          mainColor = p5sketch.color(60, 50, 100);
          const h = p5sketch.random(180, 320)
          bgColor = p5sketch.color(h, 100, 5);
          break
        }
      }

      initDepth = [0.1, 1, 0.01, 2, 0.001, 10, 0.0001].sort(() => p5sketch.random() - 0.4)[0]
      initScl = p5sketch.round(p5sketch.random(2, 14))
      resetParams()
      initParams();


      instructionContainer = document.getElementById("instructionContainer");
      closeButton = document.getElementById("closeButton");
      leftButton = document.getElementById("leftButton")
      rightButton = document.getElementById("rightButton")
      downButton = document.getElementById("downButton")
      upButton = document.getElementById("upButton")
      horizontalStep = document.getElementById("horizontalStep")
      verticalStep = document.getElementById("verticalStep")
      scaleNumberInput = document.getElementById("scaleNumberInput")
      depthNumberInput = document.getElementById("depthNumberInput")
      staticCheckbox = document.getElementById("staticCheckbox")
      animationCheckbox = document.getElementById("animationCheckbox")
      constellationCheckbox = document.getElementById("constellationCheckbox")
      danceCheckbox = document.getElementById("danceCheckbox")
      saveButton = document.getElementById("saveButton")
      cancelButton = document.getElementById("cancelButton")
      randomizeButton = document.getElementById("randomizeButton")
      // warning = document.getElementById("warning")

      tabRadioButtons = document.querySelectorAll('input[type=radio][name="tabs"]');

      instructionContainer.className = "out";

      // warning.className = "hide-warning";

      closeButton.onclick = () => handleMenuToggle();

      leftButton.onclick = () => handleMoveLeft()
      rightButton.onclick = () => handleMoveRight();
      downButton.onclick = () => handleMoveDown();
      upButton.onclick = () => handleMoveUp();

      scaleNumberInput.onchange = e => {
        scl = p5sketch.round(Number(e.target.value))
        dbMakeGrid()
      }

      depthNumberInput.onchange = e => {
        depth = Number(e.target.value)
        dbMakeGrid()
      }

      tabRadioButtons.forEach(tab => tab.addEventListener('change', handleTabChange));

      staticCheckbox.onchange = e => handleModeChange(e.target.value);
      animationCheckbox.onchange = e => handleModeChange(e.target.value);
      constellationCheckbox.onchange = e => handleModeChange(e.target.value);
      danceCheckbox.onchange = e => handleModeChange(e.target.value);


      saveButton.onclick = () => handleSave()
      cancelButton.onclick = () => handleMenuToggle();
      randomizeButton.onclick = () => handleRandomize()

      initUI()
    }


    function initUI() {
      horizontalStep.textContent = initD;
      verticalStep.textContent = initN;

      scaleNumberInput.value = scl;
      depthNumberInput.value = depth;
    }


    p5sketch.draw = () => {
      // handleShowWarning()
      if (counter < counterMax && loading == false) {
        drawGrid()
      }

      //Shader code
      if (useShader) {
        paintShader.setUniform("palette", Object.values(PALETTES).findIndex((pal) => pal === palette))
        paintShader.setUniform("resolution", [p5sketch.width, p5sketch.height]);
        paintShader.setUniform("rando", p5sketch.random())
        paintShader.setUniform("texture", graphics)
        p5sketch.rect(-p5sketch.width / 2, -p5sketch.height / 2, p5sketch.width, p5sketch.height);
      } else {
        p5sketch.image(graphics, 0, 0, p5sketch.width, p5sketch.height)
      }
    }

    function resetParams() {
      scl = initScl
      depth = initDepth
      currD = initD
      currN = initN
    }

    function initParams() {
      initD = p5sketch.round(p5sketch.randomGaussian(0, 1000))
      initN = p5sketch.round(p5sketch.randomGaussian(0, 1000))
      currD = initD
      currN = initN

      counterInc = 1
      counterMax = 360
      makeGrid()
    }

    function getRadius(noise = 0.35) {
      const base = p5sketch.min(p5sketch.height, p5sketch.width)
      const div = scl;
      return base / div * noise
    }

    function drawGrid() {
      if (displayMode === "dance") {
        graphics.fill(bgColor)
        graphics.rect(0, 0, p5sketch.width, p5sketch.height)
      }
      points.forEach((p) => {
        const d = p.d
        const n = p.n

        const radius = p.radius ? p.radius : getRadius()

        const getVector = (i) => {
          const k = i * d * (p5sketch.PI / 180);
          const r = radius * p5sketch.sin(n * k);
          const x = p.x + r * p5sketch.cos(k);
          const y = p.y + r * p5sketch.sin(k);

          return p5sketch.createVector(x, y);
        }

        const drawLine = (i) => {
          graphics.noFill();
          const v1 = getVector(i)
          const v2 = getVector(i + counterInc)

          // For NEON PAllet
          const getN = (min, max, off = 0) => {
            const rat = 0.002
            const xoff = d + ((v1.x - p.x) * scl) * rat
            const yoff = n + ((v1.y - p.y) * scl) * rat
            return p5sketch.map(p5sketch.noise(xoff + off, yoff + off), 0, 1, min, max)
          }
          const median = 120
          const h = getN(median, 360 + median) % 360
          const s = getN(40, 90, 100)
          const l = getN(40, 90, 200)

          const c = palette === PALETTES.NEON ? p5sketch.color(h, s, l) : mainColor

          if (displayMode === "constellation") {
            graphics.strokeWeight(p5sketch.constrain(7 - scl, 2, 7));
            c.setAlpha(1)
            graphics.stroke(c);
          } else {
            graphics.strokeWeight(1);

            const al = p5sketch.map(scl, 1, 4, 0.25, 0.1, true)
            c.setAlpha(al)
            graphics.stroke(c);
          }

          if (p.withLine && i < counterMax * 0.002) {
            graphics.line(p.withLine.x, p.withLine.y, p.x, p.y)
          }

          if (displayMode === "constellation") {
            graphics.point(v1.x, v1.y)
          } else {

            if (displayMode === "dance") {
              const range = 16
              const getN = (b, t) => {
                return p5sketch.map(p5sketch.noise(b * 0.009, t * 0.007), 0, 1, -range, range)
              }
              const v1x = v1.x + getN(v1.x, p5sketch.frameCount)
              const v1y = v1.y + getN(v1.y, p5sketch.frameCount) / 2
              const v2x = v2.x + getN(v2.x, p5sketch.frameCount)
              const v2y = v2.y + getN(v2.y, p5sketch.frameCount) / 2

              graphics.line(v1x, v1y, v2x, v2y)


            } else { //regular
              graphics.line(v1.x, v1.y, v2.x, v2.y)
            }
          }
        }

        if (displayMode === "animation") {
          drawLine(counter)
        } else {
          for (let i = 0; i < counterMax; i += counterInc) {
            drawLine(i)
            counter += counterInc
          }

          if (counter >= counterMax && displayMode === "dance") counter = 0;
        }
      })
      if (displayMode === "animation") counter += counterInc;
    }

    function makeGrid() {
      loading = true
      graphics.background(bgColor);

      points = [];

      // grid
      rows = scl;
      cols = p5sketch.max(p5sketch.floor((p5sketch.width / p5sketch.height * scl)), 1);

      const gw = p5sketch.width - p5sketch.height * 0.1
      const gh = p5sketch.height - p5sketch.height * 0.1
      //cell
      const cw = gw / cols;
      const ch = gh / rows;
      //margin
      mx = (p5sketch.width - gw) * 0.5;
      my = (p5sketch.height - gh) * 0.5

      const yNudge = ch / 2
      const xNudge = cw / 2

      for (let y = 0; y < rows; y++) {
        let gy = yNudge + my + y * ch;
        for (let x = 0; x < cols; x++) {
          let gx = xNudge + mx + x * cw;

          const p = p5sketch.createVector(gx, gy);

          const index = x + y * cols;

          let d, n;

          d = (index % cols) * depth;
          n = (p5sketch.floor(index / cols)) * depth;
          d += initD;
          n += initN;
          p.d = d;
          p.n = n;
          points.push(p)
        }
      }

      loading = false
      counter = 0
    }

    function debounce(func, wait) {
      let timeout;

      return function(...args) {
        const context = this;
        const later = function() {
          timeout = null;
          func.apply(context, args);
        };

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }

    const deboucedMakeGrid = debounce(makeGrid, 250);

    const dbMakeGrid = () => {
      loading = true
      deboucedMakeGrid()
    }

    function handleMenuToggle() {
      if (instructionWindowHidden) {
        instructionContainer.className = "in"
        instructionWindowHidden = false
      } else {
        instructionContainer.className = "out"
        instructionWindowHidden = true
        document.activeElement.blur()
      }
    }


    function handleTabChange(e) {
      e.preventDefault()
      const activeTab = e.target.value
      tabs.forEach(tab => {
        const section = document.getElementById(tab)
        if (tab === activeTab) {
          section.className = "tab-active"
        } else {
          section.className = "tab-hidden"
        }
      })
    }


    function handleModeChange(newMode) {
      if (newMode === displayMode) {
        //toggle back to previous mode
        displayMode = prevDisplayMode

        if (newMode === "dance") {
          scl = prevScl
          scaleNumberInput.value = scl;
        }
      } else {
        if (newMode === "dance") {
          prevDisplayMode = displayMode
          prevScl = scl;
          scl = 1
          scaleNumberInput.value = scl;
        }

        prevDisplayMode = displayMode
        displayMode = newMode
      }

      const radios = document.getElementsByName("radio-mode")
      radios.forEach(radio => {
        if (radio.value === displayMode) radio.checked = true
      })


      dbMakeGrid()
    }


    function handleRandomize() {
      initParams()
      initUI()
    }

    function roundToPrecision(num, precision = 10000) {
      return p5sketch.round((num + Number.EPSILON) * precision) / precision
    }

    function handleScaleOut() {
      scl++
      scaleNumberInput.value = scl;
      dbMakeGrid()
    }

    function handleScaleIn() {
      if (scl <= 1) return
      scl--
      scaleNumberInput.value = scl;
      dbMakeGrid()
    }

    function handleDepthOut() {
      depth *= 2;
      depthNumberInput.value = depth
      dbMakeGrid()
    }

    function handleDepthIn() {
      depth /= 2;
      depthNumberInput.value = depth
      dbMakeGrid()
    }

    function handleMoveLeft() {
      initD = roundToPrecision(initD + depth)
      horizontalStep.textContent = initD;
      dbMakeGrid()
    }

    function handleMoveRight() {
      initD = roundToPrecision(initD - depth)
      horizontalStep.textContent = initD;
      dbMakeGrid()
    }

    function handleMoveDown() {
      initN = roundToPrecision(initN - depth)
      verticalStep.textContent = initN;
      dbMakeGrid()
    }
    function handleMoveUp() {
      initN = roundToPrecision(initN + depth)
      verticalStep.textContent = initN;
      dbMakeGrid()
    }

    function handleSave() {
      p5sketch.save("Maurer Expanse.png");
    }

    p5sketch.keyPressed = () => {
      // If you hit the s key, save an image
      if (p5sketch.key == 'p') handleSave();
      if (p5sketch.key == "m" || p5sketch.keyCode === p5sketch.ESCAPE) handleMenuToggle()
      if (p5sketch.key == 'r') handleRandomize();

      if (p5sketch.key == "s") handleModeChange("static");
      if (p5sketch.key == 'c') handleModeChange("constellation");
      if (p5sketch.key == 'a') handleModeChange("animation");
      if (p5sketch.key == 'd') handleModeChange("dance");

      if (p5sketch.key == "-" || p5sketch.key == "_") handleScaleOut();
      if (p5sketch.key == "+" || p5sketch.key == "=") handleScaleIn();
      if (p5sketch.key == "[" || p5sketch.key == "{") handleDepthOut();
      if (p5sketch.key == "]" || p5sketch.key == "}") handleDepthIn();


      // ignore arrow keys if typing in input
      if (document.activeElement.tagName === "INPUT") return;

      if (p5sketch.keyCode === p5sketch.LEFT_ARROW) handleMoveLeft();
      if (p5sketch.keyCode === p5sketch.RIGHT_ARROW) handleMoveRight();
      if (p5sketch.keyCode === p5sketch.DOWN_ARROW) handleMoveDown();
      if (p5sketch.keyCode === p5sketch.UP_ARROW) handleMoveUp();
    }

    function mouseInInstructionContainer() {
      if (p5sketch.width < 600) {
        return !instructionWindowHidden
      }
      if (p5sketch.mouseX > p5sketch.width - 430 && p5sketch.mouseY < 550 && !instructionWindowHidden) return true
      return false
    }


    let lastTouchTime = 0;
    let initialDistance = 0;
    let currentDistance = 0;
    let longTouchTimeout;
    let touchStartPos = null;
    let touchEndPos = null;
    let movingPos = null;
    let touchPoints;

    const minSwipeDistance = 100;
    const doubleTapInterval = 400; // Time in milliseconds between taps to be considered a double tap

    function checkNoSwipe() {
      if (!touchStartPos || !movingPos) return true
      const swipeVector = p5.Vector.sub(movingPos, touchStartPos);
      const swipeDistance = swipeVector.mag();
      return swipeDistance < minSwipeDistance
    }

    function handlePatternTap() {
      if (mouseInInstructionContainer()) return
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const dist = p5sketch.dist(p5sketch.createVector(p5sketch.mouseX, p5sketch.mouseY));
        const radius = getRadius();

        if (dist <= radius) {
          initD = p.d;
          initN = p.n;
          currD = initD;
          currN = initN;

          horizontalStep.textContent = initD;
          verticalStep.textContent = initN;
          dbMakeGrid();
          return;
        }
      }
    }

    function touchStarted() {
      if (mouseInInstructionContainer()) return
      let currentTime = p5sketch.millis();

      if (p5sketch.touches && p5sketch.touches.length >= 2) { //handle pinch zoom
        initialDistance = dist(p5sketch.touches[0].x, p5sketch.touches[0].y, p5sketch.touches[1].x, p5sketch.touches[1].y);
      } else if (currentTime - lastTouchTime < doubleTapInterval) {
        //handle double tap
        handlePatternTap(p5sketch.mouseX, p5sketch.mouseY);
      } else {
        //handle long touch
        longTouchTimeout = setTimeout(() => {
          if (p5sketch.millis() - lastTouchTime > doubleTapInterval) {
            if (checkNoSwipe()) handleModeChange("dance");
            clearTimeout(longTouchTimeout);
          }
        }, doubleTapInterval);

        //handle swipe
        touchStartPos = p5sketch.createVector(p5sketch.mouseX, p5sketch.mouseY);
      }

      //double tap vars
      lastTouchTime = currentTime;
      return false
    }

    p5sketch.touchStarted = (e) => { 
      touchStarted()
    }
    p5sketch.mousePressed = (e) => {
      touchStarted()
    }

    function touchMoved() {
      if (mouseInInstructionContainer()) return

      movingPos = p5sketch.createVector(p5sketch.mouseX, p5sketch.mouseY);

      if (p5sketch.touches.length >= 2) { //handle pinch zoom
        currentDistance = p5sketch.dist(p5sketch.touches[0].x, p5sketch.touches[0].y, p5sketch.touches[1].x, p5sketch.touches[1].y);
      }
      return false;
    }
    p5sketch.touchMoved = (e) => { 
      touchMoved()
    }
    p5sketch.mouseDragged = (e) => {
      touchMoved()
    }

    function touchEnded() {
      clearTimeout(longTouchTimeout);

      if (mouseInInstructionContainer()) return

      //Handle pinch to zoom
      if (currentDistance && initialDistance) {
        if (currentDistance > initialDistance) {
          handleScaleIn()
        } else {
          handleScaleOut()
        }
      } else if (touchStartPos) { //handle swipe
        touchEndPos = p5sketch.createVector(p5sketch.mouseX, p5sketch.mouseY);

        const swipeVector = p5.Vector.sub(touchEndPos, touchStartPos);
        const swipeDistance = swipeVector.mag();
        if (swipeDistance >= minSwipeDistance) {
          if (touchStartPos.x > p5sketch.width - (mx * 2) && touchStartPos.y < my * 2) {
            handleMenuToggle()
          } else if (p5sketch.abs(swipeVector.x) > p5sketch.abs(swipeVector.y)) {
            if (swipeVector.x > 0) handleMoveRight();
            else handleMoveLeft();
          } else {
            if (swipeVector.y > 0) handleMoveDown();
            else handleMoveUp();
          }
        }
      }

      //reset touch variables
      touchPoints = [];
      initialDistance = 0;
      currentDistance = 0;
      touchStartPos = null;
      touchEndPos = null;
      return false;
    }

    p5sketch.touchEnded = (e) => { 
      touchEnded()
    }

    p5sketch.mouseReleased = (e) => {
      touchEnded()
    }

    p5sketch.isWebGLSupported = () => {
      try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      } catch (e) {
        return false;
      }
    }

    const vertexShader = `
attribute vec3 aPosition;
attribute vec2 aTexCoord;

varying vec2 vTexCoord;

void main() {
  vTexCoord = aTexCoord;
  vec4 positionVec4 = vec4(aPosition, 1.0);
  positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
  
  gl_Position = positionVec4;
}
`;

    const fragmentShader = `
#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vTexCoord;

uniform vec2 resolution;
uniform sampler2D texture;
uniform int palette;

bool inkMode = palette == 1;

uniform float rando;

float sRandom(vec2 st) {
  return fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453);
}

float pattern(vec2 uv) {
  float scale = 3.0 * ((resolution.y + resolution.x) / 100.0);
  float line_width = 0.1;
  vec2 grid = fract(uv * scale);
  float dOff = sRandom(uv) * 0.5;
  float diagonal = abs(grid.x - grid.y - dOff);

  float off = 1.0 - sRandom(uv * 2.0) * 0.2;
  float anti_diagonal = abs(grid.x + grid.y - off);

  float mult = inkMode ? -1.0 : 1.0;

  float lines = min(diagonal, anti_diagonal) * mult;

  return smoothstep(line_width, -line_width, lines);
}

vec2 wave(vec2 uv, float frequency, float amplitude, float r) {
  float f = frequency;
  
  float xFac = sRandom(vec2(r, uv.y*0.000001)) * 50.0;
  float yFac = sRandom(vec2(uv.x*0.000001, r)) * 50.0;
    
  vec2 blockFactor = vec2(xFac,yFac);
  float yOff = sin(uv.x * f + yFac) * amplitude;
  
  return vec2(0.0, yOff);
}

void main() {
  vec2 uv = vTexCoord;
  uv.y = 1.0 - uv.y;

  vec4 image = texture2D(texture, uv);

  gl_FragColor = image;

  float base = 0.5;

  vec2 noiseBlock = vec2(uv.x*4.0, uv.y*0.005);
  float noise = (base - sRandom(noiseBlock + rando)) * 0.2;
  noise += (base - sRandom(vec2(uv.x*0.01, uv.y*0.1)+rando)) * 0.15;

  gl_FragColor.r += noise;
  gl_FragColor.g += noise;
  gl_FragColor.b += noise;
}
`;

  }
  return (
    <div ref={containerRef} className={className} id="MaurerSketch">   
      <P5Wrapper sketch={sketch} />
      <div id="instructionContainer" className="out">
        <div id="header">
          <h1>Maurer Expanse</h1>
        <button id="closeButton" className="classic-button p-1"><img src="/images/close.png" alt="close" /></button>
        </div>

        <div id="panelsContainer">
          <div id="tabs">
            <div>
              <input
                id="guide-tab"
                type="radio"
                value="guide"
                name="tabs"
                defaultChecked
            
                className="hidden-radio"
              />
              <label htmlFor="guide-tab" >
                Guide
              </label>
            </div>
            <div>
              <input
                id="shortcuts-tab"
                type="radio"
                value="shortcuts"
                name="tabs"
                className="hidden-radio"
              />
              <label htmlFor="shortcuts-tab">
                Shortcuts
              </label>
            </div>
            <div>
              <input
                id="controls-tab"
                type="radio"
                value="controls"
                name="tabs"
                className="hidden-radio"
              />
              <label htmlFor="controls-tab">
                Controls
              </label>
            </div>
            <div>
              <input
                id="about-tab"
                type="radio"
                value="about"
                name="tabs"
                className="hidden-radio"
              />
              <label
                htmlFor="about-tab"
              
              >
                About
              </label>
            </div>

          </div>
          <section id="guide" className="tab-active">

            <h3 className="tab-content-title">Welcome to the Maurer Expanse!</h3>
            <p>I could write a whole thing about how I fell in love with exploring the Expanse, but I think the best way to experience it is to dive in and explore yourself!</p>
            <br />
            <p>This menu and it's tabs are here to help if you want it:</p>
            <p><strong>Shortcuts</strong> - to navigate without the menu</p>
            <p><strong>Controls</strong> - to navigate with the menu</p>
            <p><strong>About</strong> - to learn some technical details about how the Expanse is generated
              and where it came from.</p>

          </section>

          <section id="shortcuts" className="tab-hidden">
            <h3 className="tab-content-title">How to navigate</h3>
            <div className="desktop">
              <div className="shortcut-row"><span>❖</span>
                <p>"m" toggles this menu</p>
              </div>
              <div className="shortcut-row"><span>❖</span>
                <p>"r" randomizes the coordinates</p>
              </div>
              <div className="shortcut-row"><span>❖</span>
                <p>"p" saves the currently rendered image</p>
              </div>
              <div className="shortcut-row"><span>❖</span>
                <p>Arrow keys moves position</p>
              </div>
              <div className="shortcut-row"><span>❖</span>
                <p>Double click to move to a pattern</p>
              </div>
              <div className="shortcut-row"><span>❖</span>
                <p>"-" and "+" decreases and increases the grids scale</p>
              </div>
              <div className="shortcut-row"><span>❖</span>
                <p>"[" and "]" decreases and increases the grids depth</p>
              </div>
              <div className="shortcut-row"><span>❖</span>
                <p>"a" to toggle animation mode</p>
              </div>
              <div className="shortcut-row"><span>❖</span>
                <p>"d" to toggle dance mode</p>
              </div>
              <div className="shortcut-row"><span>❖</span>
                <p>"c" to toggle constellation mode</p>
              </div>
              <div className="shortcut-row"><span>❖</span>
                <p>"s" to toggle static mode</p>
              </div>
            </div>
            <div className="mobile">
              <div className="shortcut-row"><span>❖</span>
                <p>Swipe in from the top-right to open the menu</p>
              </div>
              <div className="shortcut-row"><span>❖</span>
                <p>Swipe directionally to move position</p>
              </div>
              <div className="shortcut-row"><span>❖</span>
                <p>Pinch out and in to increase and decrease the scale</p>
              </div>
              <div className="shortcut-row"><span>❖</span>
                <p>Double tap to move to a pattern</p>
              </div>
              <div className="shortcut-row"><span>❖</span>
                <p>Tap and hold down to toggle dance mode</p>
              </div>
            </div>
          </section>

          <section id="controls" className="tab-hidden">
            <h3 className="tab-content-title">Position</h3>
            <div className="mb-16">
              <div className="stepsContainer">
                <button id="leftButton" className="classic-button"><span>➔</span></button>
                <button id="rightButton" className="classic-button"><span>➔</span></button>

                <p>Horizontal step:</p>
                <span id="horizontalStep" className="step"></span>
              </div>
              <div className="stepsContainer">
                <button id="downButton" className="classic-button"><span>➔</span></button>
                <button id="upButton" className="classic-button"><span>➔</span></button>

                <p>Vertical step:</p>
                <span id="verticalStep" className="step"></span>
              </div>
            </div>

            <h3 className="tab-content-title">Other Grid stuff</h3>
            <label className="num-input-wraper">
              Scale:
              <input type="number" id="scaleNumberInput" min="1" />
            </label>

            <label className="num-input-wraper mb-16">
              Depth:
              <input type="number" id="depthNumberInput" step="0.1" />
            </label>

            <h3 className="tab-content-title">Display Mode</h3>
            <label className="custom-checkbox">
              <input
                defaultChecked
                value="animation"
                name="radio-mode"
                type="radio"
                id="animationCheckbox"
                className="hidden-checkbox"
              />
                <span className="checkmark"></span>
                <p>
                  <span className="underline">A</span>nimation
                </p>
            </label>
            <label className="custom-checkbox">
              <input
                value="dance"
                name="radio-mode"
                type="radio"
                id="danceCheckbox"
                className="hidden-checkbox"
              />
                <span className="checkmark"></span>
                <p>
                  <span className="underline">D</span>ance
                </p>
            </label>


            <label className="custom-checkbox">
              <input value="constellation" name="radio-mode" type="radio" id="constellationCheckbox" className="hidden-checkbox" />
                <span className="checkmark"></span>
                <p>
                  <span className="underline">C</span>onstellation
                </p>
            </label>

            <label className="custom-checkbox">
              <input
                value="static"
                name="radio-mode"
                type="radio"
                id="staticCheckbox"
                className="hidden-checkbox"
              />
                <span className="checkmark"></span>
                <p>
                  <span className="underline">S</span>tatic
                </p>
            </label>

          </section>

          <section id="about" className="tab-hidden">

            <h3 className="tab-content-title">How does it work?</h3>
            <p>Maurer Expanse an exploration of the Maurer Rose, a geometric concept introduced by Peter M. Maurer. The core algorithm is
              pretty compact and takes just two variables, "d" and "n":</p>
            <div className="code-block">
            // where theta is a number from 0 to 361
              <br />
              const k = theta * d * (PI / 180);
              <br />
              const r = 200 * sin(n * k);
              <br />
              const x = r * cos(k);
              <br />
              const y = r * sin(k);
              <br />
            </div>
            <p>The Expanse is made by creating a grid where the x-axis is "d" and the y-axis "n".</p>
            <br />
            <p>Changing the scale changes how many patterns are displayed at once. <i>Careful here, displaying too many can drastically slow down the experience.</i></p>

            <br />
            <p>Changing the depth changes the amount of change between each row and column.</p>
            <br />
            <p>And that's pretty much it. Nearly infinite possibilities from just a few lines of code. Happy exploring!</p>
          </section>
        </div>


        <div id="buttonContainer">
          <button
            id="cancelButton"
            className="classic-button"
          >Close</button>
          <button
            id="randomizeButton"
            className="classic-button"
          >Randomize</button>
          <button
            id="saveButton"
            className="classic-button"
          >Save</button>
        </div>
      </div>
    </div>
  )
}

export default memo(Maurer)