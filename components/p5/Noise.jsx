import p5 from "p5"
import { FC, memo, useRef, useState } from "react"
import debounce from "lodash.debounce";
import dynamic from "next/dynamic";
const P5Wrapper = dynamic(() => import('./P5Wrapper'), { ssr: false });

const Noise = ({ className }) => { 
  const containerRef = useRef(null);
  const [mint, setMint] = useState(null);

  const sketch = (p5sketch) => {
    if (typeof window === "undefined") return;

    let scl = 3
    let zoom = 1
    let usingBanner = false
    let margin = scl * 125
    let iteration = 0
    const opacityBuffer = 0.15
    let loadingScreen, nScales, wScales, nRanges, wRanges, palette, operations, codeContent, noiseCount, waveCount, maxNoiseScale, maxWaveScale, maxNoiseRange, maxWaveRange, waveType, lineAlpha, setDScale, canvasEl, rotateAngle;
    const resizeStuff = () => {
      const windowWidth = containerRef.current.clientWidth
      // const windowHeight = containerRef.current.clientHeight
      const canvasWidth = canvasEl.width
      const scaleAmount = windowWidth / canvasWidth
      canvasEl.style.transform = `scale(${ scaleAmount * 1.9 }) translate(-50%, -50%)`
    }
    p5sketch.setup = (cc = true) => {
      if (cc) {
        const cnv = p5sketch.createCanvas(1600 * scl, 900 * scl);
        cnv.parent("NoiseSketch");
        cnv.id("NoiseCanvas")
        p5sketch.colorMode(p5sketch.HSL)
        const localSeed = nfaRandom(0, 1000000) + nfaRandom(0, 1000000)
        p5sketch.noiseSeed(localSeed)
        p5sketch.randomSeed(localSeed)
      }
      zoom = p5sketch.random() < 0.5 ? 1 : p5sketch.random([0.5, 0.75, 0.75])
      palette = getPalette()
      loadingScreen = document.getElementById("loadingScreen")
      loadingScreen.style.fontFamily = "monospace"
      loadingScreen.style.color = palette[3]
      loadingScreen.style.opacity = 1
      loadingScreen.style.backgroundColor = palette[0]
      operations = getOperations()
      lineAlpha = p5sketch.random(0.75, 0.35)
      rotateAngle = p5sketch.random() < 0.33 ? 0 : (p5sketch.random(-1, 1) * p5sketch.PI / 4)
      setDScale = p5sketch.random() < 0.75 ? undefined : nScales[p5sketch.floor(p5sketch.random(nScales.length))]
      canvasEl = document.getElementById("NoiseCanvas")
      resizeStuff()
      // window.onresize = () => resizeStuff()
    }
    p5sketch.draw = () => {
      p5sketch.noLoop()
      p5sketch.background(palette[0]);
      let prevPoint = null
      for (let y = 0; y < p5sketch.height; y += 3 * scl * zoom) {
        for (let x = 0; x < p5sketch.width; x += 3 * scl * zoom) {
          let sx = x; let sy = y;
          operations.forEach(cb => {
            const n = cb(sx, sy)
            sx += n.x;
            sy += n.y
          })
          const dScale = setDScale || nScales[p5sketch.floor(p5sketch.random(nScales.length))]
          const op = mapMargin(sx, sy, 2) - opacityBuffer
          const cIndex = getNoise(sx, sy, dScale, [0, (palette.length - 1) * 2]) % (palette.length - 1)
          const cT = easeInOutCubic(cIndex - Math.trunc(cIndex))
          let c = p5sketch.color(longColorLerp(palette[p5sketch.floor(cIndex)], palette[p5sketch.ceil(cIndex)], cT))
          c = p5sketch.color(p5sketch.hue(c), p5sketch.saturation(c), p5sketch.lightness(c) + p5sketch.random(-10, 10))
          const sw = getNoise(sx, sy, dScale, [scl / 3, 3 * scl], 500) * zoom
          const delta = prevPoint ? p5sketch.dist(sx, sy, prevPoint.x, prevPoint.y) / (p5sketch.height / 2) : 0

          if (prevPoint && !isOut(sx, sy, 0.33) && !isOut(prevPoint.x, prevPoint.y, 0.33) && p5sketch.random() < p5sketch.min((1 - delta), zoom) * 0.85) {
            c.setAlpha(op - lineAlpha - (p5sketch.random(1 - lineAlpha)))
            p5sketch.stroke(c)
            p5sketch.strokeWeight(getNoise(sx, sy, dScale, [scl / 3, scl], 500) * zoom)
            p5sketch.line(sx, sy, prevPoint.x, prevPoint.y)
          }
          c.setAlpha(op)
          p5sketch.fill(c)
          p5sketch.noStroke()
          p5sketch.circle(sx, sy, sw)
          prevPoint = p5sketch.createVector(sx, sy)
        }
      }
      const zoomText = (() => {
        if (zoom === 0.5) return "Zoomed Way Out"
        if (zoom === 0.75) return "Zoomed Out"
        if (zoom === 1) return "Normal"
      })();
      const lineOpacityText = (() => {
        if (lineAlpha > 0.65) return "Weak"
        if (lineAlpha < 0.45) return "Strong"
        return "Moderate"
      })();
      canvasEl.style.opacity = 1
      iteration++;
    }
    const easeInOutCubic = (x) => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    const isOut = (x, y, mult = 1) => (x < margin * mult || y < margin * mult || x > p5sketch.width - margin * mult || y > p5sketch.height - margin * mult);
    function mapMargin(x, y, mult = 2) {
      if (isOut(x, y)) return 0;
      const options = [1]
      const mapFade = (coord) => p5sketch.map(coord, margin, margin * mult, opacityBuffer, 1, true)
      if (x < margin * mult) options.push(mapFade(x));
      if (y < margin * mult) options.push(mapFade(y));
      if (x > p5sketch.width - margin * mult) options.push(mapFade(p5sketch.width - x));
      if (y > p5sketch.height - margin * mult) options.push(mapFade(p5sketch.height - y));
      return p5sketch.min(options);
    }
    function longColorLerp(c1, c2, t) {
      let startHue = p5sketch.hue(c1);
      let endHue = p5sketch.hue(c2);
      if (p5sketch.abs(startHue - endHue) > 180) {
        if (startHue < endHue) startHue += 360;
        else endHue += 360;
      }
      return p5sketch.color(
        p5sketch.lerp(startHue, endHue, t) % 360,
        p5sketch.lerp(p5sketch.saturation(c1), p5sketch.saturation(c2), t),
        p5sketch.lerp(p5sketch.lightness(c1), p5sketch.lightness(c2), t)
      )
    }
    function getNoise(x, y, nScale = 0.01, range = 1, off = 0) {
      const r = Array.isArray(range) ? range : [-range, range]
      return p5sketch.map(p5sketch.noise(x * nScale + off, y * nScale + off), 0, 1, ...r)
    }
    function getPalette() {
      const mainC = p5sketch.color(p5sketch.random(360), p5sketch.random(53, 75), p5sketch.random(50, 70))
      const bgC = p5sketch.color(p5sketch.hue(mainC), p5sketch.random(30), p5sketch.random(10))
      const getSec = (chance = 0.75) => {
        const h = (p5sketch.hue(mainC) + p5sketch.randomGaussian(0, 57) + p5sketch.random(-5, 5)) % 360
        return p5sketch.random() < chance ? p5sketch.color(h, p5sketch.random(35, 48), p5sketch.random(20, 45)) : null
      }
      return [bgC, getSec(), getSec(1), mainC, getSec(1), getSec(), getSec()].filter(c => c)
    }
    function getOperations() {
      nScales = [];
      wScales = [];
      nRanges = [];
      wRanges = [];
      const baseCount = [1, 2, 2, 3]
      const nCount = p5sketch.random([...baseCount, ...baseCount, ...baseCount, 4, 4, 5, 5, 6])
      for (let i = 0; i < nCount; i++) {
        const nScale = p5sketch.random(0.007, 0.0006)
        nScales.push(nScale * scl)
        const minRange = p5sketch.map(nScale, 0.007, 0.0006, 30, 300)
        const maxRange = p5sketch.map(nScale, 0.007, 0.0006, 300, 1000)
        const nRange = p5sketch.random(minRange, maxRange)
        nRanges.push(nRange * scl / nCount)
      }
      const wCount = p5sketch.random() < 0.4 ? 0 : p5sketch.random([2, 2, 2, 3, 3, 4, 4, 5])
      const wOptions = [0.05, 0.025, 0.021, 0.01875, 0.0125, 0.01125, 0.01]
      for (let j = 0; j < wCount; j++) {
        const wIndex = p5sketch.floor(p5sketch.random(wOptions.length))
        const wScale = wOptions[wIndex]
        wScales.push((wScale * scl) / p5sketch.TWO_PI)
        const wRange = (3 / (wScale / 0.2)) * p5sketch.random(0.6, 1)
        wRanges.push(wRange * scl)
      }
      noiseCount = nScales.length
      waveCount = wScales.length
      maxNoiseScale = p5sketch.round(p5sketch.max(nScales) / scl, 4)
      maxWaveScale = waveCount ? p5sketch.round(p5sketch.max(wScales) / scl, 4) : 0
      maxNoiseRange = p5sketch.round(p5sketch.max(nRanges) / scl)
      maxWaveRange = waveCount ? p5sketch.round(p5sketch.max(wRanges) / scl) : 0
      const noOff = p5sketch.random() < 0.085
      const noises = nScales.map((nScale, i) => (sx, sy) => ({
        x: getNoise(sx, sy, nScale, nRanges[i], noOff ? 0 : i * 100 * scl),
        y: getNoise(sx, sy, nScale, nRanges[i], noOff ? 0 : i * 100 * scl + 100)
      }))
      waveType = waveCount ? p5sketch.random(["Stroke", "Line", "Line", "Wave", "Wave", "Wave"]) : "None"
      const waveMag = p5sketch.random(0.2, 0.6)
      const waves = wScales.map((wScale, i) => (sx, sy) => {
        const useX = p5sketch.noise(i * 0.075) < 0.5 ? 1 : 0
        const angleOff = p5sketch.noise(i) * p5sketch.TWO_PI
        const x = sx * p5sketch.cos(rotateAngle) - sy * p5sketch.sin(rotateAngle);
        const y = sx * p5sketch.sin(rotateAngle) + sy * p5sketch.cos(rotateAngle);
        switch (waveType) {
          case "Stroke": return {
            x: p5sketch.tan(angleOff + y * wScale * 0.5) * wRanges[i] * 4.2,
            y: p5sketch.tan(angleOff + x * wScale * 0.5) * wRanges[i] * 4.2,
          }
          case "Line": return {
            x: p5sketch.cos(angleOff + x * wScale) * wRanges[i] * 0.75 * useX,
            y: p5sketch.sin(angleOff + y * wScale) * wRanges[i] * 0.75 * p5sketch.abs(useX - 1),
          }
          case "Wave": return {
            x: ((p5sketch.cos(angleOff + x * wScale) * wRanges[i]) + (p5sketch.sin(angleOff + y * wScale * waveMag) * wRanges[i])) * useX,
            y: ((p5sketch.sin(angleOff + y * wScale) * wRanges[i]) + (p5sketch.cos(angleOff + x * wScale * waveMag) * wRanges[i])) * p5sketch.abs(useX - 1),
          }
        }
      })
      return [...noises, ...waves].sort(() => p5sketch.random([-1, 1]))
    }
    p5sketch.keyPressed = async () => {
      if (p5sketch.key === "s") {
        p5sketch.save(`its_just_noise${ usingBanner ? "_banner" : "" }${ iteration }.png`)
      }
      if (p5sketch.key === "b") {
        canvasEl.style.opacity = 0
        await new Promise((resolve) => setTimeout(resolve, 1000))
        if (!usingBanner) {
          margin = scl * 50
          p5sketch.resizeCanvas(1500 * scl, 500 * scl)
        } else {
          margin = scl * 125
          p5sketch.resizeCanvas(1600 * scl, 900 * scl)
        }
        resizeStuff()
        usingBanner = !usingBanner
        p5sketch.draw()
      }
      if (p5sketch.key === "n") {
        canvasEl.style.opacity = 0
        const localSeed = new Date().getTime()
        p5sketch.noiseSeed(localSeed)
        p5sketch.randomSeed(localSeed)
        p5sketch.setup(false)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        p5sketch.draw()
      }
    }

    //NFA PRNG FUNCTION - DO NOT EDIT

    var nfa_finished = false
    var nfa_traits = []

    function MersenneTwister(seed) {
      if (seed == null) {
        const p = "123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
        seed = `nfa${ Array.from({ length: 36 }, () => p[Math.random() * p.length | 0]).join("") }`;
      }

      let hash = 0;
      for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      let seedAsInt = hash >>> 0;

      // Constants
      this.N = 624;
      this.M = 397;
      this.MATRIX_A = 0x9908b0df;
      this.UPPER_MASK = 0x80000000;
      this.LOWER_MASK = 0x7fffffff;

      this.mt = new Array(this.N);
      this.mti = this.N + 1;

      this.init_genrand(seedAsInt);
    }

    MersenneTwister.prototype.init_genrand = function(s) {
      this.mt[0] = s >>> 0;
      for (this.mti = 1; this.mti < this.N; this.mti++) {
        var s = this.mt[this.mti - 1] ^ (this.mt[this.mti - 1] >>> 30);
        this.mt[this.mti] =
          (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) +
            (s & 0x0000ffff) * 1812433253 +
            this.mti) >>>
          0;
      }
    };

    MersenneTwister.prototype.genrand_int32 = function() {
      var y;
      var mag01 = new Array(0x0, this.MATRIX_A);

      if (this.mti >= this.N) {
        // generate N words at one time
        var kk;

        if (this.mti === this.N + 1) {
          this.init_genrand(5489); // a default initial seed is used
        }

        for (kk = 0; kk < this.N - this.M; kk++) {
          y = (this.mt[kk] & this.UPPER_MASK) | (this.mt[kk + 1] & this.LOWER_MASK);
          this.mt[kk] = this.mt[kk + this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
        }

        for (; kk < this.N - 1; kk++) {
          y = (this.mt[kk] & this.UPPER_MASK) | (this.mt[kk + 1] & this.LOWER_MASK);
          this.mt[kk] =
            this.mt[kk + (this.M - this.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
        }

        y =
          (this.mt[this.N - 1] & this.UPPER_MASK) | (this.mt[0] & this.LOWER_MASK);
        this.mt[this.N - 1] = this.mt[this.M - 1] ^ (y >>> 1) ^ mag01[y & 0x1];

        this.mti = 0;
      }

      y = this.mt[this.mti++];

      // Tempering
      y ^= y >>> 11;
      y ^= (y << 7) & 0x9d2c5680;
      y ^= (y << 15) & 0xefc60000;
      y ^= y >>> 18;

      return y >>> 0;
    };

    let generator = new MersenneTwister(mint);

    function nfaRandom(min, max) {
      const randomValue = generator.genrand_int32();
      return (randomValue % (max + 1 - min)) + min;
    }
  }
  return (
    <div ref={containerRef} className={className} id="NoiseSketch">   
      <P5Wrapper sketch={sketch} />
      <div id="loadingScreen">
        <p className="animate-pulse">Your noise is being generated...</p>
      </div>
    </div>
  )
}

export default memo(Noise)