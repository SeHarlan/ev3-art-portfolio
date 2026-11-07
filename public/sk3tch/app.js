// Sk3tch app bundle: sk3tch packages/sketch-engine dist/app.js at bf7757f5. Don't edit; rebuild there (bun run --cwd packages/sketch-engine build) and copy.
const Hr = [
  [1, 256],
  [0.5, 44],
  [0.25, 33]
], Bo = Math.max(...Hr.map(([e]) => e));
function ba(e, n) {
  return n ? Math.max(1, Bo / e) : 1;
}
function wa() {
  return { width: 1440 * Bo, height: 1080 * Bo };
}
const To = [0.09, 0.07, 0.1], So = 333, vo = 30, Uo = 1 / 180, Yo = 0.5;
function Xr(e) {
  let n = e;
  return function() {
    let r = n += 1831565813;
    return r = Math.imul(r ^ r >>> 15, r | 1), r ^= r + Math.imul(r ^ r >>> 7, r | 61), ((r ^ r >>> 14) >>> 0) / 4294967296;
  };
}
function _a(e) {
  let n = 1779033703 ^ e.length;
  for (let r = 0; r < e.length; r++)
    n = Math.imul(n ^ e.charCodeAt(r), 3432918353), n = n << 13 | n >>> 19;
  return n = Math.imul(n ^ n >>> 16, 2246822507), n = Math.imul(n ^ n >>> 13, 3266489909), (n ^ n >>> 16) >>> 0;
}
function Gr(e) {
  return _a(e);
}
function Vr() {
  return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
function ya(e) {
  const n = Gr(e), r = Xr(n ^ 2654435769);
  return [
    r() * So,
    r() * So,
    r() * So
  ];
}
function Qt(e, n = Math.random) {
  if (e.length === 0) return;
  const r = e.reduce(
    (t, [, u]) => t + Math.max(0, u),
    0
  );
  if (r === 0) return;
  const i = n() * r;
  let a = 0;
  for (const [t, u] of e)
    if (a += Math.max(0, u), i <= a)
      return t;
  return e[e.length - 1][0];
}
const xa = {
  name: "Primary",
  colors: [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
  ],
  useColorCycle: !0
}, ar = [
  {
    name: "Dim",
    colors: [
      [0.33, 0.11, 0],
      [0, 0.33, 0.11],
      [0.11, 0, 0.33]
    ],
    useColorCycle: !0
  },
  {
    name: "B&W",
    colors: [
      [0.66, 0.66, 0.66],
      [0.33, 0.33, 0.33],
      [1, 1, 1]
    ],
    useColorCycle: !1
  },
  {
    name: "CMY",
    colors: [
      [1, 0, 1],
      [1, 1, 0],
      [0, 1, 1]
    ],
    useColorCycle: !1
  },
  {
    name: "Y2K",
    colors: [
      [0, 0.25, 1],
      [0, 0.9, 0.9],
      [0.75, 0, 1]
    ],
    useColorCycle: !1
  },
  {
    name: "Win95",
    colors: [
      [0, 0.5, 0.55],
      [0, 0, 0.55],
      [0.85, 0.85, 0.85]
    ],
    useColorCycle: !1
  },
  {
    name: "Matrix",
    colors: [
      [0, 0.2, 0.1],
      [0, 1, 0.25],
      [0.6, 1, 0.65]
    ],
    useColorCycle: !1
  },
  {
    name: "Bondi Blue",
    colors: [
      [0, 0.35, 0.3],
      [0.1, 0.6, 0.7],
      [0.9, 0.95, 1]
    ],
    useColorCycle: !1
  },
  {
    name: "Jazz Cup",
    colors: [
      [0, 0.9, 1],
      [0.2, 0.1, 0.5],
      [0.85, 0.35, 0.7]
    ],
    useColorCycle: !1
  },
  {
    name: "Lava Lamp",
    colors: [
      [0.5, 0, 0],
      [1, 0.3, 0],
      [1, 0.7, 0.1]
    ],
    useColorCycle: !1
  },
  {
    name: "Platinum UI",
    colors: [
      [0.45, 0.35, 0.25],
      [0.5, 0.5, 0.65],
      [1, 0.9, 0.75]
    ],
    useColorCycle: !1
  }
];
function Ea(e = Math.random) {
  return e() < 0.5 ? xa : ar[Math.floor(e() * ar.length)];
}
function zo(e) {
  const n = Gr(e), r = ya(e), i = Xr(n), a = (V, q) => i() * (q - V) + V;
  i();
  const t = 0.33, u = [
    a(222, 1111),
    a(222, 1111)
  ], m = [
    a(50, 150),
    a(0.1, 1)
  ], f = Qt(
    [
      [0.4, 1],
      [0.5, 3],
      [0.6, 4],
      [0.7, 8],
      [0.9, 4]
    ],
    i
  ), g = [
    a(50, 100),
    a(100, 1e3)
  ], p = [
    g[1],
    g[0]
  ], d = Qt(
    [
      ["normal", 389],
      ["chunky", 22],
      ["glitchy", 22]
    ],
    i
  ), y = Qt(
    [
      [!0, d === "normal" ? 6 : 1],
      [!1, 2]
    ],
    i
  ), T = Ea(i);
  let k = Uo;
  T.useColorCycle && (k = Qt(
    [
      [!1, 311],
      [!0, 22]
    ],
    i
  ) ? Yo : Uo);
  const b = Qt(
    [
      ["two", 4],
      ["grow", 1],
      ["breathe", 1]
    ],
    i
  ), U = Qt(
    [
      [0, 33],
      // linear (classic stripes)
      [1, 33],
      // dots
      [2, 0],
      // diagonal stripes
      [3, 33],
      // plaid
      [4, 0],
      // zigzag
      [5, 33],
      // sawtooth
      [6, 0],
      // wavy
      [7, 33],
      // hyperbolic
      [8, 33],
      // saddle
      [9, 33],
      // zone plate
      [10, 231]
      // noise, half of all seeds: the sum of the weights above
    ],
    i
  ), P = Qt(Hr, i), K = a(25e-4, 75e-4), C = i() > 11 / 333 ? 1 : 3, D = Math.floor(i() * 1111) + 1, x = i(), w = d === "chunky" ? 8 + x * 4 : d === "glitchy" ? 80 + x * 40 : 1, E = i(), I = d === "chunky" ? 2 : d === "glitchy" ? E < 0.5 ? 8 : 0.1 : 1;
  return {
    seed: e,
    shaderOffset: r,
    chunkType: d,
    canvasScale: P,
    moveSpeed: K,
    moveSpeedMult: w,
    checkerScale: I,
    gradientBlockPattern: U,
    noiseMultiplier: D,
    defaultWaterfallMode: y,
    resetEdgeThreshold: t,
    dirtNoiseScale: u,
    blankStaticScale: m,
    blankStaticThreshold: f,
    extraFallStutterScale: g,
    extraMoveStutterScale: p,
    cycleColorHueBaseSpeed: k,
    backgroundStyle: b,
    palette: T,
    globalBloomMult: C
  };
}
function Ta(e) {
  const { canvasScale: n } = zo(e);
  return { width: 1440 * n, height: 1080 * n };
}
function Wr(e) {
  const n = [];
  if (e.chunkType === "glitchy" && n.push("Corrupted"), e.chunkType === "chunky" && n.push("Macroblocked"), e.cycleColorHueBaseSpeed === Yo && n.push("Overclocked"), e.globalBloomMult > 1 && n.push("Blown Out"), n.length === 0) return "None";
  const r = Math.max(...n.map((a) => a.length));
  let i = "";
  for (let a = 0; a <= r; a++)
    for (const t of n) t[a] && (i += t[a]);
  return i;
}
const Sa = {
  0: "Linear",
  1: "Dots",
  2: "Diagonal",
  3: "Plaid",
  4: "Zigzag",
  5: "Ramps",
  6: "Wavy",
  7: "Hyperbolic",
  8: "Saddle",
  9: "Zone Plate",
  10: "Noise"
}, Ra = {
  two: "Checkered",
  grow: "Grow",
  breathe: "Breathe"
}, Ma = {
  0.4: "Heavy",
  0.5: "Dense",
  0.6: "Medium",
  0.7: "Light",
  0.9: "Sparse"
};
function Ca(e) {
  const n = 1440 * e.canvasScale, r = 1080 * e.canvasScale, i = Math.sqrt(
    Math.max(1, n / e.dirtNoiseScale[0]) * Math.max(1, r / e.dirtNoiseScale[1])
  );
  return i < 1.6 ? "Fine" : i < 2.3 ? "Medium" : "Coarse";
}
function Aa(e) {
  return [
    ["Sketch Seed", e.seed],
    ["Color Palette", e.palette.name],
    ["Resolution", `${1440 * e.canvasScale}x${1080 * e.canvasScale}`],
    ["Gem", Sa[e.gradientBlockPattern] ?? e.gradientBlockPattern],
    ...e.gradientBlockPattern === 10 ? [["Noise Multiplier", e.noiseMultiplier]] : [],
    ["Movement Speed", (e.moveSpeed * e.moveSpeedMult).toFixed(3)],
    ["Background", Ra[e.backgroundStyle]],
    ["Static Density", Ma[e.blankStaticThreshold] ?? e.blankStaticThreshold],
    ["Static Grain", Ca(e)],
    ["Error", Wr(e)]
  ].map(([r, i]) => ({ trait_type: r, value: String(i) }));
}
const La = ["two", "grow", "breathe"], Fa = ["normal", "chunky", "glitchy"], Pa = "square", Oo = !1, Yr = !1;
var Da = `#version 300 es
in vec2 a_position;
in vec2 a_texCoord;

out vec2 v_texCoord;

void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texCoord = a_texCoord;
}`, Ia = `#version 300 es

precision highp float;

precision highp int;

uniform sampler2D u_texture;
uniform vec2 u_resolution;

uniform float u_staticLoopPhase;

uniform float u_steppedHuePhase;

uniform float u_staticCyclesBlank;
uniform float u_staticCyclesBlock;
uniform float u_staticCyclesEdge;
uniform float u_pixelDensity;

uniform float u_brushFrameCount, u_brushTime;

uniform float u_brushLoopFrames;

uniform float u_brushBlockTime;
uniform vec3 u_seedOffset;
uniform float u_targetFps;

uniform int u_chunkType;

uniform float u_checkerScale;
uniform float u_moveSpeed;
uniform float u_resetEdgeThreshold;
uniform float u_staticResetThreshold;
uniform vec2 u_extraMoveStutterScale;
uniform float u_extraMoveStutterThreshold;
uniform vec2 u_extraFallStutterScale;
uniform float u_extraFallStutterThreshold;
uniform float u_fallWaterfallMult;
uniform vec2 u_dirtNoiseScale;
uniform float u_ribbonDirtThreshold;
uniform vec2 u_blankStaticScale;
uniform float u_blankStaticThreshold;
uniform float u_blankStaticTimeMult;
uniform bool u_useColorCycle;

uniform int u_bgStyle;

uniform int u_gradientBlockPattern;
uniform uint u_noiseMultiplier;
uniform vec3 u_staticColor1;
uniform vec3 u_staticColor2;
uniform vec3 u_staticColor3;
uniform float u_globalFreeze;

uniform float u_noiseFreeze;

uniform sampler2D u_resolvedTexture;
uniform sampler2D u_movementTexture;
uniform sampler2D u_paintTexture;

in vec2 v_texCoord;
out vec4 fragColor;

const float PI = 3.14159265;

const float DRAW_ACTIVE_THRESHOLD = 0.25;
const float DRAW_SHIFT_THRESHOLD = 0.5;
const float DRAW_DIRECTION_THRESHOLD = 0.75;

const float R_STRAIGHT_RIGHT_MAX = 0.6875;
const float R_STRAIGHT_LEFT_MAX = 0.9375;

const float G_TRICKLE_MAX = 0.40;
const float G_STRAIGHT_DOWN_MAX = 0.55;
const float G_WATERFALL_DOWN_MAX = 0.70;
const float G_STRAIGHT_UP_MAX = 0.85;
const float B_FLOW_MIN = 0.5;
const float B_FLOW_MAX = 0.75;

const float PAINT_LIVE_MIN = 0.125;
const float PAINT_EMPTY_MIN = 0.25;
const float PAINT_BRIGHT_MIN = 0.53;
const float PAINT_EMPTY_MAX = 0.625;
const float PAINT_SOLID_MIN = 0.625;
const float PAINT_SOLID2_MIN = 0.6875;
const float PAINT_SOLID3_MIN = 0.75;
const float PAINT_SOLID_CYCLE_MIN = 0.8125;
const float PAINT_GEM_MIN = 0.875;

const float SOLID_FLAT_ALPHA = 0.5;
const float SOLID_CYCLE_ALPHA = 0.25;
const float LOOP_COORD_ALPHA = 0.875;

const float BG_ALPHA = 0.96;

const float SOLID_CYCLE_ALPHA_MAX = 0.375;
const float LOOP_COORD_ALPHA_MAX = 0.9375;
const float BG_ALPHA_MAX = 0.98;

const float EMPTY_ALPHA_MAX = 0.025;

uvec3 pcg3d(uvec3 v) {
    v = v * 1664525u + 1013904223u;
    v.x += v.y * v.z; v.y += v.z * v.x; v.z += v.x * v.y;
    v ^= v >> 16u;
    v.x += v.y * v.z; v.y += v.z * v.x; v.z += v.x * v.y;
    return v;
}

float random(vec2 st) {
    uvec3 h = pcg3d(floatBitsToUint(vec3(st.xyx) + u_seedOffset));
    return float(h.x) * (1.0 / 4294967296.0);
}

vec3 rotateHue(vec3 color, float angle) {
    float cosA = cos(angle * 6.28318);
    float sinA = sin(angle * 6.28318);
    vec3 k = vec3(0.57735); 
    return color * cosA + cross(k, color) * sinA + k * dot(k, color) * (1.0 - cosA);
}

vec2 encodeTurn16Units(float v) {
    float hi = floor(v / 256.0);
    return vec2(hi, v - hi * 256.0) / 255.0;
}

vec2 encodeTurn16(float t) {
    return encodeTurn16Units(floor(fract(t) * 65535.0 + 0.5));
}

float turn16Units(vec2 hiLo) {
    return dot(floor(hiLo * 255.0 + 0.5), vec2(256.0, 1.0));
}

float decodeTurn16(vec2 hiLo) {
    return turn16Units(hiLo) / 65535.0;
}

vec4 holdCycle(vec4 texel) {
    bool cyclingSolid = texel.a >= EMPTY_ALPHA_MAX && texel.a < SOLID_CYCLE_ALPHA_MAX;
    bool background = texel.a >= LOOP_COORD_ALPHA_MAX && texel.a < BG_ALPHA_MAX;
    if (!cyclingSolid && !background) return texel;
    return vec4(texelFetch(u_resolvedTexture, ivec2(gl_FragCoord.xy), 0).rgb, SOLID_FLAT_ALPHA);
}

const vec3 GEM_CELLS = vec3(8., 80., 800.);

const vec3 NOISE_CELL_PX = vec3(2., 8., 32.);

float chunkDirection(vec2 st, float cellPx) {
    vec2 chunk = vec2(10. * cellPx) / u_resolution;
    return random(floor(st / chunk) + vec2(17.17, 3.31)) < 0.5 ? 1. : -1.;
}

float gradientBlockAmount(vec2 st, bool horizontal, vec2 px) {
  float wavelength = 32.;

  
  
  float across = horizontal ? st.y : st.x;
  float along = horizontal ? st.x : st.y;

  float amount = 0.;

  if(u_gradientBlockPattern == 1) {
    
    wavelength *= 0.5;
    wavelength += 0.33;

    amount = (cos(PI/2. + st.y * PI * wavelength) + sin(PI/2. + st.x * PI * wavelength)) + 1. * 0.25;
  } else if(u_gradientBlockPattern == 2) {
    
    
    
    wavelength += .666;
    wavelength *= 0.75;
    float directionalSt = horizontal ? st.x + st.y : st.x - st.y;
    amount = cos(PI/2. + directionalSt * PI * wavelength) * 0.5 + 0.5;
  } else if(u_gradientBlockPattern == 3) {
    
    wavelength *= .555;
    amount = cos(st.x * PI * wavelength) * cos(st.y * PI * wavelength) * 0.5 + 0.5;
  } else if(u_gradientBlockPattern == 4) {
    wavelength += 7.77;
    wavelength *= 0.75;
    
    
    
    
    float zigFreq = 4.;
    float zig = abs(fract(along * zigFreq) - 0.5) / zigFreq;
    amount = cos(PI/2. + (across + zig) * PI * wavelength) * 0.5 + 0.5;
  } else if(u_gradientBlockPattern == 5) {
    
    wavelength *= 0.66;
    wavelength += 0.99;
    amount = fract(across * wavelength);
  } else if(u_gradientBlockPattern == 6) {
    wavelength += 0.66;
    
    amount = cos(PI/2. + (across + sin(along * PI * 7.5) * 0.05) * PI * wavelength) * 0.5 + 0.5;
  } else if(u_gradientBlockPattern == 7) {
    
    wavelength *= 22.2;
    amount = cos(st.x * st.y * PI * wavelength) * 0.5 + 0.5;
  } else if(u_gradientBlockPattern == 8) {
    
    wavelength *= 11.1;
    amount = cos((st.x * st.x - st.y * st.y) * PI * wavelength) * 0.5 + 0.5;
  } else if(u_gradientBlockPattern == 9) {
    
    wavelength *= 7.77;
    amount = cos((st.x * st.x + st.y * st.y) * PI * wavelength) * 0.5 + 0.5;
  } else if(u_gradientBlockPattern == 10) {
    
    
    
    
    
    
    
    uvec2 cell = uvec2(floor(px / NOISE_CELL_PX[u_chunkType])) + uvec2(u_seedOffset.xy * 256.);
    uint phase = cell.x * 0x11408759u + cell.y * 0x737FCA1Cu;
    uint halfTurn = (phase >> 15u) & 0xFFFFu;
    uint wave = halfTurn * (65536u - halfTurn);
    amount = float(((wave * u_noiseMultiplier) >> 14u) & 0xFFFFu) / 65535.;
  } else {
    wavelength += 0.33;
    
    amount = cos(PI/2. + across * PI * wavelength) * 0.5 + 0.5; 
  }

  return amount;
}

const float BG_GROW_TURNS = 0.5;

const float BG_BREATHE_TURNS = 1. / 3.;

const float BG_CELL_BASE_PX = 16.;
const float BG_BASE_HEIGHT = 1080.;

const float MOVE_RATE_BASE_PX = 100.;

const vec3 ZIG_SIZE_CELLS = vec3(0., 4., 10.);   
const vec3 ZIG_FREQ = vec3(0., 2., 4.);          
const vec3 ZIG_VARIETY = vec3(0., 1.5, 2.);
const float ZIG_BAND_CELLS = 5.;
const float ZIG_COVER = 0.25;

const vec3 ZIG_OFF = vec3(0., 0.75, 0.5);
const vec3 ZIG_STEPS = vec3(0., 10., 6.);

float zigzagShiftPx(float y, float cellPx) {
    if (u_chunkType == 0) return 0.;
    float size = ZIG_SIZE_CELLS[u_chunkType];
    float variety = ZIG_VARIETY[u_chunkType];
    
    float freq = ZIG_FREQ[u_chunkType] / 100. * (BG_CELL_BASE_PX / cellPx);
    float dx = 0.;
    for (int o = 0; o < 3; o++) {
        float k = o == 0 ? 1. / 3. : o == 1 ? 1. : 3.;
        float w = o == 1 ? 1. : variety;
        float bandPx = max(1., ZIG_BAND_CELLS * cellPx * k);
        vec2 key = vec2(floor(y / bandPx), 41.3 + float(o) * 7.1);
        if (random(key) >= ZIG_COVER) continue;
        
        
        
        
        vec2 stepKey = vec2(floor(u_staticLoopPhase * ZIG_STEPS[u_chunkType]), key.x + key.y * 3.7);
        if (random(stepKey + 7.) < ZIG_OFF[u_chunkType]) continue;
        float amp = size * cellPx * sqrt(k) * mix(1., random(key + 1.), variety);
        float bandFreq = freq * pow(2., (random(key + 2.) - 0.5) * 2. * variety);
        amp *= random(stepKey + 5.);
        bandFreq *= random(stepKey + 6.);
        float tri = abs(fract(y * bandFreq + random(key + 3.)) - 0.5) * 4. - 1.;
        dx += w * amp * tri;
    }
    return floor(dx + 0.5);
}

float bgLoopCoord(vec2 st) {
    float cellPx = max(2., floor(BG_CELL_BASE_PX * u_resolution.y / BG_BASE_HEIGHT * u_checkerScale + 0.5));
    
    vec2 pos = (floor(st * u_resolution) + 0.5) / cellPx;
    vec2 cell = floor(pos);
    float odd = mod(cell.x + cell.y, 2.);
    
    float base = floor(fract(u_seedOffset.z) * 3.);
    if (u_bgStyle == 0) return mod(base + odd, 3.) / 3.;
    
    vec2 local = abs(fract(pos) - 0.5);
    float d = 2. * max(local.x, local.y);
    
    
    if (u_bgStyle == 1) return base / 3. + odd * 0.5 - d * BG_GROW_TURNS;
    
    
    
    return base / 3. + (1. - 2. * odd) * (1. - d) * BG_BREATHE_TURNS;
}

float steppedTexelShift(float v, float frame) {
    int loopFrames = int(u_brushLoopFrames + 0.5);
    int k = int(round(v * u_brushLoopFrames));
    
    
    
    int f = int(frame + 0.5) + loopFrames;
    return float(f * k / loopFrames - (f - 1) * k / loopFrames);
}

void main() {
    vec2 st = v_texCoord;
    vec2 orgSt = st; 

    bool useGlobalFreeze = u_globalFreeze > 0.5;

    float densityAdjustment = ceil(2. / u_pixelDensity);

    
    float cellPx = max(2., floor(BG_CELL_BASE_PX * u_resolution.y / BG_BASE_HEIGHT + 0.5));

    
    
    vec4 movementColor = texture(u_movementTexture, orgSt);
    
    
    
    
    float movementMax = max(movementColor.r, max(movementColor.g, movementColor.b));
    bool useMovementBuffer = movementMax >= DRAW_ACTIVE_THRESHOLD;

    if (useMovementBuffer) {
      
      
      bool flowMode = movementColor.b >= B_FLOW_MIN && movementColor.b < B_FLOW_MAX;
      
      bool freezeMode = !flowMode && movementColor.b >= DRAW_ACTIVE_THRESHOLD;

      
      
      if (useGlobalFreeze) {
        fragColor = texture(u_texture, orgSt);
        if (freezeMode) fragColor = holdCycle(fragColor);
        return;
      }

      float moveTime = u_brushTime * (u_targetFps / 30.);

      float direction = 1.;
      bool shouldMove = false;
      bool shuffleMode = false;
      bool hWaterfallMode = false;
      float moveDirectionOverride = 0.0;

      vec2 flowDir = vec2(0.0);  
      vec2 flowStep = vec2(0.0); 

      if (!flowMode && movementColor.r >= DRAW_ACTIVE_THRESHOLD) {
        if (movementColor.r < DRAW_SHIFT_THRESHOLD) {
          shuffleMode = true;
        } else if (movementColor.r < DRAW_DIRECTION_THRESHOLD) {
          shouldMove = true;
          hWaterfallMode = movementColor.r >= R_STRAIGHT_RIGHT_MAX;
          moveDirectionOverride = -1.0;
        } else {
          shouldMove = true;
          hWaterfallMode = movementColor.r >= R_STRAIGHT_LEFT_MAX;
          moveDirectionOverride = 1.0;
        }
      }
      
      bool trickleMode = false;
      bool waterfallMode = false;
      bool straightFallMode = false;
      float fallDirection = 1.0;

      if (!flowMode && movementColor.g >= DRAW_ACTIVE_THRESHOLD) {
        if (movementColor.g < G_TRICKLE_MAX) {
          trickleMode = true;
        } else if (movementColor.g < G_STRAIGHT_DOWN_MAX) {
          straightFallMode = true;
          fallDirection = 1.0;
        } else if (movementColor.g < G_WATERFALL_DOWN_MAX) {
          waterfallMode = true;
          fallDirection = 1.0;
        } else if (movementColor.g < G_STRAIGHT_UP_MAX) {
          straightFallMode = true;
          fallDirection = -1.0;
        } else {
          waterfallMode = true;
          fallDirection = -1.0;
        }
      }

      
      
      
      if (flowMode) {
        flowDir = (movementColor.rg * 255.0 - 128.0) / 127.0;
        flowStep = -sign(flowDir);
        shouldMove = flowDir.x != 0.0;
        moveDirectionOverride = flowStep.x;
        straightFallMode = flowDir.y != 0.0;
        fallDirection = flowStep.y;
      }

      if (moveDirectionOverride != 0.0) {
        direction = moveDirectionOverride;
      }
      bool shouldFall = waterfallMode || straightFallMode;

      float moveAmount = 0.0;
      float fallAmount = 0.0;

      
      bool extraMoves = false;
      if (shuffleMode) {
        extraMoves = random(floor(st * u_extraMoveStutterScale) + moveTime + 1.49) < u_extraMoveStutterThreshold;
      }
      if (shuffleMode && !shouldMove) {
        direction = chunkDirection(orgSt, cellPx);
      }

      
      
      
      
      
      float texelRate = u_moveSpeed * MOVE_RATE_BASE_PX * (u_resolution.y / BG_BASE_HEIGHT) * densityAdjustment;

      
      if (!flowMode && (shouldMove || extraMoves)) {
        
        
        
        float moveRateX = texelRate;
        if (hWaterfallMode && u_fallWaterfallMult > 0.) {
          float waterY = floor(st.y * (u_resolution.y / 2.));
          float variance = (0.5 - random(vec2(waterY, u_brushBlockTime) + 7.)) * u_fallWaterfallMult;
          moveRateX = texelRate * (1.1 + variance);
        }
        
        
        
        moveAmount = direction * steppedTexelShift(moveRateX, u_brushFrameCount)
                   / (u_resolution.x * densityAdjustment);
      }

      bool extraFall = false;
      if (trickleMode) {
        extraFall = random(floor(st * u_extraFallStutterScale) + moveTime + 2.) < u_extraFallStutterThreshold;
      }
      if (trickleMode && !shouldFall) {
        fallDirection = chunkDirection(orgSt, cellPx);
      }

      if (!flowMode && (shouldFall || extraFall)) {
        
        
        
        
        
        
        
        float texelRateY = texelRate;
        if (waterfallMode && u_fallWaterfallMult > 0.) {
          float waterX = floor(st.x * (u_resolution.x / 2.));
          vec2 waterFallSt = vec2(waterX, u_brushBlockTime);
          float waterFallVariance = (0.5 - random(waterFallSt)) * u_fallWaterfallMult;
          texelRateY = texelRate * (1.1 + waterFallVariance);
        }

        fallAmount = steppedTexelShift(texelRateY, u_brushFrameCount)
                   / (u_resolution.y * densityAdjustment);

        fallAmount *= fallDirection;
      }

      
      
      
      
      
      if (flowMode) {
        moveAmount = flowStep.x * steppedTexelShift(texelRate * abs(flowDir.x), u_brushFrameCount)
                   / (u_resolution.x * densityAdjustment);
        fallAmount = flowStep.y * steppedTexelShift(texelRate * abs(flowDir.y), u_brushFrameCount)
                   / (u_resolution.y * densityAdjustment);
      }

      if (freezeMode) {
        moveAmount = 0.0;
        fallAmount = 0.0;
      }

      
      st.x += moveAmount * densityAdjustment;
      st.y += fallAmount * densityAdjustment;

      
      vec2 margin = (1.0 / u_resolution) * 2.;
      bool isOutOfXBounds = st.x >= 1. - margin.x || st.x <= margin.x;
      bool isOutOfYBounds = st.y >= 1. - margin.y || st.y <= margin.y;

      if (isOutOfXBounds && shouldMove) {
        if (direction < 0. && st.x < margin.x) {
          st.x = 1. - st.x;
        }
        if (direction > 0. && st.x > 1. - margin.x) {
          st.x = mod(st.x + margin.x, 1.);
        }
      }

      if (isOutOfYBounds && shouldFall) {
        if (fallDirection < 0. && st.y < margin.y) {
          st.y = 1. - st.y;
        }
        if (fallDirection > 0. && st.y > 1. - margin.y) {
          st.y = mod(st.y + margin.y, 1.);
        }
      }

      
      fragColor = texture(u_texture, st);
      if (freezeMode) fragColor = holdCycle(fragColor);
      return;
    }

    
    
    
    vec4 livePaint = texelFetch(u_paintTexture, ivec2(gl_FragCoord.xy), 0);
    if (livePaint.r >= PAINT_LIVE_MIN && livePaint.r < PAINT_EMPTY_MIN) {
      uvec3 b = uvec3(round(livePaint.gba * 255.));
      ivec2 src = ivec2((b.z >> 4u) << 8u | b.x, (b.z & 15u) << 8u | b.y);
      fragColor = texelFetch(u_texture, src, 0);
      return;
    }

    
    
    vec3 paint = texture(u_paintTexture, orgSt).rgb;

    
    
    
    float shiftPx = zigzagShiftPx(gl_FragCoord.y, cellPx);
    vec2 dSt = vec2(fract(orgSt.x + shiftPx / u_resolution.x), orgSt.y);
    
    vec2 dPx = mod(gl_FragCoord.xy + vec2(shiftPx, 0.), u_resolution);
    float paintR = paint.r;
    bool useBlack = false;  
    bool useBright = false; 
    bool useRibbon = false; 
    int solidIndex = 0;     
    if (paintR >= PAINT_GEM_MIN) {
      useRibbon = true;
    } else if (paintR >= PAINT_SOLID_CYCLE_MIN) {
      solidIndex = 4;
    } else if (paintR >= PAINT_SOLID3_MIN) {
      solidIndex = 3;
    } else if (paintR >= PAINT_SOLID2_MIN) {
      solidIndex = 2;
    } else if (paintR >= PAINT_SOLID_MIN) {
      solidIndex = 1;
    } else if (paintR >= PAINT_EMPTY_MIN && paintR < PAINT_EMPTY_MAX) {
      useBlack = true;
      useBright = paintR >= PAINT_BRIGHT_MIN;
    }

    
    vec4 initColor = vec4(1.);

    
    
    
    bool useBlankStatic = false;
    if (solidIndex == 0 && (useGlobalFreeze || (!useRibbon && !useBlack))) {
      useBlankStatic = random(st * u_blankStaticScale + floor(
        fract(u_staticLoopPhase * u_staticCyclesBlank) * u_blankStaticTimeMult) + 1.) < u_blankStaticThreshold;
    }

    bool useBlank = (useBlankStatic && !useRibbon && solidIndex == 0) || useBlack;

    bool usingStatic = useBlankStatic;

    if (solidIndex > 0) {
      
      
      
      
      
      vec2 cyclePhase = paint.gb;
      if (solidIndex == 4) {
        vec3 dPaint = textureLod(u_paintTexture, dSt, 0.).rgb;
        if (dPaint.r >= PAINT_SOLID_CYCLE_MIN && dPaint.r < PAINT_GEM_MIN) cyclePhase = dPaint.gb;
      }
      vec3 solidRgb = solidIndex == 4 ? vec3(cyclePhase, 0.)
                    : solidIndex == 2 ? u_staticColor2
                    : solidIndex == 3 ? u_staticColor3
                    : u_staticColor1;
      initColor = vec4(solidRgb, solidIndex == 4 ? SOLID_CYCLE_ALPHA : SOLID_FLAT_ALPHA);
      usingStatic = false;
    } else if (useBlank) {
      
      
      
      initColor = vec4(encodeTurn16(bgLoopCoord(dSt)), useBright ? 1. : 0., BG_ALPHA);
    } else {
      float staticBlockTime = floor(u_staticLoopPhase * u_staticCyclesBlock);

      vec2 dirtNoiseSt = floor(orgSt * u_dirtNoiseScale);
      float rnd = random(dirtNoiseSt + staticBlockTime);

      bool useBlock = useRibbon && rnd < u_ribbonDirtThreshold;

      
      
      vec2 gemBlock = vec2(GEM_CELLS[u_chunkType] * cellPx) / u_resolution;
      vec2 stPlus = dSt / gemBlock;
      
      
      bool horizontalGem = random(vec2(17.17, 3.31)) < 0.5;

      
      
      bool isGradient = useBlock || rnd < .25;
      int colorIdx = rnd < .5 ? 0 : rnd < .75 ? 1 : 2;
      float t = isGradient ? gradientBlockAmount(stPlus, horizontalGem, dPx) : float(colorIdx) / 3.;
      if (!useBlock) usingStatic = true;

      
      if (u_useColorCycle) {
        vec3 rgb = isGradient ? rotateHue(vec3(1., 0., .5), t)
                 : colorIdx == 0 ? u_staticColor1
                 : colorIdx == 1 ? u_staticColor2
                 : u_staticColor3;
        initColor = vec4(rotateHue(rgb, u_steppedHuePhase), 1.);
      } else {
        
        initColor = vec4(encodeTurn16(t + u_steppedHuePhase), 0., LOOP_COORD_ALPHA);
      }
    }

    
    
    
    float resetThreshold = paintR < PAINT_LIVE_MIN ? u_staticResetThreshold : u_resetEdgeThreshold;
    bool useReset = random(2. * orgSt + fract(u_staticLoopPhase * u_staticCyclesEdge)) < resetThreshold;
    
    if (useGlobalFreeze) useReset = useReset && usingStatic;
    if (u_noiseFreeze > 0.5) useReset = false;

    vec4 color = texture(u_texture, orgSt);
    
    if (color.a < EMPTY_ALPHA_MAX || useReset) {
      color = initColor;
    }

    
    
    fragColor = color;
}`, Ba = `#version 300 es
in vec2 a_position;
uniform mediump vec2 u_resolution;

void main() {
    vec2 clipSpace = (a_position / u_resolution) * 2.0 - 1.0;
    gl_Position = vec4(clipSpace, 0.0, 1.0);
}`, Ua = `#version 300 es
precision highp float;

uniform vec3 u_color;

uniform float u_alpha;
uniform float u_squareMode;

uniform float u_fuzzyEdge;
uniform vec2 u_center;
uniform vec2 u_radius;

uniform vec2 u_segDelta;

uniform vec2 u_phase;
uniform float u_phaseWrite;

uniform vec2 u_gradStart;
uniform vec2 u_gradStep;

uniform float u_liveWrite;
uniform float u_liveRestore;
uniform sampler2D u_paintPrev;

uniform float u_liveMask;
uniform vec2 u_liveOrigin;
uniform vec2 u_liveSize;
uniform vec2 u_liveCorner;

out vec4 outColor;

vec2 encodeTurn16Units(float v) {
    float hi = floor(v / 256.0);
    return vec2(hi, v - hi * 256.0) / 255.0;
}

vec2 encodeTurn16(float t) {
    return encodeTurn16Units(floor(fract(t) * 65535.0 + 0.5));
}

float turn16Units(vec2 hiLo) {
    return dot(floor(hiLo * 255.0 + 0.5), vec2(256.0, 1.0));
}

float decodeTurn16(vec2 hiLo) {
    return turn16Units(hiLo) / 65535.0;
}

const uint LIVE_BYTE_BASE = 32u; 
const uint LIVE_BYTE_END = 64u;  

const float TYPE_R[8] = float[8](0., .5, .65625, .71875, .78125, .84375, 1., 144. / 255.);
const int TYPE_SOLID_CYCLE = 5;

int paintType(float r) {
    if (r >= 0.875) return 6;
    if (r >= 0.8125) return 5;
    if (r >= 0.75) return 4;
    if (r >= 0.6875) return 3;
    if (r >= 0.625) return 2;
    if (r >= 0.53) return 7; 
    if (r >= 0.25) return 1;
    return 0;
}

bool prevPaint(out int type) {
    vec4 prev = texelFetch(u_paintPrev, ivec2(gl_FragCoord.xy), 0);
    uint byte = uint(round(prev.r * 255.));
    if (byte >= LIVE_BYTE_BASE && byte < LIVE_BYTE_END) {
        type = int((byte - LIVE_BYTE_BASE) / 4u);
        return true;
    }
    type = paintType(prev.r);
    return false;
}

const float EDGE_FALLOFF_FRAC = 0.5;     
const float EDGE_FALLOFF_MAX_PX = 30.0;  

float hash(vec2 p) {
    highp vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

void fuzzyEdge(float d) {
    if (u_fuzzyEdge < 0.5) return;
    float r = max(min(u_radius.x, u_radius.y), 1.0);
    float bandPx = min(r * EDGE_FALLOFF_FRAC, EDGE_FALLOFF_MAX_PX);
    float start = 1.0 - bandPx / r;
    float chance = 1.0 - smoothstep(start, 1.0, d);
    if (hash(gl_FragCoord.xy) > chance) discard;
}

vec4 shade(float t) {
    if (u_liveRestore > 0.5) {
        int type;
        if (!prevPaint(type)) discard;
        vec2 gb = type == TYPE_SOLID_CYCLE ? encodeTurn16(u_phase.x) : vec2(0.);
        return vec4(TYPE_R[type], gb, 1.);
    }
    if (u_liveWrite > 0.5) {
        int type;
        prevPaint(type); 
        vec2 local = clamp(floor(gl_FragCoord.xy - u_liveCorner), vec2(0.), u_liveSize - 1.);
        uvec2 src = uvec2(u_liveOrigin + local);
        uvec3 bytes = uvec3(src.x & 255u, src.y & 255u, ((src.x >> 8u) << 4u) | (src.y >> 8u));
        float r = float(LIVE_BYTE_BASE + 4u * uint(type) + 2u) / 255.;
        return vec4(r, vec3(bytes) / 255.);
    }
    vec3 c = u_color;
    if (u_phaseWrite > 0.5) {
        if (any(notEqual(u_gradStep, vec2(0.)))) {
            t = clamp(dot(gl_FragCoord.xy - u_gradStart, u_gradStep), 0., 1.);
        }
        c.gb = encodeTurn16(u_phase.x + t * u_phase.y);
    }
    return vec4(c, u_alpha);
}

void main() {
    if (u_liveMask > 1.5) {
        
        
        vec2 h = u_liveSize * 0.5;
        vec2 q = (gl_FragCoord.xy - (u_liveOrigin + h)) / h;
        if (length(q) <= 1.0) discard;
    } else if (u_liveMask > 0.5
        && all(greaterThanEqual(gl_FragCoord.xy, u_liveOrigin))
        && all(lessThan(gl_FragCoord.xy, u_liveOrigin + u_liveSize))) discard;

    
    
    vec2 p = (gl_FragCoord.xy - u_center) / u_radius;
    vec2 seg = u_segDelta / u_radius;

    
    
    
    if (u_squareMode > 0.5) {
        vec2 lo = vec2(0.0);
        vec2 hi = vec2(1.0);
        for (int i = 0; i < 2; i++) {
            if (abs(seg[i]) < 1e-5) {
                if (abs(p[i]) > 1.0) discard;
            } else {
                float a = (p[i] - 1.0) / seg[i];
                float b = (p[i] + 1.0) / seg[i];
                lo[i] = max(0.0, min(a, b));
                hi[i] = min(1.0, max(a, b));
            }
        }
        float t0 = max(lo.x, lo.y);
        float t1 = min(hi.x, hi.y);
        if (t0 > t1) discard;
        
        
        
        float tm = 0.5 * (t0 + t1);
        fuzzyEdge(max(abs(p.x - tm * seg.x), abs(p.y - tm * seg.y)));
        outColor = shade(tm);
        return;
    }

    
    float segLen2 = dot(seg, seg);
    float t = segLen2 > 0.0 ? clamp(dot(p, seg) / segLen2, 0.0, 1.0) : 0.0;
    float d = length(p - t * seg); 
    if (d > 1.0) discard;
    fuzzyEdge(d); 

    outColor = shade(t);
}`, Hn = `#version 300 es
in vec2 a_position;
in vec2 a_texCoord;
out vec2 v_texCoord;
void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
    v_texCoord = a_texCoord;
}`, za = `#version 300 es

precision highp float;

uniform sampler2D u_texture;  

uniform float u_crtEnabled;   

uniform float u_viewZoom;
uniform vec2 u_viewCenter;

uniform float u_bloomEnabled;  
uniform sampler2D u_bloomTex;  
uniform float u_bloomIntensity;
uniform float u_bloomEdgeFade;  

in vec2 v_texCoord;
out vec4 fragColor;

const float CRT_CURVATURE = 5.5;

const float VIGNETTE_START    = 0.85;  
const float VIGNETTE_END      = 1.45;  
const float VIGNETTE_DARKNESS = 0.30;  
const float CORNER_START      = 1.20;  
const float CORNER_END        = 1.45;  
const float CORNER_DARKNESS   = 0.5;  

const float CENTER_BRIGHTNESS = 0.15;  
const float CENTER_RADIUS     = 0.65;  

const float EDGE_BAND = 0.012;

const float CORNER_RADIUS = 0.1;

vec2 crtWarp(vec2 uv) {
    vec2 c = uv * 2.0 - 1.0;            
    vec2 offset = c.yx / CRT_CURVATURE;
    c += c * offset * offset;          
    return c * 0.5 + 0.5;              
}

float roundedTubeDist(vec2 uv) {
    vec2 res = vec2(textureSize(u_texture, 0));
    float minDim = min(res.x, res.y);
    vec2 pix = (uv - 0.5) * res;                   
    float radius = CORNER_RADIUS * 0.5 * minDim;   
    vec2 b = res * 0.5;                            
    vec2 q = abs(pix) - (b - radius);
    float d = min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - radius;
    return d / minDim;                            
}

void main() {
    bool crt = u_crtEnabled >= 0.5;

    
    
    vec2 uv = crt ? crtWarp(v_texCoord) : v_texCoord;
    
    
    vec2 sceneUV = u_viewCenter + (uv - 0.5) / u_viewZoom;

    vec4 color = texture(u_texture, sceneUV);

    
    if (crt) {
        
        
        
        
        
        float tubeDist = roundedTubeDist(uv);
        float tube = smoothstep(0.0, EDGE_BAND, -tubeDist);

        color.rgb *= tube;
    }

    
    
    
    
    
    
    
    
    
    
    if (u_bloomEnabled > 0.5) {
        
        vec3 bloom = texture(u_bloomTex, sceneUV).rgb;
        
        
        float fade = crt ? smoothstep(0.0, u_bloomEdgeFade, -roundedTubeDist(uv)) : 1.0;
        color.rgb += bloom * u_bloomIntensity * fade;
    }

    
    if(crt) {
        
        
        
        vec2 vc = (uv - 0.5) * 2.0;        
        float r = length(vc);
        float vig = 1.0
            - VIGNETTE_DARKNESS * smoothstep(VIGNETTE_START, VIGNETTE_END, r)
            - CORNER_DARKNESS   * smoothstep(CORNER_START, CORNER_END, r)
            + CENTER_BRIGHTNESS * (1.0 - smoothstep(0.0, CENTER_RADIUS, r));  
        vig = max(vig, 0.0);              

        
        color.rgb *= vig;
    }

    fragColor = vec4(color.rgb, 1.0);
}`, Oa = `#version 300 es

precision highp float;

uniform sampler2D u_texture;

uniform bool u_useColorCycle;

uniform float u_cycleHue;

uniform float u_cycleHueSmooth;
uniform vec3 u_staticColor1;
uniform vec3 u_staticColor2;
uniform vec3 u_staticColor3;
uniform vec3 u_blankColorMult;

const float SOLID_CYCLE_ALPHA_MAX = 0.375;
const float SOLID_FLAT_ALPHA_MAX = 0.75;
const float LOOP_COORD_ALPHA_MAX = 0.9375;
const float BG_ALPHA_MAX = 0.98;

const vec3 BRIGHT_BG_MULT = vec3(0.65);

in vec2 v_texCoord;
out vec4 fragColor;

vec3 rotateHue(vec3 color, float angle) {
    float cosA = cos(angle * 6.28318);
    float sinA = sin(angle * 6.28318);
    vec3 k = vec3(0.57735); 
    return color * cosA + cross(k, color) * sinA + k * dot(k, color) * (1.0 - cosA);
}

float chroma(vec3 c) {
    return max(c.r, max(c.g, c.b)) - min(c.r, min(c.g, c.b));
}

const float CHROMA_LO = 0.25; 
const float CHROMA_HI = 0.5;  

vec3 threeWayGradient(vec3 c1, vec3 c2, vec3 c3, float t) {
    float s = fract(t) * 3.0;
    if (s < 1.0) return mix(c1, c2, s);
    if (s < 2.0) return mix(c2, c3, s - 1.0);
    return mix(c3, c1, s - 2.0);
}
vec2 encodeTurn16Units(float v) {
    float hi = floor(v / 256.0);
    return vec2(hi, v - hi * 256.0) / 255.0;
}

vec2 encodeTurn16(float t) {
    return encodeTurn16Units(floor(fract(t) * 65535.0 + 0.5));
}

float turn16Units(vec2 hiLo) {
    return dot(floor(hiLo * 255.0 + 0.5), vec2(256.0, 1.0));
}

float decodeTurn16(vec2 hiLo) {
    return turn16Units(hiLo) / 65535.0;
}

vec3 paletteLoop(float t) {
    return threeWayGradient(u_staticColor1, u_staticColor2, u_staticColor3, t);
}

void main() {
    vec4 texel = texture(u_texture, v_texCoord);
    vec3 rgb;

    if (texel.a < SOLID_CYCLE_ALPHA_MAX) {
        
        
        
        
        rgb = paletteLoop(u_cycleHueSmooth - decodeTurn16(texel.rg));
    } else if (texel.a < SOLID_FLAT_ALPHA_MAX) {
        
        rgb = texel.rgb;
    } else if (texel.a < LOOP_COORD_ALPHA_MAX) {
        
        rgb = paletteLoop(decodeTurn16(texel.rg) + u_cycleHue);
    } else if (texel.a < BG_ALPHA_MAX) {
        
        
        
        
        float t = decodeTurn16(texel.rg);
        rgb = (u_useColorCycle ? rotateHue(paletteLoop(t), u_cycleHue) : paletteLoop(t + u_cycleHue))
            * (texel.b >= 0.5 ? BRIGHT_BG_MULT : u_blankColorMult);
    } else {
        
        float cycleAmt = smoothstep(CHROMA_LO, CHROMA_HI, chroma(texel.rgb));
        
        rgb = cycleAmt > 0.0 ? mix(texel.rgb, rotateHue(texel.rgb, u_cycleHue), cycleAmt) : texel.rgb;
    }

    fragColor = vec4(rgb, 1.0);
}`, Na = `#version 300 es

precision highp float;

uniform sampler2D u_texture;
uniform vec2  u_texelSize;  
uniform float u_prefilter;  
uniform float u_threshold;  
uniform float u_lumaWeight; 

in vec2 v_texCoord;
out vec4 fragColor;

float luma(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }

float chroma(vec3 c) { return max(c.r, max(c.g, c.b)) - min(c.r, min(c.g, c.b)); }

vec3 brightPass(vec3 c) {
    const float KNEE = 0.3;
    float b = max(luma(c) * u_lumaWeight, chroma(c));
    float soft = clamp((b - u_threshold + KNEE) / (2.0 * KNEE), 0.0, 1.0);
    float w = max(soft * soft, step(u_threshold, b));
    return c * w;
}

vec3 tap(vec2 offset) {
    return texture(u_texture, v_texCoord + u_texelSize * offset).rgb;
}

void main() {
    vec3 a = tap(vec2(-2.0,  2.0));
    vec3 b = tap(vec2( 0.0,  2.0));
    vec3 c = tap(vec2( 2.0,  2.0));
    vec3 d = tap(vec2(-2.0,  0.0));
    vec3 e = tap(vec2( 0.0,  0.0));
    vec3 f = tap(vec2( 2.0,  0.0));
    vec3 g = tap(vec2(-2.0, -2.0));
    vec3 h = tap(vec2( 0.0, -2.0));
    vec3 i = tap(vec2( 2.0, -2.0));
    vec3 j = tap(vec2(-1.0,  1.0));
    vec3 k = tap(vec2( 1.0,  1.0));
    vec3 l = tap(vec2(-1.0, -1.0));
    vec3 m = tap(vec2( 1.0, -1.0));

    vec3 col = e * 0.125;
    col += (a + c + g + i) * 0.03125;
    col += (b + d + f + h) * 0.0625;
    col += (j + k + l + m) * 0.125;

    if (u_prefilter > 0.5) {
        col = brightPass(col);
    }
    fragColor = vec4(col, 1.0);
}`, Ha = `#version 300 es

precision highp float;

uniform sampler2D u_texture;  
uniform vec2  u_texelSize;    
uniform float u_radius;       

in vec2 v_texCoord;
out vec4 fragColor;

void main() {
    vec2 t = u_texelSize * u_radius;
    vec3 col = texture(u_texture, v_texCoord).rgb * 4.0;
    col += texture(u_texture, v_texCoord + vec2(-t.x,  0.0)).rgb * 2.0;
    col += texture(u_texture, v_texCoord + vec2( t.x,  0.0)).rgb * 2.0;
    col += texture(u_texture, v_texCoord + vec2( 0.0, -t.y)).rgb * 2.0;
    col += texture(u_texture, v_texCoord + vec2( 0.0,  t.y)).rgb * 2.0;
    col += texture(u_texture, v_texCoord + vec2(-t.x, -t.y)).rgb;
    col += texture(u_texture, v_texCoord + vec2( t.x, -t.y)).rgb;
    col += texture(u_texture, v_texCoord + vec2(-t.x,  t.y)).rgb;
    col += texture(u_texture, v_texCoord + vec2( t.x,  t.y)).rgb;
    col *= (1.0 / 16.0);
    fragColor = vec4(col, 1.0);
}`, Xa = `#version 300 es

precision highp float;

uniform sampler2D u_texture;  
uniform sampler2D u_held;     
uniform float u_weight;       

in vec2 v_texCoord;
out vec4 fragColor;

float bayer8(uvec2 p) {
    uint x = p.x & 7u, y = p.y & 7u, xy = x ^ y;
    uint v = ((xy & 1u) << 5) | ((x & 1u) << 4) | ((xy & 2u) << 2)
           | ((x & 2u) << 1) | ((xy & 4u) >> 1) | ((x & 4u) >> 2);
    return (float(v) + 0.5) / 64.0;
}

void main() {
    ivec2 p = ivec2(gl_FragCoord.xy);
    vec4 live = texelFetch(u_texture, p, 0);
    vec4 held = texelFetch(u_held, p, 0);
    float light = dot(0.5 * (live.rgb + held.rgb), vec3(0.2126, 0.7152, 0.0722));
    
    
    float h = fract(bayer8(uvec2(p)) + light);
    fragColor = h < u_weight ? held : live;
}`;
function ir(e, n, r) {
  const i = e.createShader(n);
  return i ? (e.shaderSource(i, r), e.compileShader(i), e.getShaderParameter(i, e.COMPILE_STATUS) ? i : (console.error("Shader compile error:", e.getShaderInfoLog(i)), e.deleteShader(i), null)) : null;
}
function en(e, n, r) {
  const i = ir(e, e.VERTEX_SHADER, n), a = ir(e, e.FRAGMENT_SHADER, r);
  if (!i || !a) return null;
  const t = e.createProgram();
  return e.attachShader(t, i), e.attachShader(t, a), e.linkProgram(t), e.getProgramParameter(t, e.LINK_STATUS) ? (e.deleteShader(i), e.deleteShader(a), t) : (console.error("Program link error:", e.getProgramInfoLog(t)), e.deleteProgram(t), null);
}
const lr = 1e-6;
function qo(e, n) {
  return e.length === 0 ? n : Math.max(e[0], Math.min(e[e.length - 1], n));
}
function sr(e, n, r) {
  const i = e.length - 1;
  if (r > 0) {
    for (let a = 0; a <= i; a++)
      if (e[a] > n + lr) return { size: e[a], index: a };
    return { size: e[i], index: i };
  }
  for (let a = i; a >= 0; a--)
    if (e[a] < n - lr) return { size: e[a], index: a };
  return { size: e[0], index: 0 };
}
function cr(e, n) {
  let r = 0, i = 1 / 0;
  for (let a = 0; a < e.length; a++) {
    const t = Math.abs(e[a] - n);
    t < i && (i = t, r = a);
  }
  return r;
}
function Ga(e, n) {
  const r = e.length - 1;
  if (r <= 0) return 0;
  const i = qo(e, n);
  let a = 0;
  for (; a < r - 1 && i >= e[a + 1]; ) a++;
  const t = e[a + 1] - e[a];
  return (t > 0 ? a + (i - e[a]) / t : a) / r;
}
function $o(e) {
  return e === "shuffle" || e === "move" || e === "trickle" || e === "waterfall";
}
function Tt(e) {
  return e === "shuffle" || e === "move" ? "horizontal" : "vertical";
}
function qr(e, n) {
  return e.mode !== n.mode ? !1 : !("direction" in e) || !("direction" in n) ? !0 : e.direction === n.direction && e.waterfallVariant === n.waterfallVariant;
}
function Va(e) {
  return e === "waterfall" || e === "move" || e === "trickle" || e === "shuffle" || e === "flow" || e === "freeze" || e === "erase";
}
function Wa(e) {
  return e === "static" || e === "gem" || e === "empty" || e === "bright" || e === "solid1" || e === "solid2" || e === "solid3" || e === "solidCycle" || e === "live";
}
const Ya = 0.625, ur = 128, fr = 127, qa = [0, 0];
function No(e, n, r, i = qa) {
  if (e === "erase") return [0, 0, 0];
  if (e === "flow")
    return [
      (ur + Math.round(i[0] * fr)) / 255,
      (ur + Math.round(i[1] * fr)) / 255,
      Ya
    ];
  let a = 0, t = 0, u = 0;
  return e === "shuffle" ? a = 0.375 : e === "move" && (n === "left" ? a = r ? 0.96875 : 0.875 : a = r ? 0.71875 : 0.625), e === "trickle" ? t = 0.325 : e === "waterfall" && (n === "down" ? t = r ? 0.625 : 0.475 : t = r ? 0.925 : 0.775), e === "freeze" && (u = 0.375), [a, t, u];
}
function $a(e) {
  return "direction" in e ? No(e.mode, e.direction, e.waterfallVariant) : No(e.mode, "down", !0);
}
function $r(e) {
  switch (e) {
    case "empty":
      return [0.5, 0, 0];
    case "bright":
      return [144 / 255, 0, 0];
    case "static":
      return [0, 0, 0];
    case "gem":
      return [1, 0, 0];
    case "solid1":
      return [0.65625, 0, 0];
    case "solid2":
      return [0.71875, 0, 0];
    case "solid3":
      return [0.78125, 0, 0];
    case "solidCycle":
      return [0.84375, 0, 0];
    case "live":
      return [48 / 255, 0, 0];
    default:
      return [0.25, 0, 0];
  }
}
function Ka(e) {
  const n = en(e, Ba, Ua);
  return n ? {
    program: n,
    attribLocations: {
      position: e.getAttribLocation(n, "a_position")
    },
    uniformLocations: {
      resolution: e.getUniformLocation(n, "u_resolution"),
      center: e.getUniformLocation(n, "u_center"),
      radius: e.getUniformLocation(n, "u_radius"),
      color: e.getUniformLocation(n, "u_color"),
      alpha: e.getUniformLocation(n, "u_alpha"),
      squareMode: e.getUniformLocation(n, "u_squareMode"),
      fuzzyEdge: e.getUniformLocation(n, "u_fuzzyEdge"),
      segDelta: e.getUniformLocation(n, "u_segDelta"),
      phase: e.getUniformLocation(n, "u_phase"),
      phaseWrite: e.getUniformLocation(n, "u_phaseWrite"),
      gradStart: e.getUniformLocation(n, "u_gradStart"),
      gradStep: e.getUniformLocation(n, "u_gradStep"),
      liveWrite: e.getUniformLocation(n, "u_liveWrite"),
      liveOrigin: e.getUniformLocation(n, "u_liveOrigin"),
      liveSize: e.getUniformLocation(n, "u_liveSize"),
      liveCorner: e.getUniformLocation(n, "u_liveCorner"),
      liveRestore: e.getUniformLocation(n, "u_liveRestore"),
      liveMask: e.getUniformLocation(n, "u_liveMask"),
      paintPrev: e.getUniformLocation(n, "u_paintPrev")
    }
  } : null;
}
function Wn(e, n, r) {
  const i = e.createTexture();
  e.bindTexture(e.TEXTURE_2D, i), e.texImage2D(
    e.TEXTURE_2D,
    0,
    e.RGBA,
    n,
    r,
    0,
    e.RGBA,
    e.UNSIGNED_BYTE,
    null
  ), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.NEAREST), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.NEAREST), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.CLAMP_TO_EDGE), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.CLAMP_TO_EDGE);
  const a = e.createFramebuffer();
  return e.bindFramebuffer(e.FRAMEBUFFER, a), e.framebufferTexture2D(
    e.FRAMEBUFFER,
    e.COLOR_ATTACHMENT0,
    e.TEXTURE_2D,
    i,
    0
  ), { texture: i, fbo: a };
}
const Ro = 7, Za = 0.5;
function ja(e, n, r) {
  const i = Ka(e);
  if (!i) throw new Error("Failed to create drawing program");
  const a = i;
  e.useProgram(a.program), e.uniform1i(a.uniformLocations.paintPrev, Ro);
  const t = e.createBuffer(), u = new Float32Array(8);
  let m, f, g, p, d, y, T = n, k = r, b = [], U = 0, P = 0, K = 1, C = Pa, D = Oo, x = Yr;
  function w(F, B) {
    m && e.deleteTexture(m), f && e.deleteFramebuffer(f), g && e.deleteTexture(g), p && e.deleteFramebuffer(p), d && e.deleteTexture(d), y && e.deleteFramebuffer(y), { texture: m, fbo: f } = Wn(e, F, B), e.clearColor(0, 0, 0, 0), e.clear(e.COLOR_BUFFER_BIT), { texture: g, fbo: p } = Wn(e, F, B), e.clearColor(0, 0, 0, 0), e.clear(e.COLOR_BUFFER_BIT), { texture: d, fbo: y } = Wn(e, F, B), e.bindFramebuffer(e.FRAMEBUFFER, null), e.bindTexture(e.TEXTURE_2D, null);
  }
  function E() {
    const F = Math.min(T, k);
    b = [];
    const Y = F / 2 / 20;
    b.push(Za);
    for (let _ = 32; _ >= 2; _ /= 2)
      b.push(Math.max(1, Y / _));
    for (let _ = 1; _ <= 20; _++)
      b.push(_ * Y);
    b = [...new Set(b)], U = cr(b, F / 20), P = b[U];
  }
  w(n, r), E();
  function I() {
    e.uniform3f(a.uniformLocations.color, 0, 0, 0), e.uniform1f(a.uniformLocations.alpha, 1), e.uniform1f(a.uniformLocations.phaseWrite, 0), e.uniform1f(a.uniformLocations.liveWrite, 0), e.colorMask(!0, !0, !0, !0), e.bindFramebuffer(e.FRAMEBUFFER, f), e.drawArrays(e.TRIANGLE_STRIP, 0, 4);
  }
  function V() {
    const F = Math.floor(u[0]), B = Math.floor(u[1]), Y = Math.ceil(u[2]), _ = Math.ceil(u[5]);
    e.bindFramebuffer(e.READ_FRAMEBUFFER, p), e.bindFramebuffer(e.DRAW_FRAMEBUFFER, y), e.blitFramebuffer(F, B, Y, _, F, B, Y, _, e.COLOR_BUFFER_BIT, e.NEAREST), e.bindFramebuffer(e.FRAMEBUFFER, null), e.activeTexture(e.TEXTURE0 + Ro), e.bindTexture(e.TEXTURE_2D, d);
  }
  function q() {
    e.activeTexture(e.TEXTURE0 + Ro), e.bindTexture(e.TEXTURE_2D, null), e.activeTexture(e.TEXTURE0);
  }
  function ne(F) {
    V(), e.uniform1f(a.uniformLocations.liveRestore, 1), e.uniform2f(a.uniformLocations.phase, F, 0), e.colorMask(!0, !0, !0, !0), e.bindFramebuffer(e.FRAMEBUFFER, p), e.drawArrays(e.TRIANGLE_STRIP, 0, 4), e.uniform1f(a.uniformLocations.liveRestore, 0), q();
  }
  function de(F, B, Y, _, W, N, A, G, Z, oe = 0, re = 0, O) {
    const j = Va(A), H = Wa(A), Te = Math.max(0, Math.min(F, F + oe) - Y), Ge = Math.min(T, Math.max(F, F + oe) + Y), Ae = Math.max(0, Math.min(B, B + re) - _), se = Math.min(k, Math.max(B, B + re) + _);
    u[0] = Te, u[1] = Ae, u[2] = Ge, u[3] = Ae, u[4] = Te, u[5] = se, u[6] = Ge, u[7] = se, e.useProgram(a.program), e.viewport(0, 0, T, k), e.bindBuffer(e.ARRAY_BUFFER, t), e.bufferData(e.ARRAY_BUFFER, u, e.DYNAMIC_DRAW), e.enableVertexAttribArray(a.attribLocations.position), e.vertexAttribPointer(
      a.attribLocations.position,
      2,
      e.FLOAT,
      !1,
      0,
      0
    ), e.uniform2f(a.uniformLocations.resolution, T, k), e.uniform2f(a.uniformLocations.center, F, B), e.uniform2f(a.uniformLocations.radius, Y, _), e.uniform1f(a.uniformLocations.squareMode, W), e.uniform1f(a.uniformLocations.fuzzyEdge, N), e.uniform2f(a.uniformLocations.segDelta, oe, re), e.uniform1f(a.uniformLocations.phaseWrite, 0), e.uniform2f(a.uniformLocations.gradStep, 0, 0), e.uniform1f(a.uniformLocations.liveWrite, 0), e.uniform1f(a.uniformLocations.liveRestore, 0), e.uniform1f(a.uniformLocations.liveMask, 0);
    const we = Z.waterfallVariant ?? !0;
    if (A === "erase")
      I(), ne(Z.cyclePhase ?? 0);
    else if (j) {
      const Se = No(A, G, we, Z.flowDir), _e = A === "freeze", he = Z.pairedMovement;
      if (he && $o(A) && Tt(he.mode) !== Tt(A)) {
        const ae = Tt(he.mode) === "horizontal" ? 0 : 1;
        Se[ae] = $a(he)[ae];
      }
      e.uniform3f(a.uniformLocations.color, Se[0], Se[1], Se[2]), e.bindFramebuffer(e.FRAMEBUFFER, f), _e && (e.colorMask(!0, !0, !1, !1), e.enable(e.BLEND), e.blendFunc(e.ZERO, e.DST_ALPHA), e.drawArrays(e.TRIANGLE_STRIP, 0, 4), e.disable(e.BLEND)), e.uniform1f(a.uniformLocations.alpha, A === "flow" ? 0 : 1), e.colorMask(!_e, !_e, !0, !0), e.drawArrays(e.TRIANGLE_STRIP, 0, 4);
    } else if (H) {
      const Se = $r(A);
      e.uniform3f(a.uniformLocations.color, Se[0], Se[1], Se[2]), e.uniform1f(a.uniformLocations.alpha, 1);
      const _e = A === "solidCycle" || A === "live";
      e.colorMask(!0, _e, _e, !0);
      const he = A === "live" ? Z.liveSrc : void 0;
      if (he && (V(), e.uniform1f(a.uniformLocations.liveWrite, 1), e.uniform1f(a.uniformLocations.liveMask, he.shape === "ellipse" ? 2 : 1), e.uniform2f(a.uniformLocations.liveOrigin, he.x, he.y), e.uniform2f(a.uniformLocations.liveSize, he.w, he.h), e.uniform2f(a.uniformLocations.liveCorner, F - Y, B - _)), A === "solidCycle" && O)
        e.uniform2f(a.uniformLocations.phase, Z.cyclePhase ?? 0, 1), e.uniform2f(a.uniformLocations.gradStart, O[0], O[1]), e.uniform2f(a.uniformLocations.gradStep, O[2], O[3]), e.uniform1f(a.uniformLocations.phaseWrite, 1);
      else if (A === "solidCycle") {
        const ae = Z.cyclePhase ?? 0, Le = oe !== 0 || re !== 0 ? Z.cyclePhaseFrom ?? ae : ae, ge = ae - Le - Math.floor(ae - Le);
        e.uniform2f(a.uniformLocations.phase, Le, ge), e.uniform1f(a.uniformLocations.phaseWrite, 1);
      }
      e.bindFramebuffer(e.FRAMEBUFFER, p), e.drawArrays(e.TRIANGLE_STRIP, 0, 4), he && q(), I();
    }
    e.uniform1f(a.uniformLocations.liveMask, 0), e.uniform2f(a.uniformLocations.gradStep, 0, 0), e.colorMask(!0, !0, !0, !0), e.bindFramebuffer(e.FRAMEBUFFER, null);
  }
  function fe(F, B, Y, _, W) {
    $(F, B, Y, _, W);
  }
  function $(F, B, Y, _, W, N = 0, A = 0) {
    const G = C === "circle" ? 0 : 1;
    if (Y === "live") {
      const O = W.liveSrc;
      if (!O) return;
      const j = Math.round(F - O.w / 2), H = Math.round(B - O.h / 2);
      de(
        j + O.w / 2,
        H + O.h / 2,
        O.w / 2,
        O.h / 2,
        O.shape === "ellipse" ? 0 : 1,
        O.fuzzy ? 1 : 0,
        Y,
        _,
        W
      );
      return;
    }
    const Z = C !== "rect" && D ? 1 : 0, oe = P, re = P * K;
    if (Math.min(oe, re) < 1) {
      const O = Math.floor(F + N) + 0.5, j = Math.floor(B + A) + 0.5;
      F = Math.floor(F) + 0.5, B = Math.floor(B) + 0.5, N = O - F, A = j - B;
    }
    de(F, B, oe, re, G, Z, Y, _, W, N, A);
  }
  function De(F, B, Y, _, W, N, A = {}) {
    let G = Math.min(F, Y), Z = Math.max(F, Y), oe = Math.min(B, _), re = Math.max(B, _);
    x || (G = Math.max(0, G), Z = Math.min(T, Z), oe = Math.max(0, oe), re = Math.min(k, re));
    const O = (G + Z) / 2, j = (oe + re) / 2, H = (Z - G) / 2, Te = (re - oe) / 2;
    let Ge;
    if (W === "solidCycle" && A.flowDir) {
      const [Ae, se] = A.flowDir, we = x ? Math.hypot(H * Ae, Te * se) : Math.abs(H * Ae) + Math.abs(Te * se);
      we > 0 && (Ge = [O - we * Ae, j - we * se, Ae / (2 * we), se / (2 * we)]);
    }
    de(O, j, H, Te, x ? 0 : 1, 0, W, N, A, 0, 0, Ge);
  }
  function Ie(F, B, Y, _, W, N, A) {
    if (W === "live") {
      $(Y, _, W, N, A);
      return;
    }
    $(F, B, W, N, A, Y - F, _ - B);
  }
  return {
    drawAt: fe,
    drawLine: Ie,
    fillRect: De,
    clearAll() {
      e.bindFramebuffer(e.FRAMEBUFFER, f), e.clearColor(0, 0, 0, 0), e.clear(e.COLOR_BUFFER_BIT), e.bindFramebuffer(e.FRAMEBUFFER, p), e.clearColor(0, 0, 0, 0), e.clear(e.COLOR_BUFFER_BIT), e.bindFramebuffer(e.FRAMEBUFFER, null);
    },
    getMovementTexture: () => m,
    getPaintTexture: () => g,
    getMovementFbo: () => f,
    getPaintFbo: () => p,
    setBrushSize(F) {
      P = qo(b, F), U = cr(b, P);
    },
    getBrushSize: () => P,
    getBrushSizeIndex: () => U,
    setBrushSizeIndex(F) {
      U = Math.max(0, Math.min(F, b.length - 1)), P = b[U];
    },
    getBrushSizeOptions: () => b,
    generateBrushSizeOptions: E,
    setBrushShape(F) {
      C = F;
    },
    getBrushShape: () => C,
    setFuzzyEdges(F) {
      D = F;
    },
    getFuzzyEdges: () => D,
    setRectOval(F) {
      x = F;
    },
    getRectOval: () => x,
    increaseBrushSize() {
      ({ size: P, index: U } = sr(b, P, 1));
    },
    decreaseBrushSize() {
      ({ size: P, index: U } = sr(b, P, -1));
    },
    resize(F, B) {
      T = F, k = B, w(F, B), E();
    },
    setDisplayAspectCompensation(F) {
      K = F > 0 ? F : 1;
    },
    destroy() {
      e.deleteTexture(m), e.deleteFramebuffer(f), e.deleteTexture(g), e.deleteFramebuffer(p), e.deleteTexture(d), e.deleteFramebuffer(y), e.deleteBuffer(t), e.deleteProgram(a.program);
    }
  };
}
const dr = 1e3 / 60, Qa = 100;
function Ja(e, n, r) {
  const i = Math.round(e.x0), a = Math.round(e.y0);
  return {
    x: i,
    y: a,
    w: Math.max(1, Math.min(n, Math.round(e.x1)) - i),
    h: Math.max(1, Math.min(r, Math.round(e.y1)) - a)
  };
}
function ei(e, n, r, i, a) {
  const t = Math.max(1, Math.round(r * 2)), u = Math.round(e - t / 2), m = Math.round(n - t / 2), f = Math.max(0, Math.min(i - 1, u)), g = Math.max(0, Math.min(a - 1, m));
  return {
    x: f,
    y: g,
    w: Math.max(1, Math.min(i, u + t) - f),
    h: Math.max(1, Math.min(a, m + t) - g)
  };
}
function ti(e, n, r) {
  return { shape: (e === "rect" ? r : e === "circle") ? "ellipse" : "box", fuzzy: e !== "rect" && n };
}
function ni(e, n, r) {
  return n === "rect" && !(e === "live" && r !== null);
}
function Kr(e, n, r, i) {
  return !e && r !== "rect" && !(n === "live" && i !== null);
}
function oi(e) {
  let n = null, r = null, i = 0;
  function a(u, m, f) {
    r = { x: u, y: m, t: f }, i = f;
  }
  function t(u) {
    return u === n ? !1 : (n = u, e(), !0);
  }
  return {
    getSource: () => n,
    setSource: t,
    stampDown: a,
    stampMove(u, m, f) {
      const g = r;
      if (!g)
        return a(u, m, f), [];
      const p = f - g.t;
      if (p <= 0)
        return r = { x: u, y: m, t: g.t }, [];
      if (p > Qa)
        return a(u, m, f), [{ x: u, y: m }];
      r = { x: u, y: m, t: f };
      const d = [];
      for (let y = i + dr; y <= f; y += dr) {
        const T = (y - g.t) / p;
        d.push({ x: g.x + (u - g.x) * T, y: g.y + (m - g.y) * T }), i = y;
      }
      return d;
    }
  };
}
const _n = (e) => [e & 255], ke = (e) => [e >>> 8 & 255, e & 255], L = (e) => [e >>> 24 & 255, e >>> 16 & 255, e >>> 8 & 255, e & 255], tn = (e) => [e.charCodeAt(0), e.charCodeAt(1), e.charCodeAt(2), e.charCodeAt(3)];
function po(e) {
  let n = 0;
  for (const a of e) n += a.length;
  const r = new Uint8Array(n);
  let i = 0;
  for (const a of e)
    r.set(a, i), i += a.length;
  return r;
}
function et(e, ...n) {
  const r = po(n);
  return po([L(8 + r.length), tn(e), r]);
}
function Xe(e, n, r, ...i) {
  return et(e, [n & 255, r >>> 16 & 255, r >>> 8 & 255, r & 255], ...i);
}
const Zr = [
  ...L(65536),
  ...L(0),
  ...L(0),
  ...L(0),
  ...L(65536),
  ...L(0),
  ...L(0),
  ...L(0),
  ...L(1073741824)
];
function ri() {
  return et(
    "ftyp",
    tn("isom"),
    L(512),
    tn("isom"),
    tn("iso2"),
    tn("avc1"),
    tn("mp41")
  );
}
function ai(e, n) {
  return Xe(
    "mvhd",
    0,
    0,
    L(0),
    L(0),
    L(e),
    L(n),
    L(65536),
    ke(256),
    ke(0),
    L(0),
    L(0),
    Zr,
    L(0),
    L(0),
    L(0),
    L(0),
    L(0),
    L(0),
    L(2)
    // next_track_ID
  );
}
function ii(e, n, r) {
  return Xe(
    "tkhd",
    0,
    7,
    L(0),
    L(0),
    L(1),
    L(0),
    L(e),
    L(0),
    L(0),
    ke(0),
    ke(0),
    ke(0),
    ke(0),
    Zr,
    L(n * 65536),
    L(r * 65536)
  );
}
function li(e, n) {
  return Xe(
    "mdhd",
    0,
    0,
    L(0),
    L(0),
    L(e),
    L(n),
    ke(21956),
    ke(0)
    // language 'und', pre_defined
  );
}
function si() {
  return Xe(
    "hdlr",
    0,
    0,
    L(0),
    tn("vide"),
    L(0),
    L(0),
    L(0),
    [...Array.from(new TextEncoder().encode("VideoHandler")), 0]
  );
}
function ci() {
  return Xe("vmhd", 0, 1, ke(0), ke(0), ke(0), ke(0));
}
function ui() {
  const e = Xe("url ", 0, 1), n = Xe("dref", 0, 0, L(1), e);
  return et("dinf", n);
}
function fi(e, n, r) {
  const i = et("avcC", r);
  return et(
    "avc1",
    _n(0),
    _n(0),
    _n(0),
    _n(0),
    _n(0),
    _n(0),
    ke(1),
    // data_reference_index
    ke(0),
    ke(0),
    // pre_defined, reserved
    L(0),
    L(0),
    L(0),
    // pre_defined[3]
    ke(e),
    ke(n),
    L(4718592),
    L(4718592),
    // 72dpi h/v resolution
    L(0),
    ke(1),
    // frame_count
    new Uint8Array(32),
    // compressorname
    ke(24),
    // depth
    ke(65535),
    // pre_defined -1
    i
  );
}
function di(e, n) {
  const r = e.samples.length, i = Xe("stsd", 0, 0, L(1), fi(e.width, e.height, e.avccDescription)), a = Xe("stts", 0, 0, L(1), L(r), L(1)), t = Xe("stsc", 0, 0, L(1), L(1), L(r), L(1)), u = Xe("stsz", 0, 0, L(0), L(r), e.samples.flatMap((p) => L(p.data.length))), m = Xe("stco", 0, 0, L(1), L(n)), f = [];
  e.samples.forEach((p, d) => {
    p.isKey && f.push(...L(d + 1));
  });
  const g = Xe("stss", 0, 0, L(f.length / 4), f);
  return et("stbl", i, a, t, u, m, g);
}
function pi(e, n, r, i) {
  const a = et("minf", ci(), ui(), di(e, n)), t = et("mdia", li(r, i), si(), a), u = et("trak", ii(i, e.width, e.height), t);
  return et("moov", ai(r, i), u);
}
function mi(e) {
  const n = e.fps, r = e.samples.length, i = ri(), a = i.length + 8, t = et("mdat", po(e.samples.map((m) => m.data))), u = pi(e, a, n, r);
  return po([i, t, u]);
}
const jr = 51, pr = 30, hi = 6, Ho = 6, ki = 6, gi = 12, vi = 1, mr = 2, uo = (e, n) => Math.max(n, Math.min(jr, e));
function bi(e) {
  return e.measuredBytes <= 0 ? e.qpFloor : uo(Math.round(e.probeQp + Ho * Math.log2(e.measuredBytes / e.targetBytes)), e.qpFloor);
}
function wi(e) {
  let n = uo(e.initialQp ?? e.qpFloor, e.qpFloor);
  const r = e.loopClose, i = uo(n - (r?.keyframeQpOffset ?? 0), e.qpFloor), a = Math.min(e.totalFrames - 1, r?.frames ?? 0), t = e.totalFrames - a;
  let u = !1, m = 0, f = 0, g = 0, p = 0;
  const d = [];
  function y(k) {
    return k === 0 ? i : k < t ? n : Math.round(n + (i - n) * ((k - t + 1) / a));
  }
  function T(k) {
    let b = 0;
    for (let U = Math.max(t, f); U < e.totalFrames; U++)
      b += k * (2 ** ((n - y(U)) / Ho) - 1);
    return b;
  }
  return {
    onChunk(k) {
      if (m += k, f++, (!r || f > 1) && (d.push(k), d.length > pr && d.shift()), g++, g < hi) return;
      g = 0;
      const b = Math.max(1, e.totalFrames - f), U = d.reduce((I, V) => I + V, 0) / d.length;
      u = m + U * b > e.hardCapBytes;
      let P;
      const K = e.softCapBytes - m - T(U);
      if (K > 0)
        P = K / b;
      else {
        const I = e.hardCapBytes - m;
        if (I > 0)
          P = I / b;
        else {
          n = jr;
          return;
        }
      }
      const C = U === 0 ? -mr : Ho * Math.log2(U / P);
      if (Math.abs(C) < mr) return;
      const D = Math.round(n + C), x = u ? gi : f < p ? 0 : ki, w = Math.max(n - vi, Math.min(n + x, D)), E = uo(w, e.qpFloor);
      E > n && (p = f + pr), n = E;
    },
    nextQp: (k) => r && k !== void 0 && !u ? y(k) : n
  };
}
function _i(e, n) {
  return Math.max(0, Math.min(Math.floor(e), Math.floor(n / 2)));
}
function Xo(e, n, r) {
  if (e < n) return { action: "probe", outputIndex: e };
  const i = e - n;
  if (i < r) return { action: "skip", snapshot: i === 0 };
  if (i < n) return { action: "encode", outputIndex: i - r };
  const a = i - n;
  return a < r ? { action: "blend", outputIndex: i - r, weight: (a + 1) / r } : { action: "done" };
}
const Et = vo, Ko = 2 * Et, Qr = Math.round(1.5 * Et), Xn = 18, hr = 30, kr = 9e7, yi = 1e8, xi = 6, Ei = Math.round(0.5 * Et), Ti = 0.15;
function Jr(e) {
  return Math.max(1, Math.floor(wa().height / e));
}
function Si(e) {
  return typeof e != "number" || !Number.isFinite(e) || e < 1 ? Ko : Math.round(e);
}
let gr = null;
function vr(e, n, r) {
  const i = new OffscreenCanvas(e, n), a = i.getContext("2d"), t = a.createImageData(e, n), u = t.data;
  for (let m = 0; m < u.length; m += 4)
    u[m] = Math.random() * 256 | 0, u[m + 1] = Math.random() * 256 | 0, u[m + 2] = Math.random() * 256 | 0, u[m + 3] = 255;
  return a.putImageData(t, 0, 0), new VideoFrame(i, { timestamp: r });
}
function Ri() {
  return gr ??= (async () => {
    const e = [];
    let n = null, r = null, i = null;
    try {
      return n = new VideoEncoder({
        output: (a) => e.push(a.byteLength),
        error: () => {
        }
      }), n.configure({
        codec: "avc1.42001f",
        // Baseline 3.1 — adequate for the 320×180 probe
        width: 320,
        height: 180,
        framerate: 30,
        bitrateMode: "quantizer"
      }), r = vr(320, 180, 0), i = vr(320, 180, 33333), n.encode(r, { keyFrame: !0, avc: { quantizer: 10 } }), n.encode(i, { keyFrame: !0, avc: { quantizer: 51 } }), await n.flush(), e.length === 2 && e[0] > e[1] * 2;
    } catch {
      return !1;
    } finally {
      try {
        r?.close();
      } catch {
      }
      try {
        i?.close();
      } catch {
      }
      try {
        n?.close();
      } catch {
      }
    }
  })(), gr;
}
const Mi = 8, Ci = ["avc1.640034", "avc1.4D4034", "avc1.42E034"];
function Ai(e, n, r, i = Et) {
  switch (Xo(e, n, r).action) {
    case "probe":
      return { seconds: Math.ceil(n / i), pulse: !0 };
    case "skip":
    case "encode":
      return { seconds: Math.ceil((2 * n - e) / i), pulse: !1 };
    default:
      return { seconds: 0, pulse: !0 };
  }
}
function Li(e) {
  return ArrayBuffer.isView(e) ? new Uint8Array(e.buffer.slice(e.byteOffset, e.byteOffset + e.byteLength)) : new Uint8Array(e);
}
async function ea(e, n) {
  if (typeof VideoEncoder > "u") return null;
  for (const r of Ci)
    try {
      if ((await VideoEncoder.isConfigSupported({
        codec: r,
        width: e,
        height: n,
        framerate: Et,
        bitrateMode: "quantizer"
      })).supported) return r;
    } catch {
    }
  return null;
}
async function Fi(e, n) {
  const r = Jr(n), [i, a] = await Promise.all([
    ea(e * r, n * r),
    Ri()
  ]);
  return i !== null && a;
}
function ta(e) {
  return e.replace(/[^a-zA-Z0-9_-]/g, "_");
}
function na(e, n, r, i) {
  e.viewport(0, 0, n.width, n.height);
  let a = n.width, t = n.height, u = new Uint8Array(a * t * 4);
  if (e.bindFramebuffer(e.FRAMEBUFFER, null), e.readPixels(0, 0, a, t, e.RGBA, e.UNSIGNED_BYTE, u), !u.some((y) => y !== 0) && r) {
    a = i.width, t = i.height, u = new Uint8Array(a * t * 4);
    const y = e.createFramebuffer();
    e.bindFramebuffer(e.FRAMEBUFFER, y), e.framebufferTexture2D(
      e.FRAMEBUFFER,
      e.COLOR_ATTACHMENT0,
      e.TEXTURE_2D,
      r,
      0
    ), e.readPixels(0, 0, a, t, e.RGBA, e.UNSIGNED_BYTE, u), e.bindFramebuffer(e.FRAMEBUFFER, null), e.deleteFramebuffer(y);
    for (let T = 3; T < u.length; T += 4) u[T] = 255;
  }
  const m = document.createElement("canvas");
  m.width = a, m.height = t;
  const f = m.getContext("2d");
  if (!f) return null;
  const g = f.createImageData(a, t);
  for (let y = 0; y < t; y++) {
    const T = y * a * 4, k = (t - 1 - y) * a * 4;
    g.data.set(u.subarray(T, T + a * 4), k);
  }
  if (f.putImageData(g, 0, 0), a === n.width && t === n.height) return m;
  const p = document.createElement("canvas");
  p.width = n.width, p.height = n.height;
  const d = p.getContext("2d");
  return d ? (d.imageSmoothingEnabled = !1, d.drawImage(m, 0, 0, p.width, p.height), p) : null;
}
function Pi(e, n, r, i, a) {
  const t = na(e, n, r, i);
  if (!t) {
    console.error("Failed to get 2D context for screenshot");
    return;
  }
  t.toBlob((u) => {
    if (!u) {
      console.error("Failed to create screenshot blob");
      return;
    }
    const m = URL.createObjectURL(u), f = document.createElement("a");
    f.href = m, f.download = a ? `${ta(a)}.png` : "screenshot.png", f.click(), URL.revokeObjectURL(m);
  }, "image/png");
}
function Di(e, n, r, i, a, t) {
  let u = "idle", m = null, f = null, g = [], p = null, d = 0, y = Ko, T = 0, k = null, b = 0, U = 0, P = 0, K = 0, C = null, D = null, x = 0, w = !1, E = !1, I = null, V = Xn, q = 0;
  function ne(N) {
    N !== u && (u = N, r?.(N));
  }
  function de(N) {
    return {
      codec: N,
      // Record dims, not canvas dims — the composite path pads if they differ.
      width: b,
      height: U,
      framerate: Et,
      bitrateMode: "quantizer",
      // per-frame QP via encode options; no bitrate target
      latencyMode: "realtime",
      // suppress B-frames → monotonic timestamps (muxer requires this)
      avc: { format: "avc" }
      // AVCC length-prefixed output + avcC description
    };
  }
  function fe() {
    q++;
    try {
      m?.close();
    } catch {
    }
    m = null, f = null, g = [], p = null, d = 0, x = 0, w = !1, E = !1, I = null, V = Xn, C = null, D = null;
  }
  function $() {
    fe(), ne("idle");
  }
  function De(N) {
    if (n) {
      n(N, "mp4");
      return;
    }
    const A = URL.createObjectURL(N), G = document.createElement("a");
    G.href = A, G.download = k ? `${ta(k)}.mp4` : "recording.mp4", G.style.display = "none", document.body.appendChild(G), G.click(), setTimeout(() => {
      document.body.removeChild(G), URL.revokeObjectURL(A);
    }, 1e3);
  }
  async function Ie() {
    if (!m) {
      $();
      return;
    }
    ne("finishing");
    const N = q;
    try {
      if (await m.flush(), N !== q) return;
      if (!p) throw new Error("No avcC description from encoder");
      const A = mi({
        // Record dims, not canvas dims — the composite path pads if they differ.
        width: b,
        height: U,
        fps: Et,
        avccDescription: p,
        samples: g
      });
      De(new Blob([A], { type: "video/mp4" }));
    } catch (A) {
      console.error("Recording finalize failed", A);
    } finally {
      N === q && (fe(), ne("idle"));
    }
  }
  async function F() {
    if (!m || !f) {
      $();
      return;
    }
    const N = q;
    try {
      if (await m.flush(), N !== q) return;
      m.close(), m = null, V = bi({
        measuredBytes: x,
        probeQp: hr,
        targetBytes: kr * y / (y + Ti * T),
        qpFloor: Xn
      }), I = wi({
        totalFrames: y,
        softCapBytes: kr,
        hardCapBytes: yi,
        qpFloor: Xn,
        initialQp: V,
        loopClose: { frames: Ei, keyframeQpOffset: xi }
      }), m = new VideoEncoder({
        output: (A, G) => {
          !p && G?.decoderConfig?.description && (p = Li(G.decoderConfig.description));
          const Z = new Uint8Array(A.byteLength);
          A.copyTo(Z), g.push({ data: Z, isKey: A.type === "key" }), I?.onChunk(A.byteLength);
        },
        error: (A) => {
          console.error("VideoEncoder error (pass B)", A), $();
        }
      }), m.configure(de(f)), w = !1, E = !1;
    } catch (A) {
      console.error("Recording pass transition failed", A), $();
    }
  }
  async function B() {
    if (u !== "idle") return;
    const N = Jr(e.height);
    P = e.width * N, K = e.height * N;
    const A = t?.() ?? { width: e.width, height: e.height };
    if (b = Math.max(Math.round(A.width), P), U = Math.max(Math.round(A.height), K), f = await ea(b, U), !f) {
      console.warn("Recording unsupported: no compatible H.264 encoder");
      return;
    }
    if (b !== e.width || U !== e.height) {
      if (C = new OffscreenCanvas(b, U), D = C.getContext("2d", { alpha: !1 }), !D) {
        console.warn("Recording unsupported: no 2D context for letterbox compositing"), C = null, f = null;
        return;
      }
      D.imageSmoothingEnabled = !1, D.fillStyle = "#000", D.fillRect(0, 0, b, U);
    } else
      C = null, D = null;
    y = Si(i?.()), T = _i(Qr, y), k = a?.() ?? null, g = [], p = null, d = 0, x = 0, w = !0, E = !1, I = null, V = Xn;
    try {
      m = new VideoEncoder({
        output: (G) => {
          x += G.byteLength;
        },
        error: (G) => {
          console.error("VideoEncoder error (pass A)", G), $();
        }
      }), m.configure(de(f));
    } catch (G) {
      console.error("Recording unavailable: VideoEncoder setup failed at runtime", G);
      try {
        m?.close();
      } catch {
      }
      m = null, f = null, C = null, D = null;
      return;
    }
    ne("recording");
  }
  function Y() {
    if (u !== "recording" || !m || E) return null;
    const N = Xo(d, y, T);
    return N.action === "done" ? null : N;
  }
  function _() {
    const N = Y();
    if (!N || !m) return;
    if (N.action === "skip") {
      d++;
      return;
    }
    const A = N.outputIndex, G = Math.round(A * 1e6 / Et), Z = Math.round(1e6 / Et);
    let oe = e;
    C && D && (D.drawImage(
      e,
      Math.round((b - P) / 2),
      Math.round((U - K) / 2),
      P,
      K
    ), oe = C);
    const re = new VideoFrame(oe, { timestamp: G, duration: Z });
    m.encode(re, {
      keyFrame: A === 0,
      avc: { quantizer: w ? hr : I?.nextQp(A) ?? V }
    }), re.close(), d++, w ? d >= y && (E = !0, F()) : Xo(d, y, T).action === "done" && Ie();
  }
  function W() {
    u === "recording" && $();
  }
  return {
    isRecording: () => u !== "idle",
    getStatus: () => u,
    isBackpressured: () => u === "recording" && !!m && m.encodeQueueSize > Mi,
    start: () => {
      B();
    },
    stop: W,
    tick: _,
    getFrameStep: Y,
    // Finishing is past the schedule's end: the tail's pulsing 0.
    getCountdown: () => u === "idle" ? null : Ai(d, y, T),
    destroy() {
      u !== "idle" && W(), fe();
    }
  };
}
const oa = [137, 80, 78, 71, 13, 10, 26, 10], nn = 4;
function Ee(e) {
  throw new Error(`[sketch-engine] png: ${e}`);
}
const Ii = (() => {
  const e = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let r = n;
    for (let i = 0; i < 8; i++) r = r & 1 ? 3988292384 ^ r >>> 1 : r >>> 1;
    e[n] = r >>> 0;
  }
  return e;
})();
function ra(e) {
  let n = 4294967295;
  for (let r = 0; r < e.length; r++) n = Ii[(n ^ e[r]) & 255] ^ n >>> 8;
  return (n ^ 4294967295) >>> 0;
}
function lo(e, n) {
  return (e[n] << 24 | e[n + 1] << 16 | e[n + 2] << 8 | e[n + 3]) >>> 0;
}
function mo(e, n, r) {
  e[n] = r >>> 24 & 255, e[n + 1] = r >>> 16 & 255, e[n + 2] = r >>> 8 & 255, e[n + 3] = r & 255;
}
function aa(e) {
  const n = new Uint8Array(e.reduce((i, a) => i + a.length, 0));
  let r = 0;
  for (const i of e)
    n.set(i, r), r += i.length;
  return n;
}
function Mo(e, n) {
  const r = new Uint8Array(12 + n.length);
  mo(r, 0, n.length);
  for (let i = 0; i < 4; i++) r[4 + i] = e.charCodeAt(i);
  return r.set(n, 8), mo(r, 8 + n.length, ra(r.subarray(4, 8 + n.length))), r;
}
async function Bi(e, n) {
  const r = new Blob([e]).stream().pipeThrough(n);
  return new Uint8Array(await new Response(r).arrayBuffer());
}
async function Ui(e, n) {
  const r = new Blob(e).stream().pipeThrough(new DecompressionStream("deflate")).getReader(), i = [];
  let a = 0;
  for (; ; ) {
    let t;
    try {
      t = await r.read();
    } catch {
      await r.cancel().catch(() => {
      }), Ee("corrupt image data");
    }
    if (t.done) break;
    a += t.value.byteLength, a > n && (await r.cancel().catch(() => {
    }), Ee("image data is larger than its IHDR size allows")), i.push(t.value);
  }
  return aa(i);
}
async function Co(e, n, r) {
  const i = n * nn;
  e.length !== i * r && Ee(`expected ${i * r} bytes for ${n}x${r}, got ${e.length}`);
  const a = new Uint8Array(r * (i + 1));
  for (let u = 0; u < r; u++) a.set(e.subarray(u * i, (u + 1) * i), u * (i + 1) + 1);
  const t = new Uint8Array(13);
  return mo(t, 0, n), mo(t, 4, r), t[8] = 8, t[9] = 6, aa([
    new Uint8Array(oa),
    Mo("IHDR", t),
    Mo("IDAT", await Bi(a, new CompressionStream("deflate"))),
    Mo("IEND", new Uint8Array(0))
  ]);
}
class ia extends Error {
  width;
  height;
  constructor(n, r, i) {
    super(`[sketch-engine] png: image is ${n}x${r}, expected ${i.width}x${i.height}`), this.name = "PngSizeMismatchError", this.width = n, this.height = r;
  }
}
async function zi(e, n) {
  (e.length < 8 || oa.some((y, T) => e[T] !== y)) && Ee("bad signature");
  let r = 0, i = 0, a = !1, t = !1;
  const u = [];
  let m = 8;
  for (; m < e.length && !t; ) {
    m + 12 > e.length && Ee("truncated chunk");
    const y = lo(e, m);
    m + 12 + y > e.length && Ee("truncated chunk");
    const T = e.subarray(m + 4, m + 8 + y), k = String.fromCharCode(T[0], T[1], T[2], T[3]);
    ra(T) !== lo(e, m + 8 + y) && Ee(`bad CRC on ${k}`);
    const b = T.subarray(4);
    if (a)
      k === "IDAT" ? u.push(b) : k === "IEND" && (t = !0);
    else {
      if ((k !== "IHDR" || y !== 13) && Ee("missing IHDR"), r = lo(b, 0), i = lo(b, 4), (r === 0 || i === 0) && Ee(`bad size ${r}x${i}`), b[8] !== 8 && Ee(`unsupported bit depth ${b[8]}`), b[9] !== 6 && Ee(`unsupported color type ${b[9]}`), (b[10] !== 0 || b[11] !== 0) && Ee("unsupported compression/filter method"), b[12] !== 0 && Ee("interlaced images are unsupported"), n && (r !== n.width || i !== n.height))
        throw new ia(r, i, n);
      a = !0;
    }
    m += 12 + y;
  }
  a || Ee("missing IHDR"), u.length || Ee("missing IDAT");
  const f = r * nn, g = i * (f + 1), p = await Ui(u, g);
  p.length !== g && Ee("image data has the wrong length");
  const d = new Uint8Array(i * f);
  for (let y = 0; y < i; y++) {
    const T = p[y * (f + 1)], k = y * (f + 1) + 1, b = y * f;
    if (T === 0) {
      d.set(p.subarray(k, k + f), b);
      continue;
    }
    const U = b - f;
    for (let P = 0; P < f; P++) {
      const K = P >= nn ? d[b + P - nn] : 0, C = y > 0 ? d[U + P] : 0;
      let D;
      switch (T) {
        case 0:
          D = 0;
          break;
        case 1:
          D = K;
          break;
        case 2:
          D = C;
          break;
        case 3:
          D = K + C >> 1;
          break;
        case 4: {
          const x = P >= nn && y > 0 ? d[U + P - nn] : 0, w = K + C - x, E = Math.abs(w - K), I = Math.abs(w - C), V = Math.abs(w - x);
          D = E <= I && E <= V ? K : I <= V ? C : x;
          break;
        }
        default:
          Ee(`unknown filter type ${T}`);
      }
      d[b + P] = p[k + P] + D & 255;
    }
  }
  return { width: r, height: i, data: d };
}
function En(e, n, r) {
  const i = n * nn, a = new Uint8Array(e.length);
  for (let t = 0; t < r; t++) a.set(e.subarray(t * i, (t + 1) * i), (r - 1 - t) * i);
  return a;
}
function so(e) {
  throw new Error(`[sketch-engine] state: ${e}`);
}
function Ao(e, n, r, i) {
  const a = new Uint8Array(r * i * 4);
  return e.bindFramebuffer(e.FRAMEBUFFER, n), e.readPixels(0, 0, r, i, e.RGBA, e.UNSIGNED_BYTE, a), e.bindFramebuffer(e.FRAMEBUFFER, null), a;
}
function Lo(e, n, r, i, a) {
  const t = [
    [e.UNPACK_ALIGNMENT, 1],
    [e.UNPACK_FLIP_Y_WEBGL, !1],
    [e.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1],
    [e.UNPACK_COLORSPACE_CONVERSION_WEBGL, e.NONE]
  ], u = t.map(([m]) => e.getParameter(m));
  e.bindTexture(e.TEXTURE_2D, n);
  for (const [m, f] of t) e.pixelStorei(m, f);
  e.texSubImage2D(e.TEXTURE_2D, 0, 0, 0, r, i, e.RGBA, e.UNSIGNED_BYTE, a), t.forEach(([m, f], g) => {
    u[g] !== f && e.pixelStorei(m, u[g]);
  }), e.bindTexture(e.TEXTURE_2D, null);
}
async function Oi(e) {
  const { gl: n } = e, r = e.getSeed(), i = e.getFrame(), { width: a, height: t } = e.getSimSize(), u = En(Ao(n, e.getPaint().fbo, a, t), a, t), m = En(Ao(n, e.getMovement().fbo, a, t), a, t), f = En(Ao(n, e.getFeedback().fbo, a, t), a, t), [g, p, d] = await Promise.all([
    Co(u, a, t),
    Co(m, a, t),
    Co(f, a, t)
  ]);
  return { seed: r, simWidth: a, simHeight: t, frame: i, paint: g, movement: p, state: d };
}
async function Ni(e, n) {
  const { frame: r } = n;
  (!Number.isSafeInteger(r) || r < 0) && so(`frame must be a non-negative safe integer, got ${String(r)}`), e.isRecording() && so("cannot restore while recording");
  const { width: i, height: a } = Ta(n.seed), t = async (T) => {
    try {
      return await zi(n[T], { width: i, height: a });
    } catch (k) {
      throw k instanceof ia && so(`${T} PNG is ${k.width}x${k.height}, seed "${n.seed}" needs ${i}x${a}`), k;
    }
  }, u = await t("paint"), m = await t("movement"), f = await t("state");
  e.isRecording() && so("cannot restore while recording");
  const g = En(u.data, i, a), p = En(m.data, i, a), d = En(f.data, i, a), { gl: y } = e;
  e.setSeed(n.seed), Lo(y, e.getPaint().texture, i, a, g), Lo(y, e.getMovement().texture, i, a, p), Lo(y, e.getFeedback().texture, i, a, d), e.setFrame(r), e.present();
}
function Hi(e, n, r) {
  return `${n ? `${e}_${n}` : e}_f${r}`;
}
function Xi(e, n, r, i, a = !1) {
  const t = r.getBoundingClientRect(), { width: u, height: m } = i;
  return a ? {
    x: u * ((n - t.top) / t.height),
    y: m * ((e - t.left) / t.width)
  } : {
    x: (e - t.left) * (u / t.width),
    y: m - (n - t.top) * (m / t.height)
  };
}
const la = 4;
function Gi(e, n, r, i, a = !1) {
  if (Math.hypot(n.x - e.x, n.y - e.y) < la) return null;
  a && (n = Vi(e, n));
  const t = n.x - e.x, u = n.y - e.y, m = Math.hypot(t, u), f = (b) => Math.min(Math.max(b, 0), r), g = (b) => Math.min(Math.max(b, 0), i), p = {
    x0: Math.min(e.x, n.x),
    y0: Math.min(e.y, n.y),
    x1: Math.max(e.x, n.x),
    y1: Math.max(e.y, n.y)
  }, d = f(p.x0), y = f(p.x1), T = g(p.y0), k = g(p.y1);
  return y - d < 1 || k - T < 1 ? null : { x0: d, y0: T, x1: y, y1: k, flowDir: [t / m, u / m], unclamped: p };
}
function Vi(e, n) {
  const r = n.x - e.x, i = n.y - e.y, a = Math.max(Math.abs(r), Math.abs(i));
  return { x: e.x + (r < 0 ? -a : a), y: e.y + (i > 0 ? a : -a) };
}
function Wi(e, n = 2) {
  const r = 1e3 / e;
  let i = -1 / 0;
  return {
    shouldRender(a) {
      return a < i - n ? !1 : (i = a - i > r ? a + r : i + r, !0);
    },
    reset() {
      i = -1 / 0;
    }
  };
}
function Yi() {
  const e = globalThis.navigator?.deviceMemory;
  return typeof e == "number" ? e >= 8 : typeof globalThis.matchMedia != "function" ? !1 : !globalThis.matchMedia("(any-pointer: coarse)").matches;
}
function qi() {
  return Yi() ? 3 : 1;
}
function $i(e, n) {
  const { gl: r } = e, i = [], a = [], t = [];
  let u = null, m = 0, f = 0, g = !1;
  const p = () => n;
  function d() {
    let C = !1;
    for (let D = 0; D < 8; D++) {
      const x = r.getError();
      if (x === r.OUT_OF_MEMORY) C = !0;
      else if (x === r.NO_ERROR) break;
    }
    return C;
  }
  function y() {
    const C = t.pop();
    if (C) return C;
    const { width: D, height: x } = e.getSimSize();
    m = D, f = x;
    const w = { paint: Wn(r, D, x), movement: Wn(r, D, x) };
    return r.bindFramebuffer(r.FRAMEBUFFER, null), r.bindTexture(r.TEXTURE_2D, null), d() ? (t.push(w), k(), g = !0, e.onOutOfMemory(), null) : w;
  }
  function T() {
    for (const C of t.splice(0))
      for (const D of [C.paint, C.movement])
        r.deleteTexture(D.texture), r.deleteFramebuffer(D.fbo);
  }
  function k() {
    t.push(...i.splice(0), ...a.splice(0)), T();
  }
  function b(C, D) {
    r.bindFramebuffer(r.READ_FRAMEBUFFER, C), r.bindFramebuffer(r.DRAW_FRAMEBUFFER, D), r.blitFramebuffer(0, 0, m, f, 0, 0, m, f, r.COLOR_BUFFER_BIT, r.NEAREST);
  }
  function U(C) {
    b(e.getPaintFbo(), C.paint.fbo), b(e.getMovementFbo(), C.movement.fbo), r.bindFramebuffer(r.FRAMEBUFFER, null);
  }
  function P(C) {
    b(C.paint.fbo, e.getPaintFbo()), b(C.movement.fbo, e.getMovementFbo()), r.bindFramebuffer(r.FRAMEBUFFER, null);
  }
  function K(C, D) {
    if (u || C.length === 0) return !1;
    const x = y();
    if (!x) return !1;
    const w = C.pop();
    return U(x), P(w), D.push(x), t.push(w), !0;
  }
  return {
    beforeWrite() {
      u || g || (u = y(), u && U(u));
    },
    commit() {
      if (!u) return !1;
      i.push(u), u = null, t.push(...a.splice(0));
      const C = p();
      for (; i.length > C; ) t.push(i.shift());
      return !0;
    },
    revert() {
      u && (P(u), t.push(u), u = null);
    },
    undo: () => K(i, a),
    redo: () => K(a, i),
    canUndo: () => i.length > 0,
    canRedo: () => a.length > 0,
    limit: p,
    release: k,
    clear() {
      g = !1, t.push(...i.splice(0), ...a.splice(0)), u && t.push(u), u = null;
      const { width: C, height: D } = e.getSimSize();
      (C !== m || D !== f) && T();
    },
    destroy() {
      this.clear(), T();
    }
  };
}
const Ki = 1, Gn = 60 / vo, br = 1.1, Zi = 1, ji = 30 * vo, Qi = 10.123, Ji = 1, el = 0.33, tl = 3, nl = 0.99, ol = 3.3, rl = 0.2, al = 0.2, il = 1;
function Go(e, n, r) {
  const i = e.createTexture();
  return e.bindTexture(e.TEXTURE_2D, i), e.texImage2D(e.TEXTURE_2D, 0, e.RGBA, n, r, 0, e.RGBA, e.UNSIGNED_BYTE, null), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MIN_FILTER, e.NEAREST), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_MAG_FILTER, e.NEAREST), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_S, e.CLAMP_TO_EDGE), e.texParameteri(e.TEXTURE_2D, e.TEXTURE_WRAP_T, e.CLAMP_TO_EDGE), i;
}
function pt(e, n, r) {
  const i = Go(e, n, r), a = e.createFramebuffer();
  return e.bindFramebuffer(e.FRAMEBUFFER, a), e.framebufferTexture2D(e.FRAMEBUFFER, e.COLOR_ATTACHMENT0, e.TEXTURE_2D, i, 0), { texture: i, fbo: a };
}
function ll(e, n) {
  const r = new Uint8Array(n * n * 4), i = Math.round($r(e)[0] * 255);
  for (let a = 0; a < n; a++) {
    const t = n - 1 - a, u = e === "solidCycle" ? Math.floor(t / n * 65535 + 0.5) : 0;
    for (let m = 0; m < n; m++) {
      const f = (a * n + m) * 4;
      r[f] = i, r[f + 1] = u >> 8, r[f + 2] = u & 255, r[f + 3] = 255;
    }
  }
  return r;
}
function yn() {
  const e = /* @__PURE__ */ new Set();
  return {
    add(n) {
      return e.add(n), () => {
        e.delete(n);
      };
    },
    emit(...n) {
      for (const r of [...e]) r(...n);
    }
  };
}
function As(e) {
  const { canvas: n, onFpsUpdate: r, onRecordingStop: i } = e, a = n.getContext("webgl2", {
    // Not preserved: on tile GPUs a preserved buffer costs an output-sized copy
    // per present. Everything that reads the canvas does it in the task that
    // drew it: the recorder's tick() right after render()'s present, and
    // captureThumbnail/captureScreenshot present first.
    preserveDrawingBuffer: !1,
    antialias: !1,
    // Nothing depth-tests; skip the output-sized depth buffer.
    depth: !1
  });
  if (!a) throw new Error("WebGL2 not supported");
  const t = a, u = [t.COLOR_ATTACHMENT0], m = [t.COLOR];
  let f = !1;
  const g = (s) => {
    s.preventDefault(), f = !0, Wt = !1, cancelAnimationFrame(vt), ye.clear(), Qe.emit(), e.onContextLost?.();
  };
  n.addEventListener("webglcontextlost", g);
  let p = e.seed ?? Vr(), d = zo(p), y = d.canvasScale, T = e.disableWarpFx ?? !0;
  const k = () => 1440 * y, b = () => 1080 * y, U = () => ({ width: k(), height: b() }), P = () => n.width, K = () => n.height, C = () => ({ width: P(), height: K() }), D = () => ba(y, !T);
  n.width = k() * D(), n.height = b() * D(), t.viewport(0, 0, k(), b()), n.style.imageRendering = "-moz-crisp-edges", n.style.imageRendering = "pixelated", n.style.touchAction = "none", n.style.display = "block";
  const x = en(t, Da, Ia);
  if (!x) throw new Error("Failed to create main shader program");
  const w = {
    position: t.getAttribLocation(x, "a_position"),
    texCoord: t.getAttribLocation(x, "a_texCoord")
  }, E = {
    targetFps: t.getUniformLocation(x, "u_targetFps"),
    brushFrameCount: t.getUniformLocation(x, "u_brushFrameCount"),
    brushTime: t.getUniformLocation(x, "u_brushTime"),
    brushLoopFrames: t.getUniformLocation(x, "u_brushLoopFrames"),
    brushBlockTime: t.getUniformLocation(x, "u_brushBlockTime"),
    texture: t.getUniformLocation(x, "u_texture"),
    resolution: t.getUniformLocation(x, "u_resolution"),
    staticLoopPhase: t.getUniformLocation(x, "u_staticLoopPhase"),
    steppedHuePhase: t.getUniformLocation(x, "u_steppedHuePhase"),
    staticCyclesBlank: t.getUniformLocation(x, "u_staticCyclesBlank"),
    staticCyclesBlock: t.getUniformLocation(x, "u_staticCyclesBlock"),
    staticCyclesEdge: t.getUniformLocation(x, "u_staticCyclesEdge"),
    pixelRatio: t.getUniformLocation(x, "u_pixelDensity"),
    chunkType: t.getUniformLocation(x, "u_chunkType"),
    checkerScale: t.getUniformLocation(x, "u_checkerScale"),
    moveSpeed: t.getUniformLocation(x, "u_moveSpeed"),
    resetEdgeThreshold: t.getUniformLocation(x, "u_resetEdgeThreshold"),
    staticResetThreshold: t.getUniformLocation(x, "u_staticResetThreshold"),
    extraMoveStutterScale: t.getUniformLocation(x, "u_extraMoveStutterScale"),
    extraMoveStutterThreshold: t.getUniformLocation(x, "u_extraMoveStutterThreshold"),
    extraFallStutterScale: t.getUniformLocation(x, "u_extraFallStutterScale"),
    extraFallStutterThreshold: t.getUniformLocation(x, "u_extraFallStutterThreshold"),
    fallWaterfallMult: t.getUniformLocation(x, "u_fallWaterfallMult"),
    seedOffset: t.getUniformLocation(x, "u_seedOffset"),
    ribbonDirtThreshold: t.getUniformLocation(x, "u_ribbonDirtThreshold"),
    dirtNoiseScale: t.getUniformLocation(x, "u_dirtNoiseScale"),
    useColorCycle: t.getUniformLocation(x, "u_useColorCycle"),
    blankStaticScale: t.getUniformLocation(x, "u_blankStaticScale"),
    blankStaticThreshold: t.getUniformLocation(x, "u_blankStaticThreshold"),
    blankStaticTimeMult: t.getUniformLocation(x, "u_blankStaticTimeMult"),
    gradientBlockPattern: t.getUniformLocation(x, "u_gradientBlockPattern"),
    noiseMultiplier: t.getUniformLocation(x, "u_noiseMultiplier"),
    bgStyle: t.getUniformLocation(x, "u_bgStyle"),
    staticColor1: t.getUniformLocation(x, "u_staticColor1"),
    staticColor2: t.getUniformLocation(x, "u_staticColor2"),
    staticColor3: t.getUniformLocation(x, "u_staticColor3"),
    globalFreeze: t.getUniformLocation(x, "u_globalFreeze"),
    noiseFreeze: t.getUniformLocation(x, "u_noiseFreeze"),
    resolvedTexture: t.getUniformLocation(x, "u_resolvedTexture"),
    movementTexture: t.getUniformLocation(x, "u_movementTexture"),
    paintTexture: t.getUniformLocation(x, "u_paintTexture")
  }, I = en(t, Hn, Oa);
  if (!I) throw new Error("Failed to create resolve program");
  const V = {
    position: t.getAttribLocation(I, "a_position"),
    texCoord: t.getAttribLocation(I, "a_texCoord")
  }, q = {
    texture: t.getUniformLocation(I, "u_texture"),
    useColorCycle: t.getUniformLocation(I, "u_useColorCycle"),
    cycleHue: t.getUniformLocation(I, "u_cycleHue"),
    cycleHueSmooth: t.getUniformLocation(I, "u_cycleHueSmooth"),
    staticColor1: t.getUniformLocation(I, "u_staticColor1"),
    staticColor2: t.getUniformLocation(I, "u_staticColor2"),
    staticColor3: t.getUniformLocation(I, "u_staticColor3"),
    blankColorMult: t.getUniformLocation(I, "u_blankColorMult")
  }, ne = en(t, Hn, za);
  if (!ne) throw new Error("Failed to create display program");
  const de = {
    position: t.getAttribLocation(ne, "a_position"),
    texCoord: t.getAttribLocation(ne, "a_texCoord")
  }, fe = {
    texture: t.getUniformLocation(ne, "u_texture"),
    crtEnabled: t.getUniformLocation(ne, "u_crtEnabled"),
    bloomEnabled: t.getUniformLocation(ne, "u_bloomEnabled"),
    bloomTex: t.getUniformLocation(ne, "u_bloomTex"),
    bloomIntensity: t.getUniformLocation(ne, "u_bloomIntensity"),
    bloomEdgeFade: t.getUniformLocation(ne, "u_bloomEdgeFade"),
    viewZoom: t.getUniformLocation(ne, "u_viewZoom"),
    viewCenter: t.getUniformLocation(ne, "u_viewCenter")
  };
  let $ = !e.disableBloom;
  const De = 0.25, Ie = 0.225, F = 1.25, B = 4, Y = 0.015;
  let _ = null, W = !1;
  const N = () => Hi(p, _, rt), A = 32, G = 10, Z = 100, oe = 100, re = 1e-4;
  let O = 1, j = 0.5, H = 0.5, Te = -1;
  const Ge = yn();
  function Ae() {
    const s = 0.5 / O, o = G / k(), l = G / b();
    j = Math.min(1 - o + s, Math.max(o - s, j)), H = Math.min(1 - l + s, Math.max(l - s, H));
  }
  function se() {
    Ae(), Fn(), Ge.emit();
  }
  function we(s) {
    const o = Te < 0 ? 0 : Math.min(oe, s - Te);
    if (Te = s, O !== 1 || ee !== null || j === 0.5 && H === 0.5) return;
    const l = 1 - Math.exp(-o / Z);
    j += (0.5 - j) * l, H += (0.5 - H) * l, Math.abs(j - 0.5) < re && (j = 0.5), Math.abs(H - 0.5) < re && (H = 0.5), se();
  }
  const Se = 5.5;
  function _e(s, o) {
    if (T) return [s / k(), o / b()];
    const l = s / k() * 2 - 1, c = o / b() * 2 - 1, h = c / Se, v = l / Se;
    return [(l + l * h * h) * 0.5 + 0.5, (c + c * v * v) * 0.5 + 0.5];
  }
  function he(s, o) {
    const [l, c] = _e(s, o);
    return [
      (j + (l - 0.5) / O) * k(),
      (H + (c - 0.5) / O) * b()
    ];
  }
  const ae = en(t, Hn, Na);
  if (!ae) throw new Error("Failed to create bloom downsample program");
  const Le = {
    position: t.getAttribLocation(ae, "a_position"),
    texCoord: t.getAttribLocation(ae, "a_texCoord")
  }, ge = {
    texture: t.getUniformLocation(ae, "u_texture"),
    texelSize: t.getUniformLocation(ae, "u_texelSize"),
    prefilter: t.getUniformLocation(ae, "u_prefilter"),
    threshold: t.getUniformLocation(ae, "u_threshold"),
    lumaWeight: t.getUniformLocation(ae, "u_lumaWeight")
  }, Re = en(t, Hn, Ha);
  if (!Re) throw new Error("Failed to create bloom upsample program");
  const tt = {
    position: t.getAttribLocation(Re, "a_position"),
    texCoord: t.getAttribLocation(Re, "a_texCoord")
  }, Ht = {
    texture: t.getUniformLocation(Re, "u_texture"),
    texelSize: t.getUniformLocation(Re, "u_texelSize"),
    radius: t.getUniformLocation(Re, "u_radius")
  }, Fe = en(t, Hn, Xa);
  if (!Fe) throw new Error("Failed to create crossfade program");
  const Yn = {
    position: t.getAttribLocation(Fe, "a_position"),
    texCoord: t.getAttribLocation(Fe, "a_texCoord")
  }, qe = {
    texture: t.getUniformLocation(Fe, "u_texture"),
    held: t.getUniformLocation(Fe, "u_held"),
    weight: t.getUniformLocation(Fe, "u_weight")
  };
  t.useProgram(x), t.uniform1i(E.texture, 0), t.uniform1i(E.movementTexture, 1), t.uniform1i(E.paintTexture, 4), t.uniform1i(E.resolvedTexture, 5), t.useProgram(I), t.uniform1i(q.texture, 0), t.useProgram(ne), t.uniform1i(fe.texture, 0), t.uniform1i(fe.bloomTex, 2), t.useProgram(ae), t.uniform1i(ge.texture, 0), t.useProgram(Re), t.uniform1i(Ht.texture, 0), t.useProgram(Fe), t.uniform1i(qe.texture, 0), t.uniform1i(qe.held, 3);
  const Be = t.createBuffer();
  t.bindBuffer(t.ARRAY_BUFFER, Be), t.bufferData(t.ARRAY_BUFFER, new Float32Array([
    -1,
    -1,
    1,
    -1,
    -1,
    1,
    1,
    1
  ]), t.STATIC_DRAW);
  const St = t.createBuffer();
  t.bindBuffer(t.ARRAY_BUFFER, St), t.bufferData(t.ARRAY_BUFFER, new Float32Array([
    0,
    0,
    1,
    0,
    0,
    1,
    1,
    1
  ]), t.STATIC_DRAW);
  const nt = [null, null], Ve = [null, null];
  for (let s = 0; s < 2; s++) {
    const { texture: o, fbo: l } = pt(t, k(), b());
    nt[s] = o, Ve[s] = l;
  }
  let ot = 0, Ce = pt(t, k(), b()), $e = [], mt = 0, ht = null, kt = null;
  function Tn() {
    on(), !(Qr <= 0) && ($e = [pt(t, k(), b()), pt(t, k(), b())], mt = 0, ht = pt(t, k(), b()), kt = pt(t, k(), b()));
  }
  function on() {
    const s = [...$e, ht, kt];
    for (const o of s)
      o && (t.deleteTexture(o.texture), t.deleteFramebuffer(o.fbo));
    $e = [], ht = null, kt = null;
  }
  const Sn = 7;
  let ve = [];
  function qn(s, o) {
    const l = t.createTexture();
    t.bindTexture(t.TEXTURE_2D, l), t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, s, o, 0, t.RGBA, t.UNSIGNED_BYTE, null), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MIN_FILTER, t.LINEAR), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_MAG_FILTER, t.LINEAR), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE);
    const c = t.createFramebuffer();
    return t.bindFramebuffer(t.FRAMEBUFFER, c), t.framebufferTexture2D(t.FRAMEBUFFER, t.COLOR_ATTACHMENT0, t.TEXTURE_2D, l, 0), { texture: l, fbo: c, w: s, h: o };
  }
  function Rn() {
    for (const c of ve)
      t.deleteTexture(c.texture), t.deleteFramebuffer(c.fbo);
    ve = [];
    let s = Math.max(1, k() >> 2), o = Math.max(1, b() >> 2);
    const l = Math.min(Sn, B);
    for (let c = 0; c < l && (ve.push(qn(s, o)), !(s === 1 && o === 1)); c++)
      s = Math.max(1, s >> 1), o = Math.max(1, o >> 1);
  }
  Rn();
  const Q = ja(t, k(), b()), Mn = Math.max(0, Math.floor(e.historyLimit ?? qi())) || 0, ye = $i({
    gl: t,
    getSimSize: () => U(),
    getPaintFbo: () => Q.getPaintFbo(),
    getMovementFbo: () => Q.getMovementFbo(),
    onOutOfMemory: () => Qe.emit()
  }, Mn), Cn = typeof document < "u" && typeof document.addEventListener == "function" ? document : null, gt = () => {
    Cn?.visibilityState === "hidden" && (ye.release(), Qe.emit());
  };
  Cn?.addEventListener("visibilitychange", gt);
  const Rt = () => !f && !Lt;
  function An() {
    pe.isRecording() && pe.stop(), Xt();
    for (let s = 0; s < 2; s++) {
      t.deleteTexture(nt[s]), t.deleteFramebuffer(Ve[s]);
      const { texture: o, fbo: l } = pt(t, k(), b());
      nt[s] = o, Ve[s] = l;
    }
    t.deleteTexture(Ce.texture), t.deleteFramebuffer(Ce.fbo), Ce = pt(t, k(), b()), Rn(), Q.resize(k(), b());
  }
  function Xt() {
    n.width = k() * D(), n.height = b() * D(), it = !0, t.viewport(0, 0, k(), b());
  }
  function rn(s) {
    s !== y && (y = s, An());
  }
  let rt = 0, at = 0, Mt = 0, Gt = 0, an = 0, Vt = 0, Ct = !1, We = !1, ln = !1;
  const be = () => Ct || We;
  let it = !0, lt = !0, sn = !0, Wt = !1, vt = 0, Ue = -1;
  const bt = vo, Ln = Wi(bt), cn = 2;
  let Yt = 0;
  const Fn = () => {
    Yt = 0;
  };
  let xe = "flow", st = "down", At = d.defaultWaterfallMode, Pe = null;
  function _o(s) {
    return $o(xe) && Tt(xe) !== Tt(s.mode);
  }
  let Lt = !1, Me = 0, wt = 0;
  const yo = la, $n = 0.35;
  let Ft = 0, Ke = 0, ee = null, qt = null, _t = !1;
  const Ze = oi(() => dn());
  function yt(s) {
    Ze.setSource(s);
  }
  function je() {
    return ni(xe, Q.getBrushShape(), Ze.getSource());
  }
  function Pt() {
    return !ee || !qt || be() ? null : Gi(ee, qt, k(), b(), _t);
  }
  let un = 0;
  function $t(s) {
    const o = xo(), l = un;
    return un = o, {
      waterfallVariant: At,
      flowDir: s,
      cyclePhase: o,
      cyclePhaseFrom: l,
      liveSrc: Ze.getSource() ?? void 0,
      pairedMovement: Pe ?? void 0
    };
  }
  function Kn(s) {
    yt({ ...s, ...ti(Q.getBrushShape(), Q.getFuzzyEdges(), Q.getRectOval()) });
  }
  const Pn = () => d.cycleColorHueBaseSpeed === Yo;
  function Dn() {
    const s = d.cycleColorHueBaseSpeed;
    return Pn() ? s : s * Gn;
  }
  function fn() {
    const s = Dn(), o = Math.max(1, Math.round(1 / (Uo * Gn)));
    if (s > 0)
      for (let l = o; l <= ji; l++) {
        const c = l * s;
        if (Math.abs(c - Math.round(c)) < 1e-3) return l;
      }
    return Ko;
  }
  function Ye() {
    return fn() * Zi;
  }
  function Zn(s, o) {
    return Math.max(1, Math.round(s * o / bt));
  }
  function jn() {
    const s = fn(), o = (l) => Zn(s, l);
    return {
      blank: o(Qi),
      block: o(br),
      edge: o(Ji)
    };
  }
  const Kt = yn(), dn = () => Kt.emit({ globalFreeze: Ct, liveArmed: Ze.getSource() !== null }), xt = yn(), Qn = () => xt.emit(), Qe = yn(), Jn = yn(), eo = yn();
  let pn = null;
  const pe = Di(
    n,
    i,
    (s) => {
      s === "recording" ? Tn() : s === "idle" && on(), Fn(), Jn.emit(s);
    },
    Ye,
    N,
    C
  );
  Q.generateBrushSizeOptions();
  function to(s) {
    p = s, d = zo(p), rn(d.canvasScale), it = !0, lt = !0, sn = !0, Q.generateBrushSizeOptions();
  }
  function mn() {
    for (let s = 0; s < 2; s++)
      t.bindFramebuffer(t.FRAMEBUFFER, Ve[s]), t.clearColor(0, 0, 0, 0), t.clear(t.COLOR_BUFFER_BIT);
    t.bindFramebuffer(t.FRAMEBUFFER, null);
  }
  function hn(s) {
    rt = Mt = Gt = s, at = s / bt;
  }
  function no() {
    Q.clearAll(), At = d.defaultWaterfallMode, hn(0), Lt = !1, ee = null, yt(null);
  }
  function In() {
    const s = d.palette;
    t.uniform1f(E.targetFps, bt), t.uniform2f(E.resolution, k(), b()), t.uniform1f(E.pixelRatio, Ki), t.uniform3f(E.seedOffset, d.shaderOffset[0], d.shaderOffset[1], d.shaderOffset[2]), t.uniform1i(E.chunkType, Fa.indexOf(d.chunkType)), t.uniform1f(E.checkerScale, d.checkerScale), t.uniform1f(E.moveSpeed, d.moveSpeed * d.moveSpeedMult * Gn), t.uniform1f(E.resetEdgeThreshold, 1 - Math.pow(1 - d.resetEdgeThreshold, Gn)), t.uniform1f(E.staticResetThreshold, el), t.uniform1f(E.ribbonDirtThreshold, nl), t.uniform1i(E.useColorCycle, s.useColorCycle ? 1 : 0), t.uniform1f(E.blankStaticThreshold, d.blankStaticThreshold), t.uniform1i(E.gradientBlockPattern, d.gradientBlockPattern), t.uniform1ui(E.noiseMultiplier, d.noiseMultiplier), t.uniform1f(E.blankStaticTimeMult, ol);
    const o = jn();
    t.uniform1f(E.staticCyclesBlank, o.blank), t.uniform1f(E.staticCyclesBlock, o.block), t.uniform1f(E.staticCyclesEdge, o.edge);
    const l = Ye();
    t.uniform1f(E.brushLoopFrames, l), t.uniform1i(E.bgStyle, La.indexOf(d.backgroundStyle)), t.uniform3f(E.staticColor1, s.colors[0][0], s.colors[0][1], s.colors[0][2]), t.uniform3f(E.staticColor2, s.colors[1][0], s.colors[1][1], s.colors[1][2]), t.uniform3f(E.staticColor3, s.colors[2][0], s.colors[2][1], s.colors[2][2]), t.uniform2f(E.extraFallStutterScale, d.extraFallStutterScale[0], d.extraFallStutterScale[1]), t.uniform2f(E.extraMoveStutterScale, d.extraMoveStutterScale[0], d.extraMoveStutterScale[1]), t.uniform1f(E.extraFallStutterThreshold, rl), t.uniform1f(E.extraMoveStutterThreshold, al), t.uniform1f(E.fallWaterfallMult, il), t.uniform2f(E.dirtNoiseScale, d.dirtNoiseScale[0], d.dirtNoiseScale[1]), t.uniform2f(E.blankStaticScale, d.blankStaticScale[0], d.blankStaticScale[1]);
  }
  function Dt() {
    const s = fn(), o = Gt % s / s, l = Mt % s, c = l / s, h = Pn() ? 1 : Math.max(1, Math.round(tl / Gn)), v = Math.max(1, Math.round(s / h)), S = Math.floor(l * v / s) / v;
    return { loopFrames: s, rawPhase: o, hueRawPhase: c, steppedHuePhase: S };
  }
  function Bn(s, o) {
    const l = Dn(), c = Math.max(1, Math.round(l * s));
    return o * c;
  }
  function ct(s) {
    return { stepped: Bn(s.loopFrames, s.steppedHuePhase), smooth: Bn(s.loopFrames, s.hueRawPhase) };
  }
  function xo() {
    const s = ct(Dt()).smooth;
    return s - Math.floor(s);
  }
  function ze(s) {
    t.bindBuffer(t.ARRAY_BUFFER, Be), t.enableVertexAttribArray(s.position), t.vertexAttribPointer(s.position, 2, t.FLOAT, !1, 0, 0), t.bindBuffer(t.ARRAY_BUFFER, St), t.enableVertexAttribArray(s.texCoord), t.vertexAttribPointer(s.texCoord, 2, t.FLOAT, !1, 0, 0);
  }
  function kn() {
    const s = d.palette;
    t.uniform1i(q.useColorCycle, s.useColorCycle ? 1 : 0), t.uniform3f(q.staticColor1, s.colors[0][0], s.colors[0][1], s.colors[0][2]), t.uniform3f(q.staticColor2, s.colors[1][0], s.colors[1][1], s.colors[1][2]), t.uniform3f(q.staticColor3, s.colors[2][0], s.colors[2][1], s.colors[2][2]), t.uniform3f(q.blankColorMult, To[0], To[1], To[2]), sn = !1;
  }
  function gn(s, o, l) {
    t.bindFramebuffer(t.FRAMEBUFFER, o), t.invalidateFramebuffer(t.FRAMEBUFFER, u), t.viewport(0, 0, k(), b()), t.useProgram(I), sn && kn(), t.activeTexture(t.TEXTURE0), t.bindTexture(t.TEXTURE_2D, s), t.uniform1f(q.cycleHue, l.stepped), t.uniform1f(q.cycleHueSmooth, l.smooth), ze(V), t.drawArrays(t.TRIANGLE_STRIP, 0, 4);
  }
  function Un(s) {
    const o = Math.min(Math.max(1, B), ve.length);
    t.disable(t.BLEND), t.useProgram(ae), ze(Le);
    const l = d.globalBloomMult === 1 ? 0.2 : 0.4;
    t.uniform1f(ge.threshold, De), t.uniform1f(ge.lumaWeight, l);
    for (let c = 0; c < o; c++) {
      const h = ve[c], v = c === 0 ? s : ve[c - 1].texture, S = c === 0 ? k() : ve[c - 1].w, M = c === 0 ? b() : ve[c - 1].h;
      t.bindFramebuffer(t.FRAMEBUFFER, h.fbo), t.invalidateFramebuffer(t.FRAMEBUFFER, u), t.viewport(0, 0, h.w, h.h), t.activeTexture(t.TEXTURE0), t.bindTexture(t.TEXTURE_2D, v), t.uniform2f(ge.texelSize, 1 / S, 1 / M), t.uniform1f(ge.prefilter, c === 0 ? 1 : 0), t.drawArrays(t.TRIANGLE_STRIP, 0, 4);
    }
    t.enable(t.BLEND), t.blendFunc(t.ONE, t.ONE), t.useProgram(Re), ze(tt), t.uniform1f(Ht.radius, F);
    for (let c = o - 1; c > 0; c--) {
      const h = ve[c], v = ve[c - 1];
      t.bindFramebuffer(t.FRAMEBUFFER, v.fbo), t.viewport(0, 0, v.w, v.h), t.activeTexture(t.TEXTURE0), t.bindTexture(t.TEXTURE_2D, h.texture), t.uniform2f(Ht.texelSize, 1 / h.w, 1 / h.h), t.drawArrays(t.TRIANGLE_STRIP, 0, 4);
    }
    t.disable(t.BLEND), t.viewport(0, 0, P(), K());
  }
  function zn(s) {
    t.bindFramebuffer(t.FRAMEBUFFER, null), t.invalidateFramebuffer(t.FRAMEBUFFER, m), t.viewport(0, 0, P(), K()), t.useProgram(ne), lt && (t.uniform1f(fe.crtEnabled, T ? 0 : 1), t.uniform1f(fe.bloomEnabled, $ ? 1 : 0), t.uniform1f(fe.bloomIntensity, Ie * d.globalBloomMult), t.uniform1f(fe.bloomEdgeFade, Y), lt = !1), t.activeTexture(t.TEXTURE0), t.bindTexture(t.TEXTURE_2D, s), $ && ve.length > 0 && (t.activeTexture(t.TEXTURE2), t.bindTexture(t.TEXTURE_2D, ve[0].texture)), t.uniform1f(fe.viewZoom, O), t.uniform2f(fe.viewCenter, j, H), ze(de), t.drawArrays(t.TRIANGLE_STRIP, 0, 4);
  }
  function oo(s, o) {
    return s?.action !== "blend" || !kt || !ht ? Ce.texture : (gn($e[mt].texture, ht.fbo, o), t.bindFramebuffer(t.FRAMEBUFFER, kt.fbo), t.invalidateFramebuffer(t.FRAMEBUFFER, u), t.viewport(0, 0, k(), b()), t.disable(t.BLEND), t.useProgram(Fe), t.uniform1f(qe.weight, s.weight), t.activeTexture(t.TEXTURE0), t.bindTexture(t.TEXTURE_2D, Ce.texture), t.activeTexture(t.TEXTURE3), t.bindTexture(t.TEXTURE_2D, ht.texture), ze(Yn), t.drawArrays(t.TRIANGLE_STRIP, 0, 4), kt.texture);
  }
  function On(s, o, l = null) {
    gn(nt[s], Ce.fbo, o);
    const c = oo(l, o);
    $ && Un(c), zn(c);
  }
  function ut() {
    On(ot, ct(Dt()));
  }
  function vn(s, o) {
    if (pe.isRecording() || f) return null;
    if (s.length === 0) return [];
    const l = Math.min(k(), b(), Math.max(1, Math.round(o) || 1)), c = t.getParameter(t.FRAMEBUFFER_BINDING), h = t.getParameter(t.VIEWPORT), v = t.getParameter(t.ACTIVE_TEXTURE), S = t.getParameter(t.CURRENT_PROGRAM), M = Math.floor((k() - l) / 2), z = Math.floor((b() - l) / 2);
    t.activeTexture(t.TEXTURE0);
    const X = Go(t, 1, 1), te = Go(t, k(), b()), J = pt(t, M + l, z + l), me = s.length * l, ie = pt(t, me, l), ft = new Uint8Array(me * l * 4), nr = [];
    try {
      t.useProgram(I), kn(), t.useProgram(x), In(), it = !1, t.uniform1f(E.staticLoopPhase, 0), t.uniform1f(E.steppedHuePhase, 0), t.uniform1f(E.globalFreeze, 0), t.uniform1f(E.noiseFreeze, 0), t.enable(t.SCISSOR_TEST);
      for (let dt = 0; dt < s.length; dt++)
        t.activeTexture(t.TEXTURE4), t.bindTexture(t.TEXTURE_2D, te), t.texSubImage2D(t.TEXTURE_2D, 0, M, z, l, l, t.RGBA, t.UNSIGNED_BYTE, ll(s[dt], l)), t.activeTexture(t.TEXTURE1), t.bindTexture(t.TEXTURE_2D, X), t.activeTexture(t.TEXTURE0), t.bindTexture(t.TEXTURE_2D, X), t.bindFramebuffer(t.FRAMEBUFFER, J.fbo), t.viewport(0, 0, k(), b()), t.scissor(M, z, l, l), t.useProgram(x), ze(w), t.drawArrays(t.TRIANGLE_STRIP, 0, 4), t.bindFramebuffer(t.FRAMEBUFFER, ie.fbo), t.viewport(dt * l - M, -z, M + l, z + l), t.scissor(dt * l, 0, l, l), t.useProgram(I), t.bindTexture(t.TEXTURE_2D, J.texture), t.uniform1f(q.cycleHue, 0), t.uniform1f(q.cycleHueSmooth, 0), ze(V), t.drawArrays(t.TRIANGLE_STRIP, 0, 4);
      t.readPixels(0, 0, me, l, t.RGBA, t.UNSIGNED_BYTE, ft);
      const Nn = l * 4;
      for (let dt = 0; dt < s.length; dt++) {
        const or = new Uint8ClampedArray(l * Nn);
        for (let io = 0; io < l; io++) {
          const rr = (io * me + dt * l) * 4;
          or.set(ft.subarray(rr, rr + Nn), (l - 1 - io) * Nn);
        }
        nr.push({ mode: s[dt], width: l, height: l, data: or });
      }
    } finally {
      t.disable(t.SCISSOR_TEST);
      for (const Nn of [X, te, J.texture, ie.texture]) t.deleteTexture(Nn);
      t.deleteFramebuffer(J.fbo), t.deleteFramebuffer(ie.fbo), t.bindFramebuffer(t.FRAMEBUFFER, c), t.viewport(h[0], h[1], h[2], h[3]), t.useProgram(S), t.activeTexture(v);
    }
    return nr;
  }
  function Zt() {
    const s = (ot + 1) % 2, o = pe.getFrameStep();
    o?.action === "skip" && o.snapshot && $e.length && (t.bindFramebuffer(t.FRAMEBUFFER, Ve[ot]), t.activeTexture(t.TEXTURE3), t.bindTexture(t.TEXTURE_2D, $e[0].texture), t.copyTexSubImage2D(t.TEXTURE_2D, 0, 0, 0, 0, 0, k(), b()), mt = 0), t.bindFramebuffer(t.FRAMEBUFFER, Ve[s]), t.invalidateFramebuffer(t.FRAMEBUFFER, u), t.viewport(0, 0, k(), b()), t.useProgram(x), it && (In(), it = !1);
    const l = Dt(), { rawPhase: c, steppedHuePhase: h } = l;
    t.uniform1f(E.staticLoopPhase, c), t.uniform1f(E.steppedHuePhase, h);
    const v = Ye(), S = rt % v;
    t.uniform1f(E.brushFrameCount, S), t.uniform1f(E.brushTime, S / bt);
    const M = Zn(v, br);
    t.uniform1f(E.brushBlockTime, Math.floor(S * M / v)), t.uniform1f(E.globalFreeze, be() ? 1 : 0), t.uniform1f(E.noiseFreeze, ln ? 1 : 0);
    const z = ct(l);
    if (t.activeTexture(t.TEXTURE1), t.bindTexture(t.TEXTURE_2D, Q.getMovementTexture()), t.activeTexture(t.TEXTURE4), t.bindTexture(t.TEXTURE_2D, Q.getPaintTexture()), t.activeTexture(t.TEXTURE5), t.bindTexture(t.TEXTURE_2D, Ce.texture), t.activeTexture(t.TEXTURE0), t.bindTexture(t.TEXTURE_2D, nt[ot]), ze(w), t.drawArrays(t.TRIANGLE_STRIP, 0, 4), o?.action === "blend" && $e.length) {
      const te = mt ^ 1;
      t.bindFramebuffer(t.FRAMEBUFFER, $e[te].fbo), t.invalidateFramebuffer(t.FRAMEBUFFER, u), t.activeTexture(t.TEXTURE0), t.bindTexture(t.TEXTURE_2D, $e[mt].texture), t.drawArrays(t.TRIANGLE_STRIP, 0, 4), mt = te;
    }
    On(s, z, o), W && (W = !1, ro()), ot = s, pe.tick();
    const X = pe.getCountdown();
    (X?.seconds !== pn?.seconds || X?.pulse !== pn?.pulse) && (pn = X, eo.emit());
  }
  function ro() {
    Pi(t, n, Ce.texture, U(), N());
  }
  function jt(s) {
    if (!Ln.shouldRender(s)) {
      vt = requestAnimationFrame(jt);
      return;
    }
    if (pe.isBackpressured()) {
      vt = requestAnimationFrame(jt);
      return;
    }
    be() || (rt++, at = rt / bt), We || Mt++, !We && !ln && Gt++, we(s), We && !pe.isRecording() && Yt >= cn || (Zt(), Yt = We ? Yt + 1 : 0), an++, Ue < 0 && (Ue = s);
    const l = s - Ue;
    l >= 1e3 && (Vt = Math.round(an * 1e3 / l), an = 0, Ue = s, r?.(Vt)), vt = requestAnimationFrame(jt);
  }
  function ao() {
    return {
      gl: t,
      getSeed: () => p,
      getSimSize: U,
      getPaint: () => ({ texture: Q.getPaintTexture(), fbo: Q.getPaintFbo() }),
      getMovement: () => ({ texture: Q.getMovementTexture(), fbo: Q.getMovementFbo() }),
      getFeedback: () => ({ texture: nt[ot], fbo: Ve[ot] }),
      getFrame: () => Mt,
      setFrame: hn,
      setSeed: (s) => bn.setSeed(s),
      present: ut,
      isRecording: () => pe.isRecording()
    };
  }
  const Eo = wn(Q), bn = {
    start() {
      Wt || (Wt = !0, Ln.reset(), Ue = -1, vt = requestAnimationFrame(jt));
    },
    stop() {
      Wt = !1, cancelAnimationFrame(vt);
    },
    destroy() {
      bn.stop(), pe.destroy(), Q.destroy(), ye.destroy(), t.deleteProgram(x), t.deleteProgram(I), t.deleteProgram(ne), t.deleteProgram(ae), t.deleteProgram(Re), t.deleteProgram(Fe), on();
      for (const s of ve)
        t.deleteTexture(s.texture), t.deleteFramebuffer(s.fbo);
      ve = [];
      for (let s = 0; s < 2; s++)
        t.deleteTexture(nt[s]), t.deleteFramebuffer(Ve[s]);
      t.deleteTexture(Ce.texture), t.deleteFramebuffer(Ce.fbo), t.deleteBuffer(Be), t.deleteBuffer(St), n.removeEventListener("webglcontextlost", g), Cn?.removeEventListener("visibilitychange", gt);
    },
    setSeed(s) {
      to(s), mn(), no(), ye.clear(), Qe.emit(), Qn();
    },
    getSeed() {
      return p;
    },
    onSeedChange(s) {
      return xt.add(s);
    },
    // Single coherent writer of the three freeze flags. 0 playing, 1 partial
    // (movement), 2 +static (movement+static, hue cycles), 3 total (dead frame).
    setFreezeLevel(s) {
      yt(null), Ct = s >= 1, ln = s >= 2, We = s >= 3, dn();
    },
    getFreezeLevel() {
      return We ? 3 : ln ? 2 : Ct ? 1 : 0;
    },
    // Thin wrappers. Both route through setFreezeLevel so noiseFreezeFlag never
    // gets left in an inconsistent state.
    setGlobalFreeze(s) {
      this.setFreezeLevel(s ? 1 : 0);
    },
    isGlobalFrozen() {
      return Ct;
    },
    setTotalFreeze(s) {
      this.setFreezeLevel(s ? 3 : 0);
    },
    isTotalFrozen() {
      return We;
    },
    onModeStateChange(s) {
      return Kt.add(s);
    },
    getDrawingManager() {
      return Eo;
    },
    handlePointerDown(s, o, l = performance.now()) {
      if (be()) return;
      const [c, h] = he(s, o);
      if (xe === "live" && !Ze.getSource() && !je()) {
        Kn(ei(c, h, Q.getBrushSize(), k(), b()));
        return;
      }
      if (Lt = !0, je()) {
        ee = { x: c, y: h }, qt = { x: c, y: h };
        return;
      }
      Me = c, wt = h, Ft = 0, Ke = 0, xe !== "flow" && (xe === "live" && Ze.stampDown(c, h, l), ye.beforeWrite(), Q.drawAt(c, h, xe, st, $t()));
    },
    handlePointerMove(s, o, l = performance.now()) {
      if (!Lt || be()) return;
      const [c, h] = he(s, o);
      if (ee) {
        qt = { x: c, y: h };
        return;
      }
      if (xe === "live") {
        const S = Ze.stampMove(c, h, l);
        if (Me = c, wt = h, S.length === 0) return;
        ye.beforeWrite();
        const M = $t();
        for (const z of S) Q.drawAt(z.x, z.y, xe, st, M);
        return;
      }
      let v;
      if (xe === "flow") {
        const S = c - Me, M = h - wt, z = Math.hypot(S, M);
        if (z < yo) return;
        const te = Ft === 0 && Ke === 0 ? 1 : $n;
        Ft += (S / z - Ft) * te, Ke += (M / z - Ke) * te;
        const J = Math.hypot(Ft, Ke) || 1;
        v = [Ft / J, Ke / J];
      }
      ye.beforeWrite(), Q.drawLine(Me, wt, c, h, xe, st, $t(v)), Me = c, wt = h;
    },
    handlePointerUp() {
      const s = Pt();
      if (s && xe === "live")
        Kn(Ja(s, k(), b()));
      else if (s) {
        const o = Q.getRectOval() ? s.unclamped : s;
        ye.beforeWrite(), Q.fillRect(o.x0, o.y0, o.x1, o.y1, xe, st, $t(s.flowDir));
      }
      ee = null, Lt = !1, ye.commit() && Qe.emit();
    },
    handlePointerCancel(s) {
      ee = null, s?.revert && ye.revert(), this.handlePointerUp();
    },
    isRectDragging() {
      return ee !== null;
    },
    cancelRectDrag() {
      return ee === null ? !1 : (this.handlePointerCancel(), !0);
    },
    setRectConstrain(s) {
      _t = s;
    },
    getRectConstrain() {
      return _t;
    },
    getLiveSource() {
      return Ze.getSource();
    },
    setLiveSource: yt,
    usesRectDrag: je,
    setBrushShape(s) {
      ee && this.handlePointerCancel(), Q.setBrushShape(s), yt(null);
    },
    getBrushShape() {
      return Q.getBrushShape();
    },
    setFuzzyEdges(s) {
      Q.setFuzzyEdges(s);
    },
    getFuzzyEdges() {
      return Q.getFuzzyEdges();
    },
    setRectOval(s) {
      Q.setRectOval(s);
    },
    getRectOval() {
      return Q.getRectOval();
    },
    // Live stamp: any mode pick (the live button too, to pick again), shape or
    // pause change drops the captured area, returning live to the area picker.
    setDrawMode(s) {
      xe = s, Pe = null, yt(null);
    },
    getDrawMode() {
      return xe;
    },
    setDirection(s) {
      st = s;
    },
    getDirection() {
      return st;
    },
    setWaterfallVariant(s) {
      At = s;
    },
    getWaterfallVariant() {
      return At;
    },
    setPairedMovement(s) {
      Pe = s && _o(s) ? { ...s } : null;
    },
    getPairedMovement() {
      return Pe;
    },
    getParams() {
      return d;
    },
    getTime() {
      return at;
    },
    getTotalFrameCount() {
      return rt;
    },
    isRunning() {
      return Wt;
    },
    setWarpFx(s) {
      pe.isRecording() || s === !T || (T = !s, lt = !0, Xt(), f || ut());
    },
    getWarpFx() {
      return !T;
    },
    setBloomEnabled(s) {
      $ = s, lt = !0;
    },
    getBloomEnabled() {
      return $;
    },
    getSimSize() {
      return U();
    },
    toSimCoords(s, o, l = !1) {
      return Xi(s, o, n, U(), l);
    },
    zoomView(s, o, l) {
      if (ee !== null) return;
      const c = o ?? k() / 2, h = l ?? b() / 2, [v, S] = _e(c, h), M = Math.min(A, Math.max(1, O * s));
      j += (v - 0.5) / O - (v - 0.5) / M, H += (S - 0.5) / O - (S - 0.5) / M, O = M, se();
    },
    panView(s, o, l, c) {
      if (ee !== null || O === 1) return;
      const [h, v] = _e(s, o), [S, M] = _e(l, c);
      j -= (S - h) / O, H -= (M - v) / O, se();
    },
    resetView() {
      ee === null && (O = 1, j = 0.5, H = 0.5, se());
    },
    getViewZoom() {
      return O;
    },
    getViewCenter() {
      return { x: j, y: H };
    },
    setViewCenter(s, o) {
      ee !== null || O === 1 || (j = s, H = o, se());
    },
    onViewChange(s) {
      return Ge.add(s);
    },
    setFilenameLabel(s) {
      _ = s;
    },
    renderNow() {
      pe.isRecording() || Zt();
    },
    renderPaintSamples: vn,
    async exportState() {
      const s = await Oi(ao()), o = (l) => new Blob([l], { type: "image/png" });
      return { ...s, paint: o(s.paint), movement: o(s.movement), state: o(s.state) };
    },
    async loadState(s) {
      const o = async (v) => v instanceof Uint8Array ? v : new Uint8Array(await v.arrayBuffer()), [l, c, h] = await Promise.all([o(s.paint), o(s.movement), o(s.state)]);
      await Ni(ao(), { seed: s.seed, frame: s.frame, paint: l, movement: c, state: h });
    },
    async captureThumbnail(s = {}) {
      const { mime: o = "image/jpeg", quality: l = 0.92, maxEdge: c } = s;
      if (pe.isRecording()) throw new Error("[sketch-engine] thumbnail: cannot capture while recording");
      const h = O, v = j, S = H;
      O = 1, j = 0.5, H = 0.5;
      let M;
      try {
        ut(), M = na(t, n, Ce.texture, U());
      } finally {
        O = h, j = v, H = S, ut();
      }
      if (!M) throw new Error("[sketch-engine] thumbnail: no 2D context");
      let z = M;
      const X = Math.max(M.width, M.height);
      if (c !== void 0 && X > c) {
        const te = c / X;
        z = document.createElement("canvas"), z.width = Math.max(1, Math.round(M.width * te)), z.height = Math.max(1, Math.round(M.height * te));
        const J = z.getContext("2d");
        if (!J) throw new Error("[sketch-engine] thumbnail: no 2D context");
        J.imageSmoothingQuality = "high", J.drawImage(M, 0, 0, z.width, z.height);
      }
      return new Promise((te, J) => {
        z.toBlob((me) => {
          me ? te(me) : J(new Error("[sketch-engine] thumbnail: encoding failed"));
        }, o, l);
      });
    },
    captureScreenshot() {
      if (!f) {
        if (pe.isRecording()) {
          W = !0;
          return;
        }
        ut(), ro();
      }
    },
    startRecording() {
      pe.start();
    },
    stopRecording() {
      pe.stop();
    },
    isRecording() {
      return pe.isRecording();
    },
    getRecordingStatus() {
      return pe.getStatus();
    },
    onRecordingStateChange(s) {
      return Jn.add(s);
    },
    getRecordingCountdown() {
      return pe.getCountdown();
    },
    onRecordingCountdownChange(s) {
      return eo.add(s);
    },
    undo() {
      return !Rt() || !ye.undo() ? !1 : (Qe.emit(), !0);
    },
    redo() {
      return !Rt() || !ye.redo() ? !1 : (Qe.emit(), !0);
    },
    canUndo() {
      return Rt() && ye.canUndo();
    },
    canRedo() {
      return Rt() && ye.canRedo();
    },
    getHistoryLimit() {
      return ye.limit();
    },
    onHistoryChange(s) {
      return Qe.add(s);
    },
    getCanvasDisplayRect() {
      const s = n.getBoundingClientRect();
      return { left: s.left, top: s.top, width: s.width, height: s.height };
    },
    getCanvas() {
      return n;
    }
  };
  return wn(bn);
  function wn(s) {
    const o = { ...s };
    for (const [l, c] of Object.entries(s))
      typeof c == "function" && (o[l] = function(...h) {
        return Fn(), c.apply(this, h);
      });
    return o;
  }
}
const sl = 150, wr = 36, _r = 20, cl = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M3 12h18M9 6l3-3 3 3M9 18l3 3 3-3M6 9l-3 3 3 3M18 9l3 3-3 3"/></svg>';
function yr(e) {
  const n = e.touches[0];
  if (!n) return null;
  const r = e.touches[1];
  return r ? { x: (n.clientX + r.clientX) / 2, y: (n.clientY + r.clientY) / 2 } : { x: n.clientX, y: n.clientY };
}
function ul(e, n, r = document.body) {
  const i = document.createElement("div");
  i.className = "sk-brush-ring", i.innerHTML = cl, r.appendChild(i);
  const a = document.createElement("div");
  a.className = "sk-rect-preview", r.appendChild(a);
  let t = null, u = !1, m = null, f, g = !1, p, d = 0, y = !1, T = !1, k = !1, b = !1;
  function U(_, W, N, A) {
    if (!b) return { x: W, y: N };
    const G = n.getSimSize(), Z = y ? A.width / G.height : A.width / G.width, oe = y ? A.height / G.width : A.height / G.height, re = W - _.x, O = N - _.y, j = Math.max(Math.abs(re) / Z, Math.abs(O) / oe);
    return { x: _.x + (re < 0 ? -j : j) * Z, y: _.y + (O < 0 ? -j : j) * oe };
  }
  function P(_, W, N) {
    m = { x: _, y: W };
    const A = N ?? e.getBoundingClientRect(), G = r.getBoundingClientRect();
    i.style.left = _ - G.left + "px", i.style.top = W - G.top + "px";
    const Z = g || T || k;
    i.classList.toggle("sk-view-moving", Z);
    const oe = n.getBrushShape(), re = n.usesRectDrag();
    i.classList.toggle("sk-crosshair", re && !Z);
    const O = re && t !== null && n.isRectDragging();
    if (O && !Z) {
      const Le = t, ge = U(Le, _, W, A);
      a.style.left = Math.min(Le.x, ge.x) - G.left + "px", a.style.top = Math.min(Le.y, ge.y) - G.top + "px", a.style.width = Math.abs(ge.x - Le.x) + "px", a.style.height = Math.abs(ge.y - Le.y) + "px", a.style.borderRadius = n.getRectOval() ? "50%" : "0", a.style.display = "block";
    } else
      a.style.display = "none";
    if (Z) {
      i.style.width = wr + "px", i.style.height = wr + "px", i.style.borderRadius = "0", i.style.opacity = "1", u = !0;
      return;
    }
    if (re) {
      i.style.width = _r + "px", i.style.height = _r + "px", i.style.borderRadius = "0", i.style.opacity = O ? "0" : "1", u = !0;
      return;
    }
    const j = n.getDrawingManager().getBrushSize(), H = n.getSimSize(), Te = n.getViewZoom(), Ge = (y ? A.width / H.height : A.width / H.width) * Te, Ae = (y ? A.height / H.width : A.height / H.height) * Te, se = n.getDrawMode() === "live" ? n.getLiveSource() : null, we = se ? y ? se.h : se.w : j * 2, Se = se ? y ? se.w : se.h : j * 2, _e = we * Ge, he = Se * Ae;
    i.style.width = _e + "px", i.style.height = he + "px";
    const ae = se ? se.shape === "ellipse" : oe === "circle";
    i.style.borderRadius = ae ? "50%" : "0", i.style.opacity = "1", u = !0;
  }
  function K() {
    i.style.opacity = "0", a.style.display = "none", u = !1;
  }
  function C() {
    n.isRectDragging() || K();
  }
  function D() {
    if (u && m)
      P(m.x, m.y);
    else {
      const _ = e.getBoundingClientRect();
      P(_.left + _.width / 2, _.top + _.height / 2, _), clearTimeout(f), f = setTimeout(K, 800);
    }
  }
  function x(_) {
    P(_.clientX, _.clientY);
  }
  function w(_) {
    P(_.clientX, _.clientY);
  }
  function E(_) {
    d = _.touches.length;
    const W = yr(_);
    W && P(W.x, W.y);
  }
  function I(_) {
    d = _.touches.length;
    const W = yr(_);
    W && P(W.x, W.y);
  }
  function V(_) {
    d = _.touches.length, d === 0 && (g = !1), K();
  }
  function q() {
    g = !1, u && m && P(m.x, m.y);
  }
  const ne = n.onViewChange(() => {
    const _ = g && u;
    g = !0, _ || D(), clearTimeout(p), d === 0 && (p = setTimeout(q, sl));
  });
  function de(_) {
    _ !== T && (T = _, u && m && P(m.x, m.y));
  }
  function fe(_) {
    _ !== k && (k = _, u && m && P(m.x, m.y));
  }
  function $(_) {
    _ !== b && (b = _, u && m && P(m.x, m.y));
  }
  function De(_) {
    de(_.ctrlKey), _.pointerType !== "touch" && P(_.clientX, _.clientY);
  }
  function Ie(_) {
    _.isPrimary && (t = { x: _.clientX, y: _.clientY }), de(_.ctrlKey);
  }
  function F(_) {
    _.isPrimary && (t = null, a.style.display = "none", _.pointerType !== "touch" && u && P(_.clientX, _.clientY)), de(_.ctrlKey);
  }
  function B(_) {
    _.key === "Control" && de(_.type === "keydown");
  }
  function Y() {
    de(!1);
  }
  return e.addEventListener("mousemove", x), e.addEventListener("mouseenter", w), e.addEventListener("mouseleave", C), e.addEventListener("touchmove", E, { passive: !0 }), e.addEventListener("touchstart", I, { passive: !0 }), e.addEventListener("touchend", V), e.addEventListener("touchcancel", V), e.addEventListener("pointermove", De), e.addEventListener("pointerleave", C), e.addEventListener("pointerdown", Ie), e.addEventListener("pointerup", F), e.addEventListener("pointercancel", F), window.addEventListener("keydown", B), window.addEventListener("keyup", B), window.addEventListener("blur", Y), {
    refresh: D,
    setRotated(_) {
      y = _, u && m && P(m.x, m.y);
    },
    setPanHint: de,
    setPanMode: fe,
    setRectConstrain: $,
    destroy() {
      clearTimeout(f), clearTimeout(p), ne(), e.removeEventListener("mousemove", x), e.removeEventListener("mouseenter", w), e.removeEventListener("mouseleave", C), e.removeEventListener("touchmove", E), e.removeEventListener("touchstart", I), e.removeEventListener("touchend", V), e.removeEventListener("touchcancel", V), e.removeEventListener("pointermove", De), e.removeEventListener("pointerleave", C), e.removeEventListener("pointerdown", Ie), e.removeEventListener("pointerup", F), e.removeEventListener("pointercancel", F), window.removeEventListener("keydown", B), window.removeEventListener("keyup", B), window.removeEventListener("blur", Y), i.remove(), a.remove();
    }
  };
}
const fl = 2e-3;
function dl(e, n, r, i = !1) {
  if (n.ctrlKey || i) {
    const u = r(n.clientX, n.clientY);
    return e.zoomView(Math.exp(-n.deltaY * 0.01), u.x, u.y), "view";
  }
  if (n.deltaY === 0 || !Kr(e.isGlobalFrozen(), e.getDrawMode(), e.getBrushShape(), e.getLiveSource())) return null;
  const a = n.deltaMode === 1 ? 16 : 1, t = e.getDrawingManager();
  return t.setBrushSize(t.getBrushSize() * Math.exp(-n.deltaY * a * fl)), "size";
}
const pl = 80, ml = 250, hl = 300, kl = 12;
function gl(e, n, r = () => !1, i = { active: () => !1, onTap: () => {
} }, a = () => {
}) {
  const t = /* @__PURE__ */ new Map();
  let u = !1, m = null, f = 0, g = null, p = 0, d = null, y = null, T = null, k = null;
  function b() {
    k && (clearTimeout(k.timer), e.handlePointerDown(k.start.x, k.start.y, k.start.t), k.last && e.handlePointerMove(k.last.x, k.last.y, k.last.t), g = k.id, p = performance.now(), k = null);
  }
  function U() {
    k && clearTimeout(k.timer), k = null;
  }
  function P() {
    const w = t.values(), E = w.next().value, I = w.next().value;
    return { mid: { x: (E.x + I.x) / 2, y: (E.y + I.y) / 2 }, dist: Math.hypot(E.x - I.x, E.y - I.y) };
  }
  function K() {
    ({ mid: m, dist: f } = P());
  }
  function C(w) {
    T = { id: w.pointerId, prev: { x: w.clientX, y: w.clientY } };
  }
  function D() {
    if (!d || d.spoiled || performance.now() - d.firstDown > hl) return null;
    const { peak: w } = d;
    return w === 2 || w === 3 ? w : null;
  }
  function x() {
    U(), y = null, T = null, g !== null && (performance.now() - p <= ml ? e.handlePointerCancel({ revert: !0 }) : e.handlePointerCancel(), g = null), u = !0, K();
  }
  return {
    down(w) {
      if (t.set(w.pointerId, { x: w.clientX, y: w.clientY }), w.pointerType === "touch" && (d ??= { landed: /* @__PURE__ */ new Map(), peak: 0, firstDown: performance.now(), spoiled: !1 }, d.landed.set(w.pointerId, { x: w.clientX, y: w.clientY }), d.peak = Math.max(d.peak, t.size)), u) {
        t.size >= 2 && K();
        return;
      }
      if (t.size >= 2) {
        w.pointerType === "touch" && x();
        return;
      }
      if (w.pointerType === "touch" ? r() : (w.ctrlKey || r()) && (w.button === 0 || w.button === 2)) {
        C(w);
        return;
      }
      if (i.active()) {
        y = w.pointerId;
        return;
      }
      const I = n(w.clientX, w.clientY);
      w.pointerType === "touch" ? k = { id: w.pointerId, start: { ...I, t: w.timeStamp }, last: null, timer: setTimeout(b, pl) } : (g = w.pointerId, p = performance.now(), e.handlePointerDown(I.x, I.y, w.timeStamp));
    },
    move(w) {
      t.has(w.pointerId) && t.set(w.pointerId, { x: w.clientX, y: w.clientY });
      const E = d?.landed.get(w.pointerId);
      if (d && E && Math.hypot(w.clientX - E.x, w.clientY - E.y) > kl && (d.spoiled = !0), T && T.id === w.pointerId) {
        const V = n(T.prev.x, T.prev.y), q = n(w.clientX, w.clientY);
        e.panView(V.x, V.y, q.x, q.y), T.prev = { x: w.clientX, y: w.clientY };
        return;
      }
      if (u) {
        if (t.size < 2 || !m) return;
        const { mid: V, dist: q } = P(), ne = n(m.x, m.y), de = n(V.x, V.y);
        e.panView(ne.x, ne.y, de.x, de.y), f > 0 && q > 0 && e.zoomView(q / f, de.x, de.y), m = V, f = q;
        return;
      }
      if (k && k.id === w.pointerId) {
        k.last = { ...n(w.clientX, w.clientY), t: w.timeStamp };
        return;
      }
      if (g !== w.pointerId && y !== w.pointerId) return;
      if (w.ctrlKey || r()) {
        g === w.pointerId && e.handlePointerCancel(), g = null, y = null, C(w);
        return;
      }
      if (y === w.pointerId) return;
      const I = w.getCoalescedEvents?.() ?? [];
      for (const V of I.length ? I : [w]) {
        const q = n(V.clientX, V.clientY);
        e.handlePointerMove(q.x, q.y, V.timeStamp);
      }
    },
    up(w) {
      if (t.delete(w.pointerId), d && w.type === "pointercancel" && (d.spoiled = !0), T && T.id === w.pointerId && (T = null), y === w.pointerId && (y = null, w.type !== "pointercancel" && i.onTap()), k && k.id === w.pointerId && (w.type === "pointercancel" ? U() : b()), g === w.pointerId && (w.type === "pointercancel" ? e.handlePointerCancel() : e.handlePointerUp(), g = null), u)
        if (t.size === 0) {
          u = !1, m = null;
          const E = D();
          E && a(E);
        } else t.size >= 2 && K();
      t.size === 0 && (d = null);
    },
    destroy() {
      U(), t.clear(), d = null, T = null, y = null;
    }
  };
}
const vl = '.sk-brush-ring{position:absolute;pointer-events:none;border:2px solid rgba(var(--tt-primary-rgb),.7);border-radius:50%;background:transparent;transform:translate(-50%,-50%);z-index:9999;opacity:0;transition:opacity .15s ease,border-radius 0s}.sk-brush-ring svg{display:none;width:100%;height:100%;color:rgba(var(--tt-primary-rgb),.9)}.sk-brush-ring.sk-view-moving{border-color:transparent}.sk-brush-ring.sk-view-moving svg{display:block}.sk-brush-ring.sk-crosshair{border-color:transparent}.sk-brush-ring.sk-crosshair:before,.sk-brush-ring.sk-crosshair:after{content:"";position:absolute;background:rgba(var(--tt-primary-rgb),.9)}.sk-brush-ring.sk-crosshair:before{left:50%;top:0;bottom:0;width:1px;transform:translate(-50%)}.sk-brush-ring.sk-crosshair:after{top:50%;left:0;right:0;height:1px;transform:translateY(-50%)}.sk-rect-preview{position:absolute;pointer-events:none;display:none;border:1px dashed rgba(var(--tt-primary-rgb),.9);background:rgba(var(--tt-primary-rgb),.08);z-index:9999}', bl = '.p95-root{--p95-face: #c0c0c0;--p95-light: #dfdfdf;--p95-hilight: #ffffff;--p95-shadow: #808080;--p95-dark: #000000;--p95-text: #000000;--p95-text-disabled: #808080;--p95-title-bg: #000080;--p95-title-fg: #ffffff;--p95-select-bg: #000080;--p95-select-fg: #ffffff;--p95-workspace: #808080;--p95-desktop: #008080;--p95-full-bg: #000000;--p95-dither-ink: var(--p95-hilight);--p95-icon-ink: #000000;--p95-icon-shadow: #808080;--p95-icon-silver: #c0c0c0;--p95-icon-light: #ffffff;--p95-icon-blue: #000080;--p95-icon-cyan: #008080;--p95-icon-aqua: #00ffff;--p95-icon-yellow: #ffff00;--p95-icon-olive: #808000;--p95-icon-red: #ff0000;--p95-icon-maroon: #800000;--tt-primary-rgb: 255, 255, 255;--p95-font: "W95FA";--u: 1px;--p95-margin: calc(8 * var(--u));--p95-menu-pad: calc(3 * var(--u));--p95-menu-pad-b: calc(2 * var(--u));--p95-status-h: calc(26 * var(--u));--p95-chrome-w: calc(86 * var(--u));--p95-chrome-h: calc(136 * var(--u));--p95-art-min-h: calc(350 * var(--u));--p95-art-h: max(var(--p95-art-min-h), min( 100cqh - 2 * var(--p95-margin) - var(--p95-chrome-h), (100cqw - 2 * var(--p95-margin) - var(--p95-chrome-w)) * 3 / 4));--p95-art-w: calc(var(--p95-art-h) * 4 / 3);position:absolute;inset:0;overflow:hidden;container-type:size;background:var(--p95-full-bg);color:var(--p95-text);font-family:var(--p95-font),Tahoma,sans-serif;font-size:calc(11 * var(--u));line-height:1.2;-webkit-font-smoothing:none;user-select:none;-webkit-user-select:none;touch-action:none}.p95-root[data-p95-theme=gray]{--p95-face: #d8d8d8;--p95-light: #f2f2f2;--p95-shadow: #989898;--p95-text-disabled: #707070;--p95-title-bg: #2a2a2a;--p95-select-bg: #1a1a1a;--p95-workspace: #404040;--p95-desktop: #606060;--p95-icon-shadow: #505050;--p95-icon-silver: #a8a8a8;--p95-icon-blue: #1a1a1a;--p95-icon-cyan: #606060;--p95-icon-aqua: #d0d0d0;--p95-icon-yellow: #f2f2f2;--p95-icon-olive: #707070;--p95-icon-red: #404040;--p95-icon-maroon: #303030}.p95-root[data-p95-theme=bw]{--p95-face: #000000;--p95-light: #808080;--p95-hilight: #ffffff;--p95-shadow: #404040;--p95-dark: #ffffff;--p95-text: #ffffff;--p95-text-disabled: #606060;--p95-title-bg: #ffffff;--p95-title-fg: #000000;--p95-select-bg: #ffffff;--p95-select-fg: #000000;--p95-workspace: #000000;--p95-desktop: #808080;--p95-dither-ink: #606060;--p95-icon-ink: #ffffff;--p95-icon-shadow: #808080;--p95-icon-silver: #808080;--p95-icon-light: #000000;--p95-icon-blue: #ffffff;--p95-icon-cyan: #ffffff;--p95-icon-aqua: #808080;--p95-icon-yellow: #808080;--p95-icon-olive: #808080;--p95-icon-red: #ffffff;--p95-icon-maroon: #ffffff}:where(.p95-root) *,:where(.p95-root) *:before,:where(.p95-root) *:after{box-sizing:border-box}:where(.p95-root button){font:inherit;color:inherit;margin:0;padding:0;border:0;border-radius:0;background:none;cursor:default;-webkit-tap-highlight-color:transparent}.p95-root [hidden]{display:none}.p95-icon,.p95-glyph{display:block;width:calc(var(--w) * var(--u));height:calc(var(--h) * var(--u));flex:none;pointer-events:none}.p95-app-icon{--p95-icon-ink: #000000;--p95-icon-light: #ffffff;--p95-icon-red: #ff0000;--p95-icon-olive: #00ff00;--p95-icon-blue: #0000ff;--p95-icon-yellow: #ffff00;--p95-icon-aqua: #00ffff}.p95-raised{background:var(--p95-face);box-shadow:inset calc(-1 * var(--u)) calc(-1 * var(--u)) var(--p95-dark),inset var(--u) var(--u) var(--p95-hilight),inset calc(-2 * var(--u)) calc(-2 * var(--u)) var(--p95-shadow),inset calc(2 * var(--u)) calc(2 * var(--u)) var(--p95-light)}.p95-sunken,.p95-raised[aria-pressed=true]{box-shadow:inset calc(-1 * var(--u)) calc(-1 * var(--u)) var(--p95-hilight),inset var(--u) var(--u) var(--p95-shadow),inset calc(-2 * var(--u)) calc(-2 * var(--u)) var(--p95-light),inset calc(2 * var(--u)) calc(2 * var(--u)) color-mix(in srgb,var(--p95-dark) 35%,var(--p95-shadow))}.p95-dither,.p95-raised[aria-pressed=true]{background-color:var(--p95-face);background-image:conic-gradient(var(--p95-dither-ink) 25%,transparent 0 50%,var(--p95-dither-ink) 0 75%,transparent 0);background-size:calc(2 * var(--u)) calc(2 * var(--u))}.p95-screen{position:absolute;inset:0;display:grid;place-items:center;overflow:hidden;background:var(--p95-desktop);transition:background-color .28s}.p95-window{display:flex;flex-direction:column;width:calc(var(--p95-art-w) + var(--p95-chrome-w));padding:calc(4 * var(--u));background:var(--p95-face);box-shadow:inset calc(-1 * var(--u)) calc(-1 * var(--u)) var(--p95-dark),inset var(--u) var(--u) var(--p95-light),inset calc(-2 * var(--u)) calc(-2 * var(--u)) var(--p95-shadow),inset calc(2 * var(--u)) calc(2 * var(--u)) var(--p95-hilight)}.p95-titlebar{display:flex;align-items:center;gap:calc(5 * var(--u));height:calc(22 * var(--u));padding:0 calc(2 * var(--u)) 0 calc(4 * var(--u));background:var(--p95-title-bg);color:var(--p95-title-fg);flex:none}.p95-title-text{flex:1;translate:0 var(--u);min-width:0;overflow:hidden;white-space:nowrap}.p95-title-btns{display:flex;align-items:center}.p95-title-btn{display:flex;align-items:center;justify-content:center;width:calc(18 * var(--u));height:calc(16 * var(--u));color:var(--p95-text)}.p95-title-btn.p95-gap{margin-left:calc(2 * var(--u))}.p95-title-btn:active:not([disabled]){padding:var(--u) 0 0 var(--u)}.p95-title-btn[disabled]{--p95-icon-ink: var(--p95-text-disabled)}.p95-menubar{position:relative;z-index:20;display:flex;align-items:stretch;height:calc(18 * var(--u) + var(--p95-menu-pad) + var(--p95-menu-pad-b));padding:var(--p95-menu-pad) 0 var(--p95-menu-pad-b);flex:none}.p95-menu{position:relative;display:flex}.p95-menu-item{display:flex;align-items:center;gap:calc(2 * var(--u));padding:0 calc(6 * var(--u));white-space:nowrap}.p95-menubar>.p95-menu-item>.p95-label:first-letter,.p95-menubar>.p95-menu>.p95-menu-item>.p95-label:first-letter{text-decoration:underline}.p95-menu-item.p95-primary{font-weight:700}.p95-menubar .p95-menu-item[data-shell=export-menu]{min-width:var(--p95-export-w, auto)}.p95-menubar .p95-menu-item[data-shell=export-menu][data-recording]{gap:var(--u);padding:0 calc(2 * var(--u))}.p95-rec-count{margin-left:auto}.p95-rec-count[data-pulse]{animation:p95-rec-pulse 1s steps(1) infinite}@keyframes p95-rec-pulse{50%{visibility:hidden}}.p95-menu-item:focus-visible,.p95-menu-item[aria-expanded=true]{background:var(--p95-select-bg);color:var(--p95-select-fg);--p95-icon-ink: var(--p95-select-fg);outline:none}@media(hover:hover){.p95-menu-item:hover:not([aria-disabled=true]){background:var(--p95-select-bg);color:var(--p95-select-fg);--p95-icon-ink: var(--p95-select-fg)}}.p95-menu-item[aria-disabled=true]{color:var(--p95-text-disabled);text-shadow:var(--u) var(--u) 0 var(--p95-hilight);--p95-icon-ink: var(--p95-text-disabled)}.p95-dropdown{position:absolute;top:calc(100% + var(--p95-menu-pad-b) - var(--u));left:0;display:flex;flex-direction:column;min-width:calc(150 * var(--u));padding:calc(3 * var(--u))}.p95-dropdown .p95-menu-item{height:calc(18 * var(--u));padding:0 calc(8 * var(--u)) 0 0}.p95-dropdown .p95-check{display:flex;align-items:center;justify-content:center;width:calc(18 * var(--u));visibility:hidden}.p95-dropdown [aria-checked=true] .p95-check{visibility:visible}.p95-dropdown .p95-label{flex:1;text-align:left}.p95-dropdown .p95-shortcut{padding-left:calc(16 * var(--u))}.p95-no-checks .p95-check{display:none}.p95-dropdown.p95-no-checks .p95-menu-item{padding-left:calc(8 * var(--u))}.p95-separator,.p95-body:before,.p95-body:after,.p95-statusbar:before{height:calc(2 * var(--u));margin:calc(3 * var(--u)) var(--u);border-style:solid;border-color:var(--p95-shadow) var(--p95-hilight) var(--p95-hilight) var(--p95-shadow);border-width:var(--u) 0}.p95-separator-v{width:calc(2 * var(--u));border-width:0 var(--u)}.p95-body{position:relative;display:flex;gap:calc(2 * var(--u));flex:none}.p95-body:before,.p95-body:after,.p95-statusbar:before{content:"";position:absolute;left:0;margin:0}.p95-body:before,.p95-body:after{width:calc(55 * var(--u))}.p95-body:before{top:0}.p95-body:after{bottom:0}.p95-toolbox{display:flex;flex-direction:column;align-items:center;gap:calc(6 * var(--u));width:calc(56 * var(--u));padding:calc(5 * var(--u)) calc(3 * var(--u)) calc(2 * var(--u));flex:none}.p95-tools{display:grid;grid-template-columns:repeat(2,calc(25 * var(--u)))}.p95-tools>.p95-tool{height:calc(25 * var(--u))}.p95-tools-divider{grid-column:1 / -1;margin:calc(3 * var(--u)) 0}.p95-tool{display:flex;align-items:center;justify-content:center}.p95-tool:active:not([aria-disabled=true])>*,.p95-tool[aria-pressed=true]>*{translate:var(--u) var(--u)}.p95-tool,.p95-scroll-btn,.p95-title-btn,.p95-btn{position:relative;--p95-dots: calc(2 * var(--u))}.p95-tool{--p95-dots: calc(3 * var(--u))}.p95-btn{--p95-dots: calc(4 * var(--u))}.p95-tool:after,.p95-scroll-btn:after,.p95-title-btn:after,.p95-btn:after{position:absolute;inset:var(--p95-dots);border:var(--u) dotted var(--p95-text);pointer-events:none}@media(hover:hover){.p95-tool:hover:not([aria-disabled=true]):after,.p95-scroll:not(.p95-inactive) .p95-scroll-btn:hover:after,.p95-corner .p95-scroll-btn:hover:after,.p95-title-btn:hover:not([disabled]):after,.p95-btn:hover:after{content:""}}.p95-swatch[aria-disabled=true]{opacity:.35}.p95-tool[aria-disabled=true]>*{--p95-icon-ink: var(--p95-text-disabled);--p95-icon-shadow: var(--p95-text-disabled);--p95-icon-blue: var(--p95-text-disabled);--p95-icon-cyan: var(--p95-text-disabled);--p95-icon-olive: var(--p95-text-disabled);--p95-icon-red: var(--p95-text-disabled);--p95-icon-maroon: var(--p95-text-disabled);--p95-icon-light: transparent;--p95-icon-silver: transparent;--p95-icon-aqua: transparent;--p95-icon-yellow: transparent;filter:drop-shadow(var(--u) var(--u) 0 var(--p95-hilight))}.p95-size{display:flex;flex-direction:column;align-items:center;justify-content:space-between;width:calc(42 * var(--u));height:calc(66 * var(--u));padding:calc(6 * var(--u)) 0;background:var(--p95-face);flex:none;cursor:ns-resize;touch-action:none}.p95-size[aria-disabled=true]{cursor:default}.p95-size[aria-disabled=true]>*{opacity:.35}.p95-size-preview{display:block;width:calc((2 + var(--p95-size-f, 0) * 18) * var(--u));height:calc((2 + var(--p95-size-f, 0) * 18) * var(--u));background:var(--p95-icon-ink)}.p95-size[data-shape=circle] .p95-size-preview{border-radius:50%}.p95-toolbox-head{display:flex;flex:none}.p95-toolbox-divider{width:calc(50 * var(--u));margin:calc(-3 * var(--u)) 0;flex:none}.p95-toolbox-head>.p95-tool{width:calc(25 * var(--u));height:calc(25 * var(--u));flex:none}.p95-frame{display:grid;grid-template-columns:var(--p95-art-w) calc(16 * var(--u));grid-template-rows:var(--p95-art-h) calc(16 * var(--u));padding:calc(2 * var(--u));flex:none}.p95-workspace{position:relative;width:var(--p95-art-w);height:var(--p95-art-h);overflow:hidden;background:var(--p95-workspace)}.p95-workspace>canvas{position:absolute;inset:0;display:block;width:100%;height:100%;touch-action:none}.p95-workspace.p95-zooming{overflow:visible;z-index:10}.p95-workspace.p95-zooming>canvas{transform-origin:0 0}.p95-corner{display:flex;background:var(--p95-face)}.p95-corner .p95-scroll-btn:active>*{translate:var(--u) var(--u)}.p95-scroll{display:flex}.p95-vscroll{flex-direction:column}.p95-scroll-btn{display:flex;align-items:center;justify-content:center;width:calc(16 * var(--u));height:calc(16 * var(--u));flex:none}.p95-scroll.p95-inactive .p95-scroll-btn{--p95-icon-ink: var(--p95-text-disabled)}.p95-track{position:relative;flex:1}.p95-thumb{--p95-thumb-len: max(calc(8 * var(--u)), calc(var(--p95-thumb-size, 1) * 100%));position:absolute}.p95-vscroll .p95-thumb{left:0;right:0;height:var(--p95-thumb-len);top:calc(var(--p95-thumb-pos, 0) * (100% - var(--p95-thumb-len)))}.p95-hscroll .p95-thumb{top:0;bottom:0;width:var(--p95-thumb-len);left:calc(var(--p95-thumb-pos, 0) * (100% - var(--p95-thumb-len)))}.p95-scroll.p95-inactive .p95-thumb{display:none}.p95-colorbox{display:flex;align-items:center;gap:var(--u);height:calc(37 * var(--u));padding:calc(5 * var(--u)) calc(2 * var(--u)) calc(2 * var(--u));flex:none}.p95-current{position:relative;width:calc(30 * var(--u));height:calc(30 * var(--u));margin:0 calc(14 * var(--u)) 0 calc(11 * var(--u));padding:calc(2 * var(--u));flex:none}.p95-current-fill{display:block;width:100%;height:100%;background:var(--p95-workspace)}.p95-current-tools{position:absolute;inset:calc(2 * var(--u));display:flex;align-items:center;justify-content:center;gap:var(--u)}.p95-current-slot{display:flex;translate:0 var(--u)}.p95-current-tools[data-count="2"] .p95-current-slot{position:absolute;width:calc(16 * var(--u));height:calc(16 * var(--u));align-items:center;justify-content:center}.p95-current-tools[data-count="2"] .p95-current-slot:first-child{top:0;left:calc(50% - 13 * var(--u))}.p95-current-tools[data-count="2"] .p95-current-slot:last-child{right:calc(50% - 13 * var(--u));bottom:0}.p95-swatch-sample,.p95-current-sample{display:block;width:100%;height:100%}.p95-swatch{position:relative;width:calc(30 * var(--u));height:calc(30 * var(--u));padding:calc(2 * var(--u))}.p95-swatch-fill{display:block;width:100%;height:100%;background:var(--p95-workspace)}.p95-swatch[aria-pressed=true]:after{content:"";position:absolute;inset:calc(2 * var(--u));outline:var(--u) dotted var(--p95-hilight);outline-offset:calc(-2 * var(--u));box-shadow:inset 0 0 0 var(--u) var(--p95-dark)}.p95-statusbar{position:relative;display:flex;gap:calc(2 * var(--u));height:var(--p95-status-h);padding-top:calc(4 * var(--u));flex:none}.p95-statusbar:before{top:0;width:100%}.p95-pane{display:flex;align-items:center;gap:calc(4 * var(--u));padding:calc(4 * var(--u)) calc(4 * var(--u)) 0;white-space:nowrap;overflow:hidden}.p95-pane-help{flex:1;min-width:0;margin-left:calc(3 * var(--u))}.p95-pane-glitch{flex:none;width:calc(216 * var(--u));white-space:pre}.p95-pane-coords{flex:none;width:calc(104 * var(--u))}.p95-pane-coords>.p95-glyph{margin-top:calc(-4 * var(--u))}.p95-grip{display:flex;align-self:flex-end;margin:0 var(--u) var(--u) 0;flex:none;touch-action:none}.p95-dialog-overlay{position:absolute;inset:0;z-index:40;display:flex;align-items:center;justify-content:center}.p95-dialog{display:flex;flex-direction:column;min-width:calc(280 * var(--u));max-width:calc(100% - 16 * var(--u));max-height:calc(100% - 16 * var(--u));padding:calc(3 * var(--u))}.p95-dialog-body{padding:calc(10 * var(--u)) calc(12 * var(--u));overflow:auto;touch-action:pan-y}.p95-dialog-body table{border-collapse:collapse}.p95-dialog-body td{padding:var(--u) calc(8 * var(--u)) var(--u) 0;vertical-align:top}.p95-help-heading th{padding:calc(8 * var(--u)) 0 calc(2 * var(--u));text-align:left;text-decoration:underline}.p95-help-heading:first-child th{padding-top:0}.p95-dialog-body td:first-child{font-weight:700;white-space:nowrap}.p95-dialog.p95-props{width:calc(328 * var(--u))}.p95-props table{width:100%;table-layout:fixed}.p95-props td{overflow-wrap:anywhere}.p95-props td:first-child{width:45%;white-space:normal}.p95-dialog-actions{display:flex;justify-content:flex-end;gap:calc(6 * var(--u));padding:0 calc(10 * var(--u)) calc(10 * var(--u))}.p95-dialog.p95-mint,.p95-dialog.p95-new-seed{width:calc(300 * var(--u))}.p95-mint .p95-dialog-body{display:flex;flex-direction:column;align-items:center;gap:calc(8 * var(--u))}.p95-new-seed-text{margin:0}.p95-mint-text,.p95-mint-url{margin:0;text-align:center;overflow-wrap:anywhere}.p95-mint-url{user-select:text;-webkit-user-select:text}.p95-mint-qr svg{display:block;width:calc(200 * var(--u));height:calc(200 * var(--u))}.p95-progress{box-sizing:border-box;width:100%;height:calc(20 * var(--u));padding:calc(3 * var(--u));background:var(--p95-face)}.p95-progress-fill{width:0;height:100%;background:repeating-linear-gradient(90deg,var(--p95-select-bg) 0 calc(8 * var(--u)),transparent calc(8 * var(--u)) calc(10 * var(--u)));animation:p95-progress 2.4s steps(24,end) infinite}@keyframes p95-progress{to{width:100%}}@media(prefers-reduced-motion:reduce){.p95-progress-fill{width:50%;animation:none}}.p95-btn{min-width:calc(75 * var(--u));height:calc(23 * var(--u));padding:0 calc(8 * var(--u))}.p95-btn:focus-visible{outline:none}.p95-btn:focus-visible:after{content:""}@media(hover:none){.p95-menu-item:active:not([aria-disabled=true]){background:var(--p95-select-bg);color:var(--p95-select-fg);--p95-icon-ink: var(--p95-select-fg)}.p95-swatch:active:not([aria-disabled=true]),.p95-current:active{filter:brightness(.85)}}.p95-root[data-p95-layout=compact]{--p95-menu-pad: var(--u);--p95-menu-pad-b: var(--u);--p95-status-h: calc(22 * var(--u));--p95-chrome-h: calc(146 * var(--u));--p95-art-min-h: max(calc(167 * var(--u)), calc((25 * (var(--p95-strip-tool-cols) + var(--p95-strip-paint-cols)) - 24) * 3 / 4 * var(--u)))}.p95-root[data-p95-layout=compact] .p95-menubar>.p95-menu-item,.p95-root[data-p95-layout=compact] .p95-menubar>.p95-menu>.p95-menu-item{padding:0 calc(2 * var(--u))}.p95-root[data-p95-layout=compact] .p95-menubar>.p95-menu>.p95-menu-item[data-shell=export-menu][data-recording]{padding:0}.p95-root[data-p95-layout=compact] .p95-tools-divider{display:none}.p95-root[data-p95-layout=compact] .p95-colorbox{align-items:start;gap:0;height:calc(54 * var(--u));padding:calc(3 * var(--u)) calc(2 * var(--u)) var(--u)}.p95-strip-tools{display:grid;grid-template-columns:repeat(var(--p95-strip-tool-cols),calc(25 * var(--u)));grid-auto-rows:calc(25 * var(--u));flex:none}.p95-strip-divider{height:calc(50 * var(--u));margin:0 calc(3 * var(--u));flex:none}.p95-strip-paints{display:grid;grid-template-columns:auto repeat(var(--p95-strip-paint-cols),calc(25 * var(--u)));grid-template-rows:repeat(2,calc(25 * var(--u)));flex:none}.p95-strip-paints>.p95-current{grid-row:1 / span 2;grid-column:1;width:calc(38 * var(--u));height:auto;margin:0 calc(4 * var(--u)) 0 0}.p95-strip-paints .p95-current-sample{object-fit:cover}.p95-strip-paints>.p95-swatch{width:calc(25 * var(--u));height:calc(25 * var(--u))}.p95-root[data-p95-layout=compact] .p95-pane-glitch{display:none}.p95-root[data-p95-view=full]{--p95-art-w: min(100cqw, 100cqh * 4 / 3);--p95-art-h: min(100cqh, 100cqw * 3 / 4)}.p95-root[data-p95-view=full] .p95-screen{background:var(--p95-full-bg)}.p95-root[data-p95-view=full] .p95-window{width:auto;padding:0;box-shadow:none;background:transparent}.p95-root[data-p95-view=full] .p95-titlebar,.p95-root[data-p95-view=full] .p95-menubar,.p95-root[data-p95-view=full] .p95-toolbox,.p95-root[data-p95-view=full] .p95-body:before,.p95-root[data-p95-view=full] .p95-body:after,.p95-root[data-p95-view=full] .p95-colorbox,.p95-root[data-p95-view=full] .p95-statusbar,.p95-root[data-p95-view=full] .p95-scroll,.p95-root[data-p95-view=full] .p95-corner{display:none}.p95-root[data-p95-view=full] .p95-frame{display:block;padding:0;box-shadow:none}.p95-root[data-p95-view=full] .p95-workspace{background:var(--p95-full-bg)}.p95-root[data-p95-view=full] .sk-brush-ring,.p95-root[data-p95-view=full] .sk-rect-preview,.p95-root:has(.p95-dialog-overlay:not([hidden])) .sk-brush-ring,.p95-root:has(.p95-dialog-overlay:not([hidden])) .sk-rect-preview{visibility:hidden}.p95-root[data-p95-frame=host] .p95-window{position:absolute;inset:0;width:auto;padding:0;box-shadow:none}.p95-root[data-p95-frame=host][data-p95-view=window] .p95-body{flex:1}.p95-root[data-p95-frame=host][data-p95-view=window] .p95-frame{grid-template-columns:minmax(calc(var(--p95-art-min-h) * 4 / 3),1fr) calc(16 * var(--u));grid-template-rows:minmax(var(--p95-art-min-h),1fr) calc(16 * var(--u));flex:1}.p95-root[data-p95-frame=host][data-p95-view=window] .p95-workspace{width:auto;height:auto;container-type:size}.p95-root[data-p95-frame=host][data-p95-view=window] .p95-workspace>canvas{width:min(100cqw,100cqh * 4 / 3);height:min(100cqh,100cqw * 3 / 4);margin:auto}.p95-root[data-p95-frame=host] .p95-grip{visibility:hidden}.p95-root[data-p95-frame=host][data-p95-view=full] .p95-window{display:grid;place-items:center}', xr = {
  shuffle: "shuffle",
  trickle: "trickle",
  flow: "flow",
  eraseMovement: "erase",
  freezeBrush: "freeze",
  drawSpace: "empty",
  drawBright: "bright",
  drawGem: "gem",
  drawStatic: "static",
  drawSolid1: "solid1",
  drawSolid2: "solid2",
  drawSolid3: "solid3",
  drawSolidCycle: "solidCycle",
  drawLive: "live"
};
function Zo(e) {
  return Object.hasOwn(xr, e) ? xr[e] : void 0;
}
const Nt = {
  circle: { name: "Round Brush", help: "Round brush, hard edges.", spec: { kind: "shape", shape: "circle", flag: !1 } },
  circleFuzzy: { name: "Fuzzy Round Brush", help: "Round brush, fuzzy edges.", spec: { kind: "shape", shape: "circle", flag: !0 } },
  square: { name: "Square Brush", help: "Square brush, hard edges.", spec: { kind: "shape", shape: "square", flag: !1 } },
  squareFuzzy: { name: "Fuzzy Square Brush", help: "Square brush, fuzzy edges.", spec: { kind: "shape", shape: "square", flag: !0 } },
  rect: { name: "Fill Box", help: "Drag a box, release to fill it.", spec: { kind: "shape", shape: "rect", flag: !1 } },
  oval: { name: "Fill Ellipse", help: "Drag a box, release to fill an ellipse.", spec: { kind: "shape", shape: "rect", flag: !0 } },
  live: { name: "Live Stamp", help: "Pick an area, then stamp copies of it. Pick again to change it.", spec: { kind: "mode", action: "drawLive" } },
  flow: { name: "Flow", help: "Pixels follow your drag.", spec: { kind: "mode", action: "flow" } },
  shuffle: { name: "Shuffle", help: "Pixels shuffle horizontally.", spec: { kind: "mode", action: "shuffle" } },
  trickle: { name: "Trickle", help: "Pixels trickle vertically.", spec: { kind: "mode", action: "trickle" } },
  erase: { name: "Erase Movement", help: "Stops movement where you paint.", spec: { kind: "mode", action: "eraseMovement" } },
  freeze: { name: "Freeze", help: "Freezes pixels where you paint.", spec: { kind: "mode", action: "freezeBrush" } },
  waterfallUp: { name: "Waterfall Up", help: "Pixels stream up at mixed speeds.", spec: { kind: "direction", direction: "up", waterfall: !0 } },
  straightUp: { name: "Straight Up", help: "Pixels move straight up.", spec: { kind: "direction", direction: "up", waterfall: !1 } },
  waterfallDown: { name: "Waterfall Down", help: "Pixels stream down at mixed speeds.", spec: { kind: "direction", direction: "down", waterfall: !0 } },
  straightDown: { name: "Straight Down", help: "Pixels move straight down.", spec: { kind: "direction", direction: "down", waterfall: !1 } },
  moveLeft: { name: "Waterfall Left", help: "Pixels stream left at mixed speeds.", spec: { kind: "direction", direction: "left", waterfall: !0 } },
  straightLeft: { name: "Straight Left", help: "Pixels move straight left.", spec: { kind: "direction", direction: "left", waterfall: !1 } },
  moveRight: { name: "Waterfall Right", help: "Pixels stream right at mixed speeds.", spec: { kind: "direction", direction: "right", waterfall: !0 } },
  straightRight: { name: "Straight Right", help: "Pixels move straight right.", spec: { kind: "direction", direction: "right", waterfall: !1 } },
  pause: { name: "Pause", help: "Pauses movement and static.", spec: { kind: "pause" } }
}, ho = {
  empty: { name: "Background Space", help: "Dark background color.", action: "drawSpace" },
  bright: { name: "Bright Space", help: "Light background color.", action: "drawBright" },
  gem: { name: "Gem", help: 'The "gem" pattern.', action: "drawGem" },
  static: { name: "Static", help: "Static, the canvas starting state.", action: "drawStatic" },
  solid1: { name: "Solid 1", help: "Flat color 1.", action: "drawSolid1" },
  solid2: { name: "Solid 2", help: "Flat color 2.", action: "drawSolid2" },
  solid3: { name: "Solid 3", help: "Flat color 3.", action: "drawSolid3" },
  solidCycle: { name: "Color Cycle", help: "Moves through the full palette.", action: "drawSolidCycle" }
}, bo = Object.keys(Nt), Vo = Object.fromEntries(
  bo.map((e) => [e, { id: e, name: Nt[e].name, help: Nt[e].help }])
), fo = Object.keys(ho), Wo = Object.fromEntries(
  fo.map((e) => [e, { id: e, name: ho[e].name, help: ho[e].help }])
), Fo = [
  "circle",
  "circleFuzzy",
  "square",
  "squareFuzzy",
  "rect",
  "oval",
  "live",
  "flow",
  "shuffle",
  "trickle",
  "waterfallUp",
  "straightUp",
  "waterfallDown",
  "straightDown",
  "moveLeft",
  "straightLeft",
  "moveRight",
  "straightRight",
  "freeze",
  "erase"
];
function jo(e) {
  return Nt[e].spec;
}
function wl(e) {
  return ho[e].action;
}
function sa(e) {
  return e === "up" || e === "down" ? "waterfall" : "move";
}
function _l(e, n) {
  const r = bo.find((i) => {
    const a = Nt[i].spec;
    return a.kind === "direction" && a.direction === e && a.waterfall === n;
  });
  if (!r) throw new Error(`[sketch-engine] no directional tool for ${e}`);
  return r;
}
function ca(e) {
  const n = Nt[e].spec;
  if (n.kind === "direction")
    return { mode: sa(n.direction), direction: n.direction, waterfallVariant: n.waterfall };
  if (n.kind !== "mode") return null;
  const r = Zo(n.action);
  return r === "shuffle" || r === "trickle" ? { mode: r } : null;
}
function Qo(e) {
  const n = e.getDrawMode();
  if (!$o(n)) return [];
  const r = n === "shuffle" || n === "trickle" ? { mode: n } : { mode: n, direction: e.getDirection(), waterfallVariant: e.getWaterfallVariant() }, i = e.getPairedMovement();
  return i ? [r, i] : [r];
}
function yl(e, n) {
  return e.length === 2 && e.some((r) => qr(r, n)) ? null : e.find((r) => Tt(r.mode) !== Tt(n.mode)) ?? null;
}
function Jo(e, n) {
  const r = Nt[n].spec;
  switch (r.kind) {
    case "pause":
      return e.getFreezeLevel() > 0;
    case "shape":
      return e.getBrushShape() !== r.shape ? !1 : r.flag === (r.shape === "rect" ? e.getRectOval() : e.getFuzzyEdges());
    case "mode":
    case "direction": {
      const i = ca(n);
      return i ? Qo(e).some((a) => qr(a, i)) : r.kind === "mode" && e.getDrawMode() === Zo(r.action);
    }
  }
}
const xl = bo.filter((e) => {
  const n = Nt[e].spec.kind;
  return n === "mode" || n === "direction";
});
function El(e) {
  return xl.filter((n) => Jo(e, n));
}
function Er(e, n) {
  return e.getDrawMode() === n;
}
const Tl = {
  waterfallUp: ["waterfall", "up"],
  waterfallDown: ["waterfall", "down"],
  moveLeft: ["move", "left"],
  moveRight: ["move", "right"]
};
function He(e, n, r = {}) {
  const i = Zo(n);
  if (i) {
    e.setDrawMode(i);
    return;
  }
  const a = e.getDrawingManager();
  switch (n) {
    // Brush size
    case "increaseBrushSize":
      a.increaseBrushSize();
      break;
    case "decreaseBrushSize":
      a.decreaseBrushSize();
      break;
    // The edge flag comes from the picked tool (clean or fuzzy); the engine
    // follows it, falling back to the startup default.
    case "shapeCircle":
      e.setBrushShape("circle"), e.setFuzzyEdges(r.fuzzyEdges ?? Oo);
      break;
    case "shapeSquare":
      e.setBrushShape("square"), e.setFuzzyEdges(r.fuzzyEdges ?? Oo);
      break;
    // Rect fill or oval, from the picked tool.
    case "shapeRect":
      e.setBrushShape("rect"), e.setRectOval(r.rectOval ?? Yr);
      break;
    // Movement modes
    case "waterfallUp":
    case "waterfallDown":
    case "moveLeft":
    case "moveRight": {
      const [t, u] = Tl[n];
      e.setDrawMode(t), e.setDirection(u), e.setWaterfallVariant(r.waterfallVariant ?? !0);
      break;
    }
    // Pause button and Space: toggle between playing (0) and level 2.
    case "toggleGlobalFreeze":
      e.setFreezeLevel(e.getFreezeLevel() === 0 ? 2 : 0);
      break;
    // Pause levels: 0 playing, 1 partial, 2 +static, 3 total. The UI reaches
    // only 0 and 2 (above); 1 and 3 stay for later features.
    case "freezeLevel0":
      e.setFreezeLevel(0);
      break;
    case "freezeLevel1":
      e.setFreezeLevel(1);
      break;
    case "freezeLevel2":
      e.setFreezeLevel(2);
      break;
    case "freezeLevel3":
      e.setFreezeLevel(3);
      break;
    // Global
    case "newSeed":
      e.setFreezeLevel(0), e.setSeed(Vr());
      break;
    // Keyboard-only actions
    case "saveScreenshot":
      e.captureScreenshot();
      break;
    // EXPERIMENTAL view zoom — anchored at the canvas center.
    case "viewZoomIn":
      e.zoomView(2);
      break;
    case "viewZoomOut":
      e.zoomView(0.5);
      break;
    case "viewZoomReset":
      e.resetView();
      break;
    case "recordVideo":
      e.isRecording() ? e.stopRecording() : e.startRecording();
      break;
  }
}
const Po = {
  sizeUp: ["Larger Brush", "Larger brush."],
  sizeDown: ["Smaller Brush", "Smaller brush."],
  zoomIn: ["Zoom In", "Zooms in."],
  zoomOut: ["Zoom Out", "Zooms out."],
  zoomReset: ["Actual Size", "Zooms to 100%."],
  screenshot: ["Screenshot", "Saves a still image."],
  record: ["Record", "Starts or stops a video loop."],
  newSeed: ["New Seed", "Starts a new piece from a fresh seed."],
  newSeedPrompt: ["New Seed", "Asks, then starts a new piece from a fresh seed."],
  warp: ["Warp", "Warp on / off."],
  bloom: ["Glow", "Glow on / off."],
  escape: ["Show Controls", "Shows the controls, or closes a dialog."],
  help: ["Help", "Lists shortcuts and gestures."],
  properties: ["Properties", "Shows the piece's name and traits."],
  undo: ["Undo", "Undoes the last stroke."],
  redo: ["Redo", "Redoes the last undone stroke."]
}, Ot = Object.fromEntries(
  Object.keys(Po).map((e) => [e, { id: e, name: Po[e][0], help: Po[e][1] }])
), Sl = { circle: "shapeCircle", square: "shapeSquare", rect: "shapeRect" }, Rl = { up: "waterfallUp", down: "waterfallDown", left: "moveLeft", right: "moveRight" }, Ml = /* @__PURE__ */ new Set(["sizeUp", "sizeDown", "undo", "redo"]);
function ua(e, n) {
  if (e.getFreezeLevel() === 0) return !1;
  switch (n.type) {
    case "tool":
      return n.id !== "pause";
    case "paint":
    case "direction":
      return !0;
    case "command":
      return Ml.has(n.id);
  }
}
function Tr(e, n) {
  const r = jo(n), i = ca(n), a = i && yl(Qo(e), i);
  switch (r.kind) {
    case "pause":
      return He(e, "toggleGlobalFreeze"), {};
    case "shape":
      He(e, Sl[r.shape], r.shape === "rect" ? { rectOval: r.flag } : { fuzzyEdges: r.flag });
      break;
    case "mode":
      He(e, r.action);
      break;
    case "direction":
      He(e, Rl[r.direction], { waterfallVariant: r.waterfall });
      break;
  }
  return a && e.setPairedMovement(a), { panMode: !1 };
}
function Cl(e, n) {
  const r = Tt(sa(n));
  for (const i of Qo(e))
    if ("direction" in i && Tt(i.mode) === r) return i.waterfallVariant;
  return e.getWaterfallVariant();
}
function Al(e, n, r) {
  switch (n) {
    case "sizeUp":
      return He(e, "increaseBrushSize"), {};
    case "sizeDown":
      return He(e, "decreaseBrushSize"), {};
    case "zoomIn":
      return He(e, "viewZoomIn"), {};
    case "zoomOut":
      return He(e, "viewZoomOut"), {};
    case "zoomReset":
      return He(e, "viewZoomReset"), {};
    case "screenshot":
      return He(e, "saveScreenshot"), {};
    case "record":
      return He(e, "recordVideo"), {};
    case "newSeed":
      return He(e, "newSeed"), {};
    case "newSeedPrompt":
      return { openDialog: "newSeed" };
    case "warp":
      return e.setWarpFx(!e.getWarpFx()), {};
    case "bloom":
      return e.setBloomEnabled(!e.getBloomEnabled()), {};
    case "escape":
      return r.openDialog ? { openDialog: null } : r.fullView ? { fullView: !1 } : {};
    case "help":
      return { openDialog: "help" };
    case "properties":
      return { openDialog: "properties" };
    case "undo":
      return e.undo(), {};
    case "redo":
      return e.redo(), {};
  }
}
function Ll(e, n, r) {
  if (ua(e, n)) return {};
  switch (n.type) {
    case "tool":
      return Tr(e, n.id);
    case "paint":
      return He(e, wl(n.id)), { panMode: !1 };
    case "direction":
      return Tr(e, _l(n.direction, Cl(e, n.direction)));
    case "command":
      return Al(e, n.id, r);
  }
}
function Do(e, n) {
  if (ua(e, n)) return !1;
  if (n.type !== "command") return !0;
  switch (n.id) {
    case "zoomOut":
    case "zoomReset":
      return e.getViewZoom() > 1;
    case "undo":
      return e.canUndo();
    case "redo":
      return e.canRedo();
    default:
      return !0;
  }
}
function Sr(e) {
  return Kr(e.getFreezeLevel() > 0, e.getDrawMode(), e.getBrushShape(), e.getLiveSource());
}
const Oe = (e) => ({ type: "tool", id: e }), It = (e) => ({ type: "paint", id: e }), Bt = (e) => ({ type: "command", id: e }), er = [
  // Brushes: the bottom row, in toolbox order.
  { key: "z", label: "Z", action: Oe("circle") },
  { key: "x", label: "X", action: Oe("circleFuzzy") },
  { key: "c", label: "C", action: Oe("square") },
  { key: "v", label: "V", action: Oe("squareFuzzy") },
  { key: "b", label: "B", action: Oe("rect") },
  { key: "n", label: "N", action: Oe("oval") },
  { key: "[", label: "[", action: Bt("sizeDown"), repeat: !0 },
  { key: "]", label: "]", action: Bt("sizeUp"), repeat: !0 },
  // Movement: the home row, in toolbox order. Arrows keep the current
  // waterfall / straight variant.
  { key: " ", label: "Space", action: Oe("pause"), preventDefault: !0 },
  { key: "a", label: "A", action: Oe("live") },
  { key: "s", label: "S", action: Oe("flow") },
  { key: "d", label: "D", action: Oe("shuffle") },
  { key: "f", label: "F", action: Oe("trickle") },
  { key: "arrowup", label: "Up", action: { type: "direction", direction: "up" }, preventDefault: !0 },
  { key: "arrowdown", label: "Down", action: { type: "direction", direction: "down" }, preventDefault: !0 },
  { key: "arrowleft", label: "Left", action: { type: "direction", direction: "left" }, preventDefault: !0 },
  { key: "arrowright", label: "Right", action: { type: "direction", direction: "right" }, preventDefault: !0 },
  { key: "g", label: "G", action: Oe("freeze") },
  { key: "h", label: "H", action: Oe("erase") },
  // Paints: in color-box order, the first four on the number row and the
  // last four on the top row.
  { key: "1", label: "1", action: It("empty") },
  { key: "2", label: "2", action: It("bright") },
  { key: "3", label: "3", action: It("gem") },
  { key: "4", label: "4", action: It("static") },
  { key: "q", label: "Q", action: It("solid1") },
  { key: "w", label: "W", action: It("solid2") },
  { key: "e", label: "E", action: It("solid3") },
  { key: "r", label: "R", action: It("solidCycle") },
  // System: mnemonics. Glow, warp, record and screenshot are menu-only.
  { key: "=", label: "+", action: Bt("zoomIn"), repeat: !0 },
  { key: "+", label: "+", action: Bt("zoomIn"), repeat: !0 },
  { key: "-", label: "-", action: Bt("zoomOut"), repeat: !0 },
  { key: "0", label: "0", action: Bt("zoomReset"), repeat: !0 },
  { key: "escape", label: "Esc", action: Bt("escape") },
  { key: "m", label: "M", action: Bt("newSeed"), adminOnly: !0 }
], Fl = ["\\", "k", "i"];
function Pl(e, n) {
  return e.type === n.type && "id" in e && e.id === n.id;
}
function Dl(e, n) {
  if (e.metaKey || e.ctrlKey || e.altKey) return null;
  const r = e.key.toLowerCase(), i = er.find((a) => a.key === r);
  return !i || n.dialogOpen && !(i.action.type === "command" && i.action.id === "escape") || e.repeat && !i.repeat || i.adminOnly && !n.isAdmin ? null : i;
}
function Il(e) {
  switch (e.type) {
    case "tool":
      return Vo[e.id].name;
    case "paint":
      return Wo[e.id].name;
    case "command":
      return Ot[e.id].name;
  }
}
function fa(e) {
  return er.find((n) => Pl(n.action, e))?.label ?? "";
}
function Vn(e) {
  const n = fa(e), r = Il(e);
  return n ? `${r} (${n})` : r;
}
function ko(e, n) {
  return `${n ? "Cmd" : "Ctrl"}+${e === "redo" ? "Shift+" : ""}Z`;
}
function Ne({ keys: e, text: n, label: r }) {
  const i = e.map((a) => {
    const t = er.find((u) => u.key === a);
    if (!t) throw new Error(`[sketch-engine] help names unbound key ${JSON.stringify(a)}`);
    return t;
  });
  return {
    keys: e,
    label: r ?? [...new Set(i.map((a) => a.label))].join(", "),
    text: n,
    adminOnly: i.every((a) => a.adminOnly === !0)
  };
}
const co = (e, n) => ({ keys: [], label: e, text: n, adminOnly: !1 });
function xn(e, n) {
  return { title: e, rows: n, adminOnly: n.every((r) => r.adminOnly) };
}
function Bl(e) {
  return [
    xn("Brushes", [
      Ne({ keys: ["z", "x"], text: "Round, fuzzy round" }),
      Ne({ keys: ["c", "v"], text: "Square, fuzzy square" }),
      Ne({ keys: ["b", "n"], text: "Fill box, fill ellipse" }),
      Ne({ keys: ["[", "]"], text: "Smaller, larger (or scroll)" })
    ]),
    xn("Movement", [
      Ne({ keys: [" "], text: "Pause / play" }),
      Ne({ keys: ["a", "s", "d", "f"], text: "Live stamp, flow, shuffle, trickle" }),
      Ne({ keys: ["arrowup", "arrowdown", "arrowleft", "arrowright"], label: "Arrows", text: "Up, down, left, right" }),
      Ne({ keys: ["g", "h"], text: "Freeze, erase movement" })
    ]),
    xn("Paints", [
      Ne({ keys: ["1", "2", "3", "4"], text: "Dark background, light background, gem, static" }),
      Ne({ keys: ["q", "w", "e", "r"], text: "Solid 1-3, color cycle" })
    ]),
    xn("Edit", [
      co(ko("undo", e), "Undo (two-finger tap)"),
      co(ko("redo", e), "Redo (three-finger tap)")
    ]),
    xn("View", [
      Ne({ keys: ["=", "+", "-", "0"], text: "Zoom in, out, actual size" }),
      co("Ctrl+drag", "Pan (two-finger drag)"),
      co("Ctrl+scroll", "Zoom at pointer (pinch)"),
      Ne({ keys: ["escape"], text: "Exit fullscreen, close dialogs" })
    ]),
    xn("Admin", [
      Ne({ keys: ["m"], text: "New seed" })
    ])
  ];
}
[...bo];
function Rr(e, n) {
  return n === "live" && e.getLiveSource() !== null ? "liveArmed" : n === "pause" && e.getFreezeLevel() > 0 ? "paused" : n;
}
const Ul = {
  k: "--p95-icon-ink",
  g: "--p95-icon-shadow",
  s: "--p95-icon-silver",
  w: "--p95-icon-light",
  b: "--p95-icon-blue",
  c: "--p95-icon-cyan",
  a: "--p95-icon-aqua",
  y: "--p95-icon-yellow",
  o: "--p95-icon-olive",
  r: "--p95-icon-red",
  m: "--p95-icon-maroon"
};
function da(e, n) {
  let r = [...e];
  for (let i = 0; i < n; i++)
    r = r.map((a, t) => r.map((u) => u[t]).reverse().join(""));
  return r;
}
const zl = [
  "................",
  ".......kk.......",
  "......kkkk......",
  ".....kkkkkk.....",
  "....kkkkkkkk....",
  "...kkkkkkkkkk...",
  "..kkkkkkkkkkkk..",
  "......kkkk......",
  "......kkkk......",
  "......kkkk......",
  "......kkkk......",
  "......kkkk......",
  "......kkkk......",
  "......kkkk......",
  "......kkkk......",
  "................"
], Ol = [
  ".......bb.......",
  "......bbbb......",
  ".....bbbbbb.....",
  "..bb...bb.......",
  ".bbbb..bb.......",
  "bbbbbb.bb...bb..",
  "..bb...bb..bbbb.",
  "..bb...bb.bbbbbb",
  "..bb...bb...bb..",
  "..bb...bb...bb..",
  "..bb...bb...bb..",
  "..bb...bb...bb..",
  "..bb...bb...bb..",
  "..bb........bb..",
  "..bb........bb..",
  "............bb.."
], Mr = [
  "................",
  "................",
  "...........k....",
  "...........kk...",
  "kk.kk.kk.kkkkk..",
  "kk.kk.kk.kkkkk..",
  "...........kk...",
  "...........k....",
  "....k...........",
  "...kk...........",
  "..kkkkk.kk.kk.kk",
  "..kkkkk.kk.kk.kk",
  "...kk...........",
  "....k...........",
  "................",
  "................"
], Nl = { up: 0, right: 1, down: 2, left: 3 };
function Ut(e) {
  const n = jo(e);
  if (n.kind !== "direction") throw new Error(`[sketch-engine] ${e} is not a direction`);
  return da(n.waterfall ? Ol : zl, Nl[n.direction]);
}
const Hl = {
  circle: [
    "................",
    "................",
    "................",
    ".....kkkkkk.....",
    "....kkkkkkkk....",
    "...kkkkkkkkkk...",
    "...kkkkkkkkkk...",
    "...kkkkkkkkkk...",
    "...kkkkkkkkkk...",
    "...kkkkkkkkkk...",
    "...kkkkkkkkkk...",
    "....kkkkkkkk....",
    ".....kkkkkk.....",
    "................",
    "................",
    "................"
  ],
  // Fuzzy edges: an airbrush-style stipple around a solid core.
  circleFuzzy: [
    "................",
    "................",
    "......k.k.k.....",
    ".....k.k.k.k....",
    "....k.kkk.k.k...",
    "...k.kkkkkkk.k..",
    "..k.kkkkkkk.k...",
    "...kkkkkkkkk.k..",
    "..k.kkkkkkkkk...",
    "...k.kkkkkkk.k..",
    "..k.kkkkkkk.k...",
    "...k.k.kkk.k....",
    "....k.k.k.k.....",
    ".....k.k.k......",
    "................",
    "................"
  ],
  square: [
    "................",
    "................",
    "................",
    "...kkkkkkkkkk...",
    "...kkkkkkkkkk...",
    "...kkkkkkkkkk...",
    "...kkkkkkkkkk...",
    "...kkkkkkkkkk...",
    "...kkkkkkkkkk...",
    "...kkkkkkkkkk...",
    "...kkkkkkkkkk...",
    "...kkkkkkkkkk...",
    "...kkkkkkkkkk...",
    "................",
    "................",
    "................"
  ],
  squareFuzzy: [
    "................",
    "................",
    "...k.k.k.k.k.k..",
    "..k.k.k.k.k.k...",
    "...kkkkkkkkk.k..",
    "..k.kkkkkkkkk...",
    "...kkkkkkkkk.k..",
    "..k.kkkkkkkkk...",
    "...kkkkkkkkk.k..",
    "..k.kkkkkkkkk...",
    "...kkkkkkkkk.k..",
    "..k.kkkkkkkkk...",
    "...k.k.k.k.k.k..",
    "..k.k.k.k.k.k...",
    "................",
    "................"
  ],
  // Paint's filled-shape style: an outline round a gray fill.
  rect: [
    "................",
    "................",
    "................",
    ".kkkkkkkkkkkkkk.",
    ".kggggggggggggk.",
    ".kggggggggggggk.",
    ".kggggggggggggk.",
    ".kggggggggggggk.",
    ".kggggggggggggk.",
    ".kggggggggggggk.",
    ".kggggggggggggk.",
    ".kggggggggggggk.",
    ".kkkkkkkkkkkkkk.",
    "................",
    "................",
    "................"
  ],
  oval: [
    "................",
    "................",
    "................",
    ".....kkkkkk.....",
    "...kkggggggkk...",
    "..kggggggggggk..",
    ".kggggggggggggk.",
    ".kggggggggggggk.",
    ".kggggggggggggk.",
    ".kggggggggggggk.",
    "..kggggggggggk..",
    "...kkggggggkk...",
    ".....kkkkkk.....",
    "................",
    "................",
    "................"
  ],
  // A wavy arrow: pixels go the way you drag.
  flow: [
    "................",
    "................",
    "................",
    "...........b....",
    "...........bb...",
    "..bb.......bbb..",
    ".bbbb......bbbb.",
    "bb..bb....bbbbbb",
    "b....bb..bbbbbbb",
    "......bbbb.bbbb.",
    ".......bb..bbb..",
    "...........bb...",
    "...........b....",
    "................",
    "................",
    "................"
  ],
  shuffle: Mr,
  trickle: da(Mr, 1),
  // An eraser rubbing out an arrow (movement).
  erase: [
    "................",
    "......k.........",
    "......kk........",
    "k.k.kkkkk.......",
    "......kk........",
    "......k.........",
    ".......kkkkkkkkk",
    "......kwwwwwwwkk",
    ".....kwwwwwwwkok",
    "....kkkkkkkkkook",
    "....kyyyyyyykook",
    "....kyyyyyyykok.",
    "....kyyyyyyykk..",
    "....kkkkkkkkk...",
    "................",
    "................"
  ],
  freeze: [
    "................",
    ".....b.b.b......",
    "......bbb.......",
    "...b...b...b....",
    "....b..b..b.....",
    ".b...b.b.b...b..",
    "..b...bbb...b...",
    ".bbbbbbabbbbbb..",
    "..b...bbb...b...",
    ".b...b.b.b...b..",
    "....b..b..b.....",
    "...b...b...b....",
    "......bbb.......",
    ".....b.b.b......",
    "................",
    "................"
  ],
  waterfallUp: Ut("waterfallUp"),
  straightUp: Ut("straightUp"),
  waterfallDown: Ut("waterfallDown"),
  straightDown: Ut("straightDown"),
  moveLeft: Ut("moveLeft"),
  straightLeft: Ut("straightLeft"),
  moveRight: Ut("moveRight"),
  straightRight: Ut("straightRight"),
  // The pause button: pause while playing, play while paused.
  pause: [
    "................",
    "................",
    "................",
    "....kkk..kkk....",
    "....kkk..kkk....",
    "....kkk..kkk....",
    "....kkk..kkk....",
    "....kkk..kkk....",
    "....kkk..kkk....",
    "....kkk..kkk....",
    "....kkk..kkk....",
    "....kkk..kkk....",
    "....kkk..kkk....",
    "................",
    "................",
    "................"
  ],
  paused: [
    "................",
    "................",
    "................",
    ".....k..........",
    ".....kk.........",
    ".....kkk........",
    ".....kkkk.......",
    ".....kkkkk......",
    ".....kkkkk......",
    ".....kkkk.......",
    ".....kkk........",
    ".....kk.........",
    ".....k..........",
    "................",
    "................",
    "................"
  ]
}, Xl = {
  // Four arrows: drag the view any way.
  pan: [
    ".......kk.......",
    "......kkkk......",
    ".....kkkkkk.....",
    ".......kk.......",
    ".......kk.......",
    "..k....kk....k..",
    ".kk....kk....kk.",
    "kkkkkkkkkkkkkkkk",
    "kkkkkkkkkkkkkkkk",
    ".kk....kk....kk.",
    "..k....kk....k..",
    ".......kk.......",
    ".......kk.......",
    ".....kkkkkk.....",
    "......kkkk......",
    ".......kk......."
  ],
  // A magnifier, zoomed out.
  zoomFit: [
    "..kkk......",
    ".kwwwk.....",
    "kwwwwwk....",
    "kwkkkwk....",
    "kwwwwwk....",
    ".kwwwkk....",
    "..kkkkkk...",
    "......kkk..",
    ".......kkk.",
    "........kkk",
    ".........kk"
  ]
}, Gl = {
  // Title bar app icon (and the favicon): a paint palette, glitched with an
  // RGB split. Spots counterclockwise from the top right: blue, green, red,
  // yellow, cyan. Its colors are fixed in every theme (.p95-app-icon), where
  // `o` is pure green and `b` pure blue.
  app: [
    "................",
    "....aaaaaa......",
    "..aaakkkkkka....",
    ".aakkwwwwwwkk...",
    "aakwwwoowbbwwk..",
    "akwwwwoowbbwwwk.",
    "akwrrwwwwwwwwwkr",
    "akwrrwwwwwkkkkrr",
    "akwwwwwwwkrrrrr.",
    "akwwyywwwkraa...",
    ".kwwyywaawkkkk..",
    "..kwwwwaawwwwwk.",
    "...kkwwwwwwwkkrr",
    "....rkkkkkkkrrr.",
    "......rrrrrrr...",
    "................"
  ],
  minimize: ["........", "........", "........", "........", "........", ".kkkkkk.", ".kkkkkk."],
  maximize: ["kkkkkkkkk", "kkkkkkkkk", "k.......k", "k.......k", "k.......k", "k.......k", "k.......k", "kkkkkkkkk"],
  close: ["kk....kk", ".kk..kk.", "..kkkk..", "...kk...", "..kkkk..", ".kk..kk.", "kk....kk"],
  up: ["...k...", "..kkk..", ".kkkkk.", "kkkkkkk"],
  down: ["kkkkkkk", ".kkkkk.", "..kkk..", "...k..."],
  left: ["...k", "..kk", ".kkk", "kkkk", ".kkk", "..kk", "...k"],
  right: ["k...", "kk..", "kkk.", "kkkk", "kkk.", "kk..", "k..."],
  check: ["......k", ".....kk", "k...kkk", "kk.kkk.", "kkkkk..", ".kkk...", "..k...."],
  // Win95 Paint's status-bar extent icon: a dotted box, its width and height
  // arrowed between stops.
  coords: [
    "......k....k..k",
    "......k.....k.k",
    "......k.kkkkkkk",
    "......k.....k.k",
    "......k....k..k",
    "...............",
    "kkkkk.k.k.k.k.k",
    "...............",
    "..k...k.......k",
    "..k............",
    "..k...k.......k",
    "k.k.k..........",
    ".kkk..k.......k",
    "..k............",
    "kkkkk.k.k.k.k.k"
  ],
  // Win95's size grip: three embossed diagonal ridges.
  grip: [
    ".................w",
    "................wg",
    "...............wgg",
    "..............wgg.",
    ".............wgg.w",
    "............wgg.wg",
    "...........wgg.wgg",
    "..........wgg.wgg.",
    ".........wgg.wgg.w",
    "........wgg.wgg.wg",
    ".......wgg.wgg.wgg",
    "......wgg.wgg.wgg.",
    ".....wgg.wgg.wgg.w",
    "....wgg.wgg.wgg.wg",
    "...wgg.wgg.wgg.wgg",
    "..wgg.wgg.wgg.wgg.",
    ".wgg.wgg.wgg.wgg.w",
    "wgg.wgg.wgg.wgg.wg"
  ]
}, Cr = [
  "...kkkk...",
  "..kwrrrk..",
  "..krrrmk..",
  "...kmmk...",
  "...kook...",
  "...kook...",
  "kkkkkkkkkk",
  "kwwwwwwwsk",
  "kwssssssgk",
  "kkkkkkkkkk",
  ".mmmmmmmm."
], Vl = ["circle", "circleFuzzy", "square", "squareFuzzy", "rect", "oval"], Wl = {
  circle: [
    "...kkk...",
    ".kkkkkkk.",
    ".kkkkkkk.",
    "kkkkkkkkk",
    "kkkkkkkkk",
    "kkkkkkkkk",
    ".kkkkkkk.",
    ".kkkkkkk.",
    "...kkk..."
  ],
  circleFuzzy: [
    "..k.k.k..",
    ".k.k.k.k.",
    "k.kkkkk.k",
    ".kkkkkkk.",
    "k.kkkkk.k",
    ".kkkkkkk.",
    "k.kkkkk.k",
    ".k.k.k.k.",
    "..k.k.k.."
  ],
  square: [
    "kkkkkkkk",
    "kkkkkkkk",
    "kkkkkkkk",
    "kkkkkkkk",
    "kkkkkkkk",
    "kkkkkkkk",
    "kkkkkkkk",
    "kkkkkkkk"
  ],
  squareFuzzy: [
    ".k.k.k.k.",
    "k.k.k.k.k",
    ".kkkkkkk.",
    "k.kkkkk.k",
    ".kkkkkkk.",
    "k.kkkkk.k",
    ".kkkkkkk.",
    "k.k.k.k.k",
    ".k.k.k.k."
  ],
  rect: [
    "kkkkkkkkk",
    "kgggggggk",
    "kgggggggk",
    "kgggggggk",
    "kgggggggk",
    "kgggggggk",
    "kkkkkkkkk"
  ],
  oval: [
    "..kkkkk..",
    ".kgggggk.",
    "kgggggggk",
    "kgggggggk",
    "kgggggggk",
    ".kgggggk.",
    "..kkkkk.."
  ]
};
function Yl(e, n) {
  const r = Array.from({ length: 16 }, () => Array(16).fill(".")), i = Wl[e], a = { rows: Cr, x: 16 - Cr[0].length, y: 0 }, t = { rows: i, x: 0, y: 16 - i.length }, [u, m] = n ? [t, a] : [a, t], f = (g, p) => g.rows.forEach((d, y) => [...d].forEach((T, k) => {
    T !== "." && p(g.x + k, g.y + y, T);
  }));
  return f(u, (g, p, d) => {
    r[p][g] = d;
  }), f(m, (g, p) => {
    for (let d = -1; d <= 1; d++) for (let y = -1; y <= 1; y++)
      r[p + d]?.[g + y] !== void 0 && (r[p + d][g + y] = ".");
  }), f(m, (g, p, d) => {
    r[p][g] = d;
  }), r.map((g) => g.join(""));
}
function ql(e) {
  return Vl.find((n) => Jo(e, n)) ?? "circle";
}
const $l = 0.012, Kl = 10;
function Zl(e, n, r) {
  return qo(e, n * Math.exp(r * $l));
}
function Ar(e) {
  return e < Kl;
}
function jl(e, n, r) {
  return e < n + r / 2 ? 1 : -1;
}
const Ql = 0.1, Jl = 0.9, es = (e) => Math.min(1, Math.max(0, e)), tr = (e) => 0.5 / e;
function pa(e, n, r) {
  return Math.min(Math.max(e, Math.min(n, r)), Math.max(n, 1 - r));
}
function ts(e, n, r) {
  if (n <= 1) return { pos: 0, size: 1 };
  const i = tr(n), a = (r - i) / (1 - 2 * i);
  return { pos: es(e === "x" ? a : 1 - a), size: Math.min(1, 1 / n) };
}
function ns(e, n, r, i, a) {
  if (a <= 0) return r;
  const t = tr(n), u = i / a * (1 - 2 * t);
  return pa(e === "x" ? r + u : r - u, r, t);
}
function os(e, n, r, i, a) {
  const t = i * (a ? Jl : Ql) / n;
  return pa(e === "x" ? r + t : r - t, r, tr(n));
}
function rs(e) {
  return e.slice(0, 8).toLowerCase().replace(/[^a-z0-9]/g, "") || "x";
}
function Lr(e) {
  return `${rs(e)} · Sk3tch`;
}
function as() {
  const e = [];
  return {
    listen(n, r, i, a) {
      const t = i;
      n.addEventListener(r, t, a), e.push(() => n.removeEventListener(r, t, a));
    },
    add(n) {
      e.push(n);
    },
    run() {
      for (const n of e.splice(0).reverse()) n();
    }
  };
}
function is(e, n) {
  let r = e, i = null;
  function a() {
    i === null && (i = requestAnimationFrame(() => {
      i = null, n();
    }));
  }
  return {
    get: () => r,
    set(t) {
      r = { ...r, ...t }, a();
    },
    schedule: a,
    cancel() {
      i !== null && cancelAnimationFrame(i), i = null;
    }
  };
}
const ma = 8, ha = 86, ka = 136, ga = 8, ls = 22, wo = 350, ss = wo * 4 / 3 + ha + 2 * ma, cs = wo + ka + 2 * ma, us = wo * 4 / 3 + ha - ga, fs = wo + ka - ga - ls;
function ds({ width: e, height: n, frame: r }) {
  return !(e > 0) || !(n > 0) ? { compact: !1 } : r === "host" ? { compact: e < us || n < fs } : { compact: e < ss || n < cs };
}
function go(e, n) {
  const r = Math.max(...e.map((t) => t.length)), i = e.length;
  let a = "";
  return e.forEach((t, u) => {
    let m = 0;
    for (; m < t.length; ) {
      const f = t[m];
      let g = m + 1;
      for (; g < t.length && t[g] === f; ) g++;
      const p = Ul[f];
      p && (a += `<rect x="${m}" y="${u}" width="${g - m}" height="1" style="fill:var(${p})"/>`), m = g;
    }
  }), `<svg class="${n}" style="--w:${r};--h:${i}" viewBox="0 0 ${r} ${i}" shape-rendering="crispEdges" aria-hidden="true">${a}</svg>`;
}
const va = (e) => e === "live" || e === "liveArmed";
function ps(e, n) {
  return va(e) ? `${e}:${n}` : e;
}
function ms(e, n) {
  return va(e) ? go(Yl(n, e === "liveArmed"), "p95-icon") : go(Hl[e], "p95-icon");
}
function hs(e) {
  return go(Xl[e], "p95-icon");
}
const Fr = "p95-paint-styles", ks = [
  { theme: "gray", label: "Standard" },
  { theme: "win95", label: "Classic" },
  { theme: "bw", label: "1-Bit" }
], gs = "For Help, click Help Topics on the Help Menu.", Pr = "Hides the controls. Esc brings them back.", Dr = "Only available on Chrome", vs = "Drag to pan, scroll to zoom. Hold Ctrl to do both with any tool.", Ir = "Closes Mint.", Br = "Minting limit reached", bs = "You won't be able to get this QR code back. Close it?", ws = "Are you sure? This will clear everything and start a new Sk3tch.", _s = 280, ys = 0.1;
function xs(e = document) {
  if (e.getElementById(Fr)) return;
  const n = e.createElement("style");
  n.id = Fr, n.textContent = [vl, bl].join(`
`), e.head.appendChild(n);
}
function Es(e) {
  const n = e;
  return n ? n.tagName === "INPUT" || n.tagName === "TEXTAREA" || n.tagName === "SELECT" || n.isContentEditable === !0 : !1;
}
function R(e, n = "", r = {}) {
  const i = document.createElement(e);
  n && (i.className = n);
  for (const [a, t] of Object.entries(r)) i.setAttribute(a, t);
  return i;
}
function ce(e, ...n) {
  for (const r of n) e.appendChild(r);
}
function Ur(e, n) {
  const r = R("tr"), i = R("td");
  i.textContent = e;
  const a = R("td");
  return a.textContent = n, ce(r, i, a), r;
}
function Je(e) {
  return go(Gl[e], "p95-glyph");
}
function Ts(e, n = 38) {
  if (e.length <= n) return e;
  const r = Math.floor((n - 3) / 2);
  return `${e.slice(0, r)}...${e.slice(e.length - r)}`;
}
const Io = "http://www.w3.org/2000/svg";
function Ss(e) {
  const n = document.createElementNS(Io, "svg");
  n.setAttribute("viewBox", `0 0 ${e.size} ${e.size}`), n.setAttribute("shape-rendering", "crispEdges"), n.setAttribute("role", "img"), n.setAttribute("aria-label", "QR code");
  const r = document.createElementNS(Io, "rect");
  r.setAttribute("width", String(e.size)), r.setAttribute("height", String(e.size)), r.setAttribute("fill", "#fff");
  const i = document.createElementNS(Io, "path");
  return i.setAttribute("d", e.d), i.setAttribute("fill", "#000"), n.append(r, i), n;
}
function le(e, n, r) {
  e.getAttribute(n) !== r && (r === null ? e.removeAttribute(n) : e.setAttribute(n, r));
}
function zt(e, n) {
  e.textContent !== n && (e.textContent = n);
}
function ue(e, n) {
  e.hidden !== n && (e.hidden = n);
}
function Rs(e) {
  for (let n = e; n; n = n.parentElement) if (n.hidden) return !0;
  return !1;
}
function Ms(e, n, r) {
  e.classList.contains(n) !== r && e.classList.toggle(n, r);
}
function zr(e) {
  const n = document.createElement("canvas"), r = typeof n.getContext == "function" ? n.getContext("2d") : null;
  return r ? (n.className = e, { canvas: n, ctx: r }) : null;
}
function Or({ canvas: e, ctx: n }, r) {
  e.width !== r.width && (e.width = r.width), e.height !== r.height && (e.height = r.height), n.putImageData(r, 0, 0);
}
const Nr = /* @__PURE__ */ new WeakMap();
function Jt(e, n, r) {
  let i = Nr.get(e);
  i || Nr.set(e, i = /* @__PURE__ */ new Map()), i.get(n) !== r && (i.set(n, r), e.style.setProperty(n, r));
}
function Ls(e, n, r = {}) {
  xs();
  const i = e.getDrawingManager(), a = e.getCanvas(), t = r.mode === "kiosk", u = r.frame === "host", m = window.self !== window.top || window.origin === "null", f = as();
  let g = !1;
  const p = is({
    panMode: !1,
    openDialog: null,
    // Host frame: the host shows the window, so it boots in window view.
    fullView: !u,
    theme: r.theme ?? "gray",
    isAdmin: r.isAdmin ?? !1,
    openMenu: null,
    recordingSupported: !0,
    ctrlHeld: !1
  }, s), d = R("div", "p95-root", u ? { "data-p95-frame": "host" } : {}), y = R("div", "p95-screen"), T = R("div", "p95-window");
  u ? d.appendChild(T) : (d.appendChild(y), y.appendChild(T));
  const k = R("div", "p95-titlebar"), b = R("span", "p95-app-icon");
  b.innerHTML = Je("app");
  const U = R("div", "p95-title-text"), P = R("div", "p95-title-btns"), K = R("button", "p95-title-btn p95-raised", { disabled: "", tabindex: "-1", "aria-hidden": "true" });
  K.innerHTML = Je("minimize");
  const C = R("button", "p95-title-btn p95-raised", { "data-shell": "maximize", "data-help": Pr });
  C.title = "Full View", C.innerHTML = Je("maximize");
  const D = R("button", "p95-title-btn p95-raised p95-gap", { disabled: "", tabindex: "-1", "aria-hidden": "true" });
  D.innerHTML = Je("close"), ce(P, K, C, D), ce(k, b, U, P), u || T.appendChild(k);
  const x = R("div", "p95-menubar", { role: "menubar" });
  T.appendChild(x);
  function w(o, l, c = "p95-menu-item") {
    const h = R("button", c, l), v = R("span", "p95-label");
    return v.textContent = o, h.appendChild(v), { btn: h, label: v };
  }
  const E = /* @__PURE__ */ new Map();
  function I(o, l = "p95-menu-item") {
    const c = w(Ot[o].name, { "data-cmd": o }, l);
    return c.btn.title = Vn({ type: "command", id: o }), E.set(o, c), c.btn;
  }
  function V(o, l, c = !1) {
    const h = R("div", "p95-menu"), v = w(l, { "data-shell": `${o}-menu`, "aria-haspopup": "true", "aria-expanded": "false" }), S = R("div", c ? "p95-dropdown p95-raised" : "p95-dropdown p95-raised p95-no-checks", { role: "menu" });
    return S.hidden = !0, ce(h, v.btn, S), { wrapper: h, btn: v.btn, label: v.label, panel: S };
  }
  const q = typeof navigator < "u" && /Mac|iPhone|iPad|iPod/.test(navigator.platform ?? ""), ne = ko("undo", q), de = ko("redo", q), fe = w("Mint", { "data-shell": "mint" }, "p95-menu-item p95-primary").btn, $ = {
    export: V("export", "Export"),
    edit: V("edit", "Edit"),
    view: V("view", "View", !0)
  }, De = R("span", "p95-rec-count");
  ce($.export.btn, De);
  let Ie = "";
  ce(x, fe, $.export.wrapper, $.edit.wrapper, I("properties")), ce(x, $.view.wrapper, I("help"));
  function F(o, l, c, h) {
    const v = R("button", "p95-menu-item", { role: "menuitem", ...h }), S = R("span", "p95-check");
    S.innerHTML = Je("check");
    const M = R("span", "p95-label");
    M.textContent = l;
    const z = R("span", "p95-shortcut");
    return z.textContent = c, ce(v, S, M, z), o.appendChild(v), { btn: v, label: M };
  }
  function B(o, l, c = fa({ type: "command", id: l })) {
    const h = F(o, Ot[l].name, c, { "data-cmd": l, "data-help": Ot[l].help });
    E.set(l, h);
  }
  B($.export.panel, "record"), B($.export.panel, "screenshot"), B($.edit.panel, "undo", ne), B($.edit.panel, "redo", de), r.newSeed && ($.edit.panel.appendChild(R("div", "p95-separator")), B($.edit.panel, "newSeedPrompt"));
  const Y = $.view.panel, _ = () => {
    Y.appendChild(R("div", "p95-separator"));
  };
  B(Y, "zoomIn"), B(Y, "zoomOut"), B(Y, "zoomReset"), _(), B(Y, "bloom"), B(Y, "warp"), _();
  const W = ks.map(({ theme: o, label: l }) => ({
    theme: o,
    btn: F(Y, l, "", { "data-shell": `theme-${o}`, "data-help": `${l} theme.` }).btn
  }));
  _();
  const N = F(Y, "Full View", "", { "data-shell": "full-view", "data-help": Pr }).btn, A = R("div", "p95-body"), G = R("div", "p95-toolbox"), Z = R("div", "p95-tools"), oe = /* @__PURE__ */ new Map();
  function re(o, l) {
    const c = R("button", l, { "data-tool": o, "aria-label": Vo[o].name, "data-help": Vo[o].help });
    return c.title = Vn({ type: "tool", id: o }), oe.set(o, c), c;
  }
  const O = (o) => jo(o).kind === "shape";
  Fo.forEach((o, l) => {
    l > 0 && O(Fo[l - 1]) && !O(o) && Z.appendChild(R("div", "p95-separator p95-tools-divider")), Z.appendChild(re(o, "p95-tool p95-raised"));
  });
  const j = Array.from(Z.children), H = R("div", "p95-size p95-sunken", {
    role: "slider",
    "aria-label": "Brush Size",
    "data-help": "Brush size. Tap top or bottom to step, or drag."
  });
  H.title = "Brush Size ([ ])";
  const Te = R("span");
  Te.innerHTML = Je("up");
  const Ge = R("span", "p95-size-preview"), Ae = R("span");
  Ae.innerHTML = Je("down"), ce(H, Te, Ge, Ae);
  const se = R("div", "p95-toolbox-head"), we = R("button", "p95-tool p95-raised", { "data-shell": "pan", "aria-label": "Pan", "data-help": vs });
  we.title = "Pan (hold Ctrl)", ce(se, re("pause", "p95-tool p95-raised p95-pause"), we), ce(G, se, R("div", "p95-separator p95-toolbox-divider"), Z, H);
  const Se = R("div", "p95-frame p95-sunken"), _e = R("div", "p95-workspace");
  function he(o, l, c, h) {
    const v = (J) => {
      const me = R("button", "p95-scroll-btn p95-raised", {
        tabindex: "-1",
        "data-shell": `scroll-${J}`,
        "data-help": `Scrolls the view ${J}.`
      });
      return me.innerHTML = Je(J), me;
    }, S = o === "y" ? "v" : "h", M = R("div", `p95-scroll p95-${S}scroll p95-inactive`, { "data-scroll": S }), z = R("div", "p95-track p95-dither", { "data-help": h }), X = R("div", "p95-thumb p95-raised");
    z.appendChild(X);
    const te = { axis: o, bar: M, back: v(l), track: z, thumb: X, forward: v(c) };
    return ce(M, te.back, z, te.forward), te;
  }
  const ae = [
    he("y", "up", "down", "Click to page up or down, or drag the box."),
    he("x", "left", "right", "Click to page left or right, or drag the box.")
  ], Le = R("div", "p95-corner"), ge = R("button", "p95-scroll-btn p95-raised", {
    tabindex: "-1",
    "data-shell": "zoom-fit",
    "aria-label": "Zoom to Fit",
    "data-help": Ot.zoomReset.help
  });
  ge.title = Vn({ type: "command", id: "zoomReset" }), Le.appendChild(ge), ce(Se, _e, ...ae.map((o) => o.bar), Le), ce(A, G, Se), T.appendChild(A);
  const Re = R("div", "p95-colorbox"), tt = R("div", "p95-current p95-sunken", { "data-help": "The current paint or tool." }), Ht = R("span", "p95-current-fill"), Fe = R("span", "p95-current-tools p95-dither"), Yn = [R("span", "p95-current-slot"), R("span", "p95-current-slot")];
  ce(Fe, ...Yn), ce(tt, Ht, Fe), Re.appendChild(tt);
  const qe = /* @__PURE__ */ new Map();
  for (const o of fo) {
    const l = R("button", "p95-swatch p95-sunken", { "data-paint": o, "aria-label": Wo[o].name, "data-help": Wo[o].help });
    l.title = Vn({ type: "paint", id: o });
    const c = R("span", "p95-swatch-fill");
    l.appendChild(c), Re.appendChild(l), qe.set(o, { btn: l, fill: c });
  }
  let Be;
  T.appendChild(Re);
  const St = R("div", "p95-strip-tools"), nt = R("div", "p95-separator p95-separator-v p95-strip-divider"), Ve = R("div", "p95-strip-paints"), ot = Fo.filter((o) => !O(o)).map((o) => oe.get(o)), Ce = [...qe.values()].map((o) => o.btn);
  Jt(d, "--p95-strip-tool-cols", String(Math.ceil(ot.length / 2))), Jt(d, "--p95-strip-paint-cols", String(Math.ceil(Ce.length / 2)));
  function $e(o) {
    if (o !== (St.parentNode === Re))
      if (o)
        ce(St, ...ot), ce(Ve, tt, ...Ce), ce(Re, St, nt, Ve);
      else {
        ce(Z, ...j), ce(Re, tt, ...Ce);
        for (const l of [St, nt, Ve]) l.remove();
      }
  }
  const mt = R("div", "p95-statusbar"), ht = R("div", "p95-pane p95-pane-help p95-sunken"), kt = R("div", "p95-pane p95-pane-glitch p95-sunken"), Tn = R("div", "p95-pane p95-pane-coords p95-sunken"), on = R("span");
  Tn.innerHTML = Je("coords"), Tn.appendChild(on);
  const Sn = R("div", "p95-grip");
  Sn.innerHTML = Je("grip"), ce(mt, ht, kt, Tn, Sn), T.appendChild(mt);
  function ve(o, l = {}) {
    const c = `Closes ${o}.`, h = R("div", "p95-dialog-overlay");
    h.hidden = !0;
    const v = R("div", `p95-dialog p95-raised ${l.className ?? ""}`.trim(), { role: "dialog", "aria-label": o }), S = R("div", "p95-titlebar"), M = R("div", "p95-title-text");
    M.textContent = o;
    const z = R("div", "p95-title-btns"), X = R("button", "p95-title-btn p95-raised", { "data-shell": "dialog-close", "aria-label": "Close", "data-help": c });
    X.innerHTML = Je("close"), z.appendChild(X), ce(S, M, z);
    const te = R("div", "p95-dialog-body"), J = R("div", "p95-dialog-actions");
    let me = null;
    return l.ok !== !1 && (me = R("button", "p95-btn p95-raised", { "data-shell": "dialog-close", "data-help": c }), me.textContent = "OK", J.appendChild(me)), ce(v, S, te, J), h.appendChild(v), d.appendChild(h), { overlay: h, body: te, actions: J, okBtn: me, closeBtn: X, onOpen: l.onOpen };
  }
  const qn = ve("Help"), Rn = R("table"), Q = R("tbody"), Mn = [];
  for (const o of Bl(q)) {
    const l = R("tr", "p95-help-heading"), c = R("th", "", { colspan: "2" });
    c.textContent = o.title, l.appendChild(c), Q.appendChild(l), o.adminOnly && Mn.push(l);
    for (const h of o.rows) {
      const v = Ur(h.label, h.text);
      Q.appendChild(v), h.adminOnly && Mn.push(v);
    }
  }
  Rn.appendChild(Q), qn.body.appendChild(Rn);
  const ye = ve("Properties", { className: "p95-props", onOpen: Cn });
  function Cn() {
    const o = [
      ["Name", Lr(e.getSeed())],
      ...Aa(e.getParams()).map((h) => [h.trait_type, h.value])
    ], l = R("tbody");
    for (const [h, v] of o) l.appendChild(Ur(h, v));
    const c = R("table");
    c.appendChild(l), ye.body.replaceChildren(c);
  }
  const gt = ve("Mint", { className: "p95-mint", ok: !1 }), Rt = R("p", "p95-mint-text"), An = R("div", "p95-progress p95-sunken");
  An.appendChild(R("div", "p95-progress-fill"));
  const Xt = R("div", "p95-mint-qr"), rn = R("p", "p95-mint-url");
  ce(gt.body, Rt, An, Xt, rn);
  function rt(o, l, c, h) {
    const v = R("button", "p95-btn p95-raised", { "data-shell": c, "data-help": h });
    return v.textContent = l, o.actions.appendChild(v), v;
  }
  const at = (o, l, c) => rt(gt, o, l, c), Mt = at("Mint", "mint-confirm", "Mints the piece and shows its QR code."), Gt = at("Retry", "mint-confirm", "Tries the mint again."), an = at("Cancel", "mint-close", Ir), Vt = at("Close", "mint-close", Ir), Ct = at("Close", "mint-leave", "Closes the QR code for good."), We = at("Back", "mint-back", "Goes back to the QR code."), ln = [Mt, Gt, an, Vt, Ct, We];
  let be = { phase: "confirm" }, it = !1;
  const lt = ve("New Seed", { className: "p95-new-seed", ok: !1 }), sn = R("p", "p95-new-seed-text");
  sn.textContent = ws, lt.body.appendChild(sn);
  const Wt = rt(lt, "OK", "new-seed-confirm", Ot.newSeed.help), vt = rt(lt, "Cancel", "dialog-close", "Closes New Seed."), Ue = {
    help: qn,
    properties: ye,
    mint: gt,
    newSeed: lt
  }, bt = [
    ...Object.values(Ue).flatMap((o) => o.okBtn ? [o.closeBtn, o.okBtn] : [o.closeBtn]),
    ...ln,
    Wt,
    vt
  ];
  gt.closable = () => be.phase !== "minting";
  function Ln() {
    const { openDialog: o } = p.get();
    return o !== null && Ue[o].closable?.() === !1;
  }
  function cn() {
    if (Ln()) return;
    const o = be;
    if (p.get().openDialog === "mint" && (o.phase === "done" || o.phase === "leaving")) {
      be = { ...o, phase: o.phase === "done" ? "leaving" : "done" }, p.schedule();
      return;
    }
    p.set({ openDialog: null });
  }
  let Yt = null;
  function Fn() {
    switch (be.phase) {
      case "confirm":
        return Mt;
      case "done":
        return Vt;
      case "leaving":
        return We;
      case "error":
        return Gt;
      case "limit":
        return Vt;
      case "minting":
        return null;
    }
  }
  function xe() {
    if (be === Yt) return !1;
    Yt = be;
    const o = be, l = o.phase === "done" && !o.claimed, c = o.phase === "confirm" ? "Mint this sketch and get its QR code." : o.phase === "minting" ? "Minting..." : o.phase === "error" ? o.message : o.phase === "limit" ? Br : o.phase === "leaving" ? bs : o.claimed ? "Minting..." : o.qr ? "" : "QR code could not be generated";
    return zt(Rt, c), ue(Rt, !c), ue(An, o.phase !== "minting"), Xt.replaceChildren(), l && o.qr && Xt.appendChild(Ss(o.qr)), ue(Xt, !(l && o.qr)), zt(rn, l ? Ts(o.url) : ""), le(rn, "title", l ? o.url : null), ue(rn, !l), ue(Mt, o.phase !== "confirm"), ue(an, o.phase !== "confirm"), ue(Gt, o.phase !== "error"), ue(Vt, o.phase !== "done" && o.phase !== "error" && o.phase !== "limit"), ue(Ct, o.phase !== "leaving"), ue(We, o.phase !== "leaving"), ue(gt.actions, o.phase === "minting"), le(gt.closeBtn, "disabled", o.phase === "minting" ? "" : null), !0;
  }
  const st = a.parentNode, At = a.nextSibling;
  _e.appendChild(a), n.appendChild(d);
  const Pe = ul(a, e, d);
  Pe.setRotated(!1), f.add(() => Pe.destroy());
  function _o(o) {
    if ((t || m) && (o === "record" || o === "screenshot")) return !1;
    const l = e.getRecordingStatus();
    return o === "record" ? p.get().recordingSupported && l !== "finishing" : o === "screenshot" || o === "newSeed" || o === "newSeedPrompt" || o === "warp" ? l === "idle" : !0;
  }
  function Lt(o) {
    return o.type === "command" && !_o(o.id) ? !1 : Do(e, o);
  }
  function Me(o) {
    Lt(o) && (p.set(Ll(e, o, p.get())), Pe.refresh());
  }
  function wt(o) {
    p.set({ openMenu: p.get().openMenu === o ? null : o });
  }
  function yo(o) {
    switch (o) {
      case "maximize":
      case "full-view":
        p.set({ fullView: !0, openMenu: null });
        break;
      case "mint":
        it || r.onMint?.();
        break;
      case "export-menu":
        e.getRecordingStatus() === "idle" ? wt("export") : (p.get().openMenu && p.set({ openMenu: null }), Me({ type: "command", id: "record" }));
        break;
      case "edit-menu":
        wt("edit");
        break;
      case "view-menu":
        wt("view");
        break;
      case "dialog-close":
      case "mint-close":
      case "mint-back":
        cn();
        break;
      case "mint-leave":
        p.set({ openDialog: null });
        break;
      case "mint-confirm":
        r.onMintConfirm?.();
        break;
      case "new-seed-confirm":
        cn(), Me({ type: "command", id: "newSeed" });
        break;
      case "scroll-up":
        _t("y", -1, !1);
        break;
      case "scroll-down":
        _t("y", 1, !1);
        break;
      case "scroll-left":
        _t("x", -1, !1);
        break;
      case "scroll-right":
        _t("x", 1, !1);
        break;
      case "pan": {
        const l = !p.get().panMode;
        l && e.cancelRectDrag(), p.set({ panMode: l });
        break;
      }
      case "zoom-fit":
        Me({ type: "command", id: "zoomReset" });
        break;
    }
  }
  for (const [o, l] of oe) f.listen(l, "click", () => Me({ type: "tool", id: o }));
  for (const [o, { btn: l }] of qe) f.listen(l, "click", () => Me({ type: "paint", id: o }));
  for (const [o, { btn: l }] of E)
    f.listen(l, "click", () => {
      p.get().openMenu && p.set({ openMenu: null }), Me({ type: "command", id: o });
    });
  const $n = Object.values($).map((o) => o.btn), Ft = [
    C,
    fe,
    ...$n,
    N,
    ...bt,
    ...ae.flatMap((o) => [o.back, o.forward]),
    we,
    ge
  ];
  for (const o of Ft)
    f.listen(o, "click", () => yo(o.getAttribute("data-shell")));
  for (const { theme: o, btn: l } of W) f.listen(l, "click", () => p.set({ theme: o, openMenu: null }));
  let Ke = !1;
  f.listen(d, "pointerdown", (o) => {
    Ke = !1;
    const { openMenu: l, openDialog: c } = p.get(), h = o.target;
    (l ? !$[l].wrapper.contains(h) && !$n.some((S) => S.contains(h)) : c !== null && h === Ue[c].overlay) && (o.preventDefault(), o.stopPropagation(), Ke = !0, l ? p.set({ openMenu: null }) : cn());
  }, { capture: !0 }), f.listen(d, "click", (o) => {
    !Ke || o.detail === 0 || (Ke = !1, o.preventDefault(), o.stopPropagation());
  }, { capture: !0 });
  let ee = null;
  f.listen(H, "pointerdown", (o) => {
    if (!(!Sr(e) || o.button !== 0)) {
      o.preventDefault();
      try {
        H.setPointerCapture(o.pointerId);
      } catch {
      }
      ee = { id: o.pointerId, y: o.clientY, size: i.getBrushSize(), moved: 0 };
    }
  }), f.listen(H, "pointermove", (o) => {
    if (!ee || o.pointerId !== ee.id) return;
    const l = ee.y - o.clientY;
    ee.moved = Math.max(ee.moved, Math.abs(l)), !Ar(ee.moved) && (i.setBrushSize(Zl(i.getBrushSizeOptions(), ee.size, l)), Pe.refresh(), wn());
  }), f.listen(H, "pointerup", (o) => {
    if (!ee || o.pointerId !== ee.id) return;
    const { y: l, moved: c } = ee;
    if (ee = null, !Ar(c)) return;
    const h = H.getBoundingClientRect();
    Me({ type: "command", id: jl(l, h.top, h.height) > 0 ? "sizeUp" : "sizeDown" });
  }), f.listen(H, "pointercancel", () => {
    ee = null;
  });
  function qt(o, l) {
    const c = e.getViewCenter();
    e.setViewCenter(o === "x" ? l : c.x, o === "y" ? l : c.y);
  }
  function _t(o, l, c) {
    const h = e.getViewZoom();
    if (h <= 1) return;
    const v = e.getViewCenter();
    qt(o, os(o, h, o === "x" ? v.x : v.y, l, c));
  }
  for (const { axis: o, track: l, thumb: c } of ae) {
    f.listen(l, "pointerdown", (S) => {
      if (S.target === c || S.button > 0 || e.getViewZoom() <= 1) return;
      S.preventDefault();
      const M = c.getBoundingClientRect();
      _t(o, (o === "y" ? S.clientY < M.top : S.clientX < M.left) ? -1 : 1, !0);
    });
    let h = null;
    f.listen(c, "pointerdown", (S) => {
      if (S.button > 0 || e.getViewZoom() <= 1) return;
      S.preventDefault();
      try {
        c.setPointerCapture(S.pointerId);
      } catch {
      }
      const M = e.getViewCenter();
      h = o === "y" ? { id: S.pointerId, from: S.clientY, center: M.y, travel: l.clientHeight - c.clientHeight } : { id: S.pointerId, from: S.clientX, center: M.x, travel: l.clientWidth - c.clientWidth };
    }), f.listen(c, "pointermove", (S) => {
      const M = e.getViewZoom();
      if (!h || S.pointerId !== h.id || M <= 1) return;
      const z = (o === "y" ? S.clientY : S.clientX) - h.from;
      qt(o, ns(o, M, h.center, z, h.travel));
    });
    const v = (S) => {
      h && S.pointerId === h.id && (h = null);
    };
    f.listen(c, "pointerup", v), f.listen(c, "pointercancel", v);
  }
  const Ze = (o, l) => e.toSimCoords(o, l, !1), yt = () => {
    const { panMode: o, fullView: l } = p.get();
    return o && !l;
  }, je = gl(e, Ze, yt, {
    active: () => p.get().fullView,
    onTap: () => p.set({ fullView: !1 })
  }, (o) => {
    p.get().fullView || Me({ type: "command", id: o === 2 ? "undo" : "redo" });
  });
  f.add(() => je.destroy());
  let Pt = null;
  function un() {
    let o = "0,0";
    if (Pt) {
      const { width: l, height: c } = e.getSimSize(), h = e.toSimCoords(Pt.x, Pt.y, !1), v = h.x >= 0 && h.x < l && h.y > 0 && h.y <= c, S = e.getViewZoom(), M = e.getViewCenter(), z = Math.floor((M.x + (h.x / l - 0.5) / S) * l), X = Math.floor(c - (M.y + (h.y / c - 0.5) / S) * c);
      v && z >= 0 && z < l && X >= 0 && X < c && (o = `${z + 1},${X + 1}`);
    }
    zt(on, o);
  }
  function $t(o) {
    Pt = { x: o.clientX, y: o.clientY }, un();
  }
  const Kn = (o) => {
    if (p.get().fullView)
      if (o.stopPropagation(), o.type === "pointerdown") {
        o.preventDefault();
        try {
          d.setPointerCapture(o.pointerId);
        } catch {
        }
        je.down(o);
      } else o.type === "pointermove" ? je.move(o) : je.up(o);
  };
  for (const o of ["pointerdown", "pointermove", "pointerup", "pointercancel"])
    f.listen(d, o, Kn, { capture: !0 });
  f.listen(a, "pointerdown", (o) => {
    $t(o), a.setPointerCapture(o.pointerId), je.down(o);
  }), f.listen(a, "pointermove", (o) => {
    $t(o), je.move(o);
  }), f.listen(a, "pointerleave", () => {
    Pt = null, un();
  });
  const Pn = (o) => je.up(o);
  f.listen(a, "pointerup", Pn), f.listen(a, "pointercancel", Pn), f.listen(d, "contextmenu", (o) => {
    (o.target === a || p.get().fullView) && o.preventDefault();
  }), f.listen(a, "wheel", (o) => {
    if (p.get().fullView && !o.ctrlKey || o.deltaX === 0 && o.deltaY === 0) return;
    o.preventDefault();
    const l = dl(e, o, Ze, yt());
    l && (Pe.refresh(), l === "size" && wn());
  }, { passive: !1 });
  function Dn(o, l, c) {
    const h = (S) => {
      S.key === o && c(S.type === "keydown");
    }, v = (S) => c(S[l]);
    f.listen(window, "keydown", h), f.listen(window, "keyup", h), f.listen(window, "blur", () => c(!1)), f.listen(d, "pointermove", v), f.listen(d, "pointerdown", v);
  }
  Dn("Control", "ctrlKey", (o) => {
    p.get().ctrlHeld !== o && p.set({ ctrlHeld: o });
  });
  function fn(o) {
    e.getRectConstrain() !== o && (e.setRectConstrain(o), Pe.setRectConstrain(o));
  }
  Dn("Shift", "shiftKey", fn), f.add(() => fn(!1));
  let Ye = null;
  const Zn = [
    C,
    N,
    H,
    tt,
    we,
    ge,
    ...bt,
    // Mint carries help only while disabled.
    fe,
    // Dropdown items only: the menu bar's own command buttons carry no help.
    ...[...E.values()].map((o) => o.btn).filter((o) => o.getAttribute("role") === "menuitem"),
    ...oe.values(),
    ...[...qe.values()].map((o) => o.btn),
    ...W.map((o) => o.btn),
    ...ae.flatMap((o) => [o.back, o.track, o.forward])
  ];
  for (const o of Zn)
    f.listen(o, "pointerenter", () => {
      Ye !== o && (Ye = o, p.schedule());
    }), f.listen(o, "pointerleave", () => {
      Ye === o && (Ye = null, p.schedule());
    });
  let jn = !0;
  f.listen(window, "keydown", (o) => {
    if (!jn || Es(o.target)) return;
    const l = p.get(), c = o.key.toLowerCase();
    if (c === "escape" && e.cancelRectDrag()) {
      Pe.refresh(), p.schedule();
      return;
    }
    if (c === "escape" && l.openMenu) {
      p.set({ openMenu: null });
      return;
    }
    if (c === "escape" && Ln()) return;
    if (c === "escape" && l.openDialog === "mint") {
      cn();
      return;
    }
    if ((o.ctrlKey || o.metaKey) && !o.altKey && c === "z") {
      if (l.openDialog) return;
      o.preventDefault(), o.repeat || Me({ type: "command", id: o.shiftKey ? "redo" : "undo" });
      return;
    }
    if (Fl.includes(c)) {
      !o.metaKey && !o.ctrlKey && !o.altKey && !o.repeat && !l.openDialog && r.onHostKey?.(c);
      return;
    }
    const h = Dl(o, { isAdmin: l.isAdmin, dialogOpen: l.openDialog !== null });
    h && (h.preventDefault && o.preventDefault(), Me(h.action));
  });
  let Kt = { x: 0, y: 0 };
  function dn() {
    const o = Kt, l = p.get().fullView || o.x === 0 && o.y === 0 ? "" : `translate(${o.x}px, ${o.y}px)`;
    Jt(T, "transform", l);
  }
  let xt = null;
  const Qn = (o) => {
    xt && o.pointerId === xt.id && (xt = null);
  }, Qe = (o, l, c, h, v) => {
    const S = c - (o - v), M = h - (l - v);
    return S <= M ? [S, M] : [0, 0];
  }, Jn = (o, l) => {
    if (P.contains(o.target) || o.button !== 0 || p.get().fullView) return;
    o.preventDefault();
    try {
      l.setPointerCapture(o.pointerId);
    } catch {
    }
    const c = T.getBoundingClientRect(), h = d.getBoundingClientRect(), v = Kt, [S, M] = Qe(c.left, c.right, h.left, h.right, v.x), [z, X] = Qe(c.top, c.bottom, h.top, h.bottom, v.y);
    xt = { id: o.pointerId, x: o.clientX, y: o.clientY, from: v, min: { x: S, y: z }, max: { x: M, y: X } };
  }, eo = (o) => {
    const l = xt;
    if (!l || o.pointerId !== l.id) return;
    const c = Math.min(l.max.x, Math.max(l.min.x, Math.round(l.from.x + o.clientX - l.x))), h = Math.min(l.max.y, Math.max(l.min.y, Math.round(l.from.y + o.clientY - l.y)));
    Kt = { x: c, y: h }, dn();
  };
  if (!u)
    for (const o of [k, Sn])
      f.listen(o, "pointerdown", (l) => Jn(l, o)), f.listen(o, "pointermove", eo), f.listen(o, "pointerup", Qn), f.listen(o, "pointercancel", Qn);
  let pn = Number.NaN, pe = -1, to = -1;
  function mn() {
    if (g) return;
    (d.clientWidth !== pe || d.clientHeight !== to) && (pe = d.clientWidth, to = d.clientHeight, xt = null, Kt = { x: 0, y: 0 }, dn());
    const o = ds({ width: d.clientWidth, height: d.clientHeight, frame: r.frame });
    le(d, "data-p95-layout", o.compact ? "compact" : "regular"), $e(o.compact);
    const l = a.clientWidth * window.devicePixelRatio >= a.width;
    a.style.imageRendering = l ? "pixelated" : "";
    const c = a.clientWidth / a.width, h = a.clientHeight / a.height, v = h > 0 ? c / h : 1;
    v !== pn && (pn = v, i.setDisplayAspectCompensation(v));
  }
  mn();
  const hn = new ResizeObserver(mn);
  hn.observe(d), hn.observe(a), f.listen(window, "resize", mn), f.add(() => {
    hn.disconnect(), a.style.imageRendering = "", i.setDisplayAspectCompensation(1);
  }), f.add(e.onModeStateChange(() => {
    Pe.refresh(), p.schedule();
  })), f.add(e.onRecordingStateChange(() => p.schedule())), f.add(e.onRecordingCountdownChange(() => p.schedule())), f.add(e.onSeedChange(() => p.schedule())), f.add(e.onHistoryChange(() => p.schedule()));
  let no = !1;
  f.add(e.onViewChange(() => {
    bn(), e.getViewZoom() > 1 !== no && p.schedule();
  }));
  const In = /* @__PURE__ */ new Map();
  let Dt = "";
  function Bn() {
    const o = `${a.width}x${a.height}`;
    if (o === Dt) return;
    const l = Dt !== "";
    Dt = o, mn();
    let c = In.get(o);
    c || (c = Fi(a.width, a.height).catch(() => !1), In.set(o, c)), l && p.get().recordingSupported && p.set({ recordingSupported: !1 }), c.then((h) => {
      !g && Dt === o && p.get().recordingSupported !== h && p.set({ recordingSupported: h });
    });
  }
  Bn();
  let ct = null;
  function xo(o) {
    if (ct?.cancel(), ct = null, typeof a.animate != "function" || typeof window.matchMedia == "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const l = a.getBoundingClientRect();
    if (!l.width || !l.height) return;
    const c = o.left - l.left, h = o.top - l.top, v = o.width / l.width, S = o.height / l.height;
    _e.classList.add("p95-zooming");
    const M = a.animate(
      [{ transform: `translate(${c}px, ${h}px) scale(${v}, ${S})` }, { transform: "none" }],
      { duration: _s, easing: "cubic-bezier(0.2, 0, 0, 1)" }
    );
    ct = M;
    const z = () => {
      ct === M && (ct = null), _e.classList.remove("p95-zooming");
    };
    M.onfinish = z, M.oncancel = z;
  }
  f.add(() => ct?.cancel());
  const ze = /* @__PURE__ */ new Map();
  function kn(o, l) {
    const c = ql(e), h = ps(l, c);
    ze.get(o) !== h && (ze.set(o, h), o.innerHTML = ms(l, c));
  }
  function gn(o, l) {
    ze.get(o) !== l && (ze.set(o, l), o.innerHTML = hs(l));
  }
  let Un = null, zn = null, oo = null, On = null;
  const ut = /* @__PURE__ */ new Map();
  let vn = 0, Zt = null;
  const ro = { solid1: 0, solid2: 1, solid3: 2 };
  function jt(o) {
    const l = ro[o];
    return l === void 0 ? "" : `rgb(${e.getParams().palette.colors[l].map((c) => Math.round(c * 255)).join(",")})`;
  }
  function ao(o) {
    const l = e.renderPaintSamples(fo, Math.round(e.getSimSize().height * ys));
    if (l && (On = o, vn++, typeof ImageData == "function"))
      for (const c of l) {
        const h = new ImageData(c.data, c.width, c.height);
        ut.set(c.mode, h);
        const v = qe.get(c.mode);
        v && (v.sample === void 0 && (v.sample = zr("p95-swatch-sample"), v.sample && v.btn.appendChild(v.sample.canvas)), v.sample && Or(v.sample, h));
      }
  }
  function Eo() {
    const o = e.getSeed();
    if (o !== oo) {
      oo = o, ut.clear(), vn++;
      for (const [X, { fill: te }] of qe) te.style.background = jt(X);
    }
    o !== On && ao(o);
    for (const [X, { btn: te, fill: J, sample: me }] of qe) {
      const ie = !!me && ut.has(X);
      ue(J, ie), me && ue(me.canvas, !ie), le(te, "aria-pressed", String(Er(e, X))), le(te, "aria-disabled", Do(e, { type: "paint", id: X }) ? null : "true");
    }
    const l = fo.find((X) => Er(e, X)) ?? null, { panMode: c, ctrlHeld: h } = p.get(), v = [];
    e.getFreezeLevel() > 0 && v.push("pause"), (c || h) && v.push("pan");
    const S = v.length ? v : El(e);
    if (le(tt, "data-current-paint", l), le(tt, "data-current-tool", S.length ? S.join(" ") : null), le(Fe, "data-count", S.length ? String(S.length) : null), ue(Fe, !S.length), Yn.forEach((X, te) => {
      const J = S[te];
      ue(X, !J), J === "pan" ? gn(X, "pan") : J === "pause" ? kn(X, "pause") : J && kn(X, Rr(e, J));
    }), Zt && Zt.paint === l && Zt.version === vn) return;
    Zt = { paint: l, version: vn };
    const M = l ? ut.get(l) : void 0;
    M && Be === void 0 && (Be = zr("p95-current-sample"), Be && tt.appendChild(Be.canvas)), M && Be && Or(Be, M);
    const z = !!M && !!Be;
    ue(Ht, z), Be && ue(Be.canvas, !z), Ht.style.background = l ? jt(l) : "";
  }
  function bn() {
    un();
    const o = e.getViewZoom(), l = e.getViewCenter();
    for (const { axis: c, bar: h, thumb: v } of ae) {
      Ms(h, "p95-inactive", o <= 1);
      const S = ts(c, o, c === "x" ? l.x : l.y);
      Jt(v, "--p95-thumb-pos", S.pos.toFixed(3)), Jt(v, "--p95-thumb-size", S.size.toFixed(3));
    }
    ue(ge, o <= 1);
  }
  function wn() {
    Jt(H, "--p95-size-f", Ga(i.getBrushSizeOptions(), i.getBrushSize()).toFixed(3));
  }
  function s() {
    if (g) return;
    Bn();
    const o = p.get(), l = e.getRecordingStatus();
    o.fullView && (Pt = null), bn(), le(d, "data-p95-theme", o.theme);
    const c = o.fullView ? "full" : "window";
    let h = null;
    c !== Un && (h = Un !== null ? a.getBoundingClientRect() : null, Un = c, d.setAttribute("data-p95-view", c)), dn(), h && (xo(h), r.onViewChange?.(c));
    const v = Lr(e.getSeed());
    U.textContent !== v && (U.textContent = v, r.onTitle?.(v)), ue(fe, !t), le(fe, "aria-disabled", it ? "true" : null), le(fe, "data-help", it ? Br : null), ue($.export.wrapper, t);
    const S = E.get("record"), M = $.export.btn;
    if (l === "idle") Ie = "";
    else if (!Ie) {
      const ie = M.getBoundingClientRect().width;
      ie > 0 && (Ie = `${ie}px`);
    }
    Jt(M, "--p95-export-w", Ie || "auto"), le(M, "data-recording", l === "idle" ? null : ""), zt(S.label, l === "idle" ? Ot.record.name : "Stop"), zt($.export.label, l === "idle" ? "Export" : "Stop"), le(M, "aria-disabled", l === "finishing" ? "true" : null);
    const z = e.getRecordingCountdown();
    ue(De, !z), zt(De, z ? String(z.seconds) : ""), le(De, "data-pulse", z?.pulse ? "" : null), le(S.btn, "title", o.recordingSupported ? Vn({ type: "command", id: "record" }) : Dr), le(S.btn, "data-help", o.recordingSupported ? Ot.record.help : Dr);
    for (const [ie, { btn: ft }] of E)
      le(ft, "aria-disabled", Lt({ type: "command", id: ie }) ? null : "true");
    le(E.get("bloom").btn, "aria-checked", String(e.getBloomEnabled())), le(E.get("warp").btn, "aria-checked", String(e.getWarpFx()));
    for (const { theme: ie, btn: ft } of W) le(ft, "aria-checked", String(o.theme === ie));
    for (const ie of Object.keys($))
      ue($[ie].panel, o.openMenu !== ie), le($[ie].btn, "aria-expanded", String(o.openMenu === ie));
    for (const [ie, ft] of oe)
      le(ft, "aria-pressed", String(Jo(e, ie))), le(ft, "aria-disabled", Do(e, { type: "tool", id: ie }) ? null : "true"), kn(ft, Rr(e, ie));
    le(H, "aria-disabled", Sr(e) ? null : "true"), le(H, "data-shape", e.getBrushShape()), wn(), le(we, "aria-pressed", String(o.panMode || o.ctrlHeld)), gn(we, "pan"), Pe.setPanMode(o.panMode), no = e.getViewZoom() > 1, gn(ge, "zoomFit"), Eo();
    const X = o.openDialog !== zn ? o.openDialog : null, te = zn === "mint" && o.openDialog !== "mint";
    zn = o.openDialog, X && Ue[X].onOpen?.();
    const J = xe();
    for (const ie of Object.keys(Ue)) ue(Ue[ie].overlay, o.openDialog !== ie);
    le(T, "inert", o.openDialog ? "" : null);
    for (const ie of Mn) ue(ie, !o.isAdmin);
    X && Ue[X].okBtn?.focus(), X === "newSeed" && vt.focus(), o.openDialog === "mint" && (X === "mint" || J) && Fn()?.focus(), te && (r.onMintClose?.(), be.phase === "leaving" && r.onMintDone?.()), Ye && (o.fullView || Rs(Ye)) && (Ye = null), zt(ht, Ye?.getAttribute("data-help") || gs);
    const me = Wr(e.getParams());
    zt(kt, me === "None" ? "" : `Error: ${me}`);
  }
  return s(), {
    destroy() {
      g || (g = !0, p.cancel(), f.run(), st && st.insertBefore(a, At && At.parentNode === st ? At : null), d.remove());
    },
    setAdmin(o) {
      g || p.set({ isAdmin: o });
    },
    setTheme(o) {
      g || p.set({ theme: o });
    },
    showUi() {
      g || p.set({ fullView: !1 });
    },
    showFullView() {
      g || p.set({ fullView: !0, openMenu: null });
    },
    setKeysEnabled(o) {
      jn = o;
    },
    setMint(o) {
      g || !t || (be = o, p.set({ openDialog: "mint", openMenu: null }));
    },
    closeMint() {
      if (g || p.get().openDialog !== "mint") return;
      const o = be;
      o.phase !== "done" && o.phase !== "leaving" || (be = { ...o, phase: "leaving" }, p.set({ openDialog: null }));
    },
    setMintClaimed(o) {
      if (g || p.get().openDialog !== "mint") return;
      const l = be;
      l.phase !== "done" && l.phase !== "leaving" || !!l.claimed !== o && (be = { ...l, claimed: o }, p.schedule());
    },
    setMintDisabled(o) {
      g || !t || (it = o, p.schedule());
    }
  };
}
const Cs = "W95FA";
function Fs(e) {
  return `@font-face {
  font-family: '${Cs}';
  src: url('${e}') format('woff2');
  size-adjust: 145.4545%;
}`;
}
export {
  As as createEngine,
  Ls as mountPaintUi,
  Fs as paintFontFaceRule,
  Vr as randomUserSeed
};
