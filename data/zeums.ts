// Generated from EV3's zeums listings and the works' on-chain originals (SCOTT-994).
// Full-size media is served from the project's Vercel Blob store; HTML pieces are vendored under public/pieces.

export type ZeumsKind = "image" | "video" | "html";

export interface ZeumsItem {
  id: string;
  title: string;
  kind: ZeumsKind;
  /** Blob URL for images and videos; a /pieces/... path for HTML. */
  src: string;
  /** Videos only: Blob URL of a smaller re-encoded copy, played by default (Full Res plays src). */
  display?: string;
  thumb: string;
  /** remember.exe only: the piece's baked memory text, its exact seed. */
  seed?: string;
}

export interface ZeumsWindow {
  title: string;
  about: string[];
  size: { w: number; h: number };
  position: { x: number; y: number };
  items: ZeumsItem[];
}

export const REMEMBER_ENGINE = "/pieces/remember/index.html";

/** The engine reads its seed from ?hash=; with none it falls back to a random seed. */
export const rememberSrc = (seed: string) =>
  seed ? `${REMEMBER_ENGINE}?hash=${encodeURIComponent(seed)}` : REMEMBER_ENGINE;

export const ZEUMS = {
  CEASEFIRE: {
    title: "CEASEFIRE",
    about: [
      "A collaborative piece formed from conversations between EV3 and Celestial Body.",
      "It pays homage to the photography of Samar Abu Elouf and the poetry of Refaat Alareer, woven with original poetry, settler map data and repeated glitch and distortion work.",
      "All proceeds went to Islamic Relief USA and the Palestine Children's Relief Fund.",
    ],
    size: { w: 960, h: 600 },
    position: { x: 150, y: 30 },
    items: [
      { id: "ceasefire", title: "CEASEFIRE", kind: "video", src: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/ceasefire/CI_vFQErs62V5PEifCmIEAfdiZfFfmiWK-38tQxwYEc.mp4", display: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/ceasefire/display/CI_vFQErs62V5PEifCmIEAfdiZfFfmiWK-38tQxwYEc.mp4", thumb: "/images/thumbs/ceasefire-ceasefire.jpg" },
    ],
  },
  REMEMBER: {
    title: "remember.exe",
    about: [
      "Interactive glitch artwork generated from real memories: friends and community members wrote down personal memories, and each one seeds the remember algorithm, locking it to its own output.",
      "Press c, f, g or r to toggle clear, feedback, glitch loop and reverse, s to save a screen capture, left/right to cycle sister remembrances and up/down to change the pixel size.",
      "Use Seed to render any memory of your own.",
    ],
    size: { w: 800, h: 800 },
    position: { x: 175, y: 45 },
    items: [
      { id: "nineteen-and-tripping", title: "Nineteen and tripping", kind: "html", src: REMEMBER_ENGINE, thumb: "/images/thumbs/remember-nineteen-and-tripping.jpg", seed: "Nineteen and tripping,\nWalking through a grass field.\nFeeling as if my footsteps were those of a giant smashing the earth.\nLaying down and seeing new constellations form before my eyes" },
      { id: "lost-and-praying", title: "Lost and praying", kind: "html", src: REMEMBER_ENGINE, thumb: "/images/thumbs/remember-lost-and-praying.jpg", seed: "Lost and praying on my knees,\nAlone in my room.\nI had a vision of angles touching me,\nAnd I wept." },
      { id: "crashing-waves", title: "Crashing waves", kind: "html", src: REMEMBER_ENGINE, thumb: "/images/thumbs/remember-crashing-waves.jpg", seed: "Crashing waves filled my vision.\nNext I woke up in a hospital, parents by my side.\nI got a Luke Skywalker action figure.\nMy dad and I watched the fourth of July fireworks from the hospital bed." },
      { id: "the-ice-cream-was-melting", title: "The ice cream was melting", kind: "html", src: REMEMBER_ENGINE, thumb: "/images/thumbs/remember-the-ice-cream-was-melting.jpg", seed: "The ice cream was melting in my hands. Impatiently, I glance to see if he was looking and  rapidly press the cross button a number of times. BOOM! Infront of us one car slams into another at the newly changed red light. At this time I do not yet understand the difference between correlation and causation." },
      { id: "ask-a-group-of-strangers", title: "Ask a group of strangers", kind: "html", src: REMEMBER_ENGINE, thumb: "/images/thumbs/remember-ask-a-group-of-strangers.jpg", seed: "Ask a group of strangers for a lighter at a rave. He hands me one with a lion on it. Says it's like Aslan from Narnia. \"Like Gnarnia the festival?\" \"Yeah! We're going! Come with us!\" 48 hours later we are together at a location over 700 miles from where we initially met." },
      { id: "i-sheepishly-enter", title: "I sheepishly enter", kind: "html", src: REMEMBER_ENGINE, thumb: "/images/thumbs/remember-i-sheepishly-enter.jpg", seed: "I sheepishly enter the establishment - it is large and bright as are many things in Las Vegas. I stand on one of the dining booths and bellow,  \"Ladies and Gentlemen I hope you are having a wonderful evening - I have just one question for you, What the fuck is up Denny's?\" I exit followed by many confused glances  and the roaring laughter of my bandmates." },
      { id: "north-bergen-waiting-for-a-train", title: "North Bergen waiting for a train", kind: "html", src: REMEMBER_ENGINE, thumb: "/images/thumbs/remember-north-bergen-waiting-for-a-train.jpg", seed: "North Bergen waiting for a train back south to take care of dying mother, hear drums in distance and follow ears to find Indigenous Peruvians of all ages rehearsing for parade performance the next day. they see me enjoying and a few encourage me to join. we dance" },
      { id: "slowly-dancing", title: "slowly dancing", kind: "html", src: REMEMBER_ENGINE, thumb: "/images/thumbs/remember-slowly-dancing.jpg", seed: "slowly dancing my barely 12 month old nibbling around the kitchen island at my sister's house singing \"Walking the Cow\" by Daniel Johnston with him facing out and nestled just below my shoulder as usual, until he pops his head up and says, \"sheep\" before I can sing, \"cow\" then starts laughing and manages to rage against the dying of the light a little longer and hear me sing most of the song again" },
      { id: "hitching-with-b", title: "hitching with B.", kind: "html", src: REMEMBER_ENGINE, thumb: "/images/thumbs/remember-hitching-with-b.jpg", seed: "hitching with B. to see Russian Tsarlag at the Imaginerium, making costumes from textile factory dumpster and sleeping in the small attic, blacklit and carpeted ceiling to floor in bright stuffed animal pelts" },
      { id: "smoke-moves", title: "smoke moves", kind: "html", src: REMEMBER_ENGINE, thumb: "/images/thumbs/remember-smoke-moves.jpg", seed: "smoke moves" },
      { id: "ash-stays", title: "ash stays", kind: "html", src: REMEMBER_ENGINE, thumb: "/images/thumbs/remember-ash-stays.jpg", seed: "ash stays" },
      { id: "walking-around-the-harbor", title: "Walking around the harbor", kind: "html", src: REMEMBER_ENGINE, thumb: "/images/thumbs/remember-walking-around-the-harbor.jpg", seed: "Walking around the harbor, smiling at a beautiful girl.Innocent times, raw emotions,and the thrill of the promise of the very first kiss." },
      { id: "congolese-jail-the-air-is-th", title: "Congolese jail. The air is th…", kind: "html", src: REMEMBER_ENGINE, thumb: "/images/thumbs/remember-congolese-jail-the-air-is-th.jpg", seed: "Congolese jail.\nThe air is thick—sweltering, suffocating. The air in the cell is unbreathable.\nThe soldiers are sweating through their uniforms, silent and still.\nThe interrogation has just ended. A heavy silence hangs in the room.\n“What are your last words, sir?”\nHe squints, bewildered.\n“What do you mean?”\n“Let’s pretend you’re about to be executed. What would you say before the end?”" },
      { id: "grandma-dale", title: "Grandma Dale", kind: "html", src: REMEMBER_ENGINE, thumb: "/images/thumbs/remember-grandma-dale.jpg", seed: "Grandma Dale" },
      { id: "last-show-with-the-band", title: "Last show with the band", kind: "html", src: REMEMBER_ENGINE, thumb: "/images/thumbs/remember-last-show-with-the-band.jpg", seed: "Last show with the band,\nOur van breaks down.\nSmoking cigarettes,\nListening to our drummer flirt with the roadside assistance dispatcher." },
      { id: "her-eyes", title: "Her eyes", kind: "html", src: REMEMBER_ENGINE, thumb: "/images/thumbs/remember-her-eyes.jpg", seed: "Her eyes.\nMy first memory of her.\nIntense green eyes, burning through a sun-kissed face dusted with freckles, and piercing straight into your soul.\nHer skin tasting like sand and the warmth of a summer evening." },
      { id: "stuck-at-an-italian-winery", title: "Stuck at an Italian winery", kind: "html", src: REMEMBER_ENGINE, thumb: "/images/thumbs/remember-stuck-at-an-italian-winery.jpg", seed: "Stuck at an Italian winery with friends and my future lover.\nA taxi finally comes.\nI am drunkenly singing with her all the way back into town." },
      { id: "oblivion", title: "Oblivion", kind: "html", src: REMEMBER_ENGINE, thumb: "/images/thumbs/remember-oblivion.jpg", seed: "Oblivion.\nEach day, my dad's mind drifts further away,\nlike ink dissolving in water - silently, without a trace.\nA stranger slowly takes his place,\nmimicking his voice, borrowing his face.\nBut even now, behind the fog and fading light,\nI can still read love in his eyes - soft, flickering,\nlike the final glow of a fire before the night." },
      { id: "every-time-we-visited-him", title: "Every time we visited him", kind: "html", src: REMEMBER_ENGINE, thumb: "/images/thumbs/remember-every-time-we-visited-him.jpg", seed: "Every time we visited him, Striko (a sweet, slightly old-fashioned word from our language that we used for our unmarried, mathematics professor uncle) would lift me onto his shoulders like I was the crown of his kingdom. Among orchids and odd succulents in his winter garden, he whispered flower names like secrets. I was the only girl. His favorite niece. I felt ten feet tall." },
      { id: "summer-evening-on-the-balcony", title: "Summer evening on the balcony", kind: "html", src: REMEMBER_ENGINE, thumb: "/images/thumbs/remember-summer-evening-on-the-balcony.jpg", seed: "Summer evening on the balcony. Arabela - a Czechoslovakian children’s TV show, a surreal fantasy series where fairy tale characters like witches and kings crossed into the real world through a magical telephone - flickered on the screen. Magic bled into the warm air.\nA witch’s hand, long and snakelike, stretched toward me just like in the show. I screamed, then blamed a bug. I didn’t dare admit it was my already vivid imagination playing tricks on me." },
      { id: "when-i-was-around-three", title: "When I was around three", kind: "html", src: REMEMBER_ENGINE, thumb: "/images/thumbs/remember-when-i-was-around-three.jpg", seed: "When I was around three, I remember the kitchen table being a mysterious altar above my eyeline. I stood there, small and frustrated, the smells of bread and grown-up laughter out of reach. I was completely aware of my surroundings - and the fact that I was just small and helpless. I hated it." },
    ],
  },
  SEASONS: {
    title: "s34s0ns",
    about: [
      "A series of landscape photos taken over a year, \"glitched\" and transformed with a custom coded program.",
    ],
    size: { w: 800, h: 700 },
    position: { x: 200, y: 60 },
    items: [
      { id: "4pr04ch-0f-spr1ng", title: "4pr04ch 0f spr1ng", kind: "image", src: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/seasons/spring-ps.png", thumb: "/images/thumbs/seasons-4pr04ch-0f-spr1ng.jpg" },
      { id: "pr0m1s3-0f-s9mm3r", title: "pr0m1s3 0f s9mm3r", kind: "image", src: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/seasons/summer-ps.png", thumb: "/images/thumbs/seasons-pr0m1s3-0f-s9mm3r.jpg" },
      { id: "r3p0s3-0f-f4ll", title: "r3p0s3 0f f4ll", kind: "image", src: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/seasons/fall-ps.png", thumb: "/images/thumbs/seasons-r3p0s3-0f-f4ll.jpg" },
      { id: "dr34m-0f-w1nt3r", title: "dr34m 0f w1nt3r", kind: "image", src: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/seasons/winter-ps.png", thumb: "/images/thumbs/seasons-dr34m-0f-w1nt3r.jpg" },
    ],
  },
  ISAAC: {
    title: "Exaltation of Isaac",
    about: [
      "Completed during the Primavera Digitale residency and exhibited in Florence, Italy.",
      "It explores two interpretations of the biblical sacrifice of Isaac, one cynical and one inspiring, each exalting him as a willing sacrifice and foreshadowing Christ.",
      "Made with GLSL shaders and TouchDesigner from \"The Sacrifice of Isaac\" by Valdés Leal.",
    ],
    size: { w: 960, h: 600 },
    position: { x: 225, y: 75 },
    items: [
      { id: "exaltation-of-isaac", title: "Exaltation of Isaac", kind: "video", src: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/isaac/KJzBUMvw4-1wwvmTaxRaJiMh0itQ37Dd7OTM7IScNlY.mp4", display: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/isaac/display/KJzBUMvw4-1wwvmTaxRaJiMh0itQ37Dd7OTM7IScNlY.mp4", thumb: "/images/thumbs/isaac-exaltation-of-isaac.jpg" },
    ],
  },
  PROGRESS: {
    title: "\"Progress\"",
    about: [
      "Blocks try to maintain order by erasing the color, all the while experiencing entropy themselves.",
      "Click or tap to introduce more color, and press \"n\" or swipe across the screen to start over.",
    ],
    size: { w: 700, h: 700 },
    position: { x: 250, y: 90 },
    items: [
      { id: "progress", title: "\"Progress\"", kind: "html", src: "/pieces/progress/index.html", thumb: "/images/thumbs/progress-progress.jpg" },
    ],
  },
  SINGLEPATH: {
    title: "A Single Path",
    about: [
      "\"How many stories can you tell with a single line?\"",
      "A code art study on detail and constrained composition, made entirely with code.",
    ],
    size: { w: 800, h: 800 },
    position: { x: 275, y: 105 },
    items: [
      { id: "path-ten", title: "Path Ten", kind: "image", src: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/singlepath/WJQ7Pfwmyekbrj_VZNxC_5x8-xF-efFn4ko5vz0kWG8.png", thumb: "/images/thumbs/singlepath-path-ten.jpg" },
      { id: "path-one", title: "Path One", kind: "image", src: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/singlepath/0RtHBrCjRH4k6dvEj4bNgZCz40HYlkK9b8I8MREr1rI.png", thumb: "/images/thumbs/singlepath-path-one.jpg" },
      { id: "path-eleven", title: "Path Eleven", kind: "image", src: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/singlepath/XwZygT6t0Q9F-3vSx_RqRPyoZAr8t16Hc5-4NleMRKI.png", thumb: "/images/thumbs/singlepath-path-eleven.jpg" },
      { id: "path-two", title: "Path Two", kind: "image", src: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/singlepath/jm0Z-oT4i9Ke5nzael4ocYGdZeBSO_Mdpr1BWCNPPV8.png", thumb: "/images/thumbs/singlepath-path-two.jpg" },
      { id: "path-nine", title: "Path Nine", kind: "image", src: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/singlepath/pwmTL4zu_D-vLjiB1KfC-_HLlHmezgdRpmc4up-ZhQA.png", thumb: "/images/thumbs/singlepath-path-nine.jpg" },
      { id: "path-three", title: "Path Three", kind: "image", src: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/singlepath/veo9uCqZ7QZ-PtGsT4ooZSZm7FPHgpyciM1jVjNSz6U.png", thumb: "/images/thumbs/singlepath-path-three.jpg" },
      { id: "path-thirteen", title: "Path Thirteen", kind: "image", src: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/singlepath/stMcYp5xwzpJ-Rx5JuRvLBKCaB_6A0EH5Wjp-vOQ_8k.png", thumb: "/images/thumbs/singlepath-path-thirteen.jpg" },
      { id: "path-fifteen", title: "Path Fifteen", kind: "image", src: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/singlepath/s0Jm0nO2m7NjAIgp2rvabj5UbHVDlN__8CCXERtxryo.png", thumb: "/images/thumbs/singlepath-path-fifteen.jpg" },
      { id: "path-four", title: "Path Four", kind: "image", src: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/singlepath/rVBjh95W4fvN8LVnGtEz1d1r-oAgYfXHxQ_pCQrKdiI.png", thumb: "/images/thumbs/singlepath-path-four.jpg" },
      { id: "path-five", title: "Path Five", kind: "image", src: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/singlepath/aGkrjaaGGBZOj-SiITj-DIc31BJOryJSo7GusxCowGw.png", thumb: "/images/thumbs/singlepath-path-five.jpg" },
      { id: "path-fourteen", title: "Path Fourteen", kind: "image", src: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/singlepath/d2x3sLtTNVDpmRndpBLC0pcH3SCljyeQNZhmWzkey5w.png", thumb: "/images/thumbs/singlepath-path-fourteen.jpg" },
      { id: "path-twelve", title: "Path Twelve", kind: "image", src: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/singlepath/eV8Q6RhZJuRC2itdQiHvejj6OY0MnIj1s_mCFdRhcQQ.png", thumb: "/images/thumbs/singlepath-path-twelve.jpg" },
      { id: "path-seven", title: "Path Seven", kind: "image", src: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/singlepath/i7LpeGEq1Hoq1y-7_smuodc0VZAMrKY8BgRB5m9MDyE.png", thumb: "/images/thumbs/singlepath-path-seven.jpg" },
      { id: "path-sixteen", title: "Path Sixteen", kind: "image", src: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/singlepath/9eKwtBN1JKerSxUlis3bxOxhytF8pDQFmatWfGXh2EA.png", thumb: "/images/thumbs/singlepath-path-sixteen.jpg" },
    ],
  },
  TERRA: {
    title: "T3RRA",
    about: [
      "Images and videos made with custom trained and modified GAN models, a precursor of text-to-image generators like Midjourney.",
      "One model learned textures such as stone, wood and fabric, another surreal and abstract art; the two were meshed together, and thousands of their images were curated into this collection.",
    ],
    size: { w: 800, h: 800 },
    position: { x: 300, y: 120 },
    items: [
      { id: "eden", title: "Eden", kind: "video", src: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/terra/kW0u88yNNed_hMf-F2lwsIf3ktbMzudJmnKNnwPEWNQ.mp4", display: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/terra/display/kW0u88yNNed_hMf-F2lwsIf3ktbMzudJmnKNnwPEWNQ.mp4", thumb: "/images/thumbs/terra-eden.jpg" },
      { id: "t3rra-13", title: "T3RRA-13", kind: "image", src: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/terra/akG_AfMWN3GBj7G83MwVB18EsM2bh3cJ9LizaZZckxA.png", thumb: "/images/thumbs/terra-t3rra-13.jpg" },
      { id: "t3rra-5", title: "T3RRA-5", kind: "image", src: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/terra/jUMCdTLyrA2dxUChfYFfAHU9yPBfhdPgCWS7OpBZIXE.png", thumb: "/images/thumbs/terra-t3rra-5.jpg" },
      { id: "t3rra-16", title: "T3RRA-16", kind: "image", src: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/terra/NasOrOSz8F-pB6YeKzTDC-j3rwmflZx9MWxBaqZ39e0.png", thumb: "/images/thumbs/terra-t3rra-16.jpg" },
      { id: "t3rra-1", title: "T3RRA-1", kind: "image", src: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/terra/qteOYNbBlVPBFNdJSq7TytqFRCIoC-DzqQqRuTW5Jfo.png", thumb: "/images/thumbs/terra-t3rra-1.jpg" },
      { id: "t3rra-14", title: "T3RRA-14", kind: "image", src: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/terra/mnxTSHZdmDWtCzCkWF5hH7gESTyvuo7MBuejGOAd2vQ.png", thumb: "/images/thumbs/terra-t3rra-14.jpg" },
      { id: "ararat", title: "Ararat", kind: "video", src: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/terra/31K8R_pEflkIEefD4MZd93PGKUT-d_FJNYnyp2ppxZE.mp4", thumb: "/images/thumbs/terra-ararat.jpg" },
      { id: "t3rra-7", title: "T3RRA-7", kind: "image", src: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/terra/kNS9lmHTRslb4SfOa5m7-87kSiXYcG1DSbT7jHWHQpk.png", thumb: "/images/thumbs/terra-t3rra-7.jpg" },
      { id: "t3rra-10", title: "T3RRA-10", kind: "image", src: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/terra/QB6AxlkjPZ42g6EGHmryBPqdldrwtVkuTFCCGMnc1xk.png", thumb: "/images/thumbs/terra-t3rra-10.jpg" },
      { id: "t3rra-4", title: "T3RRA-4", kind: "image", src: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/terra/1CHR7kQZj7f5CiMYM1jrqXXDgGOH-Qvuaq339cIrzmU.png", thumb: "/images/thumbs/terra-t3rra-4.jpg" },
      { id: "t3rra-8", title: "T3RRA-8", kind: "image", src: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/terra/MJd5AMkh0bO-q8DTZ1JiaDxVsDr8-zV2ARV7A3h0ULw.png", thumb: "/images/thumbs/terra-t3rra-8.jpg" },
      { id: "t3rra-19", title: "T3RRA-19", kind: "image", src: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/terra/KYKJ8rXyZHjFJTsavFqD12OlWiskYo6djrLRrXvinck.png", thumb: "/images/thumbs/terra-t3rra-19.jpg" },
      { id: "babylon", title: "Babylon", kind: "video", src: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/terra/Mo-adtl3uM16vunvAmbLEnLJ6EpaArjAvfRM9NdyQsI.mp4", thumb: "/images/thumbs/terra-babylon.jpg" },
      { id: "t3rra-3", title: "T3RRA-3", kind: "image", src: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/terra/oHrD9dQnspYR7oe2JR_SKNhcED4ALHiEqMgEYwqQUKo.png", thumb: "/images/thumbs/terra-t3rra-3.jpg" },
      { id: "t3rra-15", title: "T3RRA-15", kind: "image", src: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/terra/MyxkUxSlZYqjBAT5fmry6hEchJptSqfdLsoKuFy3YgE.png", thumb: "/images/thumbs/terra-t3rra-15.jpg" },
      { id: "t3rra-17", title: "T3RRA-17", kind: "image", src: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/terra/wTK9Uqs0O2GjZauCBBhlqz5rzhti4FSVEY0jwRPVb2Y.png", thumb: "/images/thumbs/terra-t3rra-17.jpg" },
      { id: "t3rra-2", title: "T3RRA-2", kind: "image", src: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/terra/t42tAs00M_NhLwZS1sG9BoS3M2Mrdjb6ejvleALiniY.png", thumb: "/images/thumbs/terra-t3rra-2.jpg" },
      { id: "t3rra-11", title: "T3RRA-11", kind: "image", src: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/terra/9JFuQfTiSt6Om00ZXNsgzrHM2kTAjBk7qDqihdH2Mzw.png", thumb: "/images/thumbs/terra-t3rra-11.jpg" },
      { id: "t3rra-9", title: "T3RRA-9", kind: "image", src: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/terra/rafJTxmADFU_91GBHfQXkRw8bItwp30jOUjL_IO5e10.png", thumb: "/images/thumbs/terra-t3rra-9.jpg" },
      { id: "t3rra-6", title: "T3RRA-6", kind: "image", src: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/terra/e2OS3aQPgTWlNatAmOJ_FrorC-FWIXoaznzs31-rZ5Y.png", thumb: "/images/thumbs/terra-t3rra-6.jpg" },
      { id: "t3rra-12", title: "T3RRA-12", kind: "image", src: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/terra/rEUGIzgQoJmvFFZ2cbv_aGP-NPoqGnmnKBEhhV1HEwU.png", thumb: "/images/thumbs/terra-t3rra-12.jpg" },
      { id: "gomorrah", title: "Gomorrah", kind: "video", src: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/terra/3SX-Iqku7P1zhyGIH7CbMe1zFxvnyXd5sUKrSMRMMAY.mp4", thumb: "/images/thumbs/terra-gomorrah.jpg" },
      { id: "hebron", title: "Hebron", kind: "video", src: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/terra/zPjShxw1OHfI8jNnifoqBT1VnAhWDdVo-MSe40lC2CU.mp4", thumb: "/images/thumbs/terra-hebron.jpg" },
    ],
  },
  FLOWER: {
    title: "A Flower Blooms in Autumn",
    about: [
      "An original short composition, written, recorded, mixed and mastered in a home studio, paired with generative video.",
      "The visuals blend two StyleGAN2 models trained on abstract and surreal art, curated to each section of the music and finished with added textures, lighting and framing.",
    ],
    size: { w: 960, h: 600 },
    position: { x: 325, y: 135 },
    items: [
      { id: "a-flower-blooms-in-autumn", title: "A Flower Blooms in Autumn", kind: "video", src: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/flower/iZV_ZhClE2Q42A5zZtOHsQwb_ZirJBbqqn110N6H7uk.mp4", display: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/flower/display/iZV_ZhClE2Q42A5zZtOHsQwb_ZirJBbqqn110N6H7uk.mp4", thumb: "/images/thumbs/flower-a-flower-blooms-in-autumn.jpg" },
    ],
  },
  TUNEOUT: {
    title: "Tune Out",
    about: [
      "Original musical compositions looped and paired with GAN generated videos.",
      "The series marked the transition from musician to creative technologist.",
    ],
    size: { w: 960, h: 600 },
    position: { x: 350, y: 150 },
    items: [
      { id: "ch1-the-endless", title: "CH1 - The Endless", kind: "video", src: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/tuneout/CH1%20-%20The%20Endless.mp4", display: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/tuneout/display/CH1%20-%20The%20Endless.mp4", thumb: "/images/thumbs/tuneout-ch1-the-endless.jpg" },
      { id: "ch2-the-expanse", title: "CH2 - The Expanse", kind: "video", src: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/tuneout/CH2%20-%20The%20Expanse.mp4", display: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/tuneout/display/CH2%20-%20The%20Expanse.mp4", thumb: "/images/thumbs/tuneout-ch2-the-expanse.jpg" },
      { id: "ch3-the-serene", title: "CH3 - The Serene", kind: "video", src: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/tuneout/CH3%20-%20The%20Serene.mp4", display: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/tuneout/display/CH3%20-%20The%20Serene.mp4", thumb: "/images/thumbs/tuneout-ch3-the-serene.jpg" },
      { id: "ch4-the-disturbed", title: "CH4 - The Disturbed", kind: "video", src: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/tuneout/CH4%20-%20The%20Disturbed.mp4", display: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/tuneout/display/CH4%20-%20The%20Disturbed.mp4", thumb: "/images/thumbs/tuneout-ch4-the-disturbed.jpg" },
      { id: "ch5-the-traveler", title: "CH5 - The Traveler", kind: "video", src: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/tuneout/CH5%20-%20The%20Traveler.mp4", display: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/tuneout/display/CH5%20-%20The%20Traveler.mp4", thumb: "/images/thumbs/tuneout-ch5-the-traveler.jpg" },
      { id: "ch6-the-mystic", title: "CH6 - The Mystic", kind: "video", src: "https://k4xw43ajr4eh6re3.public.blob.vercel-storage.com/tuneout/CH6%20-%20The%20Mystic.mp4", thumb: "/images/thumbs/tuneout-ch6-the-mystic.jpg" },
    ],
  },
} satisfies Record<string, ZeumsWindow>;

export type ZeumsKey = keyof typeof ZEUMS;
