// Hero: a pixel German Shepherd that follows the pointer.
// The side view is a reference sprite used as a template: its silhouette and outline are kept pixel for pixel, and
// the inside is repainted with Hero's markings from photos (black saddle and muzzle, tan flanks and legs, cream
// chest, black-topped tail). The front and back views are drawn to match it.
// He turns to face where he is going: side-on for left and right (drawn facing left, flipped for right), front-on
// when the pointer is below him, and from behind when it is above. He trots to heel beside the pointer, slows as
// he arrives, stands wagging and panting, then lies down and sleeps if nothing happens. Moving the pointer wakes
// him with a "!" before he sets off. A click makes him hop.
// To review every frame: open dog-sheet.html.
(() => {
  // One character per pixel. O outline, in grey so it shows on a near-black page. K black, N grizzle, G ear lining, T golden tan, S shaded tan (far legs), L sand,
  // W cream, A eye, E nose, C chain collar.
  const INK = { O: "#5a5651", K: "#2b2725", N: "#55483f", G: "#8f7c6f", T: "#c8894a", S: "#8a5a2c", L: "#e6c690", W: "#f6ead0", A: "#0b0908", E: "#0b0908", C: "#cfd4db", P: "#e6788c", Z: "#f1eee8" };
  const STEP = [
    "........OO.......................................",
    ".OO....OOOO......................................",
    ".OOO...OKKOO.....................................",
    ".OKO...OGKKO.....................................",
    ".OGOO..OGGKOO....................................",
    ".OGGOO.OGKKKO....................................",
    ".OGGKOOKGKKKOO...................................",
    ".ONKKKKKKKKKKO...................................",
    ".ONNKKKKKKKKKO...................................",
    "..OTTTTKKKKKNO...................................",
    "..OTLTKTTTTTTTO..................................",
    "..OKKKAKTTTTTTO..................................",
    "..OKKKKTTTTTTTTO.................................",
    "..OKKKTLLTTTTTTO.................................",
    ".OOKKKKKKKKTTTTTOO...............................",
    "OOKKKKKKKKKTTTTTTCOOOOOO.........................",
    "OOKKOOOOKKKTTTTTCKKKKKKKOOOOOOOOOO...............",
    ".OOOO..OKKKTTTTCKKKKKKKKKKKKKKKKKOOOO............",
    ".......OLLLLTTCKKKKKKKKKKKKKKKKKKKKKOO...........",
    ".......OOWLLTCKKKKNNNNNKKKKKKKKKKKKKKOO..........",
    "........OWWLCTKKKKNNNNKKKKKKNNKKNKKKKKOO.........",
    "........OWWCLTKKKKKNNKKKKKNKNNKNKKKKKKKOOO.......",
    "........OWWLLTTTTTKNNKKKKKKNKKKKNNNKKKKKKOO......",
    "........OWWLLTTTTTTTNKKKKKNNNKKKKNTTTKLKKKOO.....",
    ".........OOWLLTTTTTTNTTTKTTTTKKKNKTTTTLOKKKOO....",
    "..........OOWLLTTTTTKTTTTTTTTNNKNKTTTTO.OKKKOO...",
    "...........OWWLLTTTTTTTTTLLLLTTTTTTTTTO.OKKKKKOOO",
    "............OOWLLTTTTLLLLOOOOTTTTTTTTTO..OTTTTKKO",
    ".............OOOLLTTTOOOOO..OTTTTTLLLLO...OOTTKO.",
    "...............OWWLLLO......OLLLLLLLLLO.....OOO..",
    ".............OOWLLTOO........OTTTTTTTTTOO........",
    "............OLLTTTO...........OOTTTOOOTTTO.......",
    "..........OOLTTTTO..............OTTO..OTTO.......",
    ".........OTLTTOOLLO.............OTTO...OTTO......",
    ".........OLLOO..OLO.............OTO....OTTO......",
    ".........OLO....OLO............OLLO.....OLO......",
    ".........OLO....OLLO..........OLLO......OLLO.....",
    "........OOLO.....OLO.........OOLO........OLO.....",
    "........OLOO.....OLLO........OLO.........OLO.....",
    "........OOO.......OLO........OOO.........OLO.....",
    "........OO......OOOWO.........OO........OOLO.....",
    "................OLLOO..................OOLOO.....",
    "................OOOO...................OOOO......"];   // side: the template's own pose, mid-stride with a front paw lifted
  const PASS = [
    "........OO.......................................",
    ".OO....OOOO......................................",
    ".OOO...OKKOO.....................................",
    ".OKO...OGKKO.....................................",
    ".OGOO..OGGKOO....................................",
    ".OGGOO.OGKKKO....................................",
    ".OGGKOOKGKKKOO...................................",
    ".ONKKKKKKKKKKO...................................",
    ".ONNKKKKKKKKKO...................................",
    "..OTTTTKKKKKNO...................................",
    "..OTLTKTTTTTTTO..................................",
    "..OKKKAKTTTTTTO..................................",
    "..OKKKKTTTTTTTTO.................................",
    "..OKKKTLLTTTTTTO.................................",
    ".OOKKKKKKKKTTTTTOO...............................",
    "OOKKKKKKKKKTTTTTTCOOOOOO.........................",
    "OOKKOOOOKKKTTTTTCKKKKKKKOOOOOOOOOO...............",
    ".OOOO..OKKKTTTTCKKKKKKKKKKKKKKKKKOOOO............",
    ".......OLLLLTTCKKKKKKKKKKKKKKKKKKKKKOO...........",
    ".......OOWLLTCKKKKNNNNNKKKKKKKKKKKKKKOO..........",
    "........OWWLCTKKKKNNNNKKKKKKNNKKNKKKKKOO.........",
    "........OWWCLTKKKKKNNKKKKKNKNNKNKKKKKKKOOO.......",
    "........OWWLLTTTTTKNNKKKKKKNKKKKNNNKKKKKKOO......",
    "........OWWLLTTTTTTTNKKKKKNNNKKKKNTTTKLKKKOO.....",
    ".........OOWLLTTTTTTNTTTKTTTTKKKNKTTTTLOKKKOO....",
    "..........OOWLLTTTTTKTTTTTTTTNNKNKTTTTO.OKKKOO...",
    "...........OWWLLTTTTTTTTTLLLLTTTTTTTTTO.OKKKKKOOO",
    "............OOWLLTTTTLLLLOOOOTTTTTTTTTO..OTTTTKKO",
    ".............OOOLLTTTOOOOO..OTTTTTLLLLO...OOTTKO.",
    "..........OSSO.OTTO..........OTTO..OSSO.....OOO..",
    "..........OSSO.OTTO..........OTTO..OSSO..........",
    "..........OSSO.OTTO..........OTTO..OSSO..........",
    "..........OSSO.OTTO..........OTTO..OSSO..........",
    "...........OSO..OTO...........OTO...OSO..........",
    "...........OSO..OTO...........OTO...OSO..........",
    "...........OSO..OLO...........OLO...OSO..........",
    "...........OSO..OLO...........OLO...OSO..........",
    "...........OSO..OLO...........OLO...OSO..........",
    "..........OSSO..OLO...........OLO..OSSO..........",
    "..........OOOO.OWWO..........OWWO..OOOO..........",
    "...............OOOO..........OOOO................",
    ".................................................",
    "................................................."];   // side: the passing step, also his standing pose
  const LIE = [
    "........OO.......................................",
    ".OO....OOOO......................................",
    ".OOO...OKKOO.....................................",
    ".OKO...OGKKO.....................................",
    ".OGOO..OGGKOO....................................",
    ".OGGOO.OGKKKO....................................",
    ".OGGKOOKGKKKOO...................................",
    ".ONKKKKKKKKKKO...................................",
    ".ONNKKKKKKKKKO...................................",
    "..OTTTTKKKKKNO...................................",
    "..OTLTKTTTTTTTO..................................",
    "..OKKKAKTTTTTTO..................................",
    "..OKKKKTTTTTTTTO.................................",
    "..OKKKTLLTTTTTTO.................................",
    ".OOKKKKKKKKTTTTTOO...............................",
    "OOKKKKKKKKKTTTTTTCOOOOOO.........................",
    "OOKKOOOOKKKTTTTTCKKKKKKKOOOOOOOOOO...............",
    ".OOOO..OKKKTTTTCKKKKKKKKKKKKKKKKKOOOO............",
    ".......OLLLLTTCKKKKKKKKKKKKKKKKKKKKKOO...........",
    ".......OOWLLTCKKKKNNNNNKKKKKKKKKKKKKKOO..........",
    "........OWWLCTKKKKNNNNKKKKKKNNKKNKKKKKOO.........",
    "........OWWCLTKKKKKNNKKKKKNKNNKNKKKKKKKOOO.......",
    "........OWWLLTTTTTKNNKKKKKKNKKKKNNNKKKKKKOO......",
    "........OWWLLTTTTTTTNKKKKKNNNKKKKNTTTKLKKKOO.....",
    ".........OOWLLTTTTTTNTTTKTTTTKKKNKTTTTLOKKKOO....",
    "..........OOWLLTTTTTKTTTTTTTTNNKNKTTTTO.OKKKOO...",
    "...........OWWLLTTTTTTTTTLLLLTTTTTTTTTO.OKKKKKOOO",
    ".....OLLLLLOOOWLLTTTTLLLLOOOOTTTTTTTTTO..OTTTTKKO",
    "......OOOOOO.OOOOOOOOOOOOO..OOOOOOOOOOO...OOOOOO."];    // side: the body with no legs under it, paws out in front
  const FRONT = [[
    "..O...........O..",
    ".OKO.........OKO.",
    ".OKKO.......OKKO.",
    ".OKGKO.....OKGKO.",
    ".OKGGKOOOOOKGGKO.",
    ".OKGNKOKKKOKNGKO.",
    ".OKGGKKKKKKKGGKO.",
    ".OKKGKNKKKNKGKKO.",
    ".OKTKKKKNKKKKTKO.",
    ".OTLLTKKKKKTLLTO.",
    ".OTKKTTKKKTTKKTO.",
    "OTTKATTKKKTTAKTTO",
    "OTLTTTKKKKKTTTLTO",
    ".OTLTKKKNKKKTLTO.",
    ".OTTKKKKEKKKKTTO.",
    "..OTLKKKKKKKLTO..",
    "..OTLTKKKKKTLTO..",
    "..OCCCCCCCCCCCO..",
    ".OKKTLWWCWWLTKKO.",
    ".OKNTLWWWWWLTNKO.",
    ".OKKTLWLWLWLTKKO.",
    ".OKTTLLWWWLLTTKO.",
    ".OKTTLWWLWWLTTKO.",
    ".ONTTLLWWWLLTTNO.",
    ".OTTTLLWWWLLTTTO.",
    ".OTTTTLLWLLTTTTO.",
    ".OTLTTLLWLLTTLTO.",
    ".OTTTTLLLLLTTTTO.",
    ".OTTTTTLLLTTTTTO.",
    ".OTTTTSSSSSTTTTO.",
    ".OOTTOSSSSSOTTOO.",
    ".OOTTOOSSSOOTTOO.",
    ".OOTTOOOOOOOTTOO.",
    ".OOTTOO...OOTTOO.",
    ".OOTNOO...OONTOO.",
    ".OOTTOO...OOTTOO.",
    ".OOTLOO...OOLTOO.",
    ".OOLLOO...OOLLOO.",
    ".OOLLOO...OOLLOO.",
    ".OOLLOO...OOLLOO.",
    ".OOLLOO...OOLLOO.",
    ".OOWWOO...OOWWOO.",
    ".OOWWOO...OOWWOO.",
    "..OOOO.....OOOO.."], [
    "..O...........O..",
    ".OKO.........OKO.",
    ".OKKO.......OKKO.",
    ".OKGKO.....OKGKO.",
    ".OKGGKOOOOOKGGKO.",
    ".OKGNKOKKKOKNGKO.",
    ".OKGGKKKKKKKGGKO.",
    ".OKKGKNKKKNKGKKO.",
    ".OKTKKKKNKKKKTKO.",
    ".OTLLTKKKKKTLLTO.",
    ".OTKKTTKKKTTKKTO.",
    "OTTKATTKKKTTAKTTO",
    "OTLTTTKKKKKTTTLTO",
    ".OTLTKKKNKKKTLTO.",
    ".OTTKKKKEKKKKTTO.",
    "..OTLKKKKKKKLTO..",
    "..OTLTKKKKKTLTO..",
    "..OCCCCCCCCCCCO..",
    ".OKKTLWWCWWLTKKO.",
    ".OKNTLWWWWWLTNKO.",
    ".OKKTLWLWLWLTKKO.",
    ".OKTTLLWWWLLTTKO.",
    ".OKTTLWWLWWLTTKO.",
    ".ONTTLLWWWLLTTNO.",
    ".OTTTLLWWWLLTTTO.",
    ".OTTTTLLWLLTTTTO.",
    ".OTLTTLLWLLTTLTO.",
    ".OTTTTLLLLLTTTTO.",
    ".OTTTTTLLLTTTTTO.",
    ".OTTTTSSSSSTTTTO.",
    ".OOTTOSSSSSOTTOO.",
    ".OOTTOOSSSOOTTOO.",
    ".OOTTOOOOOOOTTOO.",
    ".OOTTOO...OOTTOO.",
    ".OOTNOO...OONTOO.",
    ".OOTTOO...OOTTOO.",
    ".OOLLOO...OOLTOO.",
    ".OOLLOO...OOLLOO.",
    ".OOWWOO...OOLLOO.",
    ".OOWWOO...OOLLOO.",
    "..OOOO....OOLLOO.",
    "..........OOWWOO.",
    "..........OOWWOO.",
    "...........OOOO.."], [
    "..O...........O..",
    ".OKO.........OKO.",
    ".OKKO.......OKKO.",
    ".OKGKO.....OKGKO.",
    ".OKGGKOOOOOKGGKO.",
    ".OKGNKOKKKOKNGKO.",
    ".OKGGKKKKKKKGGKO.",
    ".OKKGKNKKKNKGKKO.",
    ".OKTKKKKNKKKKTKO.",
    ".OTLLTKKKKKTLLTO.",
    ".OTKKTTKKKTTKKTO.",
    "OTTKATTKKKTTAKTTO",
    "OTLTTTKKKKKTTTLTO",
    ".OTLTKKKNKKKTLTO.",
    ".OTTKKKKEKKKKTTO.",
    "..OTLKKKKKKKLTO..",
    "..OTLTKKKKKTLTO..",
    "..OCCCCCCCCCCCO..",
    ".OKKTLWWCWWLTKKO.",
    ".OKNTLWWWWWLTNKO.",
    ".OKKTLWLWLWLTKKO.",
    ".OKTTLLWWWLLTTKO.",
    ".OKTTLWWLWWLTTKO.",
    ".ONTTLLWWWLLTTNO.",
    ".OTTTLLWWWLLTTTO.",
    ".OTTTTLLWLLTTTTO.",
    ".OTLTTLLWLLTTLTO.",
    ".OTTTTLLLLLTTTTO.",
    ".OTTTTTLLLTTTTTO.",
    ".OTTTTSSSSSTTTTO.",
    ".OOTTOSSSSSOTTOO.",
    ".OOTTOOSSSOOTTOO.",
    ".OOTTOOOOOOOTTOO.",
    ".OOTTOO...OOTTOO.",
    ".OOTNOO...OONTOO.",
    ".OOTTOO...OOTTOO.",
    ".OOTLOO...OOLLOO.",
    ".OOLLOO...OOLLOO.",
    ".OOLLOO...OOWWOO.",
    ".OOLLOO...OOWWOO.",
    ".OOLLOO....OOOO..",
    ".OOWWOO..........",
    ".OOWWOO..........",
    "..OOOO..........."]];  // facing you: standing, left paw up, right paw up
  const BACK = [[
    "..O...........O..",
    ".OKO.........OKO.",
    ".OKKO.......OKKO.",
    ".OKKKO.....OKKKO.",
    ".OKNKKOOOOOKKNKO.",
    ".OKKKKOTTTOKKKKO.",
    ".OKKKKTTTTTKKKKO.",
    ".OKNTTTTNTTTTNKO.",
    ".OKTTLTNNNTLTTKO.",
    ".OTTTTTNKNTTTTTO.",
    ".OTLTTNKKKNTTLTO.",
    "OTTTTTNKKKNTTTTTO",
    "OTLTTNKKKKKNTTLTO",
    ".OTTTNKKKKKNTTTO.",
    ".OTTLNKKKKKNLTTO.",
    "..OTTNKKKKKNTTO..",
    "..OTTKKKKKKKTTO..",
    "..OCCCCCCCCCCCO..",
    ".OTTNKKKKKKKNTTO.",
    ".OTNKKNKKKNKKNTO.",
    ".OTKKKKKKKKKKKTO.",
    ".OTKNKKKNKKKNKTO.",
    ".OTNKKKKKKKKKNTO.",
    ".OTTKKNKKKNKKTTO.",
    ".OTTNKKKKKKKNTTO.",
    "OTTTTKKKKKKKTTTTO",
    "OTLTTTKKKKKTTTLTO",
    "OTLLTTNKKKNTTLLTO",
    "OTTLTTOKKKOTTLTTO",
    ".OTTTTOKNKOTTTTO.",
    ".OTTTTOKKKOTTTTO.",
    ".OOTTOOKKKOOTTOO.",
    ".OOTTOOKNKOOTTOO.",
    ".OOTTOOKKKOOTTOO.",
    ".OOTNOOKKKOONTOO.",
    ".OOTLOONKNOOLTOO.",
    ".OOLLOOKKKOOLLOO.",
    ".OOLLOOOKOOOLLOO.",
    ".OOLLOOOKOOOLLOO.",
    ".OOLLOOOOOOOLLOO.",
    ".OOLLOO.O.OOLLOO.",
    ".OOWWOO...OOWWOO.",
    ".OOWWOO...OOWWOO.",
    "..OOOO.....OOOO.."], [
    "..O...........O..",
    ".OKO.........OKO.",
    ".OKKO.......OKKO.",
    ".OKKKO.....OKKKO.",
    ".OKNKKOOOOOKKNKO.",
    ".OKKKKOTTTOKKKKO.",
    ".OKKKKTTTTTKKKKO.",
    ".OKNTTTTNTTTTNKO.",
    ".OKTTLTNNNTLTTKO.",
    ".OTTTTTNKNTTTTTO.",
    ".OTLTTNKKKNTTLTO.",
    "OTTTTTNKKKNTTTTTO",
    "OTLTTNKKKKKNTTLTO",
    ".OTTTNKKKKKNTTTO.",
    ".OTTLNKKKKKNLTTO.",
    "..OTTNKKKKKNTTO..",
    "..OTTKKKKKKKTTO..",
    "..OCCCCCCCCCCCO..",
    ".OTTNKKKKKKKNTTO.",
    ".OTNKKNKKKNKKNTO.",
    ".OTKKKKKKKKKKKTO.",
    ".OTKNKKKNKKKNKTO.",
    ".OTNKKKKKKKKKNTO.",
    ".OTTKKNKKKNKKTTO.",
    ".OTTNKKKKKKKNTTO.",
    "OTTTTKKKKKKKTTTTO",
    "OTLTTTKKKKKTTTLTO",
    "OTLLTTNKKKNTTLLTO",
    "OTTLTTOKKKOTTLTTO",
    ".OTTTTOKNKOTTTTO.",
    ".OTTTTOKKKOTTTTO.",
    ".OOTTOOKKKOOTTOO.",
    ".OOTTOOKNKOOTTOO.",
    ".OOTTOOKKKOOTTOO.",
    ".OOTNOOKKKOONTOO.",
    ".OOTLOONKNOOLTOO.",
    ".OOLLOOKKKOOLLOO.",
    ".OOLLOOOKOOOLLOO.",
    ".OOWWOOOKOOOLLOO.",
    ".OOWWOOOOOOOLLOO.",
    "..OOOO..O.OOLLOO.",
    "..........OOWWOO.",
    "..........OOWWOO.",
    "...........OOOO.."], [
    "..O...........O..",
    ".OKO.........OKO.",
    ".OKKO.......OKKO.",
    ".OKKKO.....OKKKO.",
    ".OKNKKOOOOOKKNKO.",
    ".OKKKKOTTTOKKKKO.",
    ".OKKKKTTTTTKKKKO.",
    ".OKNTTTTNTTTTNKO.",
    ".OKTTLTNNNTLTTKO.",
    ".OTTTTTNKNTTTTTO.",
    ".OTLTTNKKKNTTLTO.",
    "OTTTTTNKKKNTTTTTO",
    "OTLTTNKKKKKNTTLTO",
    ".OTTTNKKKKKNTTTO.",
    ".OTTLNKKKKKNLTTO.",
    "..OTTNKKKKKNTTO..",
    "..OTTKKKKKKKTTO..",
    "..OCCCCCCCCCCCO..",
    ".OTTNKKKKKKKNTTO.",
    ".OTNKKNKKKNKKNTO.",
    ".OTKKKKKKKKKKKTO.",
    ".OTKNKKKNKKKNKTO.",
    ".OTNKKKKKKKKKNTO.",
    ".OTTKKNKKKNKKTTO.",
    ".OTTNKKKKKKKNTTO.",
    "OTTTTKKKKKKKTTTTO",
    "OTLTTTKKKKKTTTLTO",
    "OTLLTTNKKKNTTLLTO",
    "OTTLTTOKKKOTTLTTO",
    ".OTTTTOKNKOTTTTO.",
    ".OTTTTOKKKOTTTTO.",
    ".OOTTOOKKKOOTTOO.",
    ".OOTTOOKNKOOTTOO.",
    ".OOTTOOKKKOOTTOO.",
    ".OOTNOOKKKOONTOO.",
    ".OOTLOONKNOOLTOO.",
    ".OOLLOOKKKOOLLOO.",
    ".OOLLOOOKOOOLLOO.",
    ".OOLLOOOKOOOWWOO.",
    ".OOLLOOOOOOOWWOO.",
    ".OOLLOO.O..OOOO..",
    ".OOWWOO..........",
    ".OOWWOO..........",
    "..OOOO..........."]];   // walking away: the same three
  const W = 49, H = 46, GROUND = 45;  // every frame is placed so its lowest row sits on the ground line

  const dot = (g, c, x, y, ...xy) => { g.fillStyle = INK[c]; for (let i = 0; i < xy.length; i += 2) g.fillRect(x + xy[i], y + xy[i + 1], 1, 1); };
  function paint(g, pose, o = {}) {
    g.clearRect(0, 0, W, H);
    const rows = pose === "step" ? STEP : pose === "pass" ? PASS : pose === "lie" ? LIE : (pose === "front" ? FRONT : BACK)[o.frame || 0];
    const lifted = pose === "step" || o.frame > 0;                                   // a stride lifts him a pixel
    const x = Math.floor((W - rows[0].length) / 2), y = GROUND - rows.findLastIndex(r => /[^.]/.test(r)) - (lifted ? 1 : 0);
    rows.forEach((line, j) => [...line].forEach((ch, i) => { if (INK[ch]) { g.fillStyle = INK[ch]; g.fillRect(x + i, y + j, 1, 1); } }));
    if (pose === "front") {
      // the tail shows past one hip, then the other; the tongue goes from just showing to lolling out
      if (o.wag) { const m = o.wag === 1 ? i => i : i => 16 - i;
        for (const [i, j] of [[0, 24], [0, 25], [0, 26], [0, 27], [1, 28], [1, 29]]) { g.fillStyle = INK.O; g.fillRect(x + m(i - 1), y + j, 1, 1); g.fillStyle = INK.K; g.fillRect(x + m(i), y + j, 1, 1); }
        g.fillStyle = INK.O; g.fillRect(x + m(0), y + 23, 1, 1); g.fillRect(x + m(0), y + 28, 1, 1); g.fillRect(x + m(0), y + 29, 1, 1); g.fillRect(x + m(1), y + 30, 1, 1); }
      if (o.tongue === 1) dot(g, "P", x, y, 8, 16);
      if (o.tongue === 2) dot(g, "P", x, y, 7, 16, 8, 16, 9, 16, 8, 17, 8, 18);
      if (o.blink) dot(g, "K", x, y, 4, 11, 12, 11);
    } else if (pose === "back") {
      // the tail swings from the root: the lower half moves a pixel, the tip two
      if (o.wag) for (let j = 33; j < 41; j++) { const wide = j < 37, x0 = x + (wide ? 6 : 7), n = wide ? 5 : 3, by = (o.wag === 1 ? -1 : 1) * (wide ? 1 : 2);
        const part = g.getImageData(x0, y + j, n, 1); g.clearRect(x0, y + j, n, 1); g.putImageData(part, x0 + by, y + j); }
    } else {
      if (o.wag) { const tail = g.getImageData(39, y + 21, 10, 9); g.clearRect(39, y + 21, 10, 9); g.putImageData(tail, 39, y + 20); }  // the tail lifts a pixel
      if (o.pant) dot(g, "P", x, y, 3, 17, 4, 17, 3, 18);
      if (o.blink) dot(g, "K", x, y, 6, 11);
      if (o.sleep) { dot(g, "K", x, y, 6, 11); if (o.z) dot(g, "Z", x, y, 17, 1, 18, 1, 19, 1, 18, 2, 17, 3, 18, 3, 19, 3); else dot(g, "Z", x, y, 15, 5, 16, 5, 15, 6, 16, 6); }
      if (o.alert) dot(g, "Z", x, y, 16, 1, 16, 2, 16, 3, 16, 5);
    }
  }

  if (window.DOG_SHEET) {  // dog-sheet.html: every frame, enlarged
    const all = [["step", {}], ["pass", {}], ["pass", { wag: 1, pant: 1 }], ["pass", { alert: 1 }], ["lie", {}], ["lie", { sleep: 1, z: 1 }],
                 ["front", {}], ["front", { frame: 1, tongue: 1, wag: 1 }], ["front", { frame: 2, tongue: 2, wag: 2 }], ["front", { tongue: 2, blink: 1 }],
                 ["back", {}], ["back", { frame: 1, wag: 1 }], ["back", { frame: 2, wag: 2 }]];
    for (const [pose, o] of all) {
      const c = document.createElement("canvas"); c.width = W; c.height = H; c.title = pose + " " + JSON.stringify(o);
      c.className = "dog"; c.style.cssText = "width:196px;height:184px;image-rendering:pixelated;margin:4px";
      paint(c.getContext("2d", { willReadFrequently: true }), pose, o); document.body.append(c);
    }
    return;
  }

  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (calm || !matchMedia("(hover: hover) and (pointer: fine)").matches) return;  // no mouse, or motion not wanted: no dog

  const dog = document.getElementById("dog"), g = dog.getContext("2d", { willReadFrequently: true });
  const S = 1.5;  // screen pixels per sprite pixel: the knob for his size
  dog.width = W; dog.height = H; dog.style.width = W * S + "px"; dog.style.height = H * S + "px";
  const TOP = 520, TROT = 140, NEAR = 130, ARRIVE = 5;  // px/s at full speed and at a trot; where he slows; where he stops
  let x = innerWidth / 2, y = innerHeight * .6, tx = x, ty = y, px = x, py = y, v = 0, face = 1, view = "side";
  let state = "stand", since = 0, stride = 0, frame = 0, hop = 0, last = 0, on = false, shown = "";
  const go = s => { state = s; since = 0; };
  // Which way to face for a direction: mostly up or down wins only when it is clearly steeper than sideways, and the
  // current view gets the benefit of the doubt, so he doesn't flicker between views on a diagonal.
  const look = (dx, dy) => { const steep = Math.abs(dy) > Math.abs(dx) * (view === "side" ? 1.5 : .9); view = steep ? (dy > 0 ? "front" : "back") : "side"; if (Math.abs(dx) > 8) face = dx > 0 ? 1 : -1; };

  function tick(now) {
    const dt = Math.min((now - last) / 1000, .05); last = now; since += dt;  // dt is capped: a background tab doesn't teleport him
    const dx = tx - x, dy = ty - y, d = Math.hypot(dx, dy);
    if (state === "alert" && since > .3) go("run");
    if (state === "stand" && d > 40) go("run");
    if (state === "run") {
      const want = d < ARRIVE ? 0 : d < NEAR ? TROT + (TOP - TROT) * (d / NEAR) ** 2 : TOP;  // ease down as he closes in
      v += (want - v) * Math.min(1, dt * 7);                                                  // and never change speed instantly
      const move = Math.min(v * dt, d); if (d > 0) { x += dx / d * move; y += dy / d * move; }
      if (d > 24) look(dx, dy);                                    // face the way he is travelling
      stride += move; if (stride > 18) { stride = 0; frame++; }  // legs advance with distance covered, so feet don't slide
      if (d < ARRIVE) { v = 0; go("stand"); }
    }
    if (state === "stand") look(px - x, py - (y - H * S / 2));     // standing: watch the pointer itself
    if (state === "stand" && since > 7) go("lie");
    if (state === "lie" && since > 6) go("sleep");
    hop = Math.max(0, hop - dt * 4);

    const t = now / 1000, blink = t % 3.4 < .14, pant = Math.floor(t * 3) % 2, turned = view !== "side";
    const tongue = Math.floor(t * 4) % 3, swing = 1 + Math.floor(t * 7) % 2;  // front and back views: tongue in, out, lolling; tail left, right
    const [pose, o] = state === "run" ? (turned ? [view, { frame: 1 + frame % 2, tongue: 1 + tongue % 2, wag: swing }] : [frame % 2 ? "pass" : "step", {}])
      : state === "alert" ? ["pass", { alert: 1 }]
      : state === "stand" ? (turned ? [view, { tongue, wag: swing, blink }] : ["pass", { wag: since < 4 && Math.floor(t * 6) % 2, pant, blink }])
      : state === "lie" ? ["lie", { blink }] : ["lie", { sleep: 1, z: Math.floor(t * 1.2) % 2 }];
    const key = pose + JSON.stringify(o); if (key !== shown) { shown = key; paint(g, pose, o); }  // repaint only when the frame changes
    const lift = Math.sin(hop * Math.PI) * 18;
    dog.style.transform = `translate(${Math.round(x - W * S / 2)}px, ${Math.round(y - H * S - lift)}px) scaleX(${-face})`;  // drawn facing left
    if (!document.hidden) requestAnimationFrame(tick); else on = false;
  }
  const wake = () => { if (!on) { on = true; last = performance.now(); requestAnimationFrame(tick); } };

  addEventListener("pointermove", e => {
    px = e.clientX; py = e.clientY;
    // heel beside the pointer, on whichever side he is already on, so he never stands under it
    tx = Math.max(W * S / 2, Math.min(innerWidth - W * S / 2, px + (x < px ? -50 : 50)));
    ty = Math.max(H * S, Math.min(innerHeight, py + 38));
    dog.hidden = false;
    if (state === "sleep" || state === "lie") go("alert");
    wake();
  });
  addEventListener("pointerdown", () => { if (state !== "sleep") hop = 1; else go("alert"); });
  document.addEventListener("visibilitychange", wake);
})();
