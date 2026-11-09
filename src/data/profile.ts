// Everything personal on the home page lives here, so updating the site
// is a matter of editing this one file.

export const profile = {
  name: "Charles Wilson",
  alias: "Q.Wrld",
  email: "charles.ikwilson@gmail.com",
  location: "Richmond, VA",
  tagline: "Optimization · Graphics · Visuals",

  intro:
    "I work in optimization and logistics, mostly in Python and data tools. On my own time I build Living Diary, a journal that turns your words into a world, and I make visuals in TouchDesigner.",
  invite:
    "I'm not looking for a job. I'm looking for people. If you're building something, I'd love to see it.",

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
      text: "People. I want to see what others are building right now.",
    },
  ],

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
