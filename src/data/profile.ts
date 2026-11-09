// Everything personal on the home page lives here, so updating the site
// is a matter of editing this one file.

export const profile = {
  name: "Charles Wilson",
  alias: "Q.Wrld",
  email: "charles.ikwilson@gmail.com",
  location: "the DC area (the DMV)",
  tagline: "Optimization · Graphics · Visuals",

  intro:
    "I work in optimization and logistics, mostly in Python and other industry data tools. On my own time I build new projects, research cutting-edge technology, and make visual art in TouchDesigner.",
  invite:
    "I'm looking to grow an inspiring community around those interests to help keep innovation, technology, and art actually fun. Yes, fun. Scroll down to learn more.",

  // The "Now" section. Bump `nowUpdated` whenever you change these.
  nowUpdated: "November 2026",
  now: [
    {
      term: "Work",
      text: "Optimization and logistics, mostly in Python, plus analytics tools like Excel.",
    },
    {
      term: "Building",
      text: "Living Diary, a journal that grows a hand-drawn world out of your words. The newest world is",
      link: { label: "Acropolis", href: "acropolis/" },
    },
    {
      term: "Exploring",
      text: "Where tech goes next: GPU hardware and CUDA, quantum computing, and nuclear energy.",
    },
    {
      term: "Making",
      text: "Visuals in TouchDesigner. It's my getaway, even if it's still scripting and math.",
    },
    {
      term: "Looking for",
      text: "A community that keeps innovation, technology, and art fun. Come build it with me.",
    },
  ],

  // "Reach out about" in the Contact section; the hero's second button links here.
  helpWith: [
    {
      title: "Project help",
      text: "Stuck on a build, or want a second set of eyes? Send it over.",
    },
    {
      title: "Technical questions",
      text: "Python, data, optimization, graphics, or anything else you see on this site.",
    },
    {
      title: "Organizations & events",
      text: "Invite me to take part in your organization, meetup, panel, or event.",
    },
    {
      title: "Tech education",
      text: "Helping the community stay educated on technology, through talks, workshops, and plain-English explainers.",
    },
  ],

  // The Visuals section. Paths are relative to public/.
  visuals: {
    heading: "Made for fun",
    text: "Art is my hobby. Lately TouchDesigner is my getaway, even if it's still scripting and math.",
    piece: {
      title: "Digital study / .1",
      tools: "TouchDesigner · DaVinci Resolve",
      year: "2026",
      statement:
        "I've been exploring just how much of our lives is blended with tech. It's a great amount, as we all know, but depicting it is another actualization I want to give this symbiotic relationship that exists.",
      video: "visuals/dance-loop.mp4",
      poster: "visuals/dance-loop-poster.webp",
      alt: "A white silhouette of a dancer moving in front of backdrops that change every few seconds: a cathedral collage, a web of node-graph lines, a copper circuit board, a road map, and a circuit schematic on parchment.",
    },
  },

  about: [
    "I graduated from Virginia Commonwealth University in May 2026 with a B.S. in computer science, focused on data science and machine learning. Along the way I led engineering at an AI startup, did AI research, and built test automation tools in C#. These days my work is optimization and logistics.",
    "Outside of work I make things: shader worlds for Living Diary, visuals in TouchDesigner, and 3D pieces in Blender. I'm also always reading about what's next, from GPU architecture to quantum computing to nuclear power.",
    "Q.Wrld is the name I make things under.",
  ],

  background: [
    { when: "Now", what: "Optimization & logistics", where: "Full-time" },
    { when: "2026", what: "B.S. Computer Science", where: "Virginia Commonwealth University" },
    { when: "2025–26", what: "CTO", where: "Rivers Intelligence" },
    { when: "2025", what: "AI Research Intern", where: "4K2" },
    { when: "2024", what: "Software Engineering Intern", where: "Serco" },
  ],

  // Clubs and organizations, shown under "Community" in About.
  community: [
    { when: "2024", what: "Director of Alumni Relations", where: "Developing Men of Color, VCU" },
    { when: "2024", what: "Club soccer", where: "VCU" },
    { when: "2022", what: "Member", where: "National Society of Black Engineers, VCU" },
  ],

  toolkit: [
    { group: "Languages", items: ["Python", "TypeScript", "Rust", "C#", "SQL", "C", "Bash"] },
    { group: "Data & ML", items: ["pandas", "NumPy", "scikit-learn", "Jupyter", "Excel"] },
    { group: "Graphics", items: ["wgpu / WGSL", "CUDA", "Three.js", "TouchDesigner", "Blender"] },
    { group: "Web & infra", items: ["React", "Next.js", "Supabase", "Docker", "Azure", "ROS", "n8n"] },
  ],

  socials: [
    { label: "GitHub", href: "https://github.com/c-wilson04", icon: "github" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/charles-wilson-71773725b/", icon: "linkedin" },
    { label: "Instagram", href: "https://www.instagram.com/qwrldvisuals/", icon: "instagram" },
    { label: "YouTube", href: "https://www.youtube.com/@yeadattq", icon: "youtube" },
  ],

  repo: "https://github.com/c-wilson04/Portfolio-V2",
} as const;

export type SocialIcon = (typeof profile.socials)[number]["icon"];
