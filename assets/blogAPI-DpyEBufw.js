const r={repoOwner:"c-wilson04",repoName:"blog-repo",branch:"main"},h=`https://raw.githubusercontent.com/${r.repoOwner}/${r.repoName}/${r.branch}/posts/index.json`,d=`![An ink drawing of a tower of open-topped rooms, with black lines, red shading and white paper. A long gallery sticks out from the top; the lower floors fade into the paper.](/Portfolio-V2/babel/hero.webp)

*Babel after 420 words, in the red-ink palette. The floor being built is open at the top, and older floors fade into the paper.*

A world that builds a tower out of what you write, about one room per word, drawn like an architect's ink drawing. What it does, how it works, and how to make your own.

## A tower made of words

Living Diary is a journal where your writing drives a living picture. Nothing on screen is a generated image. Every world is drawn live by code, from numbers the app works out from your writing.

In Babel, every word you write adds about one room to a tower. Rooms go up floor by floor. The floor being built is open to the sky, so you can look into its rooms, and older floors fade into the paper below. It is drawn the way an architect draws: black ink, grey shading, and only straight lines.

Three pictures set the look: the endless megastructures of [Tsutomu Nihei's *BLAME!*](https://www.pinterest.com/pin/82190761946982652/), the roofless rooms in [Mathew Borrett's *Labyrinth*](https://www.pinterest.com/pin/82190761946964487/) drawings, and [a pen drawing of an imaginary city](https://www.pinterest.com/pin/82190761946990610/) full of bridges and arches, which is where Babel goes once curves are allowed.

![Four finished rooms in the centre, on a dashed floor plan.](/Portfolio-V2/babel/grow-1.webp)
![Two small floor plates appear in the middle of new rooms.](/Portfolio-V2/babel/grow-2.webp)
![The new floor plates have spread to fill their rooms.](/Portfolio-V2/babel/grow-3.webp)
![Walls begin rising around the new rooms.](/Portfolio-V2/babel/grow-4.webp)
![More rooms of the ring under construction.](/Portfolio-V2/babel/grow-5.webp)
![The ring of rooms complete.](/Portfolio-V2/babel/grow-6.webp)

*One floor going up, word by word: 5, 6.3, 6.6, 7, 7.5 and 9 words. The dashed lines are the plan of rooms still to come.*

## You write, it builds

Babel reacts to everything you do in the journal, typed or spoken.

| You | Babel |
| --- | --- |
| Write a word | A room's floor appears, then its walls rise |
| Keep typing | Construction lines darken across the page |
| End a sentence | The pen presses harder for a moment |
| Delete | The newest rooms come back down |
| Speak | Your words arrive after each pause, and the lines get heavier as you get louder |
| Stop writing | The view steps back to take in the whole tower |
| Write how you feel | The light changes: a low sun and long shadows when it's sad, a high sun and open light when it's happy |

![The top of the tower while typing: dark construction lines across the paper, a new floor spreading, and windows shaped like letters.](/Portfolio-V2/babel/typing.webp)

*Mid-sentence. Construction lines darken while you type, and the newest walls carry the letter you just typed in their windows.*

![The tower drawn darker, with long shadows and heavy hatching.](/Portfolio-V2/babel/mood-sad.webp)
![The same tower drawn lighter, with a high sun.](/Portfolio-V2/babel/mood-joy.webp)

*The same 160 words in two moods: sad writing (low sun, heavier shade) and happy writing (high sun, open light). The building doesn't change, only the light.*

## Every journal gets its own tower

Babel doesn't save the building anywhere. Every frame it works the whole tower out again from two numbers: the journal's word count, and its **seed**, a random number picked when the journal was created.

That is why every journal has a different tower, why reopening a journal brings back exactly the same one, and why deleting words takes rooms back down. Everything else, like your typing speed, your voice and your mood, only changes how the tower is drawn, never what is built.

![An almost empty page with a dashed floor plan and faint construction lines.](/Portfolio-V2/babel/site.webp)
![A tall tower whose lower floors fade into white paper.](/Portfolio-V2/babel/tall.webp)

*An empty journal (0 words, just the site plan) and a long one (1,500 words, 68 floors), in the original grey palette. The view follows the floor being built, so older writing sinks into the paper.*

## Floors, bands and rooms

Every floor is a grid of 8 × 8 squares, and each square can hold one room. Floors are grouped into bands.

> **What is a band?** A stack of six floors that all share the same outline. Every six floors the tower gets a new outline: it can step in, stick out over nothing, or grow a long bridge. Without bands, every floor would be a different shape and the tower would look like a pile of random blocks.

Each band's outline is made from up to three rectangles: a main block that always covers the centre, so every band stands on the one below; sometimes a **wing**, which hangs out wherever the band below is smaller; and sometimes a long, narrow **bar** that reads as a gallery or a bridge. A room can also be left out of a whole band, leaving a shaft down through the floors.

Inside, each line between two rooms becomes a full wall, a low wall or an opening. Most walls repeat from floor to floor, the way they do in a real building, but a quarter of them change, and that turns the tower into a maze.

Rooms go up in rings, starting at the centre and working outward. At the default pace a floor takes 22 words, and each room takes a word and a half to rise.

## A word count that glides

When you speak, a whole sentence lands in the journal at once, and a deletion can remove a paragraph at once. Built straight from the word count, rooms would pop in and out in a single frame.

So Babel follows a smoothed word count that chases the real one. A typed word slides in over about a second, and a 20-word spoken sentence over about 3.3 seconds. This was the only change to the app's engine. Everything else lives in Babel's own folder.

For anyone reading the code, this is the whole idea. Close to the target it eases in gently; far behind, it catches up faster.

\`\`\`rust
// src/diary/engine.rs, run every frame
fn chase_words(current: f32, target: f32, dt: f32) -> f32 {
    let gap = target - current;
    let rate = (gap.abs() / WORDS_DRAIN_SECS)
        .clamp(WORDS_MIN_RATE, WORDS_MAX_RATE);
    let step = gap * ease(dt, WORDS_TAU);
    current + step.clamp(-rate * dt, rate * dt)
}
\`\`\`

## How it's drawn

From here on it gets more technical. Babel is a **shader**, a small program that runs once for every pixel on screen, every frame. For each pixel it sends a ray from the camera into the building and asks what the ray hits first.

The camera's rays are parallel, so lines that are parallel in the building stay parallel on screen, like an architect's drawing. This is called an axonometric view.

### Walking the grid

Checking every ray against every wall of a tall tower would be far too slow. Instead each ray steps through the grid one square at a time, always into the next square it reaches, and only checks what that square can hold: a floor, four walls and four pillars. A tall tower costs no more to draw than a short one.

### Ink lines

To draw outlines, the shader measures the distance to the nearest surface at four points around where the ray landed. On a flat face the four measurements cancel out. Near an edge they don't, and the difference becomes ink. Where two rooms' walls meet in one flat surface, the measurements cancel again, so no seam is drawn between them.

### Shading

Faces are lighter or darker depending on how they face the sun, which always sits over your shoulder. A second ray towards the sun adds shadows, corners get a soft smudge, and real shade is hatched with pen strokes. The windows on outer walls are shaped like letters.

![Close-up of the top floors: open-roofed rooms, double-line wall tops, openings, low walls, thin pillars, hatched shade and letter-shaped windows.](/Portfolio-V2/babel/rooms.webp)

*The floor being built, close up: open rooms, a maze of walls, hatched shade and letter windows.*

## Making it fast enough

At the app's default window size, that is 3.7 million rays every frame. Every change was timed, and most of the obvious speed-ups did nothing. One made it slower. The big win was testing each wall the moment it is worked out, instead of storing it first.

| Change | ms per frame |
| --- | ---: |
| First working version | 53.9 |
| ▼ Pre-computed lookup tables (slower) | 69.7 |
| ▲ Test walls as they're made, not stored | 41.6 |
| = Three more tweaks (no change) | ≈ 43 |

At the app's own window size Babel takes 28 to 42 milliseconds a frame, depending on how tall the tower is. That puts it between two existing worlds, Cosmos at 27 and Flux at 79. These are browser timings; if Babel ever feels slow, \`render_scale\` in \`data/settings.toml\` draws it at a lower resolution.

![A heatmap version of the tower: blue where rays finish quickly, orange along the lower tower and under the overhang where rays walk furthest.](/Portfolio-V2/babel/heat.webp)

*How far each pixel's ray walks. Blue finishes in a few steps; orange walks the furthest, grazing the tower before it hits.*

## What went wrong along the way

Babel was checked in a browser preview built for the job, which made every picture here, and with the same shader compiler the app uses. Two mistakes are worth showing.

![An early version: thick posts at every corner, lines at every room boundary and dense hatching.](/Portfolio-V2/babel/early.webp)
![The same view after the fix: flush posts, continuous walls, lighter hatching.](/Portfolio-V2/babel/early-fixed.webp)

*Before and after. Thick corner posts and a line at every room boundary made the tower look like stacked shipping containers; now it is one continuous wall.*

![New floors drawn as solid black rectangles.](/Portfolio-V2/babel/plates.webp)
![The same moment after the fix: small white floors spreading from the middle of their rooms.](/Portfolio-V2/babel/plates-fixed.webp)

*Before and after. New floors started thinner than the pen line, so the ink filled them solid black. Now they start full thickness and spread from the middle.*

## Make your own

There are four ways to change Babel, from easy to deep. Whatever you change, keep two rules: nothing should jump from one frame to the next, and mood should change the drawing, never the building.

### 1. Drag the sliders

Press **Cmd+4** in the app. Custom 0 sets the hatching, custom 1 the line weight, custom 2 how many words a floor takes, and custom 3 the viewing angle. The red version at the top is just two changes: a red shading colour and film saturation turned up to 2.

### 2. Copy the folder

A world is just a folder. Copy Babel, give the copy a new name in its \`theme.toml\`, and restart the app. Your copy is a new world you can change freely.

\`\`\`bash
cp -R themes/babel themes/babel-night
\`\`\`

### 3. Change the numbers

The top of \`world.wgsl\` sets the building's proportions. Save the file and the world reloads straight away.

\`\`\`wgsl
const GRID: i32 = 8;          // rooms across each floor
const BAND: i32 = 6;          // floors in each band
const WALL: f32 = 0.07;       // wall thickness
const RAISE: f32 = 1.6;       // words a room takes to go up
\`\`\`

### 4. Change the rules

\`band_of\` shapes the bands, \`edge_kind\` builds the maze, and \`born\` sets the order rooms go up. A few lines changed in each gives a very different building. Cloister below has far fewer openings; Bridges has a band every three floors, each with a wing and a bar.

![The tower with red shading and black lines on white.](/Portfolio-V2/babel/v-red.webp)
![The tower drawn in white lines on black.](/Portfolio-V2/babel/v-night.webp)
![The tower shaded only with ink hatching.](/Portfolio-V2/babel/v-pen.webp)
![The tower seen from nearly overhead, like a floor plan.](/Portfolio-V2/babel/v-plan.webp)
![A denser maze of small closed rooms.](/Portfolio-V2/babel/v-cloister.webp)
![A tower with galleries and overhangs every few floors.](/Portfolio-V2/babel/v-bridges.webp)

*Six versions of the same journal: Red ink, Night, Pen only and Plan view (sliders and colours), then Cloister (maze rules) and Bridges (band rules), which change a few lines of the shader.*

### What's next

- **Shaft:** a camera inside the tower looking down, for the *BLAME!* view.
- **Arches:** curves, for the imaginary city.
- **A building that remembers:** rooms that keep something of the words that built them, without ever storing the words.

---

Babel was built for Living Diary by Charles Wilson with Claude Code, and merged as [c-wilson04/noat#3](https://github.com/c-wilson04/noat/pull/3). It lives in \`themes/babel/\`.

References: Tsutomu Nihei, *BLAME!*. Mathew Borrett, *Labyrinth*. John Amanatides and Andrew Woo, "A Fast Voxel Traversal Algorithm for Ray Tracing" (1987).
`,s=[{slug:"babel",title:"Babel: a tower made of words",date:"2026-09-28",excerpt:"A black-and-white theme for Living Diary where a tower rises as you write and comes down as you delete. Nothing is stored; every frame is worked out again from the word count and a seed.",hero:"/Portfolio-V2/babel/hero.webp",topics:["Tech"],featured:!0,content:[d]},{slug:"learning-to-sculpt-with-data",title:"Learning to Sculpt with Data",date:"November 2025",excerpt:"How I leverage live telemetry to shape responsive lighting rigs and keep visual experiments grounded in measurable insight.",hero:"/Car/textures/material_0_baseColor.jpeg",topics:["three.js","data","lighting"],content:["Telemetry is the rhythm behind every scene. I stream camera coordinates, sensor feeds, and user interactions into a single dashboard, then bend those signals into a lighting score that informs scale, color, and movement.","Those raw numbers keep each iteration honest and help me sculpt experiences that feel cinematic while remaining rooted in measurable conditions. When a site visitor shifts behavior, the data flows back into the canvas and reinvigorates the light story.","This feedback loop makes experimentation faster: the setup tells me what variables need more attention, so the next pass is less guesswork and more intentional choreography."]},{slug:"designing-autonomous-conversational-worlds",title:"Designing Autonomous Conversational Worlds",date:"October 2025",excerpt:"The creative process behind Rivers Intelligence’s voice agent, balancing human tone with programmatic precision.",hero:"/WireFrame/WireFrameFace_Omar_data.bin",topics:["AI","conversational UX"],content:["Riva needed to sound like a thoughtful partner, not a scripted bot. That meant scoring every decision—phrasing, intonation, follow-up timing—against human benchmarks and letting the loftier outcomes inform the UI that surrounds it.","Building those worlds is a storytelling challenge as much as a code one. I sketch personas, tune conversational flow charts, and pair them with the ambient visuals that play while someone waits for a reply.","The result is a real-time experience where the agent feels less like an app and more like a collaborator that shows up with context, empathy, and a dose of procedural polish."]},{slug:"emotional-intelligence-in-visual-systems",title:"Emotional Intelligence in Visual Systems",date:"September 2025",excerpt:"A look at how Qwrld Visuals translates emotional cues into atmospheric color maps and movement.",hero:"/WireFrame/WireFrameFace_Omar.gltf",topics:["art direction","emotion"],content:["I treat emotional intelligence as a design palette. Each hue represents a feeling, every motion a pulse, and when stacked together they become the vocabulary for the narratives I build.","The Qwrld Visuals projects that resonate most are the ones where I translated quiet human cues—like breath, gaze, or hesitation—into procedural textures and cinematic lighting.","Those atmospheres allow people to see themselves in the work, instead of only appreciating it as code or geometry."]}];function g(e){return s.find(o=>o.slug===e)}const w=s.map(e=>({slug:e.slug,title:e.title,date:e.date,excerpt:e.excerpt,hero:e.hero,topics:e.topics})),i=s.filter(e=>e.featured).map(({slug:e,title:o,date:n,excerpt:t,hero:a,topics:l})=>({slug:e,title:o,date:n,excerpt:t,hero:a,topics:l}));async function c(){const e=await fetch(h);if(!e.ok)throw new Error("Unable to download blog index");const o=await e.json();return Array.isArray(o)?[...i.filter(t=>!o.some(a=>a.slug===t.slug)),...o]:w}async function u(e){if(i.some(t=>t.slug===e))throw new Error("Post is bundled locally");const n=(await c()).find(t=>t.slug===e);if(!n)throw new Error("Post not found in index");return{meta:n,body:n.excerpt,content:n.content??""}}export{c as a,u as b,w as f,g};
