# Babel: spinning post

The animated version of the Babel essay post (1080 × 1920). The tower turns once and drifts
through four ink palettes every 24 seconds, then loops without a seam:
graphite → red ink → Q.Wrld amber → blueprint → graphite.

The tower is redrawn here in WebGL2 from the rules in the essay
(`src/data/posts/babel.md`). Every floor is an 8 × 8 grid of rooms. Bands of six floors share
an outline (a main block, a wing and a bar). Each interior edge is a full wall, a low wall or an
opening, and a quarter of them change from floor to floor. Rooms rise in rings from the centre.
Rays are parallel and walk the grid one square at a time. Ink comes from comparing neighbouring
hits. The sun sits over the viewer's shoulder, and the letter windows spell the post's own copy
around each floor.

## Render

```bash
npm i --no-save playwright          # once
npx playwright install chromium     # once
node render.mjs seq 720 frames      # 720 PNG frames: 24 s at 30 fps
./encode.sh frames                  # babel-spin.mp4 and babel-spin.webp
```

It renders on the CPU (SwiftShader), at about 3 seconds a frame on 4 cores.

The black ↔ red version turns the same way but only fades between black ink and red ink:

```bash
CFG='{"config":{"palettes":["black ink","red ink"]}}' node render.mjs seq 720 frames_br
./encode.sh frames_br babel-spin-black-red
```

Quick looks before a full render:

```bash
node render.mjs preview 0 720 out.png   # one frame (k of n)
node render.mjs turn 4 turn_            # four views, 90° apart
node render.mjs pal 90 720 pal_         # one view in each palette
```

## Where to change things

| File | What it holds |
| --- | --- |
| `anim.js` | Camera, sun, loop length, palettes, and the bands that shape the tower |
| `scene.js` | Rooms, walls, pillars, build progress and letters, packed into a texture |
| `tower.js` | The shader: grid walk, ink edges, hatching, letter windows, paper |
| `post.html` | The post layout around the tower |
