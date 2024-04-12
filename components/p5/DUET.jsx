import p5 from "p5"
import { FC, memo, useRef, useState } from "react"
import dynamic from "next/dynamic";
const P5Wrapper = dynamic(() => import('./P5Wrapper'), { ssr: false });
import * as Tone from 'tone'
import { WINDOWS, useWindowsContext } from "@/context/WindowsProvider";

const Duet = ({ className, menuOpen, seed, isActive }) => { 
  const containerRef = useRef(null);

  const sketch = (p5sketch, initSeed) => {
    if (typeof window === "undefined") return;
    

  // <!-- Music -->
    function tri(t) {
      const p = p5sketch.TWO_PI
      const a = 1;
      return 4 * a / p * Math.abs((((t - p / 4) % p) + p) % p - p / 2) - a
    }

    const NoteHertz = {
      "C": [16.35, 32.70, 65.41, 130.81, 261.63, 523.25, 1046.50, 2093.00, 4186.01],
      "Db": [17.32, 34.65, 69.30, 138.59, 277.18, 554.37, 1108.73, 2217.46, 4434.92],
      "D": [18.35, 36.71, 73.42, 146.83, 293.66, 587.33, 1174.66, 2349.32, 4698.64],
      "Eb": [19.45, 38.89, 77.78, 155.56, 311.13, 622.25, 1244.51, 2489.02, 4978.03],
      "E": [20.60, 41.20, 82.41, 164.81, 329.63, 659.26, 1318.51, 2637.02],
      "F": [21.83, 43.65, 87.31, 174.61, 349.23, 698.46, 1396.91, 2793.83],
      "Gb": [23.12, 46.25, 92.50, 185.00, 369.99, 739.99, 1479.98, 2959.96],
      "G": [24.50, 49.00, 98.00, 196.00, 392.00, 783.99, 1567.98, 3135.96],
      "Ab": [25.96, 51.91, 103.83, 207.65, 415.30, 830.61, 1661.22, 3322.44],
      "A": [27.50, 55.00, 110.00, 220.00, 440.00, 880.00, 1760.00, 3520.00],
      "Bb": [29.14, 58.27, 116.54, 233.08, 466.16, 932.33, 1864.66, 3729.31],
      "B": [30.87, 61.74, 123.47, 246.94, 493.88, 987.77, 1975.53, 3951.07]
    }

    const OctaveMap = (step, scaleFunctionCB) => {
      const octMult = p5sketch.floor(step / 12);
      const octaves = 12 * octMult;
      musicDebug && console.log("octaves", octaves)

      const baseStep = scaleFunctionCB(step % 12)
      musicDebug && console.log("baseStep", baseStep)
      return baseStep + octaves
    }

    const ScaleFunctionsMap = {
      pentatonic: (step) => {
        switch (step) {
          case 1: return 0;
          case 2: return 3;
          case 4: return 3;
          case 6: return 5;
          case 8: return 7;
          case 9: return 10;
          case 11: return 12;
          default: return step;
        }
      },
      major: (step) => {
        switch (step) {
          case 1: return 0;
          case 3: return 4;
          case 6: return 5;
          case 8: return 7;
          case 10: return 9;
          default: return step;
        }
      },
      minor: (step) => {
        switch (step) {
          case 1: return 0;
          case 4: return 3;
          case 6: return 5;
          case 9: return 8
          case 11: return 10;
          default: return step;
        }
      },
      dorian: (step) => { //minor like (sharp 6)
        switch (step) {
          case 1: return 0;
          case 4: return 3;
          case 6: return 5;
          case 8: return 9
          case 11: return 10;
          default: return step;
        }
      },
      lydian: (step) => { // major like (sharp 4)
        switch (step) {
          case 1: return 0;
          case 3: return 4;
          case 5: return 6;
          case 8: return 7;
          case 10: return 9;
          default: return step;
        }
      },
      // mixolydian: (step) => { //major like (flat 7)
      //   switch (step) {
      //     case 1: return 0;
      //     case 3: return 4;
      //     case 6: return 5;
      //     case 8: return 7;
      //     case 11: return 10;
      //     default: return step;
      //   }
      // },
      // phrygian: (step) => { //minor like (flat 2)
      //   switch (step) {
      //     case 2: return 1;
      //     case 4: return 3;
      //     case 6: return 5;
      //     case 9: return 8
      //     case 11: return 10;
      //     default: return step;
      //   }
      // },
    }

    const ScaleStepMapping = (step, scaleType) => {
      const scaleFunc = ScaleFunctionsMap[scaleType]
      const noteStep = OctaveMap(step, scaleFunc)
      musicDebug && console.log("noteStep", noteStep)
      return noteStep
    }


    //Rhythm
    const getBaseNote = (t, measureLength, reversed) => {
      if (reversed) return measureLength - (t % measureLength) - 1
      return t % measureLength
    }
    const getMod = (note, mod) => {
      return note % p5sketch.round(mod) === 0
    }
    const RHYTHMS = {
      sin: (t, measureLength, reversed) => {
        let note = getBaseNote(t, measureLength, reversed)

        note = p5sketch.map(note, 0, measureLength, -p5sketch.PI / 2, p5sketch.TWO_PI - p5sketch.PI / 2)
        return p5sketch.map(p5sketch.sin(note), -1, 1, 0.1, 1, true)
      },
      square2: (t, measureLength, reversed) => {
        let note = getBaseNote(t, measureLength, reversed)
        const div = 2
        const onOff = p5sketch.floor(note / (measureLength / div)) % 2
        return p5sketch.map(onOff, 0, 1, 0.8, 0.1, true)
      },
      square4: (t, measureLength, reversed) => {
        let note = getBaseNote(t, measureLength, reversed)
        const div = 4
        const onOff = p5sketch.floor(note / (measureLength / div)) % 2
        return p5sketch.map(onOff, 0, 1, 0.8, 0.1, true)
      },
      fall: (t, measureLength, reversed) => {
        let note = getBaseNote(t, measureLength, reversed)
        return p5sketch.map(note, 0, measureLength, 1, 0)
      },
      alternate: (t, measureLength, reversed) => {
        const note = getBaseNote(t, measureLength, reversed)
        return note % 2 === 0 ? 0.75 : 0.1
      },
      staggered: (t, measureLength, reversed) => {
        const note = getBaseNote(t, measureLength, reversed)
        if (note === 0) return 0.9
        if (getMod(note, measureLength / 2)) return 0.7
        if (getMod(note, measureLength / 4)) return 0.4
        return 0.1
      },
      stomp: (t, measureLength, reversed) => {
        const note = getBaseNote(t, measureLength, reversed)
        switch (note) {
          case 0: return 1
          case 3: return 0.75
          case 6: return 1
          default: return 0.1
        }
      },
      anticipate: (t, measureLength, reversed) => {
        const note = getBaseNote(t, measureLength, reversed)
        switch (note) {
          case 0: return 1
          case 6: return 0.8
          case 14: return 0.5
          default: return 0.1
        }
      },
      anticipateFull: (t, measureLength, reversed) => {
        const note = getBaseNote(t, measureLength, reversed)
        switch (note) {
          case 0: return 1
          case 4: return 0.6
          case 8: return 1
          case 14: return 0.8
          case 15: return 0.4
          default: return 0.1
        }
      },
      space: (t, measureLength, reversed) => {
        const note = getBaseNote(t, measureLength, reversed)
        if (note === 0) return 1
        if (getMod(note, measureLength / 2)) return 0.2
        if (getMod(note, measureLength / 4)) return 0.1
        return 0.05
      },
    }


    class DuetSynth {
      constructor(waveType) {
        this.waveType = waveType

        this.synth = new Tone.Synth({
          oscillator: {
            type: this.waveType
          },
        })

        const gain1 = new Tone.Gain(this.waveType === "sine" ? 2.7 : 1)
        this.delay = new Tone.PingPongDelay("4n", 0.2)
        this.delay.wet.value = 0
        const delEq = new Tone.EQ3(-8, -3, 0)
        this.delay.connect(delEq)


        this.bitCrusher = new Tone.BitCrusher(4)
        this.bitCrusher.wet.value = 0
        const bdEq = new Tone.EQ3(-6, -10, -14)
        this.bitCrusher.connect(bdEq)

        const compressor = new Tone.Compressor({
          ratio: 5,
          threshold: -40,
          release: 0.25,
          attack: 0.003,
          knee: 40
        })
        const compressor2 = new Tone.Compressor({
          ratio: 20,
          threshold: -5,
          release: 0.25,
          attack: 0.003,
          knee: 10
        })

        const vibrato = new Tone.Vibrato(5, 0.1)
        vibrato.wet.value = 0.25
        const panner = new Tone.Panner(waveType === "triangle" ? 0.8 : -0.8)
        const gain2 = new Tone.Gain(5)
        const limiter = new Tone.Limiter(-7)
        const eq = new Tone.EQ3(-4, 0, -1)
        const eq2 = new Tone.EQ3(3, 2, 0)

        const cpuCores = navigator.hardwareConcurrency || "unknown";
        const deviceMemory = navigator.deviceMemory || "unknown";

        const lowCPU = typeof cpuCores === "number" && cpuCores <= 4
        const lowMemory = typeof deviceMemory === "number" && deviceMemory < 4
        const useTrimFX = lowCPU || lowMemory
        if (useTrimFX) {
          // Low memory device
          this.fxChain = [
            eq,
            compressor,
            gain2,
            limiter,
            Tone.Destination
          ]
        } else {
          this.fxChain = [
            panner,
            eq,
            gain1,
            compressor,
            vibrato,
            this.bitCrusher,
            bdEq,
            this.delay,
            delEq,
            compressor2,
            eq2,
            gain2,
            limiter,
            Tone.Destination
          ]
        }

        this.synth.chain(...this.fxChain)

      }
      setBitcrusher(useIt) {
        if (useIt) console.log("Using Bit Crusher")
        this.bitCrusher.wet.value = useIt ? 0.25 : 0
      }
      setDelay(useIt) {
        if (useIt) console.log("Using Delay")
        this.delay.wet.value = useIt ? 0.25 : 0
      }

      dispose() {
        const sansDestination = this.fxChain.reverse().slice(1)
        const destination = this.fxChain[this.fxChain.length - 1]
        destination.disconnect()// no dispose

        sansDestination.forEach((fx) => { 
          fx.disconnect()
          fx.dispose()
        })
        

        this.synth.disconnect()
        this.synth.dispose()
        console.log("disposed")
      }
    }

  // <!-- Rect -->
    class R3CT {
      constructor(
        { x1, y1, x2, y2,
          measure, factor, alterFunction, color,
          halfStop, buffer, borderBuffer, reverse,
          rotateBy, indexQuarterStart, decoType, margin,
          extendOn
        },
        { startingNote = 220, //220hz (A3) as lowest note
          scale = "pentatonic",
          waveType = p5sketch.random(['sine', 'triangle']),
          R1 = p5sketch.random(Object.keys(RHYTHMS)),
          R2 = p5sketch.random(Object.keys(RHYTHMS)),
          rhythmReverse = p5sketch.random([true, false]),
          useDelay = p5sketch.random() < 0.33,
          useBitcrusher = p5sketch.random() < 0.33,
          synth
        }
      ) {

        this.margin = margin
        this.buffer = buffer
        this.buffer.strokeCap(p5sketch.SQUARE)

        this.borderBuffer = borderBuffer
        this.borderBuffer.rectMode(p5sketch.CENTER)
        this.borderBuffer.strokeCap(p5sketch.PROJECT)

        this.reverse = reverse
        this.rhythmReverse = rhythmReverse

        console.log("Rhythm Reversed:", rhythmReverse)

        this.complete = false;
        this.borderPoints = [];
        this.iterations = 0;

        synth.setBitcrusher(useBitcrusher)
        synth.setDelay(useDelay)
        this.synthBase = synth
        this.synth = synth.synth
        this.waveType = synth.waveType

        this.useBitcrusher = useBitcrusher
        this.useDelay = useDelay



        //diagnal length
        const diagLen = p5sketch.dist(x1, y1, x2, y2)

        //horizontal or vertical length
        const horLen = p5sketch.max(x2 - x1, y2 - y1)

        this.maxDist = diagLen * 0.5 + horLen * 0.5

        this.measureDiv = 2 //used for rhythm
        this.measure = measure;

        this.extendOn = extendOn
        this.measureMult = extendOn ? 10 : 5
        const divisions = this.measure * this.measureMult //320 divisions (w/ 32 measure length)
        this.Xstep = (x2 - x1) / (divisions);
        this.Ystep = (y2 - y1) / (divisions);


        this.factor = factor;
        this.alterFunction = alterFunction;
        this.color = color;
        this.halfStop = halfStop;


        this.startingNote = startingNote
        this.scale = scale

        this.decoType = decoType


        const seg1 = []
        const seg2 = []

        console.log("Rythm 1", R1)
        console.log("Rythm 2", R2)
        this.rhythms = {
          top: RHYTHMS[R1],
          right: RHYTHMS[R2],
          bottom: RHYTHMS[R1],
          left: RHYTHMS[R2]
        }

        for (let x = x1; x < x2; x += this.Xstep) {
          const v1 = p5sketch.createVector(x, y1)
          v1.segment = "top"
          seg1.push(v1)

          const xBot = x1 + x2 - x;
          const v3 = p5sketch.createVector(xBot, y2)
          v3.segment = "bottom"
          seg2.push(v3)
        }
        this.horLen = seg1.length
        this.vertLen = seg2.length

        for (let y = y1; y < y2; y += this.Ystep) {
          const v2 = p5sketch.createVector(x2, y);
          v2.segment = "right"
          seg1.push(v2)

          const yLeft = y1 + y2 - y;
          const v4 = p5sketch.createVector(x1, yLeft)
          v4.segment = "left"
          seg2.push(v4)
        }

        this.borderPoints = seg1.concat(seg2)

        const quarter = p5sketch.floor(this.borderPoints.length / 4)
        for (let i = 0; i < rotateBy; i++) {
          //rotate by quarters
          const quarterPoints = this.borderPoints.splice(0, quarter)
          this.borderPoints.push(...quarterPoints)
        }

        this.startIndex = p5sketch.floor((this.borderPoints.length) / 4) * indexQuarterStart
      }

      dispose() {
        this.synthBase.dispose()
      }

      replay() {
        this.iterations = 0;
        this.complete = false;
      }

      drawLine() {
        if (this.complete) return;

        const len = this.borderPoints.length;

        let index = ((this.startIndex + this.iterations) % len);

        if (this.reverse) index = len - index - 1

        const p = this.borderPoints[index]

        const side = p.segment


        const measureLength = this.measure / this.measureDiv
        const rhythm = this.rhythms[side]
        const rhythmIndex = Object.keys(RHYTHMS).findIndex((key) => key === rhythm.name)
        const reversedRhythm = (this.rhythmReverse && rhythmIndex < 4) || this.reverse
        const volume = musicDebug ? 0.5 : rhythm(index, measureLength, reversedRhythm)

        //DRAW
        const step = p5sketch.min(this.Ystep, this.Xstep)


        const swMult = this.extendOn ? 0.5 : 0.25
        const sw = p5sketch.max(step * swMult, 0.5)

        const p1Index = p5sketch.floor(this.alterFunction(index) * this.factor) % len
        const p1 = debug ? p5sketch.createVector(width / 2, height / 2) : this.borderPoints[p1Index]

        const hModRange = 8
        const hMod = p5sketch.randomGaussian(0, hModRange)
        const h = p5sketch.hue(this.color) + hMod
        const sModRange = 4
        const sMod = p5sketch.randomGaussian(0, sModRange)
        const s = p5sketch.saturation(this.color) + sMod
        const lModRange = 6
        const lMod = p5sketch.randomGaussian(0, lModRange)
        const l = p5sketch.lightness(this.color) + lMod
        const minAlpha = 0
        const maxAlpha = 0.7
        const a = p5sketch.map(volume, 0, 1, minAlpha, maxAlpha)

        const modRangeTotal = hModRange + sModRange + lModRange
        const modTotal = hMod + sMod + lMod


        const getStep = (step) => {
          //alter length to make edge patterns
          const period = 200
          const phase = 0
          const t = p5sketch.map(step, 0, len - 1, phase, p5sketch.TWO_PI * period + phase)
          switch (this.waveType) {
            case "sine": return p5sketch.sin(t);
            case "triangle": return tri(t);
          }
        }
        const edgeDepth = 0.01
        const edgeStep1 = p5sketch.map(getStep(index), -1, 1, 0, edgeDepth)
        const sinEdge1 = p5.Vector.lerp(p, p1, edgeStep1)
        const edgeStep2 = p5sketch.map(getStep(p1Index), -1, 1, 0, edgeDepth)
        const sinEdge2 = p5.Vector.lerp(p1, p, edgeStep2)

        const col = p5sketch.color(h, s, l, a)

        const drawLine = () => {
          this.buffer.strokeWeight(sw)
          this.buffer.stroke(col)
          this.buffer.line(sinEdge1.x, sinEdge1.y, sinEdge2.x, sinEdge2.y)
          // this.buffer.line(p.x, p.y, p1.x, p1.y)
        }


        //PLAY Music

        //ref - https://pages.mtu.edu/~suits/NoteFreqCalcs.html
        const octaves = 1
        const maxStep = 12 * octaves
        const baseStep = p5sketch.floor(p5sketch.map(p.dist(p1), step * this.measure, this.maxDist, maxStep, 0, true))

        const scaleStep = ScaleStepMapping(baseStep, this.scale)
        const aConstant = 2 ** (1 / 12)
        let note = p5sketch.round((this.startingNote * (aConstant) ** scaleStep) * 1000) / 1000
        musicDebug && console.log("HERTZ", note)
        musicDebug && console.log("===========")

        note *= p5sketch.map(modTotal, -modRangeTotal, modRangeTotal, 0.993, 1.007)//modulation

        const volMod = withMusic ? 1 : 0.33

        const playNote = (t) => {
          if (!volume) return
          this.synth.triggerAttackRelease(note, "32n", t, volume * volMod);
        }


        //BORDER

        let drawBorder = () => { };
        const DECO_TYPE = this.decoType//"scattered-dots"//"straight-dots"//"scattered"//"straight

        const getDecoP = (point, pDist) => {
          switch (side) {
            case "top": return p5sketch.createVector(point.x, point.y - pDist)
            case "right": return p5sketch.createVector(point.x + pDist, point.y)
            case "bottom": return p5sketch.createVector(point.x, point.y + pDist)
            case "left": return p5sketch.createVector(point.x - pDist, point.y)
          }
        }
        const decAl = p5sketch.map(a, minAlpha, maxAlpha, minAlpha, maxAlpha / 2)
        const decoCol = p5sketch.color(h, s, l, decAl)
        switch (DECO_TYPE) {
          case "straight-dots": {
            const minLen = this.margin / maxStep / 3
            const cRad = p5sketch.min(minLen, sw * 2)
            const decorationRound = this.iterations % 2
            const pDist = minLen + minLen * (maxStep - scaleStep)

            const borderDist = minLen * 3
            const dP = getDecoP(p, borderDist)

            const dP2 = getDecoP(dP, pDist)
            const useBit = (this.useBitcrusher && this.useDelay) ? decorationRound === 1 : this.useBitcrusher
            if (useBit) {
              drawBorder = () => {
                this.borderBuffer.stroke(decoCol)
                this.borderBuffer.strokeWeight(sw)
                this.borderBuffer.line(dP.x, dP.y, dP2.x, dP2.y)
              }
            }
            const useDel = (this.useBitcrusher && this.useDelay) ? decorationRound === 0 : this.useDelay
            if (useDel) {
              drawBorder = () => {
                this.borderBuffer.fill(decoCol)
                this.borderBuffer.noStroke()
                this.borderBuffer.circle(dP.x, dP.y, cRad)
                this.borderBuffer.circle(dP2.x, dP2.y, cRad)
              }
            }
            break;
          }
          case "scattered-dots": {
            const margDist = sw * 7
            const dp1 = getDecoP(p, margDist)
            const dp2 = getDecoP(p1, margDist)
            const dP = p5.Vector.lerp(dp1, dp2, -0.045)
            this.borderBuffer.stroke(col)
            this.borderBuffer.noFill(col)
            this.borderBuffer.rectMode(CENTER)
            const maxLen = sw * 3
            const decorationRound = this.iterations % 2
            const useBit = (this.useBitcrusher && this.useDelay) ? decorationRound === 1 : this.useBitcrusher
            if (useBit) {

              this.borderBuffer.push()
              this.borderBuffer.translate(dP.x, dP.y)
              this.borderBuffer.rotate(radians(45))
              this.borderBuffer.square(0, 0, maxLen)
              this.borderBuffer.pop()
            }
            const useDel = (this.useBitcrusher && this.useDelay) ? decorationRound === 0 : this.useDelay
            if (useDel) {
              const dP1 = getDecoP(dP, -maxLen)
              const dP2 = getDecoP(dP, maxLen)
              this.borderBuffer.line(dP1.x, dP1.y, dP2.x, dP2.y)
            }
            break;
          }
          case "straight": {
            const maxDeco = 10
            const halfDeco = p5sketch.round(maxDeco / 2)
            this.borderBuffer.rectMode(CENTER)
            this.borderBuffer.stroke(col)
            this.borderBuffer.noFill()

            const decorationRound = this.iterations % maxDeco
            const borderDist = sw * 14

            const decoP = getDecoP(p, borderDist)

            const maxLen = sw * 8
            if (decorationRound === halfDeco && this.useBitcrusher) {
              const isOff = this.iterations % p5sketch.round(maxDeco * 2) === halfDeco
              this.borderBuffer.square(decoP.x, decoP.y, maxLen)
              this.borderBuffer.push()
              this.borderBuffer.translate(decoP.x, decoP.y)
              if (isOff) this.borderBuffer.rotate(radians(45))
              this.borderBuffer.square(0, 0, maxLen / 2)
              this.borderBuffer.pop()
            }
            if (decorationRound === 0 && this.useDelay) {


              const isOff = this.iterations % p5sketch.round(maxDeco * 2) === 0
              if (isOff) {
                this.borderBuffer.circle(decoP.x, decoP.y, maxLen)
                this.borderBuffer.circle(decoP.x, decoP.y, maxLen / 4)
              } else {
                const decoP1 = getDecoP(decoP, -maxLen * 0.25)
                this.borderBuffer.circle(decoP1.x, decoP1.y, maxLen)
                const decoP2 = getDecoP(decoP, maxLen * 0.25)
                this.borderBuffer.circle(decoP2.x, decoP2.y, maxLen)
              }
            }
            break;
          }
          case "scattered": {
            const maxDeco = 4
            const halfDeco = p5sketch.round(maxDeco / 2)
            const decoP = p5.Vector.lerp(p, p1, -0.04)
            const decorationRound = this.iterations % maxDeco
            this.borderBuffer.rectMode(CENTER)

            const maxLen = sw * 5
            this.borderBuffer.stroke(col)
            this.borderBuffer.noFill()
            if (decorationRound === halfDeco && this.useBitcrusher) {
              this.borderBuffer.push()
              this.borderBuffer.translate(decoP.x, decoP.y)
              this.borderBuffer.rotate(radians(45))
              this.borderBuffer.square(0, 0, maxLen * 0.8)
              this.borderBuffer.pop()
            }
            if (decorationRound === 0 && this.useDelay) {
              this.borderBuffer.circle(decoP.x, decoP.y, maxLen)
            }
            break;
          }
        }

        //END
        const endLen = this.halfStop ? p5sketch.floor(len * 0.5) : len;
        this.iterations++;

        const completed = this.iterations >= endLen
        if (completed) {
          this.complete = true
        }

        return {
          playNote,
          drawLine,
          drawBorder,
        }
      }
    }

    // <!-- Script --
    const debug = false;
    const musicDebug = false

    const musicFR = 10

    const useWaveLineLength = "wave"

    let withMusic = true

    let bgColor
    let focalRect, secRect;
    let focalColor, secColor, focalFactor, secFactor;
    let focalAltFuncKey, secAltFuncKey;
    let focalRotateBy, secRotateBy;
    let focalIndexQuarterStart, secIndexQuarterStart;
    let focalR1, focalR2, secR1, secR2;
    let focalRhythmReverse
    let decoType
    let focalUseDelay, secUseDelay
    let focalUseBitcrusher, secUseBitcrusher

    let focalDuetSynth, secDuetSynth;

    let focalHOff, secHOff;
    const hOffsetOptions = [0, 180]

    let halfStop;
    let currentScale, rootNote, upNote

    let focalBuff, secBuff;
    let focalBorderBuff, secBorderBuff;
    let textBuff

    let margin

    let Bufs = []
    let Rects = []

    let playButton
    let playing = false
    let extendOn = false

    let menuContainer, closeButton, fastForwardButton, pauseButton, screenshotButton, extendButton;
    let newButton, replayButton

    const isRecording = false
    let recorder;
    let chunks = [];

    const standardFunctionChance = 0.5

    let stream;


    const AlterIndexFunctions = {
      "standard": (i) => i,
      "cos": (i) => p5sketch.abs(p5sketch.cos(p5sketch.radians(i))),
      "sin": (i) => p5sketch.abs(p5sketch.sin(p5sketch.radians(i))),
      "tan": (i) => p5sketch.abs(p5sketch.tan(p5sketch.radians(i))),
      "sq": (i) => p5sketch.sq(i),
      "sqrt": (i) => p5sketch.sqrt(i)
    }

    const getUseBitcrusher = () => p5sketch.random() < 0.1
    const getUseDelay = () => p5sketch.random() < 0.3
    const getNewRhythm = () => p5sketch.random(Object.keys(RHYTHMS))

    p5sketch.setup = () => {
      const windowWidth = containerRef.current.clientWidth
      const windowHeight = containerRef.current.clientHeight
      p5sketch.createCanvas(windowWidth, windowHeight)
      p5sketch.colorMode(p5sketch.HSL)
      p5sketch.frameRate(musicFR)

      focalBuff = p5sketch.createGraphics(p5sketch.width, p5sketch.height)
      focalBuff.colorMode(p5sketch.HSL)
      secBuff = p5sketch.createGraphics(p5sketch.width, p5sketch.height)
      secBuff.colorMode(p5sketch.HSL)

      focalBorderBuff = p5sketch.createGraphics(p5sketch.width, p5sketch.height)
      focalBorderBuff.colorMode(p5sketch.HSL)
      secBorderBuff = p5sketch.createGraphics(p5sketch.width, p5sketch.height)
      secBorderBuff.colorMode(p5sketch.HSL)

      textBuff = p5sketch.createGraphics(p5sketch.width, p5sketch.height)
      textBuff.colorMode(p5sketch.HSL)

      const seed = initSeed || new Date().getTime();
      console.log("============================")
      console.log("SEED", seed)
      p5sketch.randomSeed(seed);
      p5sketch.noiseSeed(seed);

      focalDuetSynth = new DuetSynth("sine")
      secDuetSynth = new DuetSynth("triangle")

      //set up happens on play so mobile devices can play audio
      handleRectSetUp()

      //UI
      playButton = document.getElementById("play-button")
      playButton.onclick = handlePlayInit
      playButton.className = "classic-button"

      menuContainer = document.getElementById("instructionContainer")

      closeButton = document.getElementById("closeButton")
      closeButton.onclick = handleCloseMenu

      fastForwardButton = document.getElementById("fastForwardButton")
      fastForwardButton.onclick = handleFastForward
      pauseButton = document.getElementById("pauseButton")
      pauseButton.onclick = handlePlayToggle
      screenshotButton = document.getElementById("screenshotButton")
      screenshotButton.onclick = handleSaveScreenshot

      replayButton = document.getElementById("replayButton")
      replayButton.onclick = handleReplay
      newButton = document.getElementById("newButton")
      newButton.onclick = handleNew

      extendButton = document.getElementById("extendButton")
      extendButton.onclick = handleExtendToggle

      // window.addEventListener("resize", debounce(handleResize, 300))

      const textS = p5sketch.min(p5sketch.width, p5sketch.height) / 10
      p5sketch.textAlign(p5sketch.CENTER, p5sketch.CENTER)
      p5sketch.textSize(textS)
      p5sketch.noStroke(bgColor)
      p5sketch.strokeWeight(textS / 10)
      p5sketch.textFont("monospace")
      p5sketch.textFont('W95FA');


      //text shadow
      const darkBG = p5sketch.lightness(bgColor) < 19
      const shadowL = darkBG ? 100 : 0
      p5sketch.drawingContext.shadowColor = p5sketch.color(0, 0, shadowL, 0.5)
      p5sketch.drawingContext.shadowBlur = 6
      p5sketch.drawingContext.shadowOffsetX = 6
      p5sketch.drawingContext.shadowOffsetY = 6

      p5sketch.fill(focalColor)
      p5sketch.text("DU", p5sketch.width / 2 - textS / 2, p5sketch.height * 0.33)
      p5sketch.fill(secColor)
      p5sketch.text("ET", p5sketch.width / 2 + textS / 2, p5sketch.height * 0.66)


      const shadowOffset = p5sketch.min(p5sketch.width, p5sketch.height) * 0.0025
      const shadowAlpha = ["dorian", "lydian"].includes(currentScale) ? 0.5 : 0.3
      p5sketch.drawingContext.shadowColor = p5sketch.color(p5sketch.hue(bgColor), p5sketch.saturation(bgColor), shadowL, shadowAlpha)
      p5sketch.drawingContext.shadowBlur = shadowOffset * 1.5
      p5sketch.drawingContext.shadowOffsetX = 0
      p5sketch.drawingContext.shadowOffsetY = shadowOffset * (darkBG ? -1 : 1)


    }

    p5sketch.draw = () => {
      if (playing) playMusic()
    }

    async function playMusic() {
      if (focalRect.complete && secRect.complete) {
        p5sketch.noLoop()
        console.log("All Complete")

        handleOpenMenu()
      }

      const secFunc = secRect.drawLine()
      const focalFunc = focalRect.drawLine()

      secFunc?.playNote()
      focalFunc?.playNote()
      secFunc?.drawLine()
      focalFunc?.drawLine()
      secFunc?.drawBorder()
      focalFunc?.drawBorder()

      p5sketch.background(bgColor)

      p5sketch.image(textBuff, 0, 0)
      p5sketch.image(focalBorderBuff, 0, 0)
      p5sketch.image(secBorderBuff, 0, 0)

      p5sketch.image(secBuff, 0, 0)
      p5sketch.image(focalBuff, 0, 0)

      if (debug) {
        p5sketch.stroke(0, 0, 100)
        p5sketch.strokeWeight(2)
        const min = Math.min(p5sketch.width, p5sketch.height)
        const margin = min * 0.1;

        p5sketch.line(margin, margin, p5sketch.width - margin, margin)
        p5sketch.line(p5sketch.width - margin, margin, p5sketch.width - margin, p5sketch.height - margin)
        p5sketch.line(p5sketch.width - margin, p5sketch.height - margin, margin, p5sketch.height - margin)
        p5sketch.line(margin, p5sketch.height - margin, margin, margin)
      }

    }

    p5sketch.keyPressed = () => {
      if (menuOpen.current || !isActive.current) return;

      if (p5sketch.key == " ") {
        if (playButton.className !== "hidden") handlePlayInit()
        else handlePlayToggle()
      }
      if (p5sketch.key == 's') {
        handleSaveScreenshot()
      }
      if (playButton.className !== "hidden") return
      if (p5sketch.key == "m") {
        handleMenuToggle()
      }
      if (p5sketch.key == 'f') {
        handleFastForward()
      }
      if (p5sketch.key == "r") {
        handleReplay()
      }
      if (p5sketch.key == "n") {
        handleNew()
      }
      if (p5sketch.key == "e") {
        handleExtendToggle()
      }
      return false
    }

    function handleRectSetUp() {
      currentScale = p5sketch.random(Object.keys(ScaleFunctionsMap))
      console.log("Current Scale:", currentScale)

      const pallette = {
        major: {
          bgH: () => p5sketch.random(360),
          bgS: () => 60,
          bgL: () => 95,
          rectS: (useAlt) => 45 - (useAlt ? 10 : 0),
          rectL: (useAlt) => 70
        },
        minor: {
          bgH: () => p5sketch.random(360),
          bgS: () => 75,
          bgL: () => 5,
          rectS: (useAlt) => 90 - (useAlt ? 10 : 0),
          rectL: (useAlt) => 65,
        },
        pentatonic: {
          bgH: () => p5sketch.random(360),
          bgS: () => 25,
          bgL: () => 20,
          rectS: (useAlt) => 60 - (useAlt ? 10 : 0),
          rectL: (useAlt) => 45
        },
        lydian: {
          bgH: () => p5sketch.random(360),
          bgS: () => 5,
          bgL: () => 90,
          rectS: () => 0,
          rectL: (useAlt) => useAlt ? 99 : 35,
        },
        dorian: {
          bgH: () => p5sketch.random(360),
          bgS: () => 5,
          bgL: () => 11,
          rectS: () => 0,
          rectL: (useAlt) => useAlt ? 3 : 70,
        },
      }

      const bgH = pallette[currentScale].bgH()
      const bgS = pallette[currentScale].bgS()
      const bgL = pallette[currentScale].bgL()
      bgColor = p5sketch.color(bgH, bgS, bgL)
      debug && console.log("Bg Hue", bgH)
      p5sketch.background(bgColor);
      p5sketch.image(textBuff, 0, 0)

      decoType = "straight-dots"//random(["scattered-dots", "straight"])

      const rootNotes = Object.keys(NoteHertz)
      const noteIndex = p5sketch.round(p5sketch.map(bgH, 0, 360, 0, rootNotes.length - 1))
      rootNote = rootNotes[noteIndex]

      console.log("Root Note: ", rootNote)

      halfStop = p5sketch.random() > 0.95
      console.log("Half Stop: ", halfStop)

      //Focal settings
      focalAltFuncKey = p5sketch.random() < standardFunctionChance ? "standard" : p5sketch.random(Object.keys(AlterIndexFunctions));
      focalUseDelay = getUseDelay()
      focalUseBitcrusher = getUseBitcrusher()

      console.log("Primary Alter Function:", focalAltFuncKey)

      focalHOff = p5sketch.random(hOffsetOptions)
      const focalUseAlt = (focalHOff !== 0);
      const fH = (bgH + focalHOff) % 360;
      const fS = pallette[currentScale].rectS(focalUseAlt);
      const fL = pallette[currentScale].rectL(focalUseAlt);
      const fA = 0.75;
      focalColor = p5sketch.color(fH, fS, fL, fA)

      focalFactor = getFactorOption(focalAltFuncKey)
      console.log("Primary Factor: ", focalFactor)

      focalRotateBy = p5sketch.floor(p5sketch.random(4))
      focalIndexQuarterStart = p5sketch.round(p5sketch.random(1, 4))
      focalR1 = getNewRhythm()
      focalR2 = getNewRhythm()
      focalRhythmReverse = p5sketch.random() < 0.5


      // Secondary / alt settings
      secAltFuncKey = p5sketch.random() < standardFunctionChance ? "standard" : p5sketch.random(Object.keys(AlterIndexFunctions));
      secUseDelay = getUseDelay()
      secUseBitcrusher = getUseBitcrusher()

      console.log("Secondary Alter Function:", secAltFuncKey)
      secHOff = p5sketch.random(hOffsetOptions)
      const secUseAlt = (secHOff !== 0);
      const secH = (bgH + secHOff) % 360;
      const secS = pallette[currentScale].rectS(secUseAlt);
      const secL = pallette[currentScale].rectL(secUseAlt);
      const secA = 0.75
      secColor = p5sketch.color(secH, secS, secL, secA)


      secFactor = getFactorOption(secAltFuncKey)
      console.log("Secondary Factor: ", secFactor)

      secR1 = getNewRhythm()
      secR2 = getNewRhythm()


      //canvas shadow
      const darkBG = p5sketch.lightness(bgColor) < 19
      const shadowL = darkBG ? 100 : 0
      const shadowOffset = p5sketch.min(p5sketch.width, p5sketch.height) * 0.0025
      const shadowAlpha = ["dorian", "lydian"].includes(currentScale) ? 0.5 : 0.3
      p5sketch.drawingContext.shadowColor = p5sketch.color(p5sketch.hue(bgColor), p5sketch.saturation(bgColor), shadowL, shadowAlpha)
      p5sketch.drawingContext.shadowBlur = shadowOffset * 1.5
      p5sketch.drawingContext.shadowOffsetX = 0
      p5sketch.drawingContext.shadowOffsetY = shadowOffset * (darkBG ? -1 : 1)
    }

    const handleRectCreate = () => {
      console.log("Extended: ", extendOn)
      const isHorizontal = p5sketch.width > p5sketch.height

      const minDimension = p5sketch.min(p5sketch.width, p5sketch.height)
      margin = minDimension * 0.1;


      const focX2 = isHorizontal ? p5sketch.width / 2 - margin / 2 : p5sketch.width - margin
      const focY2 = isHorizontal ? p5sketch.height - margin : p5sketch.height / 2 - margin / 2

      const focalOctave = 3 + hOffsetOptions.indexOf(focalHOff)
      focalRect = new R3CT({
        x1: roundLastDigit(margin),
        y1: roundLastDigit(margin),
        x2: roundLastDigit(focX2),
        y2: roundLastDigit(focY2),
        margin,
        measure: 32,
        factor: focalFactor,
        alterFunction: AlterIndexFunctions[focalAltFuncKey],
        color: focalColor,
        halfStop,
        buffer: focalBuff,
        borderBuffer: focalBorderBuff,
        rotateBy: focalRotateBy,
        indexQuarterStart: focalIndexQuarterStart,
        decoType,
        extendOn
      }, {
        startingNote: NoteHertz[rootNote][focalOctave],
        scale: currentScale,
        waveType: "sine",
        R1: focalR1,
        R2: focalR2,
        rhythmReverse: focalRhythmReverse,
        useBitcrusher: focalUseBitcrusher,
        useDelay: focalUseDelay,
        synth: focalDuetSynth
      })


      const secX1 = isHorizontal ? p5sketch.width / 2 + margin / 2 : margin
      const secY1 = isHorizontal ? margin : p5sketch.height / 2 + margin / 2

      const rotateOffset = focalRotateBy % 2 === 0 ? 1 : 3
      const rotateBy = (focalRotateBy + rotateOffset) % 4

      const secOctave = 2 + hOffsetOptions.indexOf(secHOff)
      secRect = new R3CT({
        x1: roundLastDigit(secX1),
        y1: roundLastDigit(secY1),
        x2: roundLastDigit(p5sketch.width - margin),
        y2: roundLastDigit(p5sketch.height - margin),
        margin,
        measure: 32,
        factor: secFactor,
        alterFunction: AlterIndexFunctions[secAltFuncKey],
        color: secColor,
        halfStop,
        buffer: secBuff,
        borderBuffer: secBorderBuff,
        rotateBy,
        indexQuarterStart: focalIndexQuarterStart,
        reverse: true,
        decoType,
        extendOn
      },
        {
          startingNote: NoteHertz[rootNote][secOctave],
          scale: currentScale,
          waveType: "triangle",
          R1: secR1,
          R2: secR2,
          rhythmReverse: false,
          useBitcrusher: secUseBitcrusher,
          useDelay: secUseDelay,
          synth: secDuetSynth
        }
      )
    }

    function handleSaveScreenshot() {
      p5sketch.save("DUET.png");
    }

    function handleNormalSpeed() {
      withMusic = true
      p5sketch.frameRate(musicFR)
      fastForwardButton.textContent = "Fast Forward"
    }

    function handleFastForward() {
      if (withMusic) {
        withMusic = false
        p5sketch.frameRate(60)
        fastForwardButton.textContent = "Normal Speed"
      } else {
        handleNormalSpeed()
      }
      handlePlay()
    }

    function handlePlay() {
      p5sketch.loop()
      playing = true
      pauseButton.textContent = "Pause"
    }
    function handlePause() {
      playing = false
      pauseButton.textContent = "Play"
    }

    function handlePlayToggle() {
      if (playing) handlePause()
      else handlePlay()
    }

    function handleExtendToggle() {
      extendOn = !extendOn
      extendButton.textContent = extendOn ? "Default Length" : "Extend"

      handleRectCreate()
      handleReplay()
    }

    function handlePlayInit() {
      // Tone.context.latencyHint = 'playback';
      Tone.start();
      playButton.className = "hidden"
      handleRectCreate()
      handlePlay()
    }

    function handleMenuToggle() {
      if (menuContainer.className === "in") handleCloseMenu()
      else handleOpenMenu()
    }

    function handleOpenMenu() {
      if (playButton.className !== "hidden") return
      menuContainer.className = "in"
    }
    function handleCloseMenu() {
      menuContainer.className = "out"
    }

    function handleReplay(e, resizing = false) {
      p5sketch.background(bgColor);
      focalBuff.clear()
      secBuff.clear()
      focalBorderBuff.clear()
      secBorderBuff.clear()
      focalRect.replay()
      secRect.replay()

      if (resizing === false) {
        handleCloseMenu()
        handleNormalSpeed()
      }
      handlePlay()
    }

    function handleNew() {
      const s = new Date().getTime()
      console.log("============================")
      console.log("SEED", s)
      p5sketch.randomSeed(s);
      p5sketch.noiseSeed(s);
      handleRectSetUp()
      handleRectCreate()
      handleReplay()
    }

    function handleResize() {
      const windowWidth = containerRef.current.clientWidth
      const windowHeight = containerRef.current.clientHeight
      p5sketch.resizeCanvas(windowWidth, windowHeight)

      focalBuff = createGraphics(p5sketch.width, p5sketch.height)
      secBuff = createGraphics(p5sketch.width, p5sketch.height)
      focalBuff.colorMode(HSL)
      secBuff.colorMode(HSL)

      if (playButton.className === "hidden") {
        handleRectCreate()
        handleReplay(undefined, true)
      }
    }

    function downloadBlob(blob, name) {
      // Now, we need to create a download link for our new video file
      const url = URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = name;

      // We simulate a click on the download link, which triggers the browser's download action
      document.body.appendChild(downloadLink);
      downloadLink.click();

      // We don't need the download link on the page anymore, so let's remove it
      document.body.removeChild(downloadLink);
    }

    function roundLastDigit(num) {
      return p5sketch.round(num / 10) * 10
    }
    //round to precision with epsilon
    function floorToP(num, precision = 0) {
      const mult = p5sketch.pow(10, precision)
      return p5sketch.floor((Number.EPSILON + num) * mult) / mult
    }

    function getStandardFactorOption() {
      return p5sketch.random([
        floorToP(p5sketch.random(0, 9) / 10, 1), //0 to 0.8
        floorToP(p5sketch.random(1.2, 2), 1),
        floorToP(p5sketch.random(2, 12)),
        floorToP(p5sketch.random(159, 162)),
        floorToP(p5sketch.random(319, 322)),
        floorToP(p5sketch.random(6385, 6409) / 10, 1), //638.5 to 640.8
        floorToP(p5sketch.random(1278, 1280), 1),
        //assorted singles
        p5sketch.random([81, 129, 213, 214, 255, 256, 256.2, 257]),
        p5sketch.random([383, 425, 429, 479, 569, 637, 853]),
        p5sketch.random([853.3, 959, 960, 961, 1023, 1067, 1151,])
      ])
    }
    function getFactorOption(funcType) {
      switch (funcType) {
        case "standard": return getStandardFactorOption();
        case "cos":
        case "sin":
          return p5sketch.round(p5sketch.random(1, 320));
        case "tan": return p5sketch.round(p5sketch.random(1, 180));
        case "sq": return p5sketch.round(p5sketch.random(1, 160));
        case "sqrt": return p5sketch.round(p5sketch.random(1, 146));

      }
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

    //TOUCH FUNCTIONS
    let touchStartPos = null;
    let touchEndPos = null;
    let lastTouchTime = 0;

    const minSwipeDistance = 100;
    const doubleTapInterval = 400; // Time in milliseconds between taps to be considered a double tap

    function touchStarted(e) {
      if (playButton.className !== "hidden") return
      if (menuContainer.contains(e.target) || e.target === playButton) return

      let currentTime = p5sketch.millis();
      if (currentTime - lastTouchTime < doubleTapInterval) {
        //handle double tap
        handlePlayToggle()
      }

      // double tap
      lastTouchTime = currentTime;

      //handle swipe
      touchStartPos = p5sketch.createVector(p5sketch.mouseX, p5sketch.mouseY);
      return false
    }
    p5sketch.touchStarted = (e) => {
      touchStarted(e)
    }
    p5sketch.mousePressed = (e) => {
      touchStarted(e)
    }

    function touchEnded(e) {
      if (menuContainer.contains(e.target) || e.target === playButton) return
      if (touchStartPos) { //handle swipe
        touchEndPos = p5sketch.createVector(p5sketch.mouseX, p5sketch.mouseY);

        const swipeVector = p5.Vector.sub(touchEndPos, touchStartPos);
        const swipeDistance = swipeVector.mag();
        if (swipeDistance >= minSwipeDistance) {
          //swipes down / up
          if (touchStartPos.y > touchEndPos.y) {
            handleOpenMenu()
          } else {
            handleCloseMenu()
          }
        }
      }

      //reset touch variables
      touchStartPos = null;
      touchEndPos = null;
      return false;
    }
    p5sketch.touchEnded = (e) => {
      touchEnded(e)
    }
    p5sketch.mouseReleased = (e) => {
      touchEnded(e)
    }

    //cleanup function
    return () => {
      if (focalRect?.synth) {
        focalRect.dispose()
        // focalRect.synth = null
      }
      if (secRect?.synth) {
        secRect.dispose()
        // secRect.synth = null        
      }
    }
  }
  return (
    <div ref={containerRef} className={className} id="DuetSketch">   
      <P5Wrapper sketch={sketch} seed={seed} windowKey={WINDOWS.DUET}a />
      <main>
        <button
          id="play-button"
          className="classic-button"
        >Click Me</button>
        <div
          id="instructionContainer"
          className="out"
        >
          <div id="header">
            <h1>DUET</h1>
            <button
              id="closeButton"
              className="classic-button p-1"
            ><img src="/images/close.png" alt="close" className=""/></button>
          </div>
          <div id="instructionsBody">

            <p>Press "m" or swipe up/down from the bottom to toggle this menu.</p>
            <div className="button-container">
              <button
                id="pauseButton"
                className="classic-button"
              >
                Play
              </button>
              <p>"space bar" or double tap</p>
            </div>

            <div className="button-container">
              <button
                id="extendButton"
                className="classic-button"
              >
                Extend
              </button>
              <p>"e"</p>
            </div>
            <div className="button-container">
              <button
                id="fastForwardButton"
                className="classic-button"
              >
                Fast Forward
              </button>
              <p>"f"</p>
            </div>
            <div className="button-container">
              <button
                id="screenshotButton"
                className="classic-button"
              >
                Save Screenshot
              </button>
              <p>"s"</p>
            </div>
            <div className="button-container">
              <button
                id="replayButton"
                className="classic-button"
              >
                Replay
              </button>
              <p>"r"</p>
            </div>
            <div className="button-container">
              <button
                id="newButton"
                className="classic-button"
              >
                New DUET
              </button>
              <p>"n"</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default memo(Duet)