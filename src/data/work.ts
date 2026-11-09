export type WorkItem = {
  id: string;
  name: string;
  /** Short date for lists, e.g. "2025" or "2026 – now". */
  year: string;
  /** Fuller date for the project page, when known. Falls back to `year`. */
  period?: string;
  /** Only set when the owner has said where it stands. */
  status?: "Wrapped" | "Archived" | "Active";
  /** One or two words for lists, e.g. "CTO". */
  roleShort: string;
  role: string;
  summary: string;
  what: string;
  did?: string[];
  learned?: string;
  stack?: string[];
  links?: { href: string; label: string }[];
  /** Only add a picture that really shows the project. */
  image?: { src: string; alt: string };
};

const BASE = import.meta.env.BASE_URL;

// Newest first. Leave a field out rather than guessing: empty fields are
// simply not shown.
export const workItems: WorkItem[] = [
  {
    id: "living-diary",
    name: "Living Diary",
    year: "2026 – now",
    status: "Active",
    roleShort: "Solo",
    role: "Solo: design, engineering, shaders.",
    summary:
      "A journal where your writing drives a living, hand-drawn world, built in Rust and WGSL.",
    what: "A journal where writing drives a fullscreen procedural world. It is not an image generator: every frame is math and simulation, and the world only ever sees numbers, never your words. Everything stays on your own computer, including speech-to-text.",
    did: [
      "Built a diary engine and a local voice engine (whisper.cpp), joined to a shader world only by signals.",
      "Wrote Babel, a theme where a tower rises as you write, and Acropolis, where every few hundred words raise a temple.",
    ],
    learned:
      "Keep input logic and world logic apart, and never let a signal the world reads step.",
    stack: ["Rust", "wgpu", "WGSL", "whisper.cpp"],
    links: [
      { href: `${BASE}acropolis/`, label: "Read “An Acropolis of Words”" },
      { href: `${BASE}blog-post.html?slug=babel`, label: "Read “Babel: a tower made of words”" },
    ],
    image: {
      src: `${BASE}acropolis/img/acropolis-finished.webp`,
      alt: "Acropolis: a pen-and-ink Greek temple with a blue frieze, drawn live from the words written.",
    },
  },
  {
    id: "capstone",
    name: "Multi-Sensor Object Detection & Tracking",
    year: "2025",
    period: "From Sept 2025",
    roleShort: "Capstone team",
    role: "Team member, senior capstone, under faculty supervision.",
    summary: "Detecting and tracking objects by fusing Doppler radar with RGB-D camera data.",
    what: "A multi-modal object detection system that integrates Doppler radar spectrograms with RGB-D camera data.",
    did: [
      "Extracted velocity and spatiotemporal features using the Doppler effect.",
      "Explored feature extraction, sensor fusion strategies and dataset generation, including real versus synthetic data for testing.",
      "Applied machine learning to target classification and tracking, working on system design, data analysis and experimental evaluation.",
    ],
    stack: ["Doppler radar", "RGB-D", "Sensor fusion", "Machine learning"],
  },
  {
    id: "protein-ml",
    name: "Protein–Nucleic Acid Interaction Prediction",
    year: "2025",
    period: "Sept – Nov 2025",
    roleShort: "Course project",
    role: "Machine learning developer (course project).",
    summary:
      "Ensemble models that predict whether a protein binds DNA, RNA, both, or neither. Top 5 in the class.",
    what: "Machine learning models that classify protein interactions with DNA, RNA, both (DRNA), or neither, trained on 8,795 protein sequences.",
    did: [
      "Extracted features from raw biological data with Biopython.",
      "Addressed class imbalance with oversampling and compared SVM, KNN, Gradient Boosting and MLP using 5-fold cross-validation (MCC, sensitivity, specificity, accuracy).",
      "Built voting and stacking ensembles that placed in the top 5 overall by average MCC and multi-class accuracy, and wrote a technical report.",
    ],
    stack: ["Python", "Biopython", "Ensembles"],
  },
  {
    id: "riva",
    name: "Rivers Intelligence: Riva",
    year: "2025",
    period: "From Aug 2025",
    status: "Wrapped",
    roleShort: "CTO",
    role: "CTO.",
    summary: "An AI agent that worked like a business's assistant: answering calls, following up, and re-engaging leads.",
    what: "Riva was an automation agent that acted like a dedicated assistant for a business. It answered calls, followed up in real time, and reactivated leads with a human touch. Rivers Intelligence was a startup offering agentic AI solutions to businesses.",
    did: [
      "Led technical strategy and product development.",
      "Built and maintained a Next.js + TypeScript web application backed by Supabase, including a client-facing dashboard visualizing agent usage and task execution.",
      "Used Cursor and GitHub for version control and continuous delivery across teams.",
    ],
    stack: ["Next.js", "TypeScript", "Supabase"],
    links: [{ href: "https://riversintelligence.com/", label: "Visit Rivers Intelligence" }],
  },
  {
    id: "blender-rag",
    name: "Blender Geometry Nodes + AI RAG Addon",
    year: "2025",
    period: "From May 2025",
    roleShort: "Solo",
    role: "Sole developer.",
    summary: "A Blender addon that gives context-aware AI suggestions for procedural 3D modeling.",
    what: "A Python-based Blender addon using a Retrieval-Augmented Generation (RAG) system to assist in procedural 3D modeling workflows.",
    did: [
      "Used ChromaDB for vector embeddings so suggestions come from relevant context.",
      "Put intelligent, inline modeling guidance directly in Blender's UI.",
    ],
    stack: ["Python", "Blender", "ChromaDB", "RAG"],
  },
  {
    id: "badgeup",
    name: "BadgeUp",
    year: "Earlier",
    status: "Wrapped",
    roleShort: "CEO",
    role: "CEO.",
    summary: "A behavior-driven fitness app that turned consistent habits into a playful game.",
    what: "A behavior-driven fitness app built to make movement feel good. BadgeUp turned consistent habits into a playful game, rewarding small wins, shaping long-term progress, and keeping every level of user motivated with a sustainable feedback loop.",
    links: [{ href: "https://badgeupbetasite.vercel.app/", label: "Visit the beta site" }],
  },
  {
    id: "qwrld",
    name: "Qwrld Visuals",
    year: "Earlier",
    status: "Archived",
    roleShort: "Artist",
    role: "Artist: concept, 3D, and direction.",
    summary: "My art practice: visual storytelling about identity, feeling, and narrative.",
    what: "My personal art practice, where emotional intelligence meets immersive visual storytelling. Every piece explored identity, feeling, and narrative, and aimed to be thoughtful, atmospheric, and deeply personal.",
    stack: ["3D", "Art direction"],
    links: [{ href: "https://www.instagram.com/qwrldvisuals/", label: "See the archive on Instagram" }],
  },
];

export const featuredWork = workItems.find((item) => item.id === "living-diary")!;
