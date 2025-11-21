export type BlogPost = {
  slug: string
  title: string
  date: string
  excerpt: string
  hero?: string
  topics: string[]
  content: string[]
}

export const blogPosts: BlogPost[] = [
  {
    slug: "learning-to-sculpt-with-data",
    title: "Learning to Sculpt with Data",
    date: "November 2025",
    excerpt:
      "How I leverage live telemetry to shape responsive lighting rigs and keep visual experiments grounded in measurable insight.",
    hero: "/Car/textures/material_0_baseColor.jpeg",
    topics: ["three.js", "data", "lighting"],
    content: [
      "Telemetry is the rhythm behind every scene. I stream camera coordinates, sensor feeds, and user interactions into a single dashboard, then bend those signals into a lighting score that informs scale, color, and movement.",
      "Those raw numbers keep each iteration honest and help me sculpt experiences that feel cinematic while remaining rooted in measurable conditions. When a site visitor shifts behavior, the data flows back into the canvas and reinvigorates the light story.",
      "This feedback loop makes experimentation faster: the setup tells me what variables need more attention, so the next pass is less guesswork and more intentional choreography.",
    ],
  },
  {
    slug: "designing-autonomous-conversational-worlds",
    title: "Designing Autonomous Conversational Worlds",
    date: "October 2025",
    excerpt:
      "The creative process behind Rivers Intelligence’s voice agent, balancing human tone with programmatic precision.",
    hero: "/WireFrame/WireFrameFace_Omar_data.bin",
    topics: ["AI", "conversational UX"],
    content: [
      "Riva needed to sound like a thoughtful partner, not a scripted bot. That meant scoring every decision—phrasing, intonation, follow-up timing—against human benchmarks and letting the loftier outcomes inform the UI that surrounds it.",
      "Building those worlds is a storytelling challenge as much as a code one. I sketch personas, tune conversational flow charts, and pair them with the ambient visuals that play while someone waits for a reply.",
      "The result is a real-time experience where the agent feels less like an app and more like a collaborator that shows up with context, empathy, and a dose of procedural polish.",
    ],
  },
  {
    slug: "emotional-intelligence-in-visual-systems",
    title: "Emotional Intelligence in Visual Systems",
    date: "September 2025",
    excerpt:
      "A look at how Qwrld Visuals translates emotional cues into atmospheric color maps and movement.",
    hero: "/WireFrame/WireFrameFace_Omar.gltf",
    topics: ["art direction", "emotion"],
    content: [
      "I treat emotional intelligence as a design palette. Each hue represents a feeling, every motion a pulse, and when stacked together they become the vocabulary for the narratives I build.",
      "The Qwrld Visuals projects that resonate most are the ones where I translated quiet human cues—like breath, gaze, or hesitation—into procedural textures and cinematic lighting.",
      "Those atmospheres allow people to see themselves in the work, instead of only appreciating it as code or geometry.",
    ],
  },
]

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug)
}

